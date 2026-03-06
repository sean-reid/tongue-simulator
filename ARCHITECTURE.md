# Tongue Simulator: Articulatory Speech Animation System

## Architecture Design Document v2.1

### Monorepo · Rust/WASM + React · Web Speech API · GitHub Pages

---

## 1. System Overview

The Tongue Simulator is a physics-based articulatory speech animation system that takes arbitrary text input and produces a real-time, anatomically informed, midsagittal cross-section animation of the human vocal tract — synchronized to spoken audio. The tongue is modeled as a continuous deformable body whose shape, contact surfaces, and interaction with airflow determine the visual articulation of speech. The system runs entirely in the browser as a static site deployed to GitHub Pages, with the simulation core compiled from Rust to WebAssembly and a React frontend providing a minimal, modern interface.

### 1.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (GitHub Pages static site)                              │
│                                                                  │
│  ┌─────────────────────────────────────┐  ┌───────────────────┐  │
│  │  React Frontend (TypeScript)        │  │  Web Speech API   │  │
│  │                                     │  │  (SpeechSynthesis)│  │
│  │  ┌──────────┐  ┌────────────────┐   │  │                   │  │
│  │  │ Text     │  │ Canvas         │   │  │  boundary events  │  │
│  │  │ Input    │  │ Renderer       │   │  │  ──────────────►  │  │
│  │  │ Panel    │  │ (2D vocal      │   │  │  charIndex, time  │  │
│  │  │          │  │  tract view)   │   │  │                   │  │
│  │  └──────────┘  └───────┬────────┘   │  └────────┬──────────┘  │
│  │                        │            │           │              │
│  │  ┌─────────────────────┴────────┐   │           │              │
│  │  │  Synchronization Controller  │◄──┼───────────┘              │
│  │  │  (TTS ↔ Animation bridge)    │   │                          │
│  │  └──────────────┬───────────────┘   │                          │
│  └─────────────────┼───────────────────┘                          │
│                    │ wasm-bindgen FFI                              │
│  ┌─────────────────┴───────────────────┐                          │
│  │  Rust/WASM Core                     │                          │
│  │                                     │                          │
│  │  ┌──────────┐  ┌────────────────┐   │                          │
│  │  │ G2P &    │  │ Gestural Score │   │                          │
│  │  │ Phoneme  │  │ Builder &      │   │                          │
│  │  │ Pipeline │  │ Coarticulation │   │                          │
│  │  └────┬─────┘  └───────┬────────┘   │                          │
│  │       │                │            │                          │
│  │  ┌────┴────────────────┴────────┐   │                          │
│  │  │  PBD Physics Engine          │   │                          │
│  │  │  (tongue mesh, jaw, lips,    │   │                          │
│  │  │   velum, airflow model)      │   │                          │
│  │  └──────────────────────────────┘   │                          │
│  └─────────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

- **Research-informed articulation**: Phoneme-to-shape mappings derive from MRI and electromagnetic articulography (EMA) datasets, particularly the USC SPAN corpus and the Wisconsin X-ray Microbeam database.
- **Continuous deformation**: The tongue never teleports between shapes; it transitions via a constrained soft-body simulation that respects biomechanical limits.
- **Gestural phonology**: Articulatory Phonology (Browman & Goldstein, 1992) governs how gestures overlap and blend, producing natural coarticulation.
- **Audio-visual synchrony**: The browser's native Web Speech API provides free, unthrottled TTS. A synchronization controller bridges word-boundary events from the TTS engine to the simulation timeline, keeping the mouth animation locked to the spoken audio.
- **Zero backend**: The entire application is a static bundle (HTML + JS + WASM) served from GitHub Pages. No server, no API keys, no rate limits.
- **Performance-critical core in Rust**: The phoneme pipeline, physics solver, and area-function computation run in WASM at near-native speed, leaving the JS thread free for rendering and TTS event handling.

---

## 2. Technology Stack

### 2.0 Monorepo Layout

The project is a single Git repository containing both the Rust/WASM simulation core and the React frontend, with a root-level orchestration layer for builds and CI/CD.

```
tongue-simulator/                      ← repo root
├── .github/
│   └── workflows/
│       └── deploy.yml                 ← CI/CD: build WASM + React, deploy to gh-pages
├── .gitignore                         ← ignores pkg/, dist/, target/, node_modules/
├── Cargo.toml                         ← Rust workspace manifest (members = ["crates/*"])
├── Makefile                           ← Cross-package build orchestration
├── package.json                       ← npm workspaces root (private, no publish)
├── README.md
├── LICENSE
│
├── crates/
│   └── tongue-sim/                    ← Rust/WASM crate
│       ├── Cargo.toml
│       ├── src/ ...                   ← (see §2.1 for internal layout)
│       ├── data/ ...
│       ├── tests/ ...
│       └── pkg/                       ← wasm-pack output (gitignored)
│
└── web/                               ← React frontend
    ├── package.json                   ← workspace member, depends on tongue-sim via link
    ├── vite.config.ts
    ├── tsconfig.json
    ├── src/ ...                       ← (see §2.2 for internal layout)
    └── dist/                          ← vite build output (gitignored)
```

**Root `.gitignore`:**

```gitignore
# Rust
/target/
crates/tongue-sim/pkg/

# Node
node_modules/
web/dist/

# OS
.DS_Store
```

**Root `Cargo.toml`** (Rust workspace):

```toml
[workspace]
members = ["crates/tongue-sim"]
resolver = "2"
```

**Root `package.json`** (npm workspaces):

```json
{
  "private": true,
  "workspaces": ["web", "crates/tongue-sim/pkg"]
}
```

The npm workspaces declaration means that after `wasm-pack build` produces `crates/tongue-sim/pkg/`, the frontend can depend on it as a local workspace package — no manual copy step. In `web/package.json`:

```json
{
  "dependencies": {
    "tongue-sim": "workspace:*"
  }
}
```

Vite resolves the WASM import through the workspace symlink in `node_modules/`.

**Root `Makefile`:**

```makefile
.PHONY: wasm wasm-dev web dev deploy clean

wasm:
	cd crates/tongue-sim && wasm-pack build --target web --release

wasm-dev:
	cd crates/tongue-sim && wasm-pack build --target web --dev

web: wasm
	cd web && npm run build

dev: wasm-dev
	cd web && npm run dev

clean:
	rm -rf crates/tongue-sim/pkg web/dist web/node_modules/.vite

deploy: web
	npx gh-pages -d web/dist
```

### 2.1 Rust/WASM Core

| Concern | Crate / Approach | Notes |
|---|---|---|
| WASM target | `wasm32-unknown-unknown` | Standard Rust WASM target |
| JS interop | `wasm-bindgen` | Generates TS bindings automatically |
| Build tooling | `wasm-pack` | Produces npm-publishable `.wasm` + JS glue |
| Linear algebra | `glam` (2D vecs) | Lightweight, WASM-friendly, no SIMD dependency |
| Serialization | `serde` + `serde-wasm-bindgen` | Pass complex structs across FFI as JS objects |
| Phoneme data | Embedded `include_str!` JSON | Compiled into WASM binary; no runtime fetch |
| Allocator | `wee_alloc` (optional) | Smaller WASM binary (~1KB vs default allocator) |
| Panic handling | `console_error_panic_hook` | Routes Rust panics to `console.error` |

**Crate structure** (`crates/tongue-sim/`):

```
crates/tongue-sim/
├── Cargo.toml
├── src/
│   ├── lib.rs                 # wasm-bindgen entry, exports public API
│   ├── g2p/
│   │   ├── mod.rs             # Grapheme-to-phoneme engine
│   │   ├── cmudict.rs         # Embedded CMUdict lookup
│   │   └── fallback.rs        # Rule-based G2P for OOV words
│   ├── phoneme/
│   │   ├── mod.rs             # Phoneme types, database
│   │   ├── targets.rs         # Articulatory target vectors per phoneme
│   │   └── durations.rs       # Duration model (TIMIT-based)
│   ├── gestures/
│   │   ├── mod.rs             # Gestural score builder
│   │   ├── tiers.rs           # Gesture tier definitions
│   │   ├── blending.rs        # Activation blending & coarticulation
│   │   └── timeline.rs        # Time-aligned gesture sequence
│   ├── physics/
│   │   ├── mod.rs             # Simulation stepper (main loop)
│   │   ├── mesh.rs            # TongueMesh: nodes, quads, constraints
│   │   ├── pbd.rs             # Position-Based Dynamics solver
│   │   ├── muscles.rs         # Muscle force model
│   │   ├── collisions.rs      # SDF-based collision detection
│   │   └── rigid_bodies.rs    # Jaw, velum, hyoid, lips
│   ├── airflow/
│   │   ├── mod.rs             # Area function + 1D flow model
│   │   └── particles.rs       # Particle state for visualization
│   ├── anatomy/
│   │   ├── mod.rs             # AnatomyConfig, static geometry
│   │   └── defaults.rs        # Default adult vocal tract geometry
│   └── api.rs                 # High-level SimulationSession API
├── data/
│   ├── cmudict_compact.json   # Trimmed CMU Pronouncing Dictionary
│   └── phoneme_targets.json   # Per-phoneme articulatory target vectors
└── tests/
    ├── g2p_tests.rs
    ├── physics_tests.rs
    └── integration_tests.rs
```

### 2.2 React Frontend

| Concern | Library | Notes |
|---|---|---|
| Framework | React 18+ | Functional components, hooks only |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS (utility classes only) | Minimal, no custom CSS files |
| Canvas rendering | Raw `<canvas>` via `useRef` + `requestAnimationFrame` | No heavy canvas libs |
| WASM loading | Dynamic `import()` of wasm-pack output | Async init on first interaction |
| State management | `useReducer` + React Context | No external state lib |
| Build | Vite | Fast HMR, native WASM support, static output |
| Deployment | `gh-pages` branch via `vite build` | Single `dist/` folder push |

**Frontend structure** (`web/`):

```
web/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                  # React root mount
│   ├── App.tsx                   # Top-level layout
│   ├── components/
│   │   ├── TextInput.tsx         # Input field + speak button
│   │   ├── VocalTractCanvas.tsx  # Main canvas renderer
│   │   ├── TranscriptOverlay.tsx # Word highlight + IPA display
│   │   ├── PlaybackControls.tsx  # Play/pause, speed slider
│   │   ├── VoiceSelector.tsx     # Web Speech voice picker
│   │   └── SettingsPanel.tsx     # Toggle airflow, labels, debug mesh
│   ├── hooks/
│   │   ├── useSimulator.ts       # Manages WASM SimulationSession lifecycle
│   │   ├── useTTS.ts             # Web Speech API wrapper + event bridge
│   │   ├── useSyncController.ts  # Binds TTS boundary events → sim time
│   │   └── useAnimationLoop.ts   # requestAnimationFrame orchestrator
│   ├── renderer/
│   │   ├── drawTract.ts          # Draws anatomical structures from state
│   │   ├── drawTongue.ts         # Spline-interpolated tongue surface
│   │   ├── drawAirflow.ts        # Particle overlay
│   │   └── colors.ts             # Palette constants
│   ├── wasm/
│   │   └── loader.ts             # Async WASM init + typed wrapper (imports from 'tongue-sim')
│   ├── types/
│   │   └── simulation.ts         # TS interfaces mirroring Rust structs
│   └── utils/
│       ├── spline.ts             # Catmull-Rom for tongue contour smoothing
│       └── timing.ts             # Interpolation helpers
└── dist/                         # vite build output (gitignored)
```

### 2.3 Build and Deployment Pipeline

```
┌────────────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Rust source        │────►│  wasm-pack   │────►│  pkg/            │
│  crates/tongue-sim/ │     │  build       │     │   tongue_sim.wasm│
│                     │     │  --target web│     │   tongue_sim.js  │
└────────────────────┘     └──────────────┘     │   tongue_sim.d.ts│
                                                │   package.json   │
                                                └────────┬─────────┘
                                                         │
                                         npm workspaces symlink
                                       ("tongue-sim": "workspace:*")
                                                         │
┌──────────────┐     ┌──────────────┐     ┌──────────────┴──────┐
│  React source │────►│  vite build  │────►│  web/dist/          │
│  web/src/     │     │              │     │    index.html       │
│               │     │              │     │    assets/*.js      │
└──────────────┘     └──────────────┘     │    assets/*.wasm    │
                                          └────────┬────────────┘
                                                   │
                                          ┌────────┴────────────┐
                                          │  GitHub Pages       │
                                          │  (gh-pages branch)  │
                                          └─────────────────────┘
```

**Build flow** (orchestrated by root `Makefile` or GitHub Actions):
1. `wasm-pack build --target web --release` in `crates/tongue-sim/` → produces `crates/tongue-sim/pkg/`.
2. npm workspaces resolve `tongue-sim` dependency in `web/package.json` via symlink to `pkg/`.
3. `vite build` in `web/` → produces `web/dist/`.
4. `web/dist/` is deployed to `gh-pages` branch.

---

## 3. TTS Integration: Web Speech API

### 3.1 Why Web Speech API

| Requirement | Web Speech API | Alternatives (rejected) |
|---|---|---|
| Free | Yes — built into the browser | Cloud TTS APIs require keys, billing |
| Unthrottled | Yes — local engine, no quotas | Cloud APIs have per-minute/per-char limits |
| Static-site compatible | Yes — no server needed | Server-side TTS needs a backend |
| Cross-browser | Chrome, Edge, Firefox, Safari | — |
| Word-level timing | `boundary` events with `charIndex` | Some cloud APIs offer better timing but at cost |
| Offline capable | Yes (on platforms with local voices) | Cloud requires network |

### 3.2 TTS Event Model

The `SpeechSynthesisUtterance` fires several events that the synchronization controller consumes:

| Event | Payload | Usage |
|---|---|---|
| `start` | `{ elapsedTime }` | Marks `t=0` for the simulation clock |
| `boundary` | `{ charIndex, elapsedTime, name: "word" \| "sentence" }` | Primary sync signal: maps character position to wall-clock time |
| `end` | `{ elapsedTime }` | Signals animation completion; return to rest pose |
| `pause` / `resume` | — | Freezes / resumes the simulation clock |
| `error` | `{ error }` | Fallback: run animation without audio |

### 3.3 Synchronization Strategy

The fundamental challenge is that the Web Speech API does **not** provide phoneme-level timing — it only fires `boundary` events at word boundaries (and inconsistently at sentence boundaries). The synchronization controller must bridge this gap.

#### 3.3.1 Two-Phase Approach

**Phase A — Pre-computation (before TTS starts):**

1. **Text → phoneme timeline**: The Rust/WASM core runs the full G2P + duration model pipeline on the input text, producing a `PhonemeTimeline` with estimated absolute timestamps for every phoneme. This timeline assumes a default speaking rate.
2. **Word-boundary map**: From the input text, compute the character index of each word boundary. Map each word boundary to the phoneme index where that word begins in the `PhonemeTimeline`. This produces a `WordSyncMap`:

```
WordSyncMap = [
    { char_index: 0,  word: "Hello",  phoneme_start_index: 0,  estimated_time_ms: 0 },
    { char_index: 6,  word: "world",  phoneme_start_index: 5,  estimated_time_ms: 420 },
    ...
]
```

**Phase B — Runtime adaptive sync (while TTS is speaking):**

3. **On each `boundary` event**: The TTS engine reports `{ charIndex, elapsedTime }`. The controller looks up the corresponding entry in `WordSyncMap` and computes a local time-stretch factor:

```
actual_word_time = boundary_event.elapsedTime
estimated_word_time = word_sync_map[word_index].estimated_time_ms
drift = actual_word_time - estimated_word_time
```

4. **Adaptive timeline warping**: The controller applies a piecewise-linear time warp to the `PhonemeTimeline`. Between consecutive word boundaries, phoneme timestamps are linearly interpolated between the last known actual time and the next estimated time. This keeps phoneme-level animation smooth while correcting for the TTS engine's actual pacing.

```
                 estimated timeline
phonemes:    |p₁|p₂|p₃|  |p₄|p₅|p₆|p₇|  |p₈|p₉|
                        ▲              ▲
                   word boundary    word boundary
                   (actual t=420)  (actual t=890)

                 warped timeline
phonemes:    |p₁|p₂| p₃ |  | p₄|p₅| p₆|p₇ |  |p₈|p₉|
              └──stretched──┘  └──compressed──┘
```

5. **Lookahead smoothing**: To prevent jarring speed changes at word boundaries, the warp factor is smoothed with a 50ms exponential moving average. The simulation can also "pre-warp" the upcoming word segment based on the running average drift, so corrections are distributed rather than applied as sudden jumps.

#### 3.3.2 Fallback: No Boundary Events

Some browser/voice combinations fire `boundary` events unreliably or not at all. The controller detects this (no boundary events within the first 500ms after `start`) and falls back to **open-loop mode**: the pre-computed `PhonemeTimeline` runs at a fixed rate scaled by the TTS utterance's `rate` property. Lip-sync accuracy degrades but the animation remains plausible.

#### 3.3.3 Rate Matching

When the user adjusts the speaking rate slider:
1. The `SpeechSynthesisUtterance.rate` property is set (range 0.1–10, default 1.0).
2. The Rust core re-generates the `PhonemeTimeline` with a matching `speaking_rate` parameter.
3. The `WordSyncMap` is rebuilt.
4. Adaptive sync handles any residual mismatch.

### 3.4 `useTTS` Hook API

```typescript
interface TTSController {
    speak(text: string, voice?: SpeechSynthesisVoice): void;
    pause(): void;
    resume(): void;
    cancel(): void;
    setRate(rate: number): void;
    setPitch(pitch: number): void;

    // Observable state
    isSpeaking: boolean;
    isPaused: boolean;
    currentCharIndex: number;       // last reported charIndex
    elapsedTime: number;            // last reported elapsedTime (seconds)
    availableVoices: SpeechSynthesisVoice[];

    // Callback registration (called by useSyncController)
    onBoundary: (cb: (charIndex: number, elapsedTime: number) => void) => void;
    onStart: (cb: () => void) => void;
    onEnd: (cb: () => void) => void;
}
```

---

## 4. Anatomical Model

### 4.1 Midsagittal Structures

The renderer draws a 2D sagittal cross-section containing the following anatomical elements, each represented as a polyline or closed polygon:

| Structure | Representation | Degrees of Freedom |
|---|---|---|
| **Hard palate** | Static cubic Bézier curve | 0 (fixed geometry) |
| **Soft palate (velum)** | Hinged flap with one rotational DOF | 1 — elevation angle |
| **Pharyngeal wall** | Static polyline (posterior boundary) | 0 |
| **Nasal cavity** | Static enclosed region above hard/soft palate | 0 |
| **Alveolar ridge** | Static bump on anterior hard palate | 0 |
| **Upper teeth** | Static polygon anchored behind alveolar ridge | 0 |
| **Lower teeth** | Polygon attached to mandible (moves with jaw) | 0 (relative to jaw) |
| **Mandible (jaw)** | Rigid body with rotational DOF around TMJ pivot | 1 — opening angle |
| **Lower lip** | Deformable curve attached to mandible | 2 — protrusion, rounding |
| **Upper lip** | Deformable curve, limited motion | 1 — rounding |
| **Tongue** | Deformable soft body (primary focus) | See §4.2 |
| **Hyoid bone** | Rigid anchor point for tongue root | 1 — vertical displacement |
| **Epiglottis** | Semi-rigid flap above larynx | 1 — tilt angle |
| **Larynx / glottis** | Simplified opening with vibration state | 2 — aperture, voicing flag |
| **Trachea** | Static tube below larynx | 0 |

### 4.2 Tongue Model

The tongue is the central deformable structure, modeled as a 2D soft-body mesh in the midsagittal plane.

#### 4.2.1 Mesh Topology

The tongue mesh consists of a chain of connected quadrilateral elements arranged in two layers (dorsal and ventral surface) spanning from root (posterior, anchored near hyoid) to tip (anterior, free end). Resolution: 14 segments longitudinally, 2 layers vertically, yielding 30 nodes.

```
Dorsal surface (upper):  N₀ ─── N₁ ─── N₂ ─── ... ─── N_tip
                          │      │      │                 │
Ventral surface (lower): M₀ ─── M₁ ─── M₂ ─── ... ─── M_tip
                          ▲
                     (root anchor, constrained to hyoid arc)
```

Each node stores position `(x, y)` in mm. Root nodes (`N₀`, `M₀`) are constrained to slide along a short arc attached to the hyoid, providing limited retraction/advancement.

#### 4.2.2 Muscle Groups as Actuators

Tongue deformation is driven by abstract muscle activations mapped to the four primary extrinsic and four intrinsic muscles, plus palatoglossus. Each is modeled as a force field applied to a node subset:

| Muscle | Type | Effect on Mesh | Param |
|---|---|---|---|
| **Genioglossus (anterior)** | Extrinsic | Pulls tip downward and forward | `α_GGa ∈ [0,1]` |
| **Genioglossus (posterior)** | Extrinsic | Pulls body forward/down; advances root | `α_GGp ∈ [0,1]` |
| **Styloglossus** | Extrinsic | Retracts body upward and backward | `α_SG ∈ [0,1]` |
| **Hyoglossus** | Extrinsic | Pulls body downward and backward | `α_HG ∈ [0,1]` |
| **Palatoglossus** | Extrinsic | Elevates dorsum toward soft palate | `α_PG ∈ [0,1]` |
| **Superior longitudinal** | Intrinsic | Curls tip upward, shortens dorsal surface | `α_SL ∈ [0,1]` |
| **Inferior longitudinal** | Intrinsic | Curls tip downward | `α_IL ∈ [0,1]` |
| **Transversus** | Intrinsic | Narrows tongue (in 2D: raises midline) | `α_T ∈ [0,1]` |
| **Verticalis** | Intrinsic | Flattens tongue (in 2D: lowers dorsum) | `α_V ∈ [0,1]` |

Activation vector: `α = [α_GGa, α_GGp, α_SG, α_HG, α_PG, α_SL, α_IL, α_T, α_V]`

#### 4.2.3 Material Properties

| Property | Value | Source |
|---|---|---|
| Young's modulus | ~2.5–6 kPa | Gerard et al. 2005 |
| Poisson's ratio | ~0.49 | Nearly incompressible soft tissue |
| Rayleigh damping (mass) | α_R = 20 | Tuned for ~80ms settling |
| Rayleigh damping (stiffness) | β_R = 0.005 | |
| Density | 1040 kg/m³ | |

Area-preservation penalty enforces incompressibility in the 2D projection.

### 4.3 Jaw, Lips, Velum

- **Jaw**: Rotates around TMJ pivot. `θ_jaw ∈ [0°, 35°]`. Lower lip and lower teeth are rigidly attached.
- **Lips**: Each lip is a 5-node deformable curve. Parameters: protrusion `p ∈ [-1,1]`, rounding `r ∈ [0,1]`, spreading `s ∈ [0,1]`.
- **Velum**: Hinged flap. `θ_vel ∈ [0°, 45°]` where 0° = fully raised (oral seal), 45° = fully lowered (nasal open). Nasals require `θ_vel > 30°`.

---

## 5. Text-to-Phoneme Pipeline (Rust/WASM)

### 5.1 Grapheme-to-Phoneme (G2P)

The G2P runs entirely in WASM with no network calls:

1. **CMUdict lookup**: A compacted CMU Pronouncing Dictionary (~20,000 most common words, ~800KB JSON) is embedded in the WASM binary via `include_str!`. Input words are normalized (lowercased, stripped of punctuation) and looked up.
2. **Rule-based fallback**: Words not in the dictionary are converted via a hand-coded rule engine implementing English grapheme-to-phoneme correspondences (letter groups → ARPAbet). This covers ~85% of OOV words acceptably for animation purposes. Accuracy is less critical than in TTS since the visual output is approximate; exact pronunciation is provided by the Web Speech API audio.
3. **Output**: `Vec<ArpabetPhoneme>` with stress markers (0/1/2).

### 5.2 Duration Model

Each phoneme receives a baseline duration from TIMIT corpus means, then adjusted:

| Factor | Effect |
|---|---|
| Pre-pausal lengthening | Final phoneme in phrase: +40% |
| Stressed vowel | Primary stress: +25% |
| Consonant cluster | Each member: -15% |
| Speaking rate | Global multiplier (matches TTS `rate`) |

Output: `PhonemeTimeline { entries: Vec<TimedPhoneme>, total_duration_ms: f64 }`

### 5.3 Pause and Breath

- Commas → 200ms pause with partial jaw closure
- Sentence boundaries → 400ms pause with full rest return
- Phrase boundaries > 300ms → breath gesture (jaw open, velum lower, glottis open)

---

## 6. Articulatory Target System

### 6.1 Parameter Space

Each simulation frame is defined by a parameter vector **P**:

```rust
pub struct ArticulatoryState {
    pub muscle_activations: [f64; 9],  // tongue muscles
    pub jaw_angle: f64,                // 0–35°
    pub lip_protrusion: f64,           // -1..1
    pub lip_rounding: f64,             // 0..1
    pub lip_spread: f64,               // 0..1
    pub velum_angle: f64,              // 0–45°
    pub hyoid_offset: f64,             // mm vertical
    pub glottal_aperture: f64,         // 0..1
    pub voicing: f64,                  // 0..1
}
```

18 continuous parameters total.

### 6.2 Phoneme Target Database

Each phoneme maps to a target `ArticulatoryState`. These targets derive from published articulatory data (Mermelstein 1973, Maeda 1990, Badin & Fant 1984, EMA/MRI studies). Stored in `phoneme_targets.json`, embedded at compile time.

#### 6.2.1 Vowels

| Phoneme | IPA | Jaw | Tongue Body | Tongue Tip | Lips | Velum |
|---|---|---|---|---|---|---|
| IY | /iː/ | nearly closed | high front (GGa↑, SG↑) | near alveolar ridge | spread | raised |
| IH | /ɪ/ | slightly open | high-mid front | slightly lowered | neutral | raised |
| EH | /ɛ/ | mid-open | mid front | relaxed | neutral | raised |
| AE | /æ/ | open | low front (GGp↑, HG↑) | low | neutral | raised |
| AA | /ɑː/ | wide open | low back (HG↑↑) | low flat | neutral | raised |
| AO | /ɔː/ | mid-open | mid-low back | low | rounded | raised |
| OW | /oʊ/ | closing | mid-back → high-back | relaxed | rounding↑ | raised |
| UW | /uː/ | nearly closed | high back (SG↑, PG↑) | retracted | protruded + rounded | raised |
| AH | /ʌ/ | mid | central-low | relaxed | neutral | raised |
| AX | /ə/ | mid | central neutral | relaxed | neutral | raised |

#### 6.2.2 Stops

| Phoneme | Place | Closure Target | Voicing | Phases |
|---|---|---|---|---|
| P, B | Bilabial | lips sealed | B=voiced | closure (~80ms) → burst (~15ms) → aspiration(P, ~40ms) |
| T, D | Alveolar | tip → ridge | D=voiced | closure → burst → aspiration(T) |
| K, G | Velar | dorsum → velum | G=voiced | closure → burst → aspiration(K) |

#### 6.2.3 Fricatives

| Phoneme | IPA | Constriction | Tongue Shape | Airflow |
|---|---|---|---|---|
| F, V | /f, v/ | lower lip → upper teeth | neutral | turbulent at lip-teeth gap |
| TH, DH | /θ, ð/ | tip against upper teeth | flat, tip forward | turbulent at tongue-teeth |
| S, Z | /s, z/ | tip near ridge, grooved blade | grooved (T↑, channeled) | high-velocity jet |
| SH, ZH | /ʃ, ʒ/ | post-alveolar, blade raised | wider groove | broad turbulent |
| HH | /h/ | glottal | copies following vowel | glottal turbulence |

#### 6.2.4 Nasals

| Phoneme | IPA | Oral Closure | Velum |
|---|---|---|---|
| M | /m/ | bilabial | lowered |
| N | /n/ | alveolar | lowered |
| NG | /ŋ/ | velar | lowered |

#### 6.2.5 Approximants, Laterals, Affricates

| Phoneme | IPA | Configuration |
|---|---|---|
| L | /l/ | Tip contacts alveolar ridge; dorsum lowered for lateral channel |
| R | /ɹ/ | Tip retroflex or dorsum bunched; slight lip rounding |
| W | /w/ | High back tongue (≈ UW), rapid transition; lips rounded |
| Y | /j/ | High front tongue (≈ IY), rapid transition; lips spread |
| CH | /tʃ/ | Stop phase (alveolar) → fricative phase (post-alveolar SH) |
| JH | /dʒ/ | Voiced variant of CH |

### 6.3 Coarticulation via Gestural Phonology

#### 6.3.1 Gesture Tiers

Each phoneme decomposes into independent gestures on separate tiers:

| Tier | Controls | Example |
|---|---|---|
| Lip aperture | opening/closing | P → lip closure |
| Lip protrusion | protrusion/rounding | UW → lip rounding |
| Tongue tip | tip location + degree | T → tip-to-alveolar |
| Tongue body | body location + degree | K → dorsum-to-velar |
| Velum | velum height | N → velum lowering |
| Glottis | voicing state | S → glottis open |

Gestures have trapezoidal activation profiles (onset → plateau → offset).

#### 6.3.2 Blending

Same-tier gestures blend via weighted average:

```
P_effective(t) = Σᵢ wᵢ(t) · P_targetᵢ  /  Σᵢ wᵢ(t)
```

Cross-tier gestures superimpose independently, naturally producing anticipatory coarticulation.

#### 6.3.3 Key Coarticulation Rules

1. **V-to-V carryover**: Tongue body gesture for V₂ begins during intervening consonant. Degree depends on consonant "resistance" (labials/alveolars allow more than velars).
2. **Anticipatory lip rounding**: Rounding for /u/, /o/ bleeds backward through 1–2 preceding consonants.
3. **Carryover nasalization**: After nasals, velum raising lags ~50ms, slightly nasalizing the following vowel onset.
4. **Reduction**: Unstressed vowels have shorter, lower-activation gestures.

---

## 7. Physics Engine (Rust)

### 7.1 Solver Loop

Fixed timestep: `dt = 1/240s` (4.17ms). Decoupled from render frame rate.

```rust
pub fn step(&mut self, target: &ArticulatoryState, dt: f64) {
    // 1. Convert target to muscle activations (inverse model)
    let activations = self.inverse_model.solve(target);

    // 2. Apply muscle forces to tongue mesh nodes
    self.tongue_mesh.apply_muscle_forces(&activations, &self.muscle_map);

    // 3. Apply gravity + damping
    self.tongue_mesh.apply_external_forces(dt);

    // 4. PBD predict positions
    self.tongue_mesh.predict_positions(dt);

    // 5. Solve constraints (10 iterations)
    for _ in 0..10 {
        self.tongue_mesh.solve_distance_constraints();
        self.tongue_mesh.solve_area_constraints();
        self.tongue_mesh.solve_bending_constraints();
        self.tongue_mesh.solve_collision_constraints(&self.rigid_boundaries);
        self.tongue_mesh.solve_anchor_constraints();
    }

    // 6. Update velocities from position deltas
    self.tongue_mesh.update_velocities(dt);

    // 7. Step rigid bodies (jaw, velum, hyoid, lips)
    self.jaw.step_pd(target.jaw_angle, dt);
    self.velum.step_pd(target.velum_angle, dt);
    self.hyoid.step_pd(target.hyoid_offset, dt);
    self.lips.step(target.lip_protrusion, target.lip_rounding, target.lip_spread, dt);

    // 8. Compute airflow
    self.area_function = compute_area_function(&self.tongue_mesh, &self.anatomy);
    self.airflow = compute_flow(&self.area_function, SUBGLOTTAL_PRESSURE, target.glottal_aperture);
    self.particles.update(&self.airflow, &self.area_function, dt);
}
```

### 7.2 PBD Soft-Body Solver

Position-Based Dynamics (Müller et al. 2007):

1. **Predict**: Explicit Euler on positions using accumulated forces.
2. **Constrain** (Gauss-Seidel, 10 iterations):
   - Distance constraints (edge rest lengths)
   - Area constraints (quad element areas ≈ rest area → incompressibility)
   - Bending constraints (resist excessive curvature)
   - Collision constraints (SDF projection against rigid walls)
   - Anchor constraints (root nodes on hyoid arc)
3. **Velocity update**: `v = (x_new - x_old) / dt`
4. **Rayleigh damping** on velocities.

### 7.3 Muscle Force Model

```
F_m = α_m · F_max_m · hill_factor(length) · direction_field(node)
```

Each muscle has a predefined direction-vector field over the mesh and a Hill-type length-tension curve. Forces are clamped; max velocity per node is 500mm/s.

### 7.4 Collision Detection

Signed distance fields (SDF) are precomputed for rigid boundaries (palate, teeth, mandible). Each tongue node is projected out of collision and receives tangential friction damping simulating mucosal contact.

### 7.5 Inverse Articulatory Model

Maps target `ArticulatoryState` → muscle activations:

1. **Lookup table**: ~200 canonical postures pre-solved to equilibrium at build time, stored as (activation, shape) pairs.
2. **K-NN interpolation** (K=3): Find nearest postures by shape distance, inverse-distance-weight their activations.
3. **Online PD correction**: Lightweight feedback on tongue tip position and body center-of-mass.

---

## 8. Airflow Visualization

### 8.1 1D Area-Function Model

At each frame, cross-sectional area is sampled at 44 stations from glottis to lips by measuring perpendicular distance between tongue surface and opposing wall. Flow via Bernoulli:

```
U = A_min · sqrt(2 · ΔP / ρ)
```

Constriction classification:
- `A > 3.0 cm²` → open (laminar, low velocity)
- `0.1 < A ≤ 3.0 cm²` → narrow (turbulent onset)
- `A ≤ 0.1 cm²` → closed (no flow, pressure builds)

Nasal branch: when velum is lowered, flow splits proportional to oral vs. nasal area.

### 8.2 Particle Rendering

- Emitter at glottis (and nasal port when open).
- Velocity ∝ `U / A(x)` (continuity).
- Turbulence: random lateral perturbation ∝ `1/A` at constrictions.
- 60–100 active particles, 300ms lifetime, fade on exit.

### 8.3 Acoustic Event Markers

- **Voicing**: pulsating glow at glottis during voiced segments.
- **Stop burst**: particle explosion at release point.
- **Frication**: dense turbulence at constriction during fricatives.

---

## 9. Rendering System (TypeScript/Canvas)

### 9.1 Canvas Architecture

The `VocalTractCanvas` component owns a `<canvas>` element and runs a `requestAnimationFrame` loop. Each frame:

1. Query the `SyncController` for the current simulation time `t_sim`.
2. Call into WASM: `session.get_render_state(t_sim)` → returns a `RenderState` object containing all node positions, rigid body states, particle positions, and metadata.
3. Pass `RenderState` to the drawing functions in `renderer/`.

```typescript
// useAnimationLoop.ts
function useAnimationLoop(
    canvasRef: RefObject<HTMLCanvasElement>,
    session: SimulationSession,
    syncController: SyncController
) {
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const loop = (timestamp: DOMHighResTimeStamp) => {
            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx || !session) return;

            const t = syncController.getCurrentSimTime(timestamp);
            const state = session.get_render_state(t);

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            drawTract(ctx, state.anatomy);
            drawTongue(ctx, state.tongue_nodes);
            drawRigidBodies(ctx, state.jaw, state.velum, state.lips);
            drawAirflow(ctx, state.particles);
            drawVoicingIndicator(ctx, state.voicing, state.glottal_aperture);

            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameRef.current);
    }, [session, syncController]);
}
```

### 9.2 Visual Style

Clean anatomical illustration, minimal and modern:

- **Background**: `#FAFAFA` (near-white).
- **Tissue**: Soft fills — `#E8A0A0` (tongue/mucosa), `#F5E6D3` (bone/palate), `#D4A0A0` (pharyngeal wall).
- **Outlines**: 1px `#555` strokes on structures. Tongue dorsal line slightly heavier (1.5px).
- **Airflow particles**: `rgba(100, 180, 255, 0.4)` base, tinted toward `rgba(255, 100, 100, 0.6)` at high velocity.
- **Voicing glow**: Subtle pulsing radial gradient at glottis, `rgba(255, 200, 100, 0.3)`.
- **No decorative elements**. No drop shadows, no gradients on UI chrome. The anatomy illustration itself is the visual interest.

### 9.3 Layering Order (back to front)

1. Nasal cavity fill
2. Pharyngeal wall
3. Trachea / subglottal
4. Epiglottis / larynx
5. Soft palate
6. Hard palate
7. Tongue body (filled polygon: dorsal → tip → ventral → root)
8. Mandible outline
9. Lower teeth / upper teeth
10. Airflow particles
11. Lower lip / upper lip
12. Voicing indicator

### 9.4 Spline Smoothing

Tongue dorsal and ventral surfaces are interpolated with Catmull-Rom splines (TypeScript implementation in `utils/spline.ts`) for smooth contours. Lip curves use quadratic Bézier. A 5ms Gaussian kernel on parameter transitions eliminates residual jitter.

---

## 10. WASM ↔ JS Interface

### 10.1 Exported Rust API (via `wasm-bindgen`)

```rust
#[wasm_bindgen]
pub struct SimulationSession {
    timeline: PhonemeTimeline,
    gestural_score: GesturalScore,
    physics: PhysicsEngine,
    anatomy: AnatomyConfig,
    snapshots: Vec<Snapshot>,     // pre-computed or streaming
}

#[wasm_bindgen]
impl SimulationSession {
    /// Create a new session from input text and speaking rate.
    #[wasm_bindgen(constructor)]
    pub fn new(text: &str, speaking_rate: f64) -> SimulationSession;

    /// Pre-compute all physics frames for the entire utterance.
    /// Returns total duration in ms.
    pub fn precompute(&mut self) -> f64;

    /// Get the render state at a given simulation time (ms).
    /// Interpolates between nearest precomputed snapshots.
    pub fn get_render_state(&self, time_ms: f64) -> JsValue;  // RenderState as JS object

    /// Get the phoneme timeline for sync map construction.
    pub fn get_phoneme_timeline(&self) -> JsValue;  // Vec<TimedPhoneme> as JS array

    /// Get word boundary mapping for TTS sync.
    pub fn get_word_sync_map(&self, text: &str) -> JsValue;

    /// Rebuild timeline at a new speaking rate.
    pub fn set_speaking_rate(&mut self, rate: f64);

    /// Total simulation duration in ms.
    pub fn duration_ms(&self) -> f64;
}
```

### 10.2 RenderState Structure (Serialized to JS)

```rust
#[derive(Serialize)]
pub struct RenderState {
    pub tongue_dorsal: Vec<[f64; 2]>,     // smoothed dorsal contour points
    pub tongue_ventral: Vec<[f64; 2]>,    // smoothed ventral contour points
    pub jaw_angle: f64,
    pub upper_lip: Vec<[f64; 2]>,
    pub lower_lip: Vec<[f64; 2]>,
    pub velum_angle: f64,
    pub hyoid_y: f64,
    pub glottal_aperture: f64,
    pub voicing: f64,
    pub particles: Vec<AirflowParticleState>,
    pub current_phoneme_ipa: String,
    pub current_phoneme_index: usize,
}

#[derive(Serialize)]
pub struct AirflowParticleState {
    pub x: f64,
    pub y: f64,
    pub velocity_magnitude: f64,
    pub turbulence: f64,
    pub opacity: f64,
}
```

### 10.3 Memory and Performance Considerations

- All precomputed snapshots live in WASM linear memory. `get_render_state` serializes only the single requested frame across the FFI boundary via `serde-wasm-bindgen`.
- For a 5-second utterance at 240 Hz, that is ~1200 snapshots. Each snapshot is ~2KB → ~2.4MB total. Well within browser memory limits.
- Precomputation of a 5-second utterance takes ~50–100ms in release WASM (1200 frames × ~60μs each). This is fast enough to run between the user pressing "Speak" and the TTS audio starting (~100–200ms latency in most browsers).

---

## 11. UI Design

### 11.1 Design Language

The interface follows a strictly minimalist aesthetic: monochrome chrome, generous whitespace, a single accent color, and the anatomical canvas as the sole visual focus.

| Element | Specification |
|---|---|
| Typeface | System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) |
| Accent color | `#2563EB` (blue-600) — used sparingly for active states and the speak button |
| Background | `#FFFFFF` (page), `#FAFAFA` (canvas area) |
| Text | `#111827` (primary), `#6B7280` (secondary) |
| Borders | `#E5E7EB` (gray-200), 1px, only where needed |
| Radius | `6px` on inputs and buttons |
| Spacing | 8px base grid |
| Shadows | None |

### 11.2 Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │  ← 16px padding
│   Tongue Simulator                    [⚙]           │  ← Title (text-lg, font-medium)
│                                                     │     + settings gear icon
│  ┌─────────────────────────────────────────────────┐│
│  │                                                 ││
│  │                                                 ││
│  │           [ Vocal Tract Canvas ]                ││  ← ~60% viewport height
│  │           ( midsagittal cross-section )         ││     aspect ratio ~4:3
│  │                                                 ││
│  │                                                 ││
│  │                                                 ││
│  │                                    [IPA: /h ɛ/] ││  ← current phoneme, bottom-right
│  └─────────────────────────────────────────────────┘│
│                                                     │
│   "Hello world"                                     │  ← transcript with word highlight
│    ─────                                            │     (underline on active word)
│                                                     │
│  ┌───────────────────────────────────┐  ┌─────────┐│
│  │ Type something to speak...        │  │  Speak ▶│││  ← text input + button
│  └───────────────────────────────────┘  └─────────┘│
│                                                     │
│   ◀◀   ▶/❚❚   ▶▶      ───●──────── 1.0×           │  ← playback controls + rate slider
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 11.3 Settings Panel (Slide-out or Modal)

Accessed via the gear icon. Contains:

- **Voice**: dropdown of `speechSynthesis.getVoices()` filtered to `lang.startsWith('en')`
- **Show airflow**: toggle (default on)
- **Show labels**: toggle (default off)
- **Show mesh debug**: toggle (default off)
- **Pitch**: slider 0.5–2.0 (maps to `SpeechSynthesisUtterance.pitch`)

### 11.4 Interaction Flow

1. User types text and presses "Speak" (or Enter).
2. WASM `SimulationSession` is created; precomputation runs (~50ms).
3. `SpeechSynthesisUtterance` is created with the same text, configured voice, rate, pitch.
4. `SyncController` is initialized with the `WordSyncMap` from WASM and the TTS event callbacks.
5. TTS `speak()` is called. On `start` event, the animation loop begins.
6. `boundary` events drive adaptive time-warping.
7. On `end` event, the tongue returns to rest position over 200ms, animation loop stops.

### 11.5 Responsive Behavior

- Canvas scales to container width, maintaining 4:3 aspect ratio.
- Below 640px width: controls stack vertically, text input becomes full-width.
- The anatomical view uses a coordinate system in mm, mapped to canvas pixels via a uniform scale factor. Anatomical proportions are preserved regardless of viewport size.

---

## 12. Data Structures (Rust)

### 12.1 Core Types

```rust
#[derive(Clone, Copy)]
pub struct Vec2 {
    pub x: f64,
    pub y: f64,
}

pub struct MeshNode {
    pub id: usize,
    pub position: Vec2,
    pub predicted: Vec2,
    pub velocity: Vec2,
    pub inv_mass: f64,               // 0.0 = pinned
    pub muscle_weights: [f64; 9],    // per-muscle influence on this node
}

pub struct TongueMesh {
    pub dorsal: Vec<MeshNode>,       // root → tip
    pub ventral: Vec<MeshNode>,      // root → tip
    pub quads: Vec<[usize; 4]>,
    pub rest_lengths: HashMap<(usize, usize), f64>,
    pub rest_areas: Vec<f64>,
}

pub struct ArticulatoryState {
    pub muscle_activations: [f64; 9],
    pub jaw_angle: f64,
    pub lip_protrusion: f64,
    pub lip_rounding: f64,
    pub lip_spread: f64,
    pub velum_angle: f64,
    pub hyoid_offset: f64,
    pub glottal_aperture: f64,
    pub voicing: f64,
}

pub struct Phoneme {
    pub ipa: String,
    pub arpabet: String,
    pub target: ArticulatoryState,
    pub gestures: Vec<GestureSpec>,
}

pub struct GestureSpec {
    pub tier: GestureTier,
    pub target_params: Vec<(String, f64)>,
    pub onset_ms: f64,
    pub plateau_ms: f64,
    pub offset_ms: f64,
    pub peak_activation: f64,
    pub priority: u8,
}

pub enum GestureTier {
    LipAperture,
    LipProtrusion,
    TongueTip,
    TongueBody,
    Velum,
    Glottis,
}

pub struct TimedPhoneme {
    pub phoneme: Phoneme,
    pub start_ms: f64,
    pub end_ms: f64,
    pub stress: Stress,
}

pub enum Stress { None, Secondary, Primary }

pub struct PhonemeTimeline {
    pub entries: Vec<TimedPhoneme>,
    pub total_duration_ms: f64,
}

pub struct TractAreaFunction {
    pub areas: [f64; 44],            // cm² at each station
    pub positions: [f64; 44],        // distance from glottis, cm
}

pub struct AirflowParticle {
    pub position: Vec2,
    pub velocity: Vec2,
    pub age_ms: f64,
    pub turbulence: f64,
    pub opacity: f64,
}
```

### 12.2 Anatomy Configuration

```rust
pub struct AnatomyConfig {
    pub palate_bezier: [Vec2; 4],
    pub alveolar_ridge: Vec<Vec2>,
    pub pharyngeal_wall: Vec<Vec2>,
    pub nasal_cavity: Vec<Vec2>,
    pub tmj_pivot: Vec2,
    pub mandible_polygon: Vec<Vec2>,
    pub upper_teeth: Vec<Vec2>,
    pub lower_teeth: Vec<Vec2>,       // relative to mandible
    pub hyoid_position: Vec2,
    pub hyoid_range: (f64, f64),
    pub epiglottis_anchor: Vec2,
    pub larynx_position: Vec2,
    pub tongue_root_arc: ArcSpec,
}
```

---

## 13. Phoneme Transition Dynamics

### 13.1 Articulator Response Times

| Articulator | Transition Time | PD Gain (kp) |
|---|---|---|
| Glottis | 20–40ms | 800 |
| Tongue tip | 40–80ms | 400 |
| Tongue body | 60–120ms | 200 |
| Lips | 80–120ms | 150 |
| Jaw | 100–150ms | 100 |
| Velum | 80–200ms | 80 |

These scale the gesture onset/offset ramps and PD controller gains.

### 13.2 Diphthongs and Glides

Diphthongs: two vowel targets, first ~60% duration, second ~40%, smooth interpolation. Glides: faster transition (~30ms), initial target with narrow constriction approaching consonant-like.

### 13.3 Gemination

Adjacent identical phonemes at syllable boundaries merge into a single prolonged gesture rather than release-and-reform.

---

## 14. Calibration Framework

### 14.1 Reference Data

| Source | Data Type | Usage |
|---|---|---|
| USC SPAN / XRMB | EMA pellet trajectories | Ground-truth tongue positions |
| Maeda (1990) | Factor analysis of X-ray data | 7-parameter articulatory reference |
| Mermelstein (1973) | Geometric vocal tract model | Tract geometry |
| Fant (1960) | Area-function ↔ formant theory | Area function validation |
| IPA handbook | Articulatory descriptions | Qualitative target verification |
| Perkell et al. (1992) | Tongue movement speeds | Transition timing |

### 14.2 Tuning Procedure

1. **Static posture**: Freeze at phoneme midpoint, compare tongue contour to MRI/X-ray images. Adjust muscle directions.
2. **Dynamic transitions**: Simulate VCV sequences (/ata/, /isi/, /uku/), compare to EMA trajectories. Adjust PD gains and gesture timing.
3. **Coarticulation**: Verify anticipatory lip rounding, V-to-V carryover in minimal pairs.
4. **Perceptual**: Silent speechreading identification test. Target > 70% word identification accuracy.

---

## 15. Performance Budget

| Component | Per Frame (at 60fps) | Notes |
|---|---|---|
| WASM: `get_render_state` | < 0.3ms | Snapshot lookup + interpolation + serialize |
| JS: Canvas clear + draw tract | < 2ms | Static geometry, cached paths |
| JS: Draw tongue (spline) | < 1ms | Catmull-Rom on ~30 points |
| JS: Draw airflow particles | < 0.5ms | 100 circles with alpha |
| JS: Draw UI overlays | < 0.5ms | Text, phoneme label |
| Sync controller | < 0.1ms | Time lookup |
| **Total per render frame** | **< 5ms** | **16.7ms budget at 60fps** |

WASM precomputation (one-time per utterance):

| Utterance length | Frames (240Hz) | Est. time | Memory |
|---|---|---|---|
| 2 seconds | 480 | ~30ms | ~1MB |
| 5 seconds | 1200 | ~70ms | ~2.4MB |
| 15 seconds | 3600 | ~200ms | ~7MB |
| 30 seconds | 7200 | ~400ms | ~14MB |

For utterances > 15 seconds, consider streaming mode (compute frames in chunks of 1200 ahead of playback).

---

## 16. Build and Deploy

### 16.1 Prerequisites

```bash
# Rust + WASM toolchain
rustup target add wasm32-unknown-unknown
cargo install wasm-pack

# Node (for React frontend)
node >= 18
npm >= 9
```

### 16.2 Local Development

```bash
# From repo root — one-time setup
npm install                  # installs all workspaces

# Terminal 1: Build WASM (dev mode)
make wasm-dev
# equivalent to: cd crates/tongue-sim && wasm-pack build --target web --dev
# output: crates/tongue-sim/pkg/  (symlinked into node_modules by npm workspaces)

# Terminal 2: Run Vite dev server
make dev
# equivalent to: cd web && npm run dev
# serves at localhost:5173 with HMR
```

After modifying Rust source, re-run `make wasm-dev` in Terminal 1. Vite will detect the changed WASM output via the workspace symlink and trigger an HMR update.

### 16.3 Production Build

```bash
# From repo root
make web
# equivalent to:
#   cd crates/tongue-sim && wasm-pack build --target web --release
#   cd web && npm run build
# output: web/dist/  (ready for GitHub Pages)
```

### 16.4 GitHub Actions CI/CD

Located at `.github/workflows/deploy.yml` in the repo root:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
    paths:
      - 'crates/**'
      - 'web/**'
      - 'package.json'
      - 'Makefile'
      - '.github/workflows/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: wasm32-unknown-unknown

      - name: Install wasm-pack
        run: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

      - name: Build WASM
        run: cd crates/tongue-sim && wasm-pack build --target web --release

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build Frontend
        run: cd web && npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./web/dist
```

The `paths` filter ensures the workflow only runs when relevant source files change (not on README-only edits, etc.). The root-level `npm ci` installs all workspace dependencies and creates the symlink from `node_modules/tongue-sim` → `crates/tongue-sim/pkg/`.

### 16.5 WASM Binary Size Budget

| Component | Estimated Size (gzip) |
|---|---|
| Physics engine + PBD solver | ~40KB |
| G2P + CMUdict (compressed) | ~250KB |
| Phoneme database + gesture specs | ~15KB |
| Anatomy geometry | ~5KB |
| `wasm-bindgen` glue | ~10KB |
| **Total WASM** | **~320KB** |
| React app bundle | ~80KB |
| **Total page load** | **~400KB** |

---

## 17. Phased Implementation Plan

### Phase 1 — Static Articulatory Viewer (Weeks 1–3)

**WASM**: Implement `AnatomyConfig`, `TongueMesh`, PBD solver, phoneme database with targets for 39 ARPAbet phonemes. Export a `set_phoneme(arpabet: &str)` function that solves to equilibrium and returns `RenderState`.

**React**: Canvas renderer drawing all anatomical structures. A dropdown to select phonemes manually. No TTS yet.

**Milestone**: User selects a phoneme from a list, tongue deforms to the correct shape.

### Phase 2 — Continuous Animation (Weeks 4–6)

**WASM**: Gestural score builder, gesture blending, inverse articulatory model. Full `SimulationSession` with precompute. Jaw, lip, velum animation.

**React**: Animation loop via `requestAnimationFrame`. Manual phoneme sequence input (e.g., paste IPA string) for testing transitions.

**Milestone**: Smooth tongue animation through arbitrary phoneme sequences.

### Phase 3 — Text + TTS Integration (Weeks 7–9)

**WASM**: G2P pipeline (CMUdict + rule fallback), duration model, `get_word_sync_map`.

**React**: `useTTS` hook, `useSyncController` hook, adaptive time-warping. Full text input → TTS + synchronized animation pipeline. Transcript overlay with word highlighting.

**Milestone**: Type "Hello world", hear it spoken, see the mouth animate in sync.

### Phase 4 — Airflow, Polish, Deploy (Weeks 10–12)

**WASM**: Area function computation, particle physics.

**React**: Particle rendering, voicing indicator, settings panel, voice selector, playback controls. Responsive layout. GitHub Actions deploy pipeline.

**Milestone**: Production-quality static site on GitHub Pages.

### Phase 5 — Extensions (Ongoing)

- Formant synthesizer driven by area function (replace Web Speech API with self-generated audio).
- Multi-language phoneme support (French, Spanish, German).
- User-adjustable anatomy (palate height, tongue length slider).
- 3D volumetric tract extension (Three.js or WebGPU).
- "Slow motion" mode with per-phoneme stepping for language learning.

---

## 18. API Summary

### 18.1 WASM Public Interface

```rust
// Core session
SimulationSession::new(text: &str, speaking_rate: f64) -> Self
SimulationSession::precompute(&mut self) -> f64  // returns duration_ms
SimulationSession::get_render_state(&self, time_ms: f64) -> JsValue
SimulationSession::get_phoneme_timeline(&self) -> JsValue
SimulationSession::get_word_sync_map(&self, text: &str) -> JsValue
SimulationSession::set_speaking_rate(&mut self, rate: f64)
SimulationSession::duration_ms(&self) -> f64

// Static helpers
get_phoneme_list() -> JsValue          // all supported phonemes
get_default_anatomy() -> JsValue       // default AnatomyConfig
solve_static_posture(arpabet: &str) -> JsValue  // single phoneme → RenderState
```

### 18.2 React Hook API

```typescript
// useSimulator
const { session, isReady, precompute, getRenderState } = useSimulator(text, rate);

// useTTS
const { speak, pause, resume, cancel, isSpeaking, voices, setVoice, setRate } = useTTS();

// useSyncController
const { currentSimTime, currentWord, currentPhoneme, isActive } = useSyncController(session, tts);

// useAnimationLoop
useAnimationLoop(canvasRef, session, syncController);  // drives rendering
```

---

## 19. Glossary

| Term | Definition |
|---|---|
| **ARPAbet** | ASCII phoneme notation (e.g., "AE1" for stressed /æ/) |
| **Articulatory Phonology** | Framework modeling speech as overlapping gestures on independent tiers |
| **Coarticulation** | Influence of neighboring phonemes on articulation |
| **EMA** | Electromagnetic articulography; tracks sensors on articulators |
| **G2P** | Grapheme-to-phoneme conversion |
| **Gestural score** | Time-aligned articulatory gesture specifications |
| **Midsagittal** | Median plane dividing body into left/right halves |
| **PBD** | Position-Based Dynamics; solves constraints on positions directly |
| **SDF** | Signed distance field; precomputed distance-to-surface for collision |
| **Velum** | Soft palate; controls nasal airflow coupling |
| **WASM** | WebAssembly; portable binary format for near-native browser execution |
| **Web Speech API** | Browser-native TTS/STT interface; `SpeechSynthesis` for text-to-speech |

---

*This document is the authoritative architectural reference for the Tongue Simulator project. All implementation decisions should trace to the models, structures, and algorithms described herein.*
