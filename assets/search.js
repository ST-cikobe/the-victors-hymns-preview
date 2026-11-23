(function () {
  'use strict';
  const input = document.getElementById('query');
  const mode = document.getElementById('match-mode');
  const capo = document.getElementById('capo-filter');
  const verses = document.getElementById('verse-filter');
  const cards = Array.from(document.querySelectorAll('.song-card'));
  const status = document.getElementById('result-status');
  const empty = document.getElementById('no-results');

  function update() {
    const criteria = { query: input.value, mode: mode.value, capo: capo.value, verses: verses.value };
    let shown = 0;
    for (const card of cards) {
      const searchable = [
        card.querySelector('.song-title')?.textContent || '',
        ...Array.from(card.querySelectorAll('.lyric')).map(node => node.textContent || '')
      ].join(' ');
      const visible = window.TVHSearch.matchesCriteria({
        searchText: searchable,
        capoStatus: card.dataset.capo,
        verseValue: card.dataset.verses === '' ? null : Number(card.dataset.verses),
        verseConfirmed: card.dataset.verses !== ''
      }, criteria);
      card.hidden = !visible;
      if (visible) shown += 1;
    }
    empty.hidden = shown !== 0;
    status.textContent = `検索結果：${shown}曲`;
  }

  [input, mode, capo, verses].forEach(control => control.addEventListener(control === input ? 'input' : 'change', update));
})();
