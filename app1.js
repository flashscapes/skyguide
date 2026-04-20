// ─────────────────────────────────────────────────────────
// BUILD MASTER LANDMARK ARRAY FROM ALL LOADED JS FILES
// ─────────────────────────────────────────────────────────

var ALL_LANDMARKS = (function() {
  var seen = {};
  var out  = [];

  function norm(lm) {
    var lat = (lm.lat != null) ? lm.lat : (lm.coords ? lm.coords.lat : null);
    var lon = (lm.lon != null) ? lm.lon
            : (lm.coords ? (lm.coords.lon != null ? lm.coords.lon : lm.coords.lng) : null);
    var photo = lm.photo || lm.image || '';
    var fact = lm.fact || '';
    if (!fact && lm.media) {
      fact = '<div class="film-row"><span class="film-label">🎬 Movie</span><span class="film-val">' + (lm.media || '') + '</span></div>'
           + '<div class="film-row"><span class="film-label">🎥 The Scene</span><span class="film-val">' + (lm.scene || lm.history || '') + '</span></div>'
           + '<div class="film-row"><span class="film-label">⭐ Fun Fact</span><span class="film-val">' + (lm.fun_fact || '') + '</span></div>';
    }
    var cat = lm.cat || '';
    if (!cat && lm.media) cat = 'Movie & TV Film';
    return {
      name:   lm.name   || '',
      county: lm.county || '',
      emoji:  lm.emoji  || '📍',
      lat:    lat,
      lon:    lon,
      cat:    cat,
      photo:  photo,
      fact:   fact
    };
  }

  function merge(arr) {
    if (!arr || !arr.length) return;
    for (var i = 0; i < arr.length; i++) {
      var n   = norm(arr[i]);
      if (!n.lat || !n.lon || !n.name) continue;
      var key = n.name.toLowerCase().trim();
      if (seen[key]) continue;
      seen[key] = true;
      out.push(n);
    }
  }

  if (typeof LANDMARKS             !== 'undefined') merge(LANDMARKS);
  if (typeof LANDMARKS_SOUTH       !== 'undefined') merge(LANDMARKS_SOUTH);
  if (typeof LANDMARKS_TOPUP       !== 'undefined') merge(LAN
