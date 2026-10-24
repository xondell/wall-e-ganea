#!/usr/bin/env bash
# Publish the static deck via GitHub Actions / GitHub Pages.
# DRY RUN is the default. Nothing goes online without --publish and confirmation.
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-}"
TARGET="${2:-}"

if [[ "$MODE" != "--publish" || -z "$TARGET" ]]; then
  printf '%s\n' 'Публикации не было. Запусти после решения о публичности:'
  printf '%s\n' '  bash deploy-pages.sh --publish xondell/wall-e-ganea'
  printf '%s\n' 'Нужны git, gh (GitHub CLI) и авторизация gh auth login.'
  exit 0
fi
if [[ ! "$TARGET" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  printf '%s\n' 'Ожидалось имя GitHub OWNER/REPO.' >&2
  exit 2
fi
for binary in git gh; do
  command -v "$binary" >/dev/null 2>&1 || { printf 'Не найден %s\n' "$binary" >&2; exit 2; }
done
gh auth status

cd "$SCRIPT_DIR"
for required in index.html app.js world3d.js styles.css assets/glm-usage-2026-10-25.png .github/workflows/pages.yml; do
  [[ -s "$required" ]] || { printf 'Нет обязательного файла: %s\n' "$required" >&2; exit 2; }
done

repository_exists=false
if gh repo view "$TARGET" --json name --jq .name >/dev/null 2>&1; then
  repository_exists=true
fi
if [[ -d .git ]]; then
  current_branch="$(git branch --show-current)"
  if [[ "$current_branch" != main ]]; then
    printf 'Остановлено: текущая ветка %s, нужна main. Ветки не переключаю.\n' "$current_branch" >&2
    exit 3
  fi
  existing_remote="$(git remote get-url origin 2>/dev/null || true)"
  if [[ -n "$existing_remote" && "$existing_remote" != "https://github.com/$TARGET.git" && "$existing_remote" != "git@github.com:$TARGET.git" ]]; then
    printf 'Остановлено: origin указывает на другой репозиторий: %s\n' "$existing_remote" >&2
    exit 3
  fi
elif [[ "$repository_exists" == true ]]; then
  printf '%s\n' 'Остановлено: репозиторий уже существует, а локальной Git-истории нет.' >&2
  printf '%s\n' 'Сначала клонируй именно этот репозиторий или выбери новое имя; историю не перезаписываю.' >&2
  exit 3
fi

printf '\n%s\n' "Будет создан/обновлён ПУБЛИЧНЫЙ GitHub-репозиторий: $TARGET"
printf '%s\n' 'JavaScript презентации и заметки в нём смогут читать посторонние.'
printf '%s\n' 'Скрин GLM с видимой статистикой аккаунта также будет ПУБЛИЧНЫМ.'
printf '%s\n' 'В Pages-артефакт войдут только HTML, JS, CSS, .nojekyll и скрин GLM.'
printf '%s' 'Для подтверждения введи PUBLISH WALL-E: '
read -r confirmation
[[ "$confirmation" == 'PUBLISH WALL-E' ]] || { printf 'Отменено.\n'; exit 1; }

if [[ ! -d .git ]]; then git init -b main; fi
git add -- index.html app.js world3d.js styles.css .nojekyll assets/glm-usage-2026-10-25.png README.md SOURCES.md ASSET_CREDITS.md capture-slides.sh deploy-pages.sh .github/workflows/pages.yml
if ! git diff --cached --quiet; then
  git commit -m 'Update WALL-E presentation and GitHub Pages deployment'
fi

if [[ "$repository_exists" == false ]]; then
  gh repo create "$TARGET" --public --source . --remote origin
elif [[ -z "$(git remote get-url origin 2>/dev/null || true)" ]]; then
  git remote add origin "https://github.com/$TARGET.git"
fi
git push -u origin main

# GitHub's official Pages API supports build_type=workflow.
if gh api "repos/$TARGET/pages" >/dev/null 2>&1; then
  gh api -X PUT "repos/$TARGET/pages" -f build_type=workflow >/dev/null
else
  gh api -X POST "repos/$TARGET/pages" -f build_type=workflow >/dev/null
fi

# Trigger after Pages has been enabled; later updates deploy on each push.
gh workflow run pages.yml --repo "$TARGET" --ref main
printf '\n%s\n' 'Запрошен автоматический deploy через GitHub Actions.'
printf 'Проверка сборки: https://github.com/%s/actions/workflows/pages.yml\n' "$TARGET"
printf '%s\n' 'Готовность и публичный URL проверь после успешного выполнения workflow.'
