#!/usr/bin/env bash
# Normalize headshot images to consistent 600x600 square WebP files.
# Requires: sips (macOS built-in) + cwebp (brew install webp)
# Usage: bash scripts/normalize-headshots.sh

set -euo pipefail

HEADSHOT_DIR="frontend/public/images/headshots"
SIZE=600
QUALITY=85

cd "$(dirname "$0")/.."

if ! command -v cwebp &>/dev/null; then
  echo "Error: cwebp not found. Install with: brew install webp"
  exit 1
fi

echo "Normalizing headshots in $HEADSHOT_DIR → ${SIZE}x${SIZE} WebP (q${QUALITY})"

for src in "$HEADSHOT_DIR"/*; do
  filename=$(basename "$src")

  # Skip blank placeholder
  if [[ "$filename" == "blank_headshot.png" ]]; then
    echo "  SKIP $filename (placeholder)"
    continue
  fi

  # Skip already-processed webp files
  if [[ "$filename" == *.webp ]]; then
    echo "  SKIP $filename (already webp)"
    continue
  fi

  stem="${filename%.*}"
  dest="$HEADSHOT_DIR/${stem}.webp"

  # Get current dimensions
  w=$(sips -g pixelWidth "$src" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$src" | awk '/pixelHeight/{print $2}')
  echo "  Processing $filename (${w}x${h})"

  # Work on a temp copy as PNG (sips intermediate)
  tmp="/tmp/headshot_${stem}.png"
  sips -s format png "$src" --out "$tmp" >/dev/null 2>&1

  # Center-crop to square (use the smaller dimension)
  if [ "$w" -gt "$h" ]; then
    sips --cropToHeightWidth "$h" "$h" "$tmp" >/dev/null 2>&1
  elif [ "$h" -gt "$w" ]; then
    sips --cropToHeightWidth "$w" "$w" "$tmp" >/dev/null 2>&1
  fi

  # Resize to target
  sips --resampleHeightWidth "$SIZE" "$SIZE" "$tmp" >/dev/null 2>&1

  # Convert to webp using cwebp
  cwebp -q "$QUALITY" "$tmp" -o "$dest" >/dev/null 2>&1

  # Clean up
  rm -f "$tmp"
  rm -f "$src"
  echo "    → ${stem}.webp (${SIZE}x${SIZE})"
done

echo "Done. All headshots normalized."
