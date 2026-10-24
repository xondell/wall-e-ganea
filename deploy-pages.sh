#!/usr/bin/env bash
set -euo pipefail

# Intentionally dry-run by default. Publishing Ganea-related material requires
# the operator's explicit decision and appropriate company authorization.
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${2:-}"

if [[ "${1:-}" != "--publish" || -z "$TARGET" ]]; then
  printf '%s\n' 'Ничего не опубликовано.'
  printf '%s\n' 'Для публикации (только после разрешения правообладателя):'
  printf '%s\n' '  bash deploy-pages.sh --publish GITHUB_OWNER/REPO'
  printf '%s\n' 'Понадобятся установленный gh, вход gh auth login и подтверждение публичности.'
  exit 0
fi

if [[ ! "$TARGET" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  printf '%s\n' 'Недопустимое имя: ожидается OWNER/REPO.' >&2
  exit 2
fi

command -v git >/dev/null || { printf 'git не найден\n' >&2; exit 2; }
command -v gh >/dev/null || { printf 'gh CLI не найден\n' >&2; exit 2; }
gh auth status

printf '%s\n' "Будет создан/обновлён ПУБЛИЧНЫЙ репозиторий $TARGET, включая материалы WALL-E."
printf '%s' 'Введите PUBLISH WALL-E для подтверждения: '
read -r CONFIRMATION
[[ "$CONFIRMATION" == 'PUBLISH WALL-E' ]] || { printf 'Отменено\n'; exit 1; }

cd "$SCRIPT_DIR"
if [[ ! -d .git ]]; then git init -b main; fi
git add index.html styles.css app.js world3d.js README.md SOURCES.md ASSET_CREDITS.md docs tests .nojekyll .github deploy-pages.sh
if ! git diff --cached --quiet; then git commit -m 'Add WALL-E Ganea interactive presentation'; fi

if gh repo view "$TARGET" >/dev/null 2>&1; then
  if ! git remote get-url origin >/dev/null 2>&1; then git remote add origin "https://github.com/$TARGET.git"; fi
else
  gh repo create "$TARGET" --public --source . --remote origin
fi
git push -u origin main
printf '%s\n' 'Код загружен. В GitHub Settings → Pages выберите Source: GitHub Actions.'
printf '%s\n' "Проверьте GitHub Actions для $TARGET перед тем, как считать сайт опубликованным."
