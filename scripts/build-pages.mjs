// 대상별 안내 페이지(docs/<slug>/index.html) + sitemap.xml + robots.txt 생성
// 사용법: node scripts/build-pages.mjs   (절기가 바뀌면 이 파일의 날짜·문구를 고친 뒤 다시 실행)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
const SITE = 'https://flu.hnlab.kr';
const UPDATED = '2026-09-16';
const UPDATED_KO = '2026. 9. 16.';
const PDF = 'https://haneulfm.co.kr/downloads/flu-consent-secondary-student.pdf';
const NIP = '<a href="https://nip.kdca.go.kr" target="_blank" rel="noopener">예방접종도우미(nip.kdca.go.kr)</a>';
const DL = `<a class="dl-btn" href="${PDF}" target="_blank" rel="noopener">동의서·예진표 내려받기 (PDF)</a>`;

const pages = [
  {
    slug: 'elderly',
    crumb: '65세 이상 어르신',
    linkSub: '75세 10. 6. · 70~74세 10. 12. · 65~69세 10. 15.',
    title: '2026 어르신 독감 무료접종 일정 | 65세 이상 날짜·준비물',
    description: '2026-2027절기 65세 이상 어르신 독감 무료 예방접종 일정. 75세 이상 10월 6일, 70~74세 10월 12일, 65~69세 10월 15일부터. 요양병원·요양시설은 백신 보유 시 연령별 날짜와 관계없이, 65세 이상 면역저하자는 의사 판단에 따라 10월 6일부터 접종 가능.',
    keywords: ['65세 이상 독감 무료접종', '어르신 독감 무료접종 일정', '2026 어르신 독감', '75세 독감 무료접종', '70세 독감 무료접종', '65세 독감 무료접종 날짜', '노인 독감 예방접종', '독감 코로나 동시접종'],
    h1: '65세 이상 어르신 독감 무료접종 일정',
    lead: '2026-2027절기 어르신 독감 무료접종은 나이가 많은 분부터 차례로 시작해요. 태어난 해로 내 날짜를 확인하세요.',
    key: [['75세 이상', '1951. 12. 31. 이전 출생', '10. 6.(화)'], ['70~74세', '1952. 1. 1. ~ 1956. 12. 31.', '10. 12.(월)'], ['65~69세', '1957. 1. 1. ~ 1961. 12. 31.', '10. 15.(목)']],
    keyNote: '모두 2027. 4. 30.(금)까지 · 인플루엔자 3가 백신 무료',
    sections: [
      ['태어난 해별 독감 무료접종 시작일', `
        <ul>
          <li><strong>1951년생 이전</strong> (75세 이상) → 2026년 10월 6일(화)부터</li>
          <li><strong>1952년생 · 1953년생 · 1954년생 · 1955년생 · 1956년생</strong> (70~74세) → 10월 12일(월)부터</li>
          <li><strong>1957년생 · 1958년생 · 1959년생 · 1960년생 · 1961년생</strong> (65~69세) → 10월 15일(목)부터</li>
        </ul>
        <p>만 나이가 아니라 <strong>태어난 해 기준</strong>이에요. 1961년 12월 31일 이전에 태어났다면 올해 생일이 지나지 않았어도 무료접종 대상이에요.</p>`],
      ['요양병원·요양시설·면역저하자 예외', `
        <ul>
          <li><strong>요양병원·요양시설 입원·입소자</strong>: 연령별 시작일과 관계없이 시설에 백신이 있으면 접종할 수 있어요.</li>
          <li><strong>65세 이상 면역저하자</strong>: 의사 판단에 따라 증빙서류 없이 2026년 10월 6일(화)부터 접종할 수 있어요.</li>
        </ul>`],
      ['준비물과 접종 장소', `
        <ul>
          <li>준비물: <strong>신분증</strong></li>
          <li>접종 기관: 전국 지정위탁의료기관. 가까운 곳은 ${NIP}에서 찾을 수 있어요.</li>
          <li>방문 전에 의료기관에 전화로 접종 가능 여부를 먼저 확인하세요.</li>
        </ul>`],
      ['코로나19 예방접종과 함께 맞으세요', `
        <p>어르신은 독감 백신과 코로나19 백신을 함께 맞는 것을 권고해요. 같은 날 두 가지를 맞을 수 있는지는 방문할 의료기관에 확인하세요.</p>`]
    ],
    faq: [
      ['1961년생인데 생일이 안 지났어요. 무료접종 대상인가요?', '네. 1961년 12월 31일 이전에 태어났다면 생일과 관계없이 대상이에요. 1957~1961년생은 2026년 10월 15일(목)부터 맞을 수 있어요.'],
      ['75세 이상 독감 무료접종은 언제부터인가요?', '1951년 12월 31일 이전에 태어난 75세 이상 어르신은 2026년 10월 6일(화)부터 2027년 4월 30일(금)까지 무료로 맞을 수 있어요.'],
      ['70세 독감 무료접종 날짜는 언제인가요?', '1952~1956년생(70~74세)은 2026년 10월 12일(월)부터예요.'],
      ['요양병원·요양시설은 연령별 시작일을 기다려야 하나요?', '아니요. 65세 이상 입원·입소자는 시설에 백신이 있으면 연령별 시작일과 관계없이 접종할 수 있어요.'],
      ['65세 이상 면역저하자는 증빙서류가 필요한가요?', '아니요. 의사가 접종이 필요하다고 판단하면 증빙서류 없이 2026년 10월 6일(화)부터 접종할 수 있어요.'],
      ['어르신 독감 예방접종 준비물은 무엇인가요?', '신분증만 챙기면 돼요. 전국 지정위탁의료기관에서 인플루엔자 3가 백신을 무료로 맞을 수 있어요.']
    ]
  },
  {
    slug: 'children',
    crumb: '어린이',
    linkSub: '1·2회 접종 모두 9. 21.',
    title: '2026 어린이 독감 무료접종 일정 | 1·2회 모두 9월 21일',
    description: '2026-2027절기 어린이 독감 무료 예방접종(생후 6개월~14세, 2012.1.1.~2026.8.31. 출생). 2회 접종 대상과 1회 접종 대상 모두 9월 21일부터. 2027년 4월 30일까지 전국 지정 의료기관.',
    keywords: ['어린이 독감 무료접종', '어린이 독감 예방접종 일정', '어린이 독감 2회 접종', '2026 어린이 독감', '소아 독감 무료접종', '영유아 독감 접종 시기', '초등학생 독감 무료접종', '중학생 독감 무료접종'],
    h1: '어린이 독감 무료접종 일정',
    lead: '생후 6개월부터 14세(2012. 1. 1. ~ 2026. 8. 31. 출생)까지 무료예요. 접종 이력에 따라 시작일과 횟수가 달라요.',
    key: [['2회 접종 대상', '만 9세 미만 · 처음이거나 1회만 접종', '9. 21.(월)'], ['1회 접종 대상', '2회 이상 접종했거나 만 9세 이상', '9. 21.(월)']],
    keyNote: '2027. 4. 30.(금)까지 · 전국 지정위탁의료기관 · 인플루엔자 3가 백신',
    sections: [
      ['1회 접종일까, 2회 접종일까?', `
        <ul>
          <li><strong>2회 접종</strong>: 만 9세 미만이면서 독감 백신을 처음 맞거나 지금까지 1회만 맞은 아이 → 2026년 9월 21일(월)부터, <strong>4주 간격으로 두 번</strong></li>
          <li><strong>1회 접종</strong>: 지금까지 2회 이상 맞았거나 만 9세 이상인 아이 → 9월 21일(월)부터</li>
        </ul>
        <p>2회 접종이라면 2차까지 지원 기간(2027년 4월 30일) 안에 맞아야 하니, 1차는 늦어도 <strong>2027년 4월 2일</strong>까지 맞는 게 좋아요. 아이 접종 기록은 ${NIP}에서 확인할 수 있어요.</p>`],
      ['아기는 생후 6개월부터', `
        <p>독감 백신은 <strong>생후 6개월이 되는 날</strong>부터 맞을 수 있어요. 예를 들어 2026년 3월 15일에 태어난 아기는 9월 15일에 생후 6개월이 되어 9월 21일부터 맞을 수 있고, 처음 맞는 것이라 2회 접종이에요.</p>
        <p>이번 절기 어린이 무료접종은 <strong>2026년 8월 31일 이전 출생아</strong>까지예요.</p>`],
      ['초등학생·중학생도 대상이에요', `
        <p>2012년 1월 1일 이후에 태어났다면 초등학생이든 중학생이든 어린이 국가예방접종으로 무료예요. 2026년 기준 <strong>중학교 1·2학년(2012~2013년생)</strong>은 경기도교육청 중·고등학생 사업이 아니라 이 일정으로 맞아요.</p>`],
      ['동의서·예진표', `
        <p>보호자가 예진표를 미리 작성해 가면 병원에서 기다리는 시간을 줄일 수 있어요.</p>${DL}`]
    ],
    faq: [
      ['아이가 작년에 독감 백신을 한 번만 맞았어요.', '만 9세 미만이고 지금까지 1회만 맞았다면 올해는 4주 간격으로 2회 맞아요. 2026년 9월 21일(월)부터 시작할 수 있어요.'],
      ['어린이 독감 무료접종 대상 나이는요?', '생후 6개월~14세, 2012년 1월 1일부터 2026년 8월 31일 사이에 태어난 어린이예요.'],
      ['2회 접종 간격은 얼마인가요?', '1차와 2차는 4주 간격으로 맞아요. 지원 기간 안에 끝내려면 1차를 2027년 4월 2일까지 맞으세요.'],
      ['중학생도 어린이 무료접종인가요?', '2012년 이후에 태어난 중학생(2026년 기준 중1·중2)은 어린이 국가예방접종 대상이라 9월 21일부터 1회 맞아요.']
    ]
  },
  {
    slug: 'pregnant',
    crumb: '임신부',
    linkSub: '9. 21.부터 · 임신 주수 무관',
    title: '2026 임신부 독감 무료접종 | 9월 21일부터 · 임신 주수 무관',
    description: '2026-2027절기 임신부 독감 무료 예방접종은 2026년 9월 21일(월)부터 2027년 4월 30일(금)까지. 임신 주수와 관계없이 전국 지정 의료기관에서 신분증과 임신확인서(산모수첩)를 가져가면 무료예요.',
    keywords: ['임신부 독감 무료접종', '임산부 독감 예방접종', '임신 중 독감 접종', '2026 임신부 독감', '임산부 독감 무료', '임신부 독감 준비물', '임신 초기 독감 접종'],
    h1: '임신부 독감 무료접종',
    lead: '임신 중이라면 임신 주수와 관계없이 2026년 9월 21일(월)부터 무료로 맞을 수 있어요.',
    key: [['임신부', '임신 주수와 관계없이', '9. 21.(월)']],
    keyNote: '2027. 4. 30.(금)까지 · 전국 지정위탁의료기관 · 인플루엔자 3가 백신',
    sections: [
      ['준비물', `
        <ul>
          <li><strong>신분증</strong></li>
          <li><strong>임신을 확인할 수 있는 서류</strong>: 임신확인서, 산모수첩 등</li>
        </ul>`],
      ['접종 장소', `
        <p>전국 지정위탁의료기관에서 맞을 수 있어요. 다니는 병원이 지정 의료기관인지 전화로 확인해 보세요. 가까운 기관은 ${NIP}에서 찾을 수 있어요.</p>`],
      ['접종 전에', `
        <p>임신 주수와 관계없이 접종할 수 있지만, 몸 상태가 걱정된다면 예진 때 의사와 상담하세요.</p>`],
      ['함께 사는 가족은?', `
        <p>가족은 나이와 조건에 따라 무료 대상이 달라요. 아이는 <a href="../children/">어린이 무료접종</a>, 65세 이상 부모님은 <a href="../elderly/">어르신 무료접종</a> 대상이에요. <a href="../">계산기</a>에 가족 생년월일을 넣어 보세요.</p>`]
    ],
    faq: [
      ['임신부 독감 무료접종은 언제부터인가요?', '2026년 9월 21일(월)부터 2027년 4월 30일(금)까지 맞을 수 있어요.'],
      ['임신 초기에도 무료로 맞을 수 있나요?', '임신 주수와 관계없이 무료접종 대상이에요. 몸 상태는 예진 때 의사와 상담하세요.'],
      ['임신부 독감 접종 준비물은 무엇인가요?', '신분증과 임신을 확인할 수 있는 서류(임신확인서, 산모수첩 등)를 챙기세요.']
    ]
  },
  {
    slug: 'student',
    crumb: '경기도 중·고등학생',
    linkSub: '10. 5. ~ 11. 21. · 동의서 내려받기',
    title: '경기도 중고등학생 독감 무료접종 2026 | 10.5~11.21·동의서',
    description: '경기도교육청 2026년 중고등학생 인플루엔자 무료 예방접종. 경기도 소재 중3~고3 또는 2008~2011년생 중·고등학생, 2026년 10월 5일(월)~11월 21일(토). 지정 의료기관에서만 가능하고 보건소는 안 돼요. 보호자 동의서·개인정보 동의서 내려받기.',
    keywords: ['중고등학생 독감 무료접종', '고등학생 독감 무료접종', '중학생 독감 무료접종', '경기도 중고생 독감', '경기도교육청 독감 예방접종', '고3 독감 무료', '청소년 독감 무료접종', '독감 보호자 동의서'],
    h1: '경기도 중·고등학생 독감 무료접종',
    lead: '경기도교육청이 지원하는 사업이에요. 2026년 10월 5일(월)부터 11월 21일(토)까지, 이 기간 안에 맞은 접종만 지원돼요.',
    key: [['시작일', '', '10. 5.(월)'], ['마감일', '기간 안에 맞은 접종만 지원', '11. 21.(토)']],
    keyNote: '경기도 소재 중·고등학교 재학생 · 보건소 접종 불가 · 인플루엔자 3가 백신',
    sections: [
      ['지원 대상', `
        <ul>
          <li>경기도 소재 <strong>중3~고3</strong> 재학 중인 학생 중 희망자</li>
          <li>경기도 소재 중·고등학생 중 <strong>2008. 1. 1. ~ 2011. 12. 31. 출생자</strong> 중 희망자</li>
          <li>특수학교 학생 포함</li>
        </ul>
        <p><strong>제외</strong>: 어린이 국가예방접종 대상(2012. 1. 1. ~ 2026. 8. 31. 출생), 학교 밖 청소년, 자퇴한 학생. 2012년 이후 출생한 중학생은 <a href="../children/">어린이 무료접종</a>으로 맞아요.</p>`],
      ['접종 방법', `
        <ul>
          <li>보호자와 함께 <strong>지정 의료기관</strong>을 방문해 접종해요. 지정 의료기관 목록은 학교 안내문 [붙임1]에서 확인하세요.</li>
          <li>보호자가 함께 가지 못하면 보호자가 <strong>직접 쓴 동의서</strong>를 학생이 의료기관에 내야 해요.</li>
          <li><strong>보건소에서는 맞을 수 없어요.</strong></li>
        </ul>`],
      ['의료기관에서 확인·제출하는 서류', `
        <ol>
          <li><strong>재학 증명</strong>: 학생증, 재학증명서, 나이스플러스 앱 재학생 인증 중 하나</li>
          <li><strong>개인정보 수집·이용·제3자 제공 동의서</strong> (필수)</li>
          <li><strong>보호자 동의서</strong> (보호자가 함께 가지 않을 때만)</li>
        </ol>${DL}`]
    ],
    faq: [
      ['중학교 1학년도 경기도교육청 독감 무료접종 대상인가요?', '2026년 기준 중1·중2(2012~2013년생)는 어린이 국가예방접종 대상이라 이 사업에서 제외돼요. 대신 9월 21일부터 어린이 무료접종으로 맞을 수 있어요.'],
      ['보호자 없이 혼자 가도 되나요?', '보호자가 직접 작성한 동의서를 가져가면 돼요. 개인정보 수집·이용·제3자 제공 동의서는 보호자 동반 여부와 관계없이 꼭 내야 해요.'],
      ['11월 21일이 지나면 무료로 못 맞나요?', '이 사업은 2026년 10월 5일부터 11월 21일 사이에 맞은 접종만 지원돼요.'],
      ['보건소에서 맞을 수 있나요?', '아니요. 경기도교육청 지정 의료기관에서만 맞을 수 있어요.']
    ]
  },
  {
    slug: 'uijeongbu',
    crumb: '의정부',
    linkSub: '의료취약계층 10. 22. · 전체 일정',
    title: '의정부 독감 예방접종 2026 | 무료 대상·일정·의료취약계층',
    description: '의정부시 2026-2027절기 인플루엔자(독감) 무료 예방접종 안내. 어린이·임신부 9월 21일, 어르신 10월 6일부터 연령별, 의정부시민 의료취약계층(15~64세 기초생활수급자·장애인·국가보훈대상자) 10월 22일부터 2027년 4월 30일까지.',
    keywords: ['의정부 독감 예방접종', '의정부 독감 무료접종', '의정부시 인플루엔자 예방접종', '의정부 보건소 독감', '의정부 의료취약계층 독감', '의정부 기초생활수급자 독감', '의정부 장애인 독감 무료', '의정부 국가보훈대상자 독감'],
    h1: '의정부 독감 무료 예방접종 안내',
    lead: '의정부시 2026-2027절기 인플루엔자 예방접종 실시 안내를 대상별로 정리했어요. 지원 기간은 2026년 9월 21일(월)부터 2027년 4월 30일(금)까지예요.',
    key: [['어린이 1·2회 · 임신부', '', '9. 21.(월)'], ['75세 이상', '', '10. 6.(화)'], ['70~74세', '', '10. 12.(월)'], ['65~69세', '', '10. 15.(목)'], ['요양병원·요양시설', '65세 이상 입원·입소자', '백신 보유 시'], ['65세 이상 면역저하자', '의사 판단 시·증빙서류 불필요', '10. 6.(화)'], ['의료취약계층', '의정부시민 15~64세', '10. 22.(목)']],
    keyNote: '모두 2027. 4. 30.(금)까지 · 인플루엔자 3가 백신 무료',
    sections: [
      ['의정부시 의료취약계층 무료접종', `
        <p>의정부시에 사는 <strong>15~64세(1962. 1. 1. ~ 2011. 12. 31. 출생)</strong> 중 아래에 해당하면 <strong>2026년 10월 22일(목)</strong>부터 무료로 맞을 수 있어요.</p>
        <ul>
          <li>기초생활수급자(생계·의료급여)</li>
          <li>장애인</li>
          <li>국가보훈대상자(본인 및 선순위유족)</li>
        </ul>
        <p>준비물은 신분증과 기초생활수급자 증명서, 장애인증, 국가보훈등록증 중 해당 서류예요. 접종은 <strong>의정부시 관내 지정위탁의료기관</strong>에서만 돼요.</p>`],
      ['대상별 준비물과 접종 기관', `
        <ul>
          <li><strong>어린이</strong> (2012. 1. 1. ~ 2026. 8. 31. 출생): 전국 지정위탁의료기관</li>
          <li><strong>임신부</strong>: 신분증, 임신확인서·산모수첩 등 · 전국 지정위탁의료기관</li>
          <li><strong>어르신</strong> (1961. 12. 31. 이전 출생): 신분증 · 전국 지정위탁의료기관 · 코로나19와 동시 접종 권고. 요양병원·요양시설 입원·입소자는 백신 보유 시 연령별 날짜와 관계없이, 65세 이상 면역저하자는 의사 판단에 따라 증빙서류 없이 10월 6일부터 접종</li>
          <li><strong>의료취약계층</strong>: 신분증과 해당 증빙서류 · 의정부시 관내 지정위탁의료기관</li>
        </ul>
        <p>자세한 일정은 <a href="../children/">어린이</a>, <a href="../pregnant/">임신부</a>, <a href="../elderly/">어르신</a> 안내에서 볼 수 있어요.</p>`],
      ['의정부 중·고등학생', `
        <p>의정부의 중·고등학생은 경기도교육청 지원으로 <strong>2026년 10월 5일(월)~11월 21일(토)</strong> 지정 의료기관에서 무료로 맞을 수 있어요. <a href="../student/">중·고등학생 안내 보기</a></p>`],
      ['접종 장소 찾기', `
        <p>접종 기관은 대상마다 달라요. ${NIP}에서 가까운 지정 의료기관을 찾고, 방문 전에 전화로 상담한 뒤 신분증과 증빙서류를 챙겨 가세요.</p>`]
    ],
    faq: [
      ['의정부 의료취약계층 독감 무료접종 대상은 누구인가요?', '의정부시에 사는 15~64세 중 기초생활수급자(생계·의료급여), 장애인, 국가보훈대상자(본인 및 선순위유족)예요. 2026년 10월 22일(목)부터 맞을 수 있어요.'],
      ['의료취약계층은 다른 지역 병원에서도 맞을 수 있나요?', '아니요. 의료취약계층 무료접종은 의정부시 관내 지정위탁의료기관에서만 돼요. 어린이·임신부·어르신은 전국 지정위탁의료기관에서 맞을 수 있어요.'],
      ['의정부 독감 예방접종 기간은 언제인가요?', '2026년 9월 21일(월)부터 2027년 4월 30일(금)까지예요. 대상별로 시작일이 달라요.']
    ]
  }
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FAVICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='88'>💉</text></svg>";

function jsonLd(p, url) {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', headline: p.h1, description: p.description, inLanguage: 'ko',
        datePublished: UPDATED, dateModified: UPDATED, mainEntityOfPage: url, image: `${SITE}/og.png`,
        author: { '@type': 'Organization', name: 'hnlab', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'hnlab', url: `${SITE}/` }
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: '독감 예방접종 일정 계산기', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: p.crumb, item: url }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
      }
    ]
  };
  return JSON.stringify(ld).replace(/</g, '\\u003c');
}

function page(p) {
  const url = `${SITE}/${p.slug}/`;
  const others = pages.filter((o) => o.slug !== p.slug)
    .map((o) => `      <li><a href="../${o.slug}/"><strong>${o.crumb}</strong><span>${o.linkSub}</span></a></li>`).join('\n');
  const key = p.key.map(([t, s, d]) => `      <dt>${t}${s ? `<small>${s}</small>` : ''}</dt><dd>${d}</dd>`).join('\n');
  const sections = p.sections.map(([h, html]) => `  <section class="card guide-body">
    <h2>${h}</h2>${html}
  </section>`).join('\n\n');
  const faq = p.faq.map(([q, a]) => `    <details>
      <summary>${q}</summary>
      <p>${a}</p>
    </details>`).join('\n');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="keywords" content="${esc(p.keywords.join(', '))}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="hnlab">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta property="article:modified_time" content="${UPDATED}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0f766e">
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="../style.css">
<script type="application/ld+json">${jsonLd(p, url)}</script>
</head>
<body>
<header class="top">
  <p class="crumb"><a href="../">독감 예방접종 일정 계산기</a> › ${p.crumb}</p>
  <h1>${p.h1}</h1>
  <p class="lead">${p.lead}</p>
</header>

<main>
  <section class="keybox" aria-label="2026-2027절기 무료접종 시작일">
    <h2>2026-2027절기 무료접종 시작일</h2>
    <dl>
${key}
    </dl>
    <p>${p.keyNote}</p>
  </section>

  <section class="card cta-box">
    <p>생년월일만 넣으면 내 접종 가능일과 준비물을 바로 알려드려요.</p>
    <a class="go" href="../">내 독감 접종일 계산하기</a>
  </section>

${sections}

  <section class="card faq">
    <h2>자주 묻는 질문</h2>
${faq}
  </section>

  <nav class="card" aria-label="다른 대상 독감 일정">
    <h2>다른 대상 독감 일정</h2>
    <ul class="guide-links">
      <li><a href="../"><strong>독감 예방접종 일정 계산기</strong><span>생년월일로 내 접종일 확인</span></a></li>
${others}
    </ul>
  </nav>
</main>

<footer class="foot">
  <p>출처: 의정부시 「2026-2027절기 인플루엔자(독감) 예방접종 실시 안내」, 경기도교육청 「2026년 중고등학생 인플루엔자 예방접종 지원사업 안내」</p>
  <p>마지막 업데이트 ${UPDATED_KO} · 참고용 안내예요. 정확한 대상과 일정은 예방접종도우미 또는 보건소에 확인하세요.</p>
</footer>
</body>
</html>
`;
}

for (const p of pages) {
  const dir = join(DOCS, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p));
  console.log(`docs/${p.slug}/index.html`);
}

const urls = [{ loc: `${SITE}/`, priority: '1.0' }, ...pages.map((p) => ({ loc: `${SITE}/${p.slug}/`, priority: '0.8' }))];
writeFileSync(join(DOCS, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${UPDATED}</lastmod><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DOCS, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log('docs/sitemap.xml, docs/robots.txt');
