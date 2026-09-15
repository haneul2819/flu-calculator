# 독감 무료접종일 계산기 (2026-2027절기)

생년월일과 비고(임신부·의료취약계층·중고생) 체크로 독감 무료 예방접종 시작일을 알려주는 정적 페이지.
기준 자료: 의정부시 2026-2027절기 인플루엔자 예방접종 안내, 경기도교육청 2026년 중고등학생 인플루엔자 예방접종 지원사업.

## 폴더

| 경로 | 내용 |
|---|---|
| `docs/` | 사이트 본체 (GitHub Pages가 이 폴더를 서비스). `index.html`, `style.css`, `app.js`, 링크 카드 `og.png`, 위젯 배너 `banner.png` |
| `design/` | 이미지 원본 HTML과 `render.sh` (HTML → PNG) |
| `블로그/` | 네이버 블로그용: `네이버_원고.html`(복사해서 붙여넣기), `cta.png`(계산기 버튼 이미지), `schedule.png`(일정표), `위젯_코드.txt` |

## 결과 공유·동의서

- 결과 화면의 [결과를 카톡으로 공유하기] → 결과만 캔버스로 그린 PNG(생년월일 없음)를 미리 보여 주고 보냄
  - `CFG.kakaoKey`(카카오 개발자 앱 JavaScript 키)가 있으면 카카오톡 공유 메시지(이미지 + '내 접종일 계산하기' 버튼)
  - 없으면 휴대폰 공유 창(Web Share) → 카카오톡 선택, 그것도 안 되면 PC는 이미지 복사, 폰은 길게 눌러 저장 안내
- 만 18세 이하 무료접종 대상(또는 경기도 중고생 사업 대상)이면 `CFG.consentPdf` 동의서·예진표 내려받기 버튼

## 검색 노출 (SEO)

- 대상별 안내 페이지 5개: `/elderly/` `/children/` `/pregnant/` `/student/` `/uijeongbu/` → `node scripts/build-pages.mjs` 로 생성 (sitemap.xml, robots.txt 포함). docs/ 안의 이 파일들은 직접 고치지 말고 스크립트를 고친다
- 메인 `docs/index.html`: 네이버 소유확인 meta, 제목·설명·키워드, FAQ(화면 + JSON-LD)
- 네이버 서치어드바이저: https://flu.hnlab.kr 소유확인(HTML 태그) → 사이트맵 `https://flu.hnlab.kr/sitemap.xml` 제출 → 웹 페이지 수집 요청
- 구글 서치 콘솔 인증 파일 `docs/google5c39d22cd6990b0e.html` (다른 hnlab 사이트와 같은 토큰)

## 이미지 다시 만들기

```bash
bash design/render.sh            # 전부
bash design/render.sh og banner  # 일부만
```

Chrome(없으면 Edge) 헤드리스로 캡처하고, 글꼴은 Google Fonts의 Noto Sans KR을 받아 쓴다.

## 다음 절기로 갱신할 때

1. `docs/app.js` 맨 위 `CFG`의 날짜·출생 기준을 새 공고로 바꾼다 (`prevSeasonEnd`는 지난 절기 종료일).
2. `docs/index.html`의 제목·설명·일정표·FAQ, `scripts/build-pages.mjs`(안내 페이지 문구·UPDATED), `design/*.html`의 날짜를 바꾸고 `node scripts/build-pages.mjs` 실행.
3. `bash design/render.sh`로 이미지를 다시 만든다.
4. `블로그/네이버_원고.html`의 날짜를 바꿔 새 글을 쓴다.

## 배포

- GitHub Pages: main 브랜치 `/docs` 폴더
- 도메인: 가비아 DNS에 `CNAME flu → haneul2819.github.io.` 추가 → DNS가 풀린 뒤 `docs/CNAME`(내용 `flu.hnlab.kr`) 추가, Pages 설정에서 HTTPS 강제
