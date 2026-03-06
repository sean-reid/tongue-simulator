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
