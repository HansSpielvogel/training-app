#!/usr/bin/env bash
# Automated architecture & convention checks for training-app.
# Run from the project root: bash .claude/skills/arch-review/scripts/check_arch.sh
# Output: one finding per line — [CRITICAL|WARN] <path>: <message>

OUT=$(mktemp)
trap 'rm -f "$OUT"' EXIT

# ── File size ────────────────────────────────────────────────────────────────
while IFS= read -r file; do
  lines=$(wc -l < "$file")
  if echo "$file" | grep -qE '\.tsx$'; then limit=200; else limit=100; fi
  if [ "$lines" -gt "$limit" ]; then
    echo "[CRITICAL] $file: $lines lines (limit: $limit)" >> "$OUT"
  fi
done < <(find src/presentation -name "*.ts" -o -name "*.tsx" | sort)

# ── Application use-case file sizes ──────────────────────────────────────────
while IFS= read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 40 ]; then
    echo "[WARN] $file: $lines lines (use-case limit: 40)" >> "$OUT"
  fi
done < <(find src/application -name "*.ts" ! -name "*.test.ts" ! -name "index.ts" | sort)

# ── Infrastructure repository file sizes ─────────────────────────────────────
while IFS= read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 80 ]; then
    echo "[WARN] $file: $lines lines (repository limit: 80)" >> "$OUT"
  fi
done < <(find src/infrastructure -name "*.ts" ! -name "*.test.ts" ! -name "index.ts" | sort)

# ── Missing barrel files ──────────────────────────────────────────────────────
for ctx in sessions exercises planning analytics; do
  for layer in domain application; do
    dir="src/$layer/$ctx"
    if [ -d "$dir" ] && [ ! -f "$dir/index.ts" ]; then
      echo "[WARN] $dir — missing index.ts barrel" >> "$OUT"
    fi
  done
done

# ── DDD import boundary violations ───────────────────────────────────────────

# presentation → domain (hooks are allowed as composition root)
grep -rn "from '@domain/" src/presentation/ --include="*.ts" --include="*.tsx" \
  | grep -v "/hooks\." \
  | sed "s|^|[CRITICAL] |; s|:| line |1; s|$| — presentation imports domain directly|" >> "$OUT"

# application → infrastructure (exclude test files — tests legitimately wire infra)
grep -rn "from '@infrastructure/" src/application/ --include="*.ts" \
  | grep -v "\.test\.ts:" \
  | sed "s|^|[CRITICAL] |; s|:| line |1; s|$| — application imports infrastructure|" >> "$OUT"

# domain → anything outside domain
grep -rn "from '@" src/domain/ --include="*.ts" \
  | grep -v "from '@domain/" \
  | sed "s|^|[CRITICAL] |; s|:| line |1; s|$| — domain imports outside layer|" >> "$OUT"

# cross-bounded-context at domain level (only ID-type references allowed)
for src_ctx in sessions planning analytics; do
  for tgt_ctx in sessions exercises planning analytics; do
    [ "$src_ctx" = "$tgt_ctx" ] && continue
    grep -rn "from '@domain/$tgt_ctx/" "src/domain/$src_ctx/" --include="*.ts" 2>/dev/null \
      | grep -v "Id['\"]" \
      | sed "s|^|[CRITICAL] |; s|:| line |1; s|$| — $src_ctx domain imports full type from $tgt_ctx (use ID only)|" >> "$OUT"
  done
done

# cross-bounded-context at application layer (all pairs)
for src_ctx in sessions exercises planning analytics; do
  for tgt_ctx in sessions exercises planning analytics; do
    [ "$src_ctx" = "$tgt_ctx" ] && continue
    grep -rn "from '@application/$tgt_ctx/" "src/application/$src_ctx/" --include="*.ts" 2>/dev/null \
      | grep -v "\.test\.ts:" \
      | sed "s|^|[WARN] |; s|:| line |1; s|$| — cross-context application import ($src_ctx→$tgt_ctx)|" >> "$OUT"
  done
done

# ── TypeScript conventions ────────────────────────────────────────────────────

# Inline object prop types in function signatures
grep -rn "}: {$" src/presentation/ --include="*.tsx" \
  | sed "s|^|[WARN] |; s|:| line |1; s|$| — inline prop type; extract as interface|" >> "$OUT"

# Non-null assertion (exclude test files)
grep -rn "!\." src/ --include="*.ts" --include="*.tsx" \
  | grep -v "\.test\." \
  | sed "s|^|[WARN] |; s|:| line |1; s|$| — non-null assertion (\.); narrow the type instead|" >> "$OUT"

# ── PWA / iOS safe area ───────────────────────────────────────────────────────
if ! grep -rq "safe-area-inset" src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null; then
  echo "[CRITICAL] PWA — no safe-area-inset found; bottom nav overlaps iPhone home indicator" >> "$OUT"
fi

if ! grep -q "viewport-fit=cover" index.html 2>/dev/null; then
  echo "[WARN] index.html — missing viewport-fit=cover; content won't reach screen edges" >> "$OUT"
fi

# ── Test coverage gaps ────────────────────────────────────────────────────────
find src/presentation -name "use*.ts" | while read -r hookfile; do
  testfile="${hookfile%.ts}.test.ts"
  [ ! -f "$testfile" ] && echo "[WARN] $hookfile — no test file" >> "$OUT"
done

# ── Output & summary ─────────────────────────────────────────────────────────
cat "$OUT"
CRITICALS=$(grep -c "^\[CRITICAL\]" "$OUT" || true)
echo ""
echo "── Done. Critical issues: $CRITICALS"
