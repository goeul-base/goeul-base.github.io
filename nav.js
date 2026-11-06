// 소개 페이지 뒤로 가기 정리 (11-06 인표)
// 휴대폰 뒤로 가기가 '한 단계 위'로만 가도록 방문 기록을 쌓지 않는다.
//  - 옆 화면(이장님↔주민↔가족) 이동: 기록을 바꿔치기(replace)
//  - '← 뒤로' 링크: 바로 앞이 그 화면이면 기록에서 뒤로, 아니면 바꿔치기
//  - 차례(#) 이동: 기록을 쌓지 않고 그 자리로만 스크롤
(function () {
  // 사용 가이드: 차례에서 누른 부분만 보여 준다 (11-06 인표 — 계속 내려가며 다음 차례가 나오지 않게)
  var toc = document.querySelector('.toc');
  var secs = toc ? [].slice.call(document.querySelectorAll('.gsec[id]')) : [];
  function show(id, scroll) {
    if (!secs.length) return false;
    var hit = secs.some(function (x) { return x.id === id; });
    if (!hit) id = secs[0].id;
    secs.forEach(function (x) { x.hidden = x.id !== id; });
    [].forEach.call(toc.querySelectorAll('a'), function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    if (scroll) toc.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  if (secs.length) show(location.hash.slice(1), false);

  function same(a, b) {
    try { var x = new URL(a, location.href), y = new URL(b, location.href); return x.origin === y.origin && x.pathname.replace(/index\.html$/, '') === y.pathname.replace(/index\.html$/, ''); }
    catch (e) { return false; }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || a.target) return;
    var href = a.getAttribute('href');
    if (href.charAt(0) === '#' && secs.length && href !== '#top') {
      e.preventDefault();
      show(href.slice(1), true);
      try { history.replaceState(null, '', href); } catch (err) {}
      return;
    }
    if (href === '#top' && secs.length && a.classList.contains('up') && a.textContent.indexOf('차례') >= 0) {
      e.preventDefault();
      toc.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (href.charAt(0) === '#') {
      var el = href.length > 1 && document.getElementById(href.slice(1));
      if (!el && href !== '#top') return;
      e.preventDefault();
      (el || document.body).scrollIntoView({ behavior: 'smooth', block: 'start' });
      try { history.replaceState(null, '', href === '#top' ? location.pathname : href); } catch (err) {}
      return;
    }
    if (a.hasAttribute('data-back')) {
      e.preventDefault();
      if (document.referrer && same(document.referrer, a.href) && history.length > 1) history.back();
      else location.replace(a.href);
      return;
    }
    if (a.hasAttribute('data-swap')) {
      e.preventDefault();
      location.replace(a.href);
    }
  });
})();
