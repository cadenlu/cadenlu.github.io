HUGO ?= hugo
PORT ?= 1313

.PHONY: help build serve clean chroma check deploy-preview

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

build: ## Build the site into public/
	$(HUGO) --gc --minify

serve: ## Run the dev server with drafts
	$(HUGO) server --buildDrafts --navigateToChanged --port $(PORT)

clean: ## Remove generated output and caches
	rm -rf public resources/_gen
	$(HUGO) mod clean --all

chroma: ## Regenerate assets/css/chroma.css from Hugo's Chroma styles
	python3 scripts/gen-chroma.py

check: ## Report unused templates, missing internal links, and template problems
	@# Builds to a scratch directory so public/ keeps its production output.
	@# Note: --printUnusedTemplates reports a false positive for
	@# layouts/_default/archive.html, which is selected via `layout: archive`
	@# in content/archive.md rather than by kind.
	$(HUGO) --destination "$(TMPDIR)/hugo-check" --printPathWarnings --printUnusedTemplates
