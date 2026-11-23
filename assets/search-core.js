(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TVHSearch = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalizeText(value) {
    return String(value ?? '').normalize('NFKC').toLowerCase();
  }

  function textMatches(searchableText, query = '', mode = 'and') {
    const terms = normalizeText(query).trim().split(/\s+/u).filter(Boolean);
    if (!terms.length) return true;
    const haystack = normalizeText(searchableText);
    const matches = terms.map(term => haystack.includes(term));
    return mode === 'or' ? matches.some(Boolean) : matches.every(Boolean);
  }

  function matchesCriteria({ searchText, capoStatus, verseValue, verseConfirmed }, criteria = {}) {
    const capo = criteria.capo ?? 'any';
    const verses = criteria.verses ?? 'any';
    if (!textMatches(searchText, criteria.query ?? '', criteria.mode ?? 'and')) return false;
    if (capo !== 'any' && capoStatus !== capo) return false;
    if (verses !== 'any' && (!verseConfirmed || verseValue !== Number(verses))) return false;
    return true;
  }

  function songSearchText(song) {
    return [song.title?.value ?? '', ...(song.blocks ?? []).flatMap(block => (block.lines ?? []).map(line => line.lyricText ?? ''))].join(' ');
  }

  function filterSongs(songs, criteria = {}) {
    return songs.filter(song => matchesCriteria({
      searchText: songSearchText(song),
      capoStatus: song.capo?.status,
      verseValue: song.verseCount?.value,
      verseConfirmed: song.verseCount?.status === 'confirmed'
    }, criteria));
  }

  return { normalizeText, textMatches, matchesCriteria, songSearchText, filterSongs };
});
