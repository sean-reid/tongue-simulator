use wasm_bindgen::prelude::*;

pub mod anatomy;
pub mod api;
pub mod airflow;
pub mod g2p;
pub mod gestures;
pub mod phoneme;
pub mod physics;

pub use api::SimulationSession;

#[cfg(feature = "console_error_panic_hook")]
#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

/// Returns the list of all supported ARPAbet phonemes as a JS array of strings.
#[wasm_bindgen]
pub fn get_phoneme_list() -> JsValue {
    let list: Vec<&str> = vec![
        "AA", "AE", "AH", "AO", "AW", "AY",
        "B", "CH", "D", "DH", "EH", "ER", "EY",
        "F", "G", "HH", "IH", "IY", "JH", "K",
        "L", "M", "N", "NG", "OW", "OY", "P",
        "R", "S", "SH", "T", "TH", "UH", "UW",
        "V", "W", "Y", "Z", "ZH",
    ];
    serde_wasm_bindgen::to_value(&list).unwrap_or(JsValue::NULL)
}

/// Returns the default anatomy configuration as a JS object.
#[wasm_bindgen]
pub fn get_default_anatomy() -> JsValue {
    let cfg = anatomy::defaults::default_anatomy();
    serde_wasm_bindgen::to_value(&cfg).unwrap_or(JsValue::NULL)
}

/// Solve the static posture for a single ARPAbet phoneme and return the render state.
#[wasm_bindgen]
pub fn solve_static_posture(arpabet: &str) -> JsValue {
    let target = phoneme::targets::get_target(arpabet);
    let anat = anatomy::defaults::default_anatomy();
    let mut mesh = physics::mesh::TongueMesh::new(&anat);
    let mut rigid = physics::rigid_bodies::RigidBodies::new(&anat);

    // Run physics to convergence (~150 steps at 240 Hz)
    for _ in 0..150 {
        let dt = 1.0 / 240.0;
        physics::pbd::step_mesh(&mut mesh, &target, &anat, dt);
        rigid.step(&target, dt);
    }

    let render = api::build_render_state(&mesh, &rigid, &target, phoneme::arpabet_to_ipa(arpabet));
    serde_wasm_bindgen::to_value(&render).unwrap_or(JsValue::NULL)
}
