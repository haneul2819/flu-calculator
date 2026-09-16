#!/usr/bin/env bash
# 디자인 HTML → PNG. 사용법: bash design/render.sh [이름...]  (이름 생략 시 전부)
# 결과: og.png, banner.png → docs/ (사이트에 올라감) · cta.png, schedule.png → 블로그/ (블로그에 직접 업로드)
set -e
cd "$(dirname "$0")"
ROOT="$(cd .. && pwd -W)"   # Git Bash: C:/Users/... 형태
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CH" ] || CH="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"

# 이름 폭 높이 배율 출력폴더
JOBS="og 1200 630 1 docs
banner 170 220 2 docs
cta 900 280 2 블로그
schedule 900 1454 2 블로그"

want="$*"
echo "$JOBS" | while read -r name w h scale out; do
  if [ -n "$want" ] && ! echo " $want " | grep -q " $name "; then continue; fi
  "$CH" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="$w,$h" --force-device-scale-factor="$scale" \
    --virtual-time-budget=5000 \
    --screenshot="$ROOT/$out/$name.png" "file:///$ROOT/design/$name.html" 2>/dev/null
  echo "$out/$name.png"
done
