#!/usr/bin/env bash
set -euo pipefail

echo "==> Railpack start.sh running in: $(pwd)"
echo "==> Listing root:"
ls -la

# Change this if you want to start frontend instead
APP_DIR="${APP_DIR:-backend}"

if [[ ! -d "$APP_DIR" ]]; then
  echo "✖ APP_DIR '$APP_DIR' not found. Set APP_DIR=backend or APP_DIR=frontend."
  echo "Root contains:"
  ls -la
  exit 1
fi

cd "$APP_DIR"
echo "==> Entered $(pwd)"
ls -la

# ---- Node.js (package.json) ----
if [[ -f "package.json" ]]; then
  echo "==> Detected Node app (package.json)"

  if command -v npm >/dev/null 2>&1; then
    echo "==> Installing dependencies (npm ci if lockfile exists, else npm install)"
    if [[ -f "package-lock.json" ]]; then
      npm ci
    else
      npm install
    fi

    # Optional build step (won't fail if missing)
    echo "==> Running build if present"
    npm run -s build || true

    echo "==> Starting Node app"
    exec npm run -s start
  else
    echo "✖ npm not found in environment."
    exit 1
  fi
fi

# ---- Python (requirements.txt / pyproject.toml) ----
if [[ -f "requirements.txt" || -f "pyproject.toml" ]]; then
  echo "==> Detected Python app"

  if command -v python >/dev/null 2>&1; then
    python -V

    if command -v pip >/dev/null 2>&1; then
      if [[ -f "requirements.txt" ]]; then
        echo "==> Installing requirements.txt"
        pip install --no-cache-dir -r requirements.txt
      else
        echo "==> pyproject.toml found. Installing with pip (editable)."
        pip install --no-cache-dir -e .
      fi
    fi

    # Try common start patterns:
    # 1) If PORT exists and app uses uvicorn with main:app or app:app, set START_CMD env.
    # 2) Otherwise user must set START_CMD.
    START_CMD="${START_CMD:-}"

    if [[ -z "$START_CMD" ]]; then
      echo "✖ Python app detected but no START_CMD provided."
      echo "  Set START_CMD, e.g.:"
      echo "  START_CMD='python -m yourmodule'"
      echo "  START_CMD='uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}'"
      exit 1
    fi

    echo "==> Starting Python app with START_CMD: $START_CMD"
    exec bash -lc "$START_CMD"
  else
    echo "✖ python not found in environment."
    exit 1
  fi
fi

# ---- Static site (frontend build output) ----
# If you want to serve a static build, you'd typically need a server. Many platforms handle this separately.
# Keeping this explicit so it doesn't silently "succeed" while doing nothing.
echo "✖ Could not detect how to start app in '$APP_DIR'."
echo "  Expected package.json (Node) or requirements.txt/pyproject.toml (Python)."
exit 1
