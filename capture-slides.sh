#!/usr/bin/env bash
# Generate 12 genuine Chrome/Chromium renders on the user's OWN machine.
# No upload, cloud service, external API or repository publication.
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/screenshots_1920x1080"
ZIP_FILE="$SCRIPT_DIR/WALL_E_SLIDES_SCREENSHOTS_1920x1080.zip"

CHROME_BIN=""
for candidate in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$candidate" >/dev/null 2>&1; then
    CHROME_BIN="$(command -v "$candidate")"
    break
  fi
done
if [[ -z "$CHROME_BIN" ]]; then
  printf '%s\n' 'Chrome/Chromium не найден. Установи обычный Google Chrome или Chromium и повтори.' >&2
  exit 2
fi
if [[ ! -f "$SCRIPT_DIR/index.html" ]]; then
  printf '%s\n' 'Не найден index.html рядом со скриптом.' >&2
  exit 2
fi

mkdir -p "$OUTPUT_DIR"
URL="file://$SCRIPT_DIR/index.html"

for number in $(seq 1 12); do
  target="$OUTPUT_DIR/slide-$(printf '%02d' "$number").png"
  printf 'Слайд %02d/12 ... ' "$number"
  "$CHROME_BIN" \
    --headless \
    --hide-scrollbars \
    --disable-dev-shm-usage \
    --run-all-compositor-stages-before-draw \
    --window-size=1920,1080 \
    --virtual-time-budget=2200 \
    --screenshot="$target" \
    "$URL#$number" >/dev/null 2>&1

  if [[ ! -s "$target" ]]; then
    printf 'ОШИБКА: файл PNG не создан или пуст.\n' >&2
    exit 1
  fi
  printf 'OK\n'
done

if command -v zip >/dev/null 2>&1; then
  # Recreating a task-specific ZIP only; screenshots themselves are preserved.
  (cd "$OUTPUT_DIR" && zip -q -FS "$ZIP_FILE" slide-*.png)
  printf '\nГотово: %s\n' "$ZIP_FILE"
else
  printf '\nГотово: снимки в каталоге %s\n' "$OUTPUT_DIR"
  printf 'Для ZIP понадобится утилита zip.\n'
fi
printf 'Проверь визуально слайды 3, 5 и 6: автоматический снимок не гарантирует правильную композицию.\n'
