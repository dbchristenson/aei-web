.PHONY: clean clean-pyc clean-build clean-ds clean-next clean-all

# Remove Python bytecode and cache
clean-pyc:
	find . -type d -name "__pycache__" -not -path "./.venv/*" -not -path "./analysis/.venv/*" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -not -path "./.venv/*" -not -path "./analysis/.venv/*" -exec rm -f {} + 2>/dev/null || true
	find . -type f -name "*.pyo" -not -path "./.venv/*" -not -path "./analysis/.venv/*" -exec rm -f {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true

# Remove Next.js build output
clean-next:
	rm -rf frontend/.next
	rm -rf .next

# Remove .DS_Store files
clean-ds:
	find . -type f -name ".DS_Store" -exec rm -f {} +

# Remove Python build artifacts
clean-build:
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "dist" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "build" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Remove editor/OS temp files
clean-temp:
	find . -type f -name "*.swp" -exec rm -f {} +
	find . -type f -name "*.swo" -exec rm -f {} +
	find . -type f -name "*~" -exec rm -f {} +
	find . -type f -name "Thumbs.db" -exec rm -f {} +

# Remove everything except venvs and node_modules
clean: clean-pyc clean-ds clean-temp
	@echo "Cleaned bytecode, .DS_Store, and temp files."

# Nuclear option — also removes build output
clean-all: clean clean-build clean-next
	@echo "Cleaned everything (excluding venvs and node_modules)."
