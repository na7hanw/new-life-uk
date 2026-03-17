# New Life UK — common developer commands
# All targets delegate to the nluk/ sub-project where the app lives.
#
# Usage:
#   make install   — install npm dependencies
#   make dev       — start the Vite dev server  (http://localhost:5173)
#   make build     — production build → nluk/dist/
#   make preview   — serve the production build locally
#   make test      — run Vitest tests
#   make lint      — ESLint + jsx-a11y checks
#
# You can also cd nluk && npm <command> for the same effect.

.PHONY: install dev build preview test lint

install:
	npm --prefix nluk install

dev:
	npm --prefix nluk run dev

build:
	npm --prefix nluk run build

preview:
	npm --prefix nluk run preview

test:
	npm --prefix nluk test

lint:
	npm --prefix nluk run lint
