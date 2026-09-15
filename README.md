# 독감 무료접종일 계산기 (2026-2027절기)

생년월일과 비고(임신부·의료취약계층·중고생) 체크로 독감 무료 예방접종 시작일을 알려주는 정적 페이지.
기준 자료: 의정부시 2026-2027절기 인플루엔자 예방접종 안내, 경기도교육청 2026년 중고등학생 인플루엔자 예방접종 지원사업.

## 폴더

| 경로 | 내용 |
|---|---|
| `docs/` | 사이트 본체 (GitHub Pages가 이 폴더를 서비스). `index.html`, `style.css`, `app.js`, 링크 카드 `og.png`, 위젯 배너 `banner.png` |
| `design/` | 이미지 원본 HTML과 `render.sh` (HTML → PNG) |
| `블로그/` | 네이버 블로그용: `네이버_원고.html`(복사해서 붙여넣기), `cta.png`(계산기 버튼 이미지), `schedule.png`(일정표), `위젯_코드.txt` |

## 이미지 다시 만들기

```bash
bash design/render.sh            # 전부
bash design/render.sh og banner  # 일부만
```

Chrome(없으면 Edge) 헤드리스로 캡처하고, 글꼴은 Google Fonts의 Noto Sans KR을 받아 쓴다.

## 다음 절기로 갱신할 때

1. `docs/app.js` 맨 위 `CFG`의 날짜·출생 기준을 새 공고로 바꾼다 (`prevSeasonEnd`는 지난 절기 종료일).
2. `docs/index.html`의 제목·설명·일정표, `design/*.html`의 날짜를 바꾼다.
3. `bash design/render.sh`로 이미지를 다시 만든다.
4. `블로그/네이버_원고.html`의 날짜를 바꿔 새 글을 쓴다.

## 배포

- GitHub Pages: main 브랜치 `/docs` 폴더
- 도메인: 가비아 DNS에 `CNAME flu → haneul2819.github.io.` 추가 → DNS가 풀린 뒤 `docs/CNAME`(내용 `flu.hnlab.kr`) 추가, Pages 설정에서 HTTPS 강제
