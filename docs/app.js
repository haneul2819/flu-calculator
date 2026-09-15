(function () {
  'use strict';

  // ── 절기 설정: 해마다 질병관리청·시 공고가 나오면 이 부분만 바꾸면 됩니다 ──
  var CFG = {
    season: '2026-2027절기',
    seasonStart: '2026-09-21',
    seasonEnd: '2027-04-30',
    prevSeasonEnd: '2026-04-30', // 이날까지 생후 6개월이 안 된 아기는 지난 절기에 맞았을 수 없으므로 '첫 접종'
    child: {
      bornFrom: '2012-01-01', bornTo: '2026-08-31',
      twoDoseStart: '2026-09-21', oneDoseStart: '2026-09-28',
      place: '전국 지정위탁의료기관'
    },
    pregnant: { start: '2026-09-21', place: '전국 지정위탁의료기관' },
    elderly: {
      bornTo: '1961-12-31',
      tiers: [
        { label: '75세 이상', bornFrom: null, bornTo: '1951-12-31', start: '2026-10-06', range: '1951. 12. 31. 이전 출생' },
        { label: '70~74세', bornFrom: '1952-01-01', bornTo: '1956-12-31', start: '2026-10-12', range: '1952. 1. 1. ~ 1956. 12. 31. 출생' },
        { label: '65~69세', bornFrom: '1957-01-01', bornTo: '1961-12-31', start: '2026-10-15', range: '1957. 1. 1. ~ 1961. 12. 31. 출생' }
      ],
      place: '전국 지정위탁의료기관'
    },
    vulnerable: {
      bornFrom: '1962-01-01', bornTo: '2011-12-31', start: '2026-10-22',
      place: '의정부시 관내 지정위탁의료기관'
    },
    student: { bornFrom: '2008-01-01', bornTo: '2011-12-31', start: '2026-10-05', end: '2026-11-21' }
  };

  // ── 날짜 도우미 (시간대 영향을 피하려고 모두 로컬 자정 기준) ──
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  function ymd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d) { return d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate() + '.(' + WD[d.getDay()] + ')'; }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function addMonths(d, n) {
    var y = d.getFullYear(), m = d.getMonth() + n;
    var last = new Date(y, m + 1, 0).getDate();
    return new Date(y, m, Math.min(d.getDate(), last));
  }
  function today0() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
  function inRange(d, from, to) { return (!from || d >= ymd(from)) && (!to || d <= ymd(to)); }
  function manAge(b, at) {
    var a = at.getFullYear() - b.getFullYear();
    if (at.getMonth() < b.getMonth() || (at.getMonth() === b.getMonth() && at.getDate() < b.getDate())) a--;
    return a;
  }
  function monthsOld(b, at) {
    var m = (at.getFullYear() - b.getFullYear()) * 12 + at.getMonth() - b.getMonth();
    if (at.getDate() < b.getDate()) m--;
    return m;
  }

  // ── 생년월일 읽기: 19550315 / 1955.3.15 / 1955-03-15 / 1955년3월15일 ──
  function parseBirth(raw) {
    var s = raw.replace(/\s+/g, '');
    if (!s) return { state: 'empty' };
    var m = s.match(/^(\d{4})(\d{2})(\d{2})$/) ||
            s.match(/^(\d{4})[.\-\/년](\d{1,2})[.\-\/월](\d{1,2})[.일]?$/);
    if (!m) {
      if (/^\d{6}$/.test(s)) return { state: 'error', msg: '태어난 해를 4자리로 넣어 주세요. 예) 19550315' };
      if (/[^\d.\-\/년월일]/.test(s)) return { state: 'error', msg: '숫자로 넣어 주세요. 예) 19550315' };
      return { state: 'typing' };
    }
    var y = +m[1], mo = +m[2], d = +m[3];
    var date = new Date(y, mo - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) {
      return { state: 'error', msg: '없는 날짜예요. 다시 확인해 주세요.' };
    }
    if (y < 1900) return { state: 'error', msg: '태어난 해를 다시 확인해 주세요.' };
    if (date > today0()) return { state: 'error', msg: '오늘 이후 날짜는 넣을 수 없어요.' };
    return { state: 'ok', date: date };
  }

  function firstTimeBaby(b) { return addMonths(b, 6) > ymd(CFG.prevSeasonEnd); }
  function needsHistory(b) {
    if (!inRange(b, CFG.child.bornFrom, CFG.child.bornTo) || firstTimeBaby(b)) return false;
    var ninth = new Date(b.getFullYear() + 9, b.getMonth(), b.getDate());
    return ninth > ymd(CFG.seasonStart);
  }

  // ── 대상 판정 ──
  function evaluate(b, o) {
    var S = ymd(CFG.seasonStart), E = ymd(CFG.seasonEnd);
    var c = CFG.child, v = CFG.vulnerable, st = CFG.student, el = CFG.elderly;
    var progs = [], notes = [], hints = [];
    var isChild = inRange(b, c.bornFrom, c.bornTo);
    var isElder = b <= ymd(el.bornTo);
    var tooYoung = b > ymd(c.bornTo);
    var anyVul = o.basic || o.disabled || o.veteran;

    if (isChild) {
      var six = addMonths(b, 6);
      var ninth = new Date(b.getFullYear() + 9, b.getMonth(), b.getDate());
      var under9 = ninth > S;
      var baby = firstTimeBaby(b);
      if (baby) o.history = 'first';
      var known = o.history === 'first' || o.history === 'twoplus';
      var two = under9 && o.history !== 'twoplus';
      var groupStart = ymd(two ? c.twoDoseStart : c.oneDoseStart);
      var p = {
        key: 'child', title: '어린이 무료접종',
        tag: !under9 || o.history === 'twoplus' ? '1회 접종' : (known ? '2회 접종' : '접종 이력 확인'),
        start: six > groupStart ? six : groupStart, end: E, place: c.place,
        basis: ['2012. 1. 1. ~ 2026. 8. 31. 출생 (생후 6개월~14세)'], bring: [], notes: []
      };
      if (!under9) {
        p.basis.push('만 9세 이상이라 1회 접종');
      } else if (o.history === 'twoplus') {
        p.basis.push('만 9세 미만 · 지금까지 2회 이상 접종 → 1회 접종');
      } else if (baby) {
        p.basis.push('올해 처음 맞는 아기 → 4주 간격 2회 접종');
      } else if (o.history === 'first') {
        p.basis.push('만 9세 미만 · 처음이거나 지금까지 1회만 접종 → 4주 간격 2회 접종');
      } else {
        p.basis.push('만 9세 미만은 접종 이력에 따라 시작일이 달라요');
        p.notes.push('처음 맞거나 지금까지 1회만 맞았다면 → ' + fmt(ymd(c.twoDoseStart)) + '부터, 4주 간격 2회');
        p.notes.push('지금까지 2회 이상 맞았다면 → ' + fmt(ymd(c.oneDoseStart)) + '부터 1회');
        p.notes.push('아이 접종 기록은 예방접종도우미(nip.kdca.go.kr)에서 확인할 수 있어요.');
      }
      if (six > groupStart) p.notes.unshift('생후 6개월이 되는 ' + fmt(six) + '부터 맞을 수 있어요.');
      if (two) {
        p.notes.push('2차까지 지원 기간 안에 맞으려면 1차를 늦어도 ' + fmt(addDays(E, -28)) + '까지 맞으세요.');
        if (ninth <= E) p.notes.push(fmt(ninth) + '에 만 9세가 돼요. 첫 접종을 그 뒤에 하면 1회만 맞아요.');
      }
      progs.push(p);
    }

    if (isElder) {
      var tier = el.tiers.filter(function (t) { return inRange(b, t.bornFrom, t.bornTo); })[0];
      progs.push({
        key: 'elderly', title: '어르신 무료접종', tag: tier.label,
        start: ymd(tier.start), end: E, place: el.place,
        basis: [tier.range + ' → ' + tier.label],
        bring: ['신분증'],
        notes: ['코로나19 예방접종과 함께 맞는 것을 권고해요.',
                '나이가 많은 순서로 시작해요: 75세 이상 10. 6. → 70~74세 10. 12. → 65~69세 10. 15.']
      });
    }

    if (o.pregnant) {
      progs.push({
        key: 'pregnant', title: '임신부 무료접종', tag: '임신 주수 무관',
        start: ymd(CFG.pregnant.start), end: E, place: CFG.pregnant.place,
        basis: ['임신 중이면 임신 주수와 관계없이 접종할 수 있어요'],
        bring: ['신분증', '임신을 확인할 수 있는 서류 (임신확인서, 산모수첩 등)'],
        notes: []
      });
    }

    if (anyVul) {
      if (inRange(b, v.bornFrom, v.bornTo)) {
        var kinds = [], bring = ['신분증'];
        if (o.basic) { kinds.push('기초생활수급자(생계·의료)'); bring.push('기초생활수급자 증명서'); }
        if (o.disabled) { kinds.push('장애인'); bring.push('장애인증(복지카드)'); }
        if (o.veteran) { kinds.push('국가보훈대상자'); bring.push('국가보훈등록증'); }
        progs.push({
          key: 'vulnerable', title: '의료취약계층 무료접종', tag: '의정부시민',
          start: ymd(v.start), end: E, place: v.place,
          basis: ['15~64세(1962~2011년생) 의정부시민 · ' + kinds.join(', ')],
          bring: bring,
          notes: ['의정부시에 사는 분만 해당돼요. 다른 시·군은 거주지 보건소에 문의하세요.',
                  '접종은 의정부시 안의 지정 의료기관에서만 돼요.']
        });
      } else if (isChild || isElder) {
        notes.push('의료취약계층 지원은 15~64세(1962~2011년생)가 대상이에요. 대신 ' +
          (isChild ? '어린이' : '어르신') + ' 무료접종으로 맞으면 돼요.');
      }
    }

    if (o.student) {
      if (b >= ymd(c.bornFrom)) {
        notes.push('2012년 이후 출생 학생은 경기도교육청 사업이 아니라 어린이 국가예방접종으로 맞아요.');
      } else {
        progs.push({
          key: 'student', title: '경기도 중·고등학생 무료접종', tag: '경기도교육청',
          start: ymd(st.start), end: ymd(st.end), place: '경기도교육청 지정 의료기관 (보건소 접종 불가)',
          basis: [inRange(b, st.bornFrom, st.bornTo)
            ? '경기도 소재 중·고등학교 재학 · 2008~2011년생'
            : '경기도 소재 중3~고3 재학생이면 지원 (2008~2011년생이 아니어도 가능)'],
          bring: ['재학 증명: 학생증, 재학증명서, 나이스플러스 앱 인증 중 하나',
                  '개인정보 수집·이용·제3자 제공 동의서 (필수)',
                  '보호자 동의서 (보호자가 함께 가지 않을 때만, 보호자가 직접 작성)'],
          notes: ['이 기간 안에 맞은 접종만 지원돼요.',
                  '보호자와 함께 방문하는 것이 원칙이에요.',
                  '학교 밖 청소년, 자퇴한 학생은 제외돼요.']
        });
      }
    }

    // 놓치기 쉬운 항목 알려 주기
    if (!o.pregnant && inRange(b, '1971-01-01', '2007-12-31')) {
      hints.push({ id: 'pregnant', text: '임신 중이라면 "임신 중"을 체크하세요 → ' + fmt(ymd(CFG.pregnant.start)) + '부터 무료' });
    }
    if (!anyVul && inRange(b, v.bornFrom, v.bornTo)) {
      hints.push({ id: 'basic', text: '의정부시민이면서 기초생활수급자·장애인·국가보훈대상자라면 해당 항목을 체크하세요 → ' + fmt(ymd(v.start)) + '부터 무료' });
    }
    if (!o.student && inRange(b, st.bornFrom, st.bornTo)) {
      hints.push({ id: 'student', text: '경기도 소재 중·고등학교에 다닌다면 "경기도 중·고등학생"을 체크하세요 → ' + fmt(ymd(st.start)) + ' ~ ' + fmt(ymd(st.end)) + ' 무료' });
    }

    progs.sort(function (a, b2) { return a.start - b2.start; });
    return { progs: progs, notes: notes, hints: hints, tooYoung: tooYoung, six: addMonths(b, 6) };
  }

  // ── 화면 ──
  var $ = function (id) { return document.getElementById(id); };
  var birth = $('birth'), info = $('birthInfo'), historyBox = $('historyBox'), result = $('result');
  var boxes = ['pregnant', 'basic', 'disabled', 'veteran', 'student'];
  var shown = false;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function list(items, cls) {
    if (!items.length) return '';
    return '<ul class="' + cls + '">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  function status(p, T) {
    if (T > p.end) return { cls: 'over', text: '지원 기간 끝' };
    if (T >= p.start) return { cls: 'now', text: '지금 접종 가능' };
    return { cls: 'wait', text: 'D-' + daysBetween(T, p.start) };
  }

  function readOpts() {
    var o = {};
    boxes.forEach(function (k) { o[k] = $(k).checked; });
    var h = document.querySelector('input[name="history"]:checked');
    o.history = h ? h.value : null;
    return o;
  }

  function updateBirthInfo() {
    var r = parseBirth(birth.value);
    info.className = 'birth-info';
    historyBox.hidden = true;
    if (r.state === 'ok') {
      var b = r.date, T = today0(), age = manAge(b, T);
      var ageText = age < 2 ? '생후 ' + monthsOld(b, T) + '개월' : '만 ' + age + '세';
      info.textContent = b.getFullYear() + '년 ' + (b.getMonth() + 1) + '월 ' + b.getDate() + '일생 · ' + ageText;
      info.classList.add('ok');
      historyBox.hidden = !needsHistory(b);
      birth.setAttribute('aria-invalid', 'false');
    } else if (r.state === 'error') {
      info.textContent = r.msg;
      info.classList.add('err');
      birth.setAttribute('aria-invalid', 'true');
    } else {
      info.textContent = '8자리 숫자로 넣어 주세요. 예) 1955년 3월 15일 → 19550315';
      birth.removeAttribute('aria-invalid');
    }
    return r;
  }

  function render(scroll) {
    var r = updateBirthInfo();
    if (r.state !== 'ok') {
      if (scroll) { birth.focus(); if (r.state !== 'error') { info.textContent = '생년월일을 먼저 넣어 주세요. 예) 19550315'; info.classList.add('err'); } }
      if (!shown) return;
      result.hidden = true;
      return;
    }
    var T = today0(), res = evaluate(r.date, readOpts()), html = '';
    var live = res.progs.filter(function (p) { return p.end >= T; });

    if (live.length) {
      var first = live.slice().sort(function (a, b) { return Math.max(a.start, T) - Math.max(b.start, T); })[0];
      var s = status(first, T);
      html += '<div class="summary">' +
        '<p class="summary-label">무료 접종 가능일</p>' +
        (s.cls === 'now'
          ? '<p class="summary-date">지금 바로 맞을 수 있어요</p><p class="summary-sub">' + esc(first.title) + ' · ' + fmt(first.end) + '까지</p>'
          : '<p class="summary-date">' + fmt(first.start) + '부터</p><p class="summary-sub">' + esc(first.title) + ' · 오늘부터 ' + daysBetween(T, first.start) + '일 남았어요</p>') +
        '</div>';
    } else if (res.progs.length) {
      html += '<div class="summary summary-muted"><p class="summary-label">무료 접종</p><p class="summary-date">지원 기간이 끝났어요</p>' +
        '<p class="summary-sub">병·의원에서 유료로 맞을 수 있어요.</p></div>';
    } else if (res.tooYoung) {
      html += '<div class="summary summary-muted"><p class="summary-label">이번 절기 무료접종</p><p class="summary-date">대상이 아니에요</p>' +
        '<p class="summary-sub">독감 백신은 생후 6개월(' + fmt(res.six) + ')부터 맞을 수 있어요. 이번 절기 어린이 무료접종은 2026. 8. 31. 이전 출생아까지예요.</p></div>';
    } else {
      html += '<div class="summary summary-muted"><p class="summary-label">무료 접종</p><p class="summary-date">무료 지원 대상이 아니에요</p>' +
        '<p class="summary-sub">가까운 병·의원에서 유료로 맞을 수 있어요. 백신이 들어왔는지, 가격은 얼마인지 전화로 먼저 확인하세요.</p></div>';
    }

    if (res.hints.length) {
      html += '<div class="hints"><p class="hints-title">혹시 해당되나요?</p><ul>' +
        res.hints.map(function (h) { return '<li><button type="button" class="hint-btn" data-target="' + h.id + '">' + esc(h.text) + '</button></li>'; }).join('') +
        '</ul></div>';
    }

    res.progs.forEach(function (p) {
      var s = status(p, T);
      html += '<article class="prog prog-' + p.key + '">' +
        '<header><h3>' + esc(p.title) + '</h3><span class="tag">' + esc(p.tag) + '</span><span class="st st-' + s.cls + '">' + s.text + '</span></header>' +
        '<p class="period"><strong class="nw">' + fmt(p.start) + '</strong> ~ <span class="nw">' + fmt(p.end) + '</span></p>' +
        list(p.basis, 'basis') +
        '<dl><dt>접종 기관</dt><dd>' + esc(p.place) + '</dd>' +
        (p.bring.length ? '<dt>준비물</dt><dd>' + list(p.bring, 'bring') + '</dd>' : '') +
        '</dl>' + list(p.notes, 'notes') + '</article>';
    });

    if (res.notes.length) html += list(res.notes, 'extra-notes');

    html += '<p class="result-foot">방문 전에 의료기관에 전화로 접종 가능 여부를 확인하고, 신분증과 증빙서류를 챙기세요. ' +
      '지정 의료기관은 <a href="https://nip.kdca.go.kr" target="_blank" rel="noopener">예방접종도우미</a>에서 찾을 수 있어요.</p>';

    result.innerHTML = html;
    result.hidden = false;
    shown = true;
    if (scroll) result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  birth.addEventListener('input', function () { render(false); });
  birth.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); render(true); } });
  document.querySelectorAll('#calc input[type="checkbox"], #calc input[type="radio"]').forEach(function (el) {
    el.addEventListener('change', function () { render(false); });
  });
  $('go').addEventListener('click', function () { render(true); });

  result.addEventListener('click', function (e) {
    var btn = e.target.closest('.hint-btn');
    if (!btn) return;
    var box = $(btn.getAttribute('data-target'));
    box.closest('.opts').scrollIntoView({ behavior: 'smooth', block: 'center' });
    box.focus();
    box.closest('label').classList.add('flash');
    setTimeout(function () { box.closest('label').classList.remove('flash'); }, 1600);
  });

  var share = $('share');
  share.addEventListener('click', function () {
    var data = { title: document.title, text: '생년월일만 넣으면 독감 무료 접종일을 알려줘요', url: location.href.split('#')[0].split('?')[0] };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { share.textContent = '주소를 복사했어요'; setTimeout(function () { share.textContent = '가족에게 공유하기'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(done, function () { prompt('주소를 복사하세요', data.url); });
    else prompt('주소를 복사하세요', data.url);
  });

  updateBirthInfo();
})();
