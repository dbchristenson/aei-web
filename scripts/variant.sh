#!/usr/bin/env bash
# variant.sh — manage AI design-variant worktrees for the AEI site.
#
#   variant.sh new <name> ["inline flavor prompt"]   create + provision a variant worktree
#   variant.sh mix <name> <srcA> <srcB> [...]        create a mix variant sourcing other variants
#   variant.sh dev <name>                            run the variant's dev server on its port
#   variant.sh list                                  show variant | branch | port | URL | status
#   variant.sh remove <name> [...] [--force]         remove worktree(s), branch(es), port row(s)
#
# Works from the main checkout or from inside any worktree. Master's own dev
# server keeps port 3000; variants get 3001+ recorded in .claude/worktrees/.ports.
set -euo pipefail

# Resolve the MAIN checkout even when invoked from inside a worktree.
GIT_COMMON_DIR="$(git rev-parse --path-format=absolute --git-common-dir)"
REPO="$(dirname "$GIT_COMMON_DIR")"
WT_DIR="$REPO/.claude/worktrees"
PORTS="$WT_DIR/.ports"

err()  { printf 'error: %s\n' "$*" >&2; exit 1; }
warn() { printf 'warn: %s\n' "$*" >&2; }

port_for() { [[ -f "$PORTS" ]] && awk -v n="$1" '$1==n{print $2}' "$PORTS" || true; }

next_port() {
  local max=3000 _n p
  if [[ -f "$PORTS" ]]; then
    while read -r _n p; do
      [[ "$p" =~ ^[0-9]+$ ]] && (( p > max )) && max=$p
    done < "$PORTS"
  fi
  echo $((max + 1))
}

worktree_registered() {
  git -C "$REPO" worktree list --porcelain | grep -Fxq "worktree $1"
}

cmd_new() {
  local name="${1:-}"; [[ -n "$name" ]] || err "usage: variant.sh new <name> [\"flavor prompt\"]"
  [[ "$name" =~ ^[a-z0-9][a-z0-9-]*$ ]] || err "name must be kebab-case (got '$name')"
  local prompt="${2:-}"
  local wt="$WT_DIR/$name" branch="worktree-$name"
  mkdir -p "$WT_DIR"

  if worktree_registered "$wt"; then
    echo "Worktree $wt already registered — provisioning only."
  elif [[ -e "$wt" ]]; then
    err "$wt exists but is not a registered worktree; move it aside first"
  else
    git -C "$REPO" worktree add "$wt" -b "$branch" master
  fi

  # Untracked essentials that worktrees don't inherit.
  local f
  for f in .claude/settings.local.json frontend/.env.local; do
    if [[ -f "$REPO/$f" ]]; then
      mkdir -p "$wt/$(dirname "$f")"
      cp "$REPO/$f" "$wt/$f"
    else
      warn "$REPO/$f not found — skipping copy"
    fi
  done

  # Dependencies: APFS copy-on-write clone of node_modules, npm ci fallback.
  if [[ ! -d "$wt/frontend/node_modules" ]]; then
    if [[ -d "$REPO/frontend/node_modules" ]] && cp -Rc "$REPO/frontend/node_modules" "$wt/frontend/node_modules" 2>/dev/null; then
      echo "Cloned node_modules from main checkout (APFS clone)."
    else
      rm -rf "$wt/frontend/node_modules"
      echo "Clone unavailable — running npm ci (this takes a while)..."
      (cd "$wt/frontend" && npm ci)
    fi
  fi

  # Port assignment (idempotent).
  local port; port="$(port_for "$name")"
  if [[ -z "$port" ]]; then
    port="$(next_port)"
    echo "$name $port" >> "$PORTS"
  fi

  # Flavor stub from inline prompt, only if no flavor file exists yet.
  local vf="$wt/docs/design-briefs/variants/$name.md"
  if [[ -n "$prompt" && ! -f "$vf" ]]; then
    mkdir -p "$(dirname "$vf")"
    printf '# %s\n\n## Direction\n%s\n' "$name" "$prompt" > "$vf"
    echo "Wrote flavor stub: docs/design-briefs/variants/$name.md"
  fi

  cat <<EOF

Variant '$name' ready.
  worktree : $wt
  branch   : $branch
  port     : $port
  preview  : scripts/variant.sh dev $name   ->  http://localhost:$port
  session  : cd $wt && claude
             then run: /design-variant
EOF
}

cmd_mix() {
  local name="${1:-}"; shift || true
  [[ -n "$name" && $# -ge 2 ]] || err "usage: variant.sh mix <name> <srcA> <srcB> [...]"
  local sources=("$@") src
  for src in "${sources[@]}"; do
    git -C "$REPO" show-ref --verify --quiet "refs/heads/worktree-$src" \
      || err "source variant '$src' has no branch worktree-$src"
  done

  cmd_new "$name"

  local vf="$WT_DIR/$name/docs/design-briefs/variants/$name.md"
  if [[ ! -f "$vf" ]]; then
    mkdir -p "$(dirname "$vf")"
    {
      printf '# %s\n\n## Direction\nCombine the strongest ideas of the source variants below into one cohesive design.\n\n## Sources to mix\n' "$name"
      for src in "${sources[@]}"; do
        printf -- '- worktree-%s: <what to take from it>\n' "$src"
      done
      printf '\nFollow the mixing recipe in docs/design-briefs/BASE.md.\n'
    } > "$vf"
    echo "Wrote mix brief: docs/design-briefs/variants/$name.md (fill in what to take from each source)"
  fi
}

cmd_dev() {
  local name="${1:-}"; [[ -n "$name" ]] || err "usage: variant.sh dev <name>"
  local wt="$WT_DIR/$name"
  [[ -d "$wt/frontend" ]] || err "no worktree at $wt (create with: variant.sh new $name)"
  local port; port="$(port_for "$name")"
  [[ -n "$port" ]] || err "no port registered for '$name' in $PORTS (re-run: variant.sh new $name)"
  echo "Serving '$name' at http://localhost:$port (if the port is busy, Next picks the next one — trust its printed URL)"
  cd "$wt/frontend" && exec npm run dev -- -p "$port"
}

cmd_list() {
  [[ -f "$PORTS" ]] || { echo "No variants registered."; return 0; }
  printf '%-20s %-30s %-6s %-24s %-6s %s\n' VARIANT BRANCH PORT URL DIRTY "LAST COMMIT"
  local name port wt branch dirty subject
  while read -r name port; do
    [[ -n "$name" ]] || continue
    wt="$WT_DIR/$name"
    if [[ ! -d "$wt" ]]; then
      printf '%-20s %-30s %-6s %-24s %-6s %s\n' "$name" "-" "$port" "-" "-" "(worktree missing — stale row, clean with: variant.sh remove $name)"
      continue
    fi
    branch="$(git -C "$wt" branch --show-current 2>/dev/null || echo '?')"
    subject="$(git -C "$wt" log -1 --format=%s 2>/dev/null || echo '?')"
    if [[ -n "$(git -C "$wt" status --porcelain 2>/dev/null)" ]]; then dirty=yes; else dirty=no; fi
    printf '%-20s %-30s %-6s %-24s %-6s %s\n' "$name" "$branch" "$port" "http://localhost:$port" "$dirty" "$subject"
  done < "$PORTS"
}

cmd_remove() {
  local force=0 names=() arg
  for arg in "$@"; do
    case "$arg" in
      --force|-f) force=1 ;;
      *) names+=("$arg") ;;
    esac
  done
  [[ ${#names[@]} -ge 1 ]] || err "usage: variant.sh remove <name> [...] [--force]"

  local name wt branch
  for name in "${names[@]}"; do
    wt="$WT_DIR/$name" branch="worktree-$name"

    if git -C "$REPO" show-ref --verify --quiet "refs/heads/$branch" \
       && ! git -C "$REPO" merge-base --is-ancestor "$branch" master; then
      if [[ "$force" -ne 1 ]]; then
        printf "Branch %s is NOT merged into master — its design will be lost.\n" "$branch"
        read -r -p "Remove '$name' anyway? [y/N] " reply
        [[ "$reply" =~ ^[Yy]$ ]] || { echo "Skipping '$name'."; continue; }
      fi
    fi

    if worktree_registered "$wt"; then
      git -C "$REPO" worktree remove --force "$wt"
      echo "Removed worktree $wt"
    elif [[ -d "$wt" ]]; then
      warn "$wt exists but is not git-registered — leaving directory in place"
    fi

    if git -C "$REPO" show-ref --verify --quiet "refs/heads/$branch"; then
      git -C "$REPO" branch -D "$branch"
    fi

    if [[ -f "$PORTS" ]] && grep -q "^$name " "$PORTS"; then
      awk -v n="$name" '$1 != n' "$PORTS" > "$PORTS.tmp" && mv "$PORTS.tmp" "$PORTS"
      echo "Dropped port row for '$name'"
    fi
  done
}

cmd="${1:-}"; shift || true
case "$cmd" in
  new)    cmd_new "$@" ;;
  mix)    cmd_mix "$@" ;;
  dev)    cmd_dev "$@" ;;
  list)   cmd_list "$@" ;;
  remove) cmd_remove "$@" ;;
  *)      sed -n '2,10p' "$0"; exit 1 ;;
esac
