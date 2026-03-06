# Tongue Simulator

A real-time midsagittal vocal tract animation that synchronises with text-to-speech playback. Type a phrase, press Speak, and watch an anatomically-modelled tongue, jaw, velum, and lips move through each phoneme.

## How it works

- **Rust/WASM** — a physics-based (PBD) soft-body tongue mesh is pre-computed for the full phoneme sequence and exposed via `wasm-bindgen`
- **G2P + gestural phonology** — text is converted to ARPAbet phonemes, then to smooth articulatory trajectories
- **React + Canvas** — the Web Speech API speaks the text; boundary events sync the simulation timeline to the audio

## Build

```sh
# Install wasm-pack (once)
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Build WASM, then the frontend
make wasm
cd web && npm install && npm run dev
```

Or to build everything for production:

```sh
make wasm && cd web && npm run build
```

## Deploy

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys to GitHub Pages.
