use crate::anatomy::Vec2;
use crate::physics::mesh::MeshNode;

/// Muscle target positions in the rest frame (mm).
/// Each muscle has an attachment point and a direction of action.
struct MuscleAction {
    /// Target position the muscle pulls toward.
    target: Vec2,
    /// Maximum force magnitude (mm/s²).
    max_force: f64,
}

fn muscle_actions() -> [MuscleAction; 9] {
    [
        // 0: GGa — pulls tongue tip down and forward
        MuscleAction { target: Vec2::new(130.0, 20.0), max_force: 8000.0 },
        // 1: GGp — pulls tongue body forward and down
        MuscleAction { target: Vec2::new(80.0, 16.0), max_force: 7000.0 },
        // 2: SG — retracts body upward and backward
        MuscleAction { target: Vec2::new(20.0, 42.0), max_force: 6000.0 },
        // 3: HG — pulls body downward and backward
        MuscleAction { target: Vec2::new(25.0, 12.0), max_force: 5000.0 },
        // 4: PG — elevates dorsum toward soft palate
        MuscleAction { target: Vec2::new(70.0, 52.0), max_force: 7000.0 },
        // 5: SL — curls tip upward (toward alveolar ridge)
        MuscleAction { target: Vec2::new(145.0, 44.0), max_force: 6500.0 },
        // 6: IL — curls tip downward
        MuscleAction { target: Vec2::new(130.0, 18.0), max_force: 3000.0 },
        // 7: T — narrows tongue (in 2D: raises midline slightly)
        MuscleAction { target: Vec2::new(70.0, 33.0), max_force: 3500.0 },
        // 8: V — flattens tongue (lowers dorsum)
        MuscleAction { target: Vec2::new(70.0, 20.0), max_force: 3000.0 },
    ]
}

/// Apply muscle forces to mesh nodes given activation vector [0..1]^9.
pub fn apply_muscle_forces(
    dorsal: &[MeshNode],
    ventral: &[MeshNode],
    activations: &[f64; 9],
    forces_d: &mut Vec<Vec2>,
    forces_v: &mut Vec<Vec2>,
) {
    let actions = muscle_actions();

    for (m, (action, &alpha)) in actions.iter().zip(activations.iter()).enumerate() {
        if alpha < 1e-4 { continue; }

        let f_max = action.max_force * alpha;

        // Apply to dorsal nodes
        for (i, node) in dorsal.iter().enumerate() {
            if node.inv_mass < 1e-10 { continue; }
            let w = node.muscle_weights[m];
            if w < 1e-4 { continue; }
            let dir = action.target.sub(&node.position).normalized();
            forces_d[i].x += dir.x * f_max * w;
            forces_d[i].y += dir.y * f_max * w;
        }

        // Apply to ventral nodes
        for (i, node) in ventral.iter().enumerate() {
            if node.inv_mass < 1e-10 { continue; }
            let w = node.muscle_weights[m];
            if w < 1e-4 { continue; }
            let dir = action.target.sub(&node.position).normalized();
            forces_v[i].x += dir.x * f_max * w;
            forces_v[i].y += dir.y * f_max * w;
        }
    }
}
