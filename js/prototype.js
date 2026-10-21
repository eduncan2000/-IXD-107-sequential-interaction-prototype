/* Making a Muse: one continuous sequence built from the clay studies (clay-ball, clay-face, red-wig, she-left).
   Spin the clay into a head -> sculpt a face -> drag on the red wig -> drag the head onto her body -> she leaves. */
(function () {
  var NS = 'http://www.w3.org/2000/svg', svg = document.getElementById('scene');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return 0.5 - 0.5 * Math.cos(Math.PI * clamp(t, 0, 1)); }

  var CX = 800, CY = 440, R = 190, TILT = 0.2;
  var r = rng(7), i;

  /* the lumpy outline of the ball */
  function outline(m) {
    var d = '', st = 0.08;
    for (var a = 0; a < Math.PI * 2 + st; a += st) {
      var rr = R * (1 + 0.016 * Math.sin(3 * a + 1) + 0.011 * Math.sin(5 * a + 2) + 0.007 * Math.sin(8 * a));
      var x0 = CX + Math.cos(a) * rr, y0 = CY + Math.sin(a) * rr * 0.995;
      /* a smooth head: full across the brow, tapering to a soft jaw and chin */
      var low = Math.max(0, Math.sin(a)), ca = Math.cos(a), x1 = CX + R * (ca < 0 ? -1 : 1) * Math.pow(Math.abs(ca), low > 0 ? 0.74 : 0.9) * (0.9 - 0.19 * Math.pow(low, 1.2)), y1 = CY - 0.06 * R + R * 1.04 * Math.sin(a) * (1 - 0.04 * Math.pow(low, 3));
      var x = x0 + (x1 - x0) * m, y = y0 + (y1 - y0) * m;
      d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d + 'Z';
  }
  function setOutline(m) { var od = outline(m); $('ballFill').setAttribute('d', od); $('ballClipPath').setAttribute('d', od); $('bounceP').setAttribute('d', od); }
  setOutline(0);

  /* marks that live on the sphere and turn with it */
  var lumps = [], dimples = [], grooves = [], grit = [], drops = [];
  function randPt() { var lon = r() * Math.PI * 2, lat = Math.asin(r() * 2 - 1); return [lon, lat]; }
  var gl = $('lumps'), gd = $('dimples'), gg = $('grooves'), gt = $('grit'), gdr = $('drops');
  for (i = 0; i < 18; i++) { var p = randPt(), dark = i % 2 === 0, rad = 38 + r() * 46; lumps.push({ lon: p[0], lat: p[1], rad: rad, el: mk('circle', { r: rad, fill: dark ? 'url(#lumpD)' : 'url(#lumpL)' }, gl) }); }
  for (i = 0; i < 70; i++) { var q = randPt(), rr2 = 6 + r() * 12; dimples.push({ lon: q[0], lat: q[1], rad: rr2, a: mk('ellipse', { rx: rr2, ry: rr2, fill: '#1d0d05', 'fill-opacity': 0.5 }, gd), b: mk('ellipse', { rx: rr2 * 0.8, ry: rr2 * 0.8, fill: '#c68a58', 'fill-opacity': 0.3 }, gd) }); }
  for (i = 0; i < 9; i++) { var g0 = randPt(); grooves.push({ lon: g0[0], lat: g0[1] * 0.75, len: 0.7 + r() * 0.9, wob: r() * 6, dk: mk('path', { stroke: '#1e0e05', 'stroke-opacity': 0.4, 'stroke-width': 7, filter: 'url(#b2)' }, gg), lt: mk('path', { stroke: '#e1a873', 'stroke-opacity': 0.34, 'stroke-width': 2.4 }, gg) }); }
  for (i = 0; i < 200; i++) { var s0 = randPt(); grit.push({ lon: s0[0], lat: s0[1], el: mk('circle', { r: 0.7 + r() * 1.3, fill: r() < 0.55 ? '#1a0b04' : '#d8a06a', 'fill-opacity': 0.5 }, gt) }); }
  for (i = 0; i < 26; i++) { var w0 = randPt(), wr = 2.6 + r() * 3.4; drops.push({ lon: w0[0], lat: w0[1], rad: wr, o: mk('circle', { r: wr, fill: '#2a1409', 'fill-opacity': 0.45 }, gdr), h: mk('circle', { r: wr * 0.38, fill: '#fff8ea', 'fill-opacity': 0.9 }, gdr) }); }

  /* the wet sheen */
  var shWin = $('shWin');
  [[-0.4, -0.5], [-0.3, -0.5], [-0.4, -0.32], [-0.3, -0.32]].forEach(function (c) {
    mk('rect', { x: CX + c[0] * R - 15, y: CY + c[1] * R - 12, width: 26, height: 20, rx: 4, transform: 'rotate(-22 ' + (CX + c[0] * R) + ' ' + (CY + c[1] * R) + ')' }, shWin);
  });
  function set(el, o) { for (var k in o) el.setAttribute(k, o[k]); }
  set($('shBroad'), { cx: CX - 0.34 * R, cy: CY - 0.4 * R, rx: R * 0.5, ry: R * 0.36, transform: 'rotate(-35 ' + (CX - 0.34 * R) + ' ' + (CY - 0.4 * R) + ')' });
  set($('shSharp'), { cx: CX - 0.5 * R, cy: CY - 0.62 * R, rx: R * 0.1, ry: R * 0.05, transform: 'rotate(-38 ' + (CX - 0.5 * R) + ' ' + (CY - 0.62 * R) + ')' });
  var rimPts = [], ra;
  for (ra = 3.35; ra <= 4.75; ra += 0.1) rimPts.push((CX + Math.cos(ra) * (R - 6)).toFixed(1) + ' ' + (CY + Math.sin(ra) * (R - 6)).toFixed(1));
  $('shRim').setAttribute('d', 'M' + rimPts.join('L'));
  $('shStreak').setAttribute('d', 'M' + (CX + 0.12 * R) + ' ' + (CY - 0.78 * R) + ' Q' + (CX + 0.4 * R) + ' ' + (CY - 0.7 * R) + ' ' + (CX + 0.62 * R) + ' ' + (CY - 0.4 * R));

  /* projection */
  var yaw = 0, LX = -0.5, LY = 0.62, LZ = 0.6;
  function proj(lon, lat) {
    var cl = Math.cos(lat), x = cl * Math.sin(lon + yaw), y = Math.sin(lat), z = cl * Math.cos(lon + yaw);
    var ct = Math.cos(TILT), st = Math.sin(TILT), y2 = y * ct - z * st, z2 = y * st + z * ct;
    return [x, y2, z2];
  }
  function place(el, p, rad, extra) {
    var x = p[0], y = p[1], z = p[2];
    var vis = clamp((z - 0.04) / 0.2, 0, 1);
    el.setAttribute('opacity', vis.toFixed(2));
    if (vis <= 0) return false;
    return true;
  }
  function updateMarks() {
    var k, o, p, X, Y, ang, zc;
    for (k = 0; k < lumps.length; k++) {
      o = lumps[k]; p = proj(o.lon, o.lat);
      if (!place(o.el, p)) continue;
      X = CX + R * p[0]; Y = CY - R * p[1]; zc = Math.max(0.15, p[2]); ang = Math.atan2(-p[1], p[0]) * 180 / Math.PI;
      o.el.setAttribute('transform', 'translate(' + X.toFixed(1) + ' ' + Y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + zc.toFixed(3) + ' 1)');
    }
    for (k = 0; k < dimples.length; k++) {
      o = dimples[k]; p = proj(o.lon, o.lat);
      var vis = place(o.a, p); o.b.setAttribute('opacity', o.a.getAttribute('opacity'));
      if (!vis) continue;
      X = CX + R * p[0]; Y = CY - R * p[1]; zc = Math.max(0.12, p[2]); ang = Math.atan2(-p[1], p[0]) * 180 / Math.PI;
      o.a.setAttribute('transform', 'translate(' + X.toFixed(1) + ' ' + Y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + zc.toFixed(3) + ' 1)');
      o.b.setAttribute('transform', 'translate(' + (X + o.rad * 0.3).toFixed(1) + ' ' + (Y + o.rad * 0.34).toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + zc.toFixed(3) + ' 1)');
    }
    for (k = 0; k < grooves.length; k++) {
      o = grooves[k]; var d = '', dl = '', pen = false, n = 14, t;
      for (t = 0; t <= n; t++) {
        var lon = o.lon + (t / n - 0.5) * o.len, lat = o.lat + Math.sin(t / n * 6.28 + o.wob) * 0.06;
        p = proj(lon, lat);
        if (p[2] > 0.08) { X = CX + R * p[0]; Y = CY - R * p[1]; d += (pen ? 'L' : 'M') + X.toFixed(1) + ' ' + Y.toFixed(1); dl += (pen ? 'L' : 'M') + (X + 1.5).toFixed(1) + ' ' + (Y + 3).toFixed(1); pen = true; } else pen = false;
      }
      o.dk.setAttribute('d', d); o.lt.setAttribute('d', dl);
    }
    for (k = 0; k < grit.length; k++) {
      o = grit[k]; p = proj(o.lon, o.lat);
      if (p[2] < 0.05) { o.el.setAttribute('opacity', 0); continue; }
      o.el.setAttribute('opacity', clamp((p[2] - 0.05) / 0.25, 0, 1).toFixed(2));
      o.el.setAttribute('cx', (CX + R * p[0]).toFixed(1)); o.el.setAttribute('cy', (CY - R * p[1]).toFixed(1));
    }
    for (k = 0; k < drops.length; k++) {
      o = drops[k]; p = proj(o.lon, o.lat);
      if (p[2] < 0.1) { o.o.setAttribute('opacity', 0); o.h.setAttribute('opacity', 0); continue; }
      var a2 = clamp((p[2] - 0.1) / 0.25, 0, 1).toFixed(2);
      X = CX + R * p[0]; Y = CY - R * p[1];
      o.o.setAttribute('opacity', a2); o.o.setAttribute('cx', X.toFixed(1)); o.o.setAttribute('cy', (Y + 1).toFixed(1));
      o.h.setAttribute('opacity', (a2 * (0.35 + 0.65 * clamp(p[0] * LX * -1 + p[1] * LY + p[2] * LZ, 0, 1))).toFixed(2));
      o.h.setAttribute('cx', (X - o.rad * 0.3).toFixed(1)); o.h.setAttribute('cy', (Y - o.rad * 0.35).toFixed(1));
    }
  }

  /* ---------- interaction two: the background darkens and dragging over the clay pushes up soft, exaggerated features ---------- */
  var stage = 0, pend = false, st2 = { t0: 0, drag: 0, started: false }, cam2 = Sp(1, 62, 9), dark = { v: 0, t: 0 }, dragVel = 0, lastY = 0, zones = [];
  function Sp(x, k, c) { return { x: x, v: 0, t: x, k: k, c: c }; }
  function stepSp(o, dt) { var a = o.k * (o.t - o.x) - o.c * o.v; o.v += a * dt; o.x += o.v * dt; }
  var DEFS = svg.querySelector('defs'), fColor = $('fColor'), fRelM = $('fRelM'), fRelL = $('fRelL'), fSpM = $('fSpM'), fSpL = $('fSpL'), fFinger = $('fFinger');
  var fingerOn = false, fingerPos = { x: 0, y: 0 }, smudges = [], smIdx = 0, lastSm = { x: -999, y: -999 };
  /* every feature is a soft relief under a "reveal" mask: each pass of the finger stamps more clay into the mask, so the shape is pushed up, lit and shaded, gradually, right where you work */
  function zone(id, cx, cy, rad, order, lash) {
    var mk_ = mk('mask', { id: 'mk_' + id, maskUnits: 'userSpaceOnUse', x: 520, y: 200, width: 560, height: 480 }, DEFS);
    var sg = mk('g', {}, mk_), fb = mk('rect', { x: 520, y: 200, width: 560, height: 480, fill: '#fff', opacity: 0 }, mk_);
    var rel = mk('g', { id: 'rz_' + id, mask: 'url(#mk_' + id + ')' }, DEFS);
    var col = mk('g', { mask: 'url(#mk_' + id + ')' }, fColor);
    [[fRelM, fRelL], [fSpM, fSpL]].forEach(function (pair) { mk('use', { href: '#rz_' + id }, lash ? pair[1] : pair[0]); });
    var z = { id: id, cx: cx, cy: cy, r: rad, order: order, sg: sg, fb: fb, rel: rel, col: col, n: 0, acc: 0, hold: 0, fbv: Sp(0, 36, 13) };
    zones.push(z); return z;
  }
  function W(parent, tag, attrs) { if (!attrs.fill) attrs.fill = '#fff'; return mk(tag, attrs, parent); }
  var zEL = zone('eL', 732, 398, 80, 0), zER = zone('eR', 868, 398, 80, 1), zNo = zone('no', 800, 456, 64, 2), zLi = zone('li', 800, 538, 92, 3), zCL = zone('cL', 690, 490, 64, 4), zCR = zone('cR', 910, 490, 64, 5), zLaL = zone('laL', 732, 376, 80, 6, true), zLaR = zone('laR', 868, 376, 80, 7, true);
  function eyeShapes(z, k) {
    var ex = z.cx, ey = z.cy, almond = 'M' + (ex - 44) + ' ' + ey + ' Q' + ex + ' ' + (ey - 36) + ' ' + (ex + 44) + ' ' + ey + ' Q' + ex + ' ' + (ey + 28) + ' ' + (ex - 44) + ' ' + ey + 'Z';
    mk('path', { d: almond, fill: 'url(#hole)' }, z.col);
    mk('path', { d: 'M' + (ex - 40) + ' ' + (ey - 8) + ' Q' + ex + ' ' + (ey - 50) + ' ' + (ex + 40) + ' ' + (ey - 8), fill: 'none', stroke: '#150803', 'stroke-width': 2.4, 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }, z.col);
    mk('path', { d: 'M' + (ex - 38) + ' ' + (ey + 16) + ' Q' + ex + ' ' + (ey + 34) + ' ' + (ex + 38) + ' ' + (ey + 16), fill: 'none', stroke: '#150803', 'stroke-width': 2.2, 'stroke-opacity': 0.4, 'stroke-linecap': 'round' }, z.col);
    [-6, 6].forEach(function (o) { mk('path', { d: 'M' + (ex - 52) + ' ' + (ey - 52 + o) + ' Q' + (ex - 8 * k) + ' ' + (ey - 78 + o) + ' ' + (ex + 52) + ' ' + (ey - 58 + o), fill: 'none', stroke: '#150803', 'stroke-width': 1.8, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }, z.col); });
    W(z.rel, 'path', { d: almond, fill: 'none', stroke: '#fff', 'stroke-width': 13, 'stroke-linejoin': 'round' });
    W(z.rel, 'path', { d: 'M' + (ex - 48) + ' ' + (ey - 4) + ' Q' + ex + ' ' + (ey - 48) + ' ' + (ex + 48) + ' ' + (ey - 4), fill: 'none', stroke: '#fff', 'stroke-width': 14, 'stroke-linecap': 'round' });
    W(z.rel, 'path', { d: 'M' + (ex - 52) + ' ' + (ey - 46) + ' Q' + (ex - 8 * k) + ' ' + (ey - 74) + ' ' + (ex + 52) + ' ' + (ey - 52), fill: 'none', stroke: '#fff', 'stroke-width': 18, 'stroke-linecap': 'round' });
    mk('path', { d: almond, fill: 'none', stroke: '#000', 'stroke-width': 3, 'stroke-opacity': 0.5 }, z.col);
  }
  eyeShapes(zEL, -1); eyeShapes(zER, 1);
  (function () {
    var i;
    [[732, -1], [868, 1]].forEach(function (E) {
      var ex = E[0], k = E[1];
      for (i = 0; i < 9; i++) {
        var u = i / 8, bx = ex + k * (-32 + 66 * u), tx = (bx - (ex - 36)) / 72, by = 398 - 22 * (1 - Math.pow(2 * tx - 1, 2)) - 6;
        var phi = (-8 + 66 * u) * Math.PI / 180, len = 42 + 22 * u, dx = k * Math.sin(phi), dy = -Math.cos(phi);
        var tipx = bx + dx * len, tipy = by + dy * len, cx2 = bx + dx * len * 0.5, cy2 = by + dy * len * 0.55, curl = k * 0.28 * len, nx = -dy, ny = dx, w = 3.8;
        var d = 'M' + (bx + nx * w) + ' ' + (by + ny * w) + ' Q' + (cx2 + nx * 2.4 + curl * 0.4) + ' ' + (cy2 + ny * 2.4) + ' ' + (tipx + curl) + ' ' + (tipy - 6) + ' Q' + (cx2 - nx * 2.4 + curl * 0.4) + ' ' + (cy2 - ny * 2.4) + ' ' + (bx - nx * w) + ' ' + (by - ny * w) + 'Z';
        var lz = ex === 732 ? zLaL : zLaR; mk('path', { d: d, fill: '#3a1c0e' }, lz.col); W(lz.rel, 'path', { d: d });
      }
    });
  })();
  (function () {
    mk('ellipse', { cx: 800, cy: 486, rx: 26, ry: 7, fill: '#120803', 'fill-opacity': 0.3 }, zNo.col);
    W(zNo.rel, 'ellipse', { cx: 800, cy: 424, rx: 13, ry: 32 });
    W(zNo.rel, 'ellipse', { cx: 774, cy: 472, rx: 17, ry: 14 }); W(zNo.rel, 'ellipse', { cx: 826, cy: 472, rx: 17, ry: 14 });
    W(zNo.rel, 'circle', { cx: 800, cy: 459, r: 27 });
    mk('ellipse', { cx: 788, cy: 478, rx: 7.5, ry: 4.4, fill: '#120803', 'fill-opacity': 0.92 }, zNo.col); mk('ellipse', { cx: 812, cy: 478, rx: 7.5, ry: 4.4, fill: '#120803', 'fill-opacity': 0.92 }, zNo.col);
  })();
  (function () {
    var up = 'M730 522 C752 510 778 507 800 516 C822 507 848 510 870 522 C846 536 822 541 800 539 C778 541 754 536 730 522Z';
    var lo = 'M736 531 C758 546 782 549 800 549 C818 549 842 546 864 531 C860 569 832 587 800 587 C768 587 740 569 736 531Z';
    mk('path', { d: up, fill: 'url(#featLip)' }, zLi.col); mk('path', { d: lo, fill: 'url(#featLip)' }, zLi.col);
    W(zLi.rel, 'path', { d: up }); W(zLi.rel, 'path', { d: lo });
    mk('path', { d: 'M726 520 Q800 556 874 520', fill: 'none', stroke: '#180805', 'stroke-width': 3.4, 'stroke-opacity': 0.9, 'stroke-linecap': 'round' }, zLi.col);
    [-1, 1].forEach(function (k) { mk('path', { d: 'M' + (800 + k * 38) + ' 488 Q' + (800 + k * 78) + ' 506 ' + (800 + k * 82) + ' 534', fill: 'none', stroke: '#150803', 'stroke-width': 2.4, 'stroke-opacity': 0.4, 'stroke-linecap': 'round' }, zLi.col); });
  })();
  [zCL, zCR].forEach(function (z) { W(z.rel, 'circle', { cx: z.cx, cy: z.cy, r: 46, 'fill-opacity': 0.55 }); });
  /* the ghost finger that shows the gesture until the first drag */
  var cue2 = $('cue2'), cueDots = [];
  for (i = 0; i < 6; i++) cueDots.push(mk('circle', { r: 7 - i, fill: '#fff', 'fill-opacity': 0.4 - i * 0.06 }, cue2));
  var cueRing = mk('circle', { r: 17, fill: 'rgba(255,255,255,0.16)', stroke: '#fff', 'stroke-width': 2.4, 'stroke-opacity': 0.9 }, cue2), cueDot = mk('circle', { r: 3.4, fill: '#fff' }, cue2);
  var WP = [[732, 398], [868, 398], [800, 456], [800, 536], [905, 490], [695, 490], [740, 420]];
  function cuePos(ph) {
    var n = WP.length - 1, f = ph * n, i2 = Math.min(n - 1, Math.floor(f)), t = f - i2, e = 0.5 - 0.5 * Math.cos(Math.PI * t);
    return [WP[i2][0] + (WP[i2 + 1][0] - WP[i2][0]) * e, WP[i2][1] + (WP[i2 + 1][1] - WP[i2][1]) * e];
  }
  /* the fingertip pressing the clay, and the smudges it leaves behind */
  var fingEl = mk('ellipse', { rx: 27, ry: 31, fill: 'url(#fingG)' }, fFinger);
  var fingRim = mk('ellipse', { rx: 25, ry: 29, fill: 'none', stroke: '#ffe6c8', 'stroke-opacity': 0.22, 'stroke-width': 2.4 }, fFinger);
  var smG = mk('g', {}, $('features'));
  for (i = 0; i < 30; i++) smudges.push({ x: 0, y: 0, age: 9, el: mk('circle', { r: 34, fill: 'url(#smudge)', opacity: 0 }, smG) });
  $('features').appendChild(fFinger);
  function toBall(clientX, clientY) {
    var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
    var q = svg.createSVGPoint(); q.x = clientX; q.y = clientY; var v = q.matrixTransform(m.inverse());
    var z = cam2.x, x = 800 + (v.x - 800) / z, y = 430 + (v.y - 430) / z, k = window.__clayScale || 1;
    return { x: 800 + (x - 800) / k, y: 630 + (y - 630) / k };
  }
  function stamp(z, x, y) {
    if (z.n >= 150) return;
    mk('circle', { cx: (x + (Math.random() - 0.5) * 10).toFixed(1), cy: (y + (Math.random() - 0.5) * 10).toFixed(1), r: (30 + Math.random() * 12).toFixed(1), fill: '#fff', 'fill-opacity': 0.2 }, z.sg); z.n++;
  }
  /* each feature group (eyes with their lashes, nose, mouth) has its own length and width, scaled around its own centre */
  var FG = { e: [zEL, zLaL], n: [zNo], m: [zLi] }; zEL.pv = [732, 398]; zLaL.pv = [732, 398]; zER.pv = [868, 398]; zLaR.pv = [868, 398]; zNo.pv = [800, 440]; zLi.pv = [800, 538];
  zEL.fg = zLaL.fg = zER.fg = zLaR.fg = 'e'; zNo.fg = 'n'; zLi.fg = 'm';
  window.__ft = { e: { x: 1, y: 1 }, n: { x: 1, y: 1 }, m: { x: 1, y: 1 } };
  function featXf() {
    zones.forEach(function (z) { if (!z.fg) return; var f = window.__ft[z.fg], t = 'translate(' + z.pv[0] + ' ' + z.pv[1] + ') scale(' + f.x + ' ' + f.y + ') translate(' + (-z.pv[0]) + ' ' + (-z.pv[1]) + ')'; z.col.setAttribute('transform', t); z.rel.setAttribute('transform', t); });
  }
  window.__featXf = featXf;
  function loc(z, b) { if (!z.fg) return b; var f = window.__ft[z.fg]; return { x: z.pv[0] + (b.x - z.pv[0]) / f.x, y: z.pv[1] + (b.y - z.pv[1]) / f.y }; }
  function toFeat(b) { return b; }
  function fingerAt(e) { var b = toFeat(toBall(e.clientX, e.clientY)); fingerPos = b; fingerOn = true; lastSm = { x: b.x, y: b.y }; }
  function fingerOff() { fingerOn = false; }
  function featureDrag(e, dx, dy, now) {
    var mv = Math.hypot(dx, dy), dt = Math.max(1, now - lastT);
    st2.drag += mv; dragVel = dragVel * 0.6 + (mv / dt) * 0.4;
    if (!st2.started && st2.drag > 18) { st2.started = true; cam2.t = 1.17; }
    var b = toFeat(toBall(e.clientX, e.clientY)), unit = R * px * (window.__clayScale || 1);
    fingerPos = b; fingerOn = true;
    zones.forEach(function (z) {
      var lb = loc(z, b), d = Math.hypot(lb.x - z.cx, lb.y - z.cy);
      if (d < z.r + 30) { z.acc += mv / px / (window.__clayScale || 1); while (z.acc > 10) { z.acc -= 10; stamp(z, lb.x, lb.y); } }
    });
    if (Math.hypot(b.x - lastSm.x, b.y - lastSm.y) > 16) { var sm = smudges[smIdx++ % smudges.length]; sm.x = b.x; sm.y = b.y; sm.age = 0; lastSm = { x: b.x, y: b.y }; }
  }
  function resetZones() {
    zones.forEach(function (z) { while (z.sg.firstChild) z.sg.removeChild(z.sg.firstChild); z.n = 0; z.acc = 0; z.fb.setAttribute('opacity', 0); z.fbv.x = z.fbv.t = 0; z.fbv.v = 0; });
    cue2.setAttribute('opacity', 0); fFinger.setAttribute('opacity', 0); fingerOn = false;
    st2.pr = -1; smudges.forEach(function (m) { m.age = 9; m.el.setAttribute('opacity', 0); });
  }
  function stage2Frame(now, dt) {
    var unit = R * px * (window.__clayScale || 1);
    zones.forEach(function (z) {
      /* dragging anywhere slowly firms up every feature in turn, so nothing is a dead end */
      z.fbv.t = Math.min(1, Math.max(0, st2.drag / (unit * 5) - z.order * 0.8)); stepSp(z.fbv, dt);
      z.fb.setAttribute('opacity', Math.max(0, Math.min(1, z.fbv.x)).toFixed(3));
      if (fingerOn && pressed && dragVel < 0.05) { var lb = loc(z, fingerPos), d = Math.hypot(lb.x - z.cx, lb.y - z.cy); if (d < z.r + 30) { z.hold += dt; if (z.hold > 0.16) { z.hold = 0; stamp(z, lb.x, lb.y); } } }
    });
    dragVel *= Math.exp(-6 * dt);
    var pr = 0; zones.forEach(function (z) { pr += Math.max(Math.min(1, z.n / 55), z.fbv.x); }); pr /= zones.length;
    if (Math.abs(pr - (st2.pr || 0)) > 0.01) { st2.pr = pr; var sd = (10 - 5.2 * pr).toFixed(2); ['rlM', 'spM'].forEach(function (id) { document.getElementById(id).firstChild.setAttribute('stdDeviation', sd); }); }
    if (!st2.whistled && st2.started && zones.every(function (z) { return z.fbv.x > 0.96 || z.n > 50; })) { st2.whistled = true; st2.wt = now; whistle(); }
    if (st2.whistled && !st3.on && now - st2.wt > 2800 && !pressed) startStage3(now);
    if (st3.on) stage3Frame(now, dt);
    fFinger.setAttribute('opacity', fingerOn && pressed ? 1 : 0);
    if (fingerOn) {
      var press = 1 + 0.06 * Math.sin(now / 90);
      fingEl.setAttribute('cx', fingerPos.x.toFixed(1)); fingEl.setAttribute('cy', fingerPos.y.toFixed(1)); fingEl.setAttribute('rx', (27 * press).toFixed(1));
      fingRim.setAttribute('cx', fingerPos.x.toFixed(1)); fingRim.setAttribute('cy', fingerPos.y.toFixed(1));
    }
    smudges.forEach(function (m) { if (m.age < 4) { m.age += dt; m.el.setAttribute('cx', m.x.toFixed(1)); m.el.setAttribute('cy', m.y.toFixed(1)); m.el.setAttribute('opacity', (0.9 * Math.max(0, 1 - m.age / 4)).toFixed(3)); } else m.el.setAttribute('opacity', 0); });
    stepSp(cam2, dt);
    $('cam').setAttribute('transform', st3.on ? camStr() : 'translate(800 430) scale(' + cam2.x.toFixed(4) + ') translate(-800 -430)');
    var showCue = !st2.started && now - st2.t0 > 900;
    cue2.setAttribute('opacity', showCue ? 1 : 0);
    if (showCue) {
      var ph = ((now - st2.t0) % 6200) / 6200, pos = cuePos(ph), k;
      for (k = 0; k < cueDots.length; k++) { var pp = cuePos(Math.max(0, ph - k * 0.012)); cueDots[k].setAttribute('cx', pp[0].toFixed(1)); cueDots[k].setAttribute('cy', pp[1].toFixed(1)); }
      cueRing.setAttribute('cx', pos[0].toFixed(1)); cueRing.setAttribute('cy', pos[1].toFixed(1)); cueDot.setAttribute('cx', pos[0].toFixed(1)); cueDot.setAttribute('cy', pos[1].toFixed(1));
    }
  }

  /* spinning: drag across the clay, it follows your finger, then coasts to a stop (wet clay is draggy) */
  var morph = { t0: 0, m: 0, active: false, done: false, dir: 1 }, dragSum = 0, pressed = false, lastX = 0, lastT = 0, omega = 0, dragged = false, stoneFade = 1, stoneT0 = performance.now(), px = 1;
  function scalePx() { var rc = svg.getBoundingClientRect(); px = Math.max(rc.width / 1600, rc.height / 900); }
  scalePx(); window.addEventListener('resize', scalePx);
  svg.addEventListener('pointerdown', function (e) {
    initAudio();
    if (stage === 2) fingerAt(e);
    pressed = true; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); if (stage < 2) omega = 0; svg.classList.add('grabbing');
    try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  svg.addEventListener('pointermove', function (e) {
    if (!pressed) return;
    var now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
    if (stage >= 3) return;
    if (stage >= 2) { featureDrag(e, dx, e.clientY - lastY, now); lastX = e.clientX; lastY = e.clientY; lastT = now; return; }
    if (morph.active) { lastX = e.clientX; lastT = now; return; }
    var dth = dx / (R * px * (window.__clayScale || 1)) * 0.9;
    yaw += dth;
    omega = omega * 0.6 + (dth / dt * 1000) * 0.4;
    dragSum += Math.abs(dx);
    if (!dragged && dragSum > 45) { dragged = true; morph.t0 = now; morph.active = true; morph.dir = dx >= 0 ? 1 : -1; omega = morph.dir * 32; }
    lastX = e.clientX; lastT = now;
  });
  function release() { pressed = false; fingerOff(); svg.classList.remove('grabbing'); if (performance.now() - lastT > 90) omega *= 0.2; }
  svg.addEventListener('pointerup', release); svg.addEventListener('pointercancel', release);

  window.__clayReset = function () {
    morph = { t0: 0, m: 0, active: false, done: false, dir: 1 }; dragSum = 0; dragged = false; stoneFade = 1; stoneT0 = performance.now(); omega = 0; yaw = 0;
    stage = 0; pend = false; st2 = { t0: 0, drag: 0, started: false }; cam2.x = cam2.t = 1; cam2.v = 0; dark.t = 0; dragVel = 0;
    resetZones(); if (window.__reset4) window.__reset4(); if (window.__reset3) window.__reset3();
    $('cam').removeAttribute('transform'); setOutline(0);
    ['lumps', 'grooves', 'dimples', 'grit', 'drops'].forEach(function (id) { $(id).setAttribute('opacity', 1); }); $('faceform').setAttribute('opacity', 0);
  };
  /* ---------- swoosh sounds, synthesized: filtered noise that follows how fast the clay is turning ---------- */
  var AC = null, bp = null, gN = null, master = null, soundOn = true, noiseBuf = null;
  function initAudio() {
    if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      var len = AC.sampleRate * 2, buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0), lp = 0, q;
      for (q = 0; q < len; q++) { lp = lp * 0.55 + (Math.random() * 2 - 1) * 0.45; d[q] = lp * 1.6; }
      noiseBuf = buf;
      var src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
      bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 300; bp.Q.value = 0.9;
      gN = AC.createGain(); gN.gain.value = 0;
      master = AC.createGain(); master.gain.value = soundOn ? 0.8 : 0;
      src.connect(bp); bp.connect(gN); gN.connect(master); master.connect(AC.destination); src.start();
    } catch (err) { AC = null; }
  }
  window.__claySound = function (on) { soundOn = on; if (master) master.gain.setTargetAtTime(on ? 0.8 : 0, AC.currentTime, 0.05); };
  function sweep(f0, f1, dur, peak, q) {
    if (!AC || !soundOn) return;
    var t = AC.currentTime, s2 = AC.createBufferSource(); s2.buffer = noiseBuf; s2.loop = true;
    var f = AC.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q || 1.2; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var g = AC.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s2.connect(f); f.connect(g); g.connect(master); s2.start(t); s2.stop(t + dur + 0.05);
  }
  function thud() {
    if (!AC || !soundOn) return;
    var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.28);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.4);
  }
  /* wolf whistle: "fi-fiiu" - a quick swoop up, a held high note with vibrato, then a long slide down */
  function whistle() {
    if (!AC || !soundOn) return;
    var t = AC.currentTime + 0.15, o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain(), lfo = AC.createOscillator(), lg = AC.createGain();
    o.type = 'sine'; o2.type = 'sine';
    function F(f, a, b, c, d, e2, f2) { f.setValueAtTime(a, t); f.exponentialRampToValueAtTime(b, t + 0.2); f.setValueAtTime(b * 0.78, t + 0.27); f.exponentialRampToValueAtTime(c, t + 0.62); f.setValueAtTime(c, t + 0.9); f.exponentialRampToValueAtTime(d, t + 1.5); f.exponentialRampToValueAtTime(e2, t + 1.75); }
    F(o.frequency, 1100, 2100, 2500, 1500, 760);
    F(o2.frequency, 2200, 4200, 5000, 3000, 1520);
    lfo.frequency.value = 6.5; lg.gain.value = 26; lfo.connect(lg); lg.connect(o.frequency);
    var g2 = AC.createGain(); g2.gain.value = 0.06; o2.connect(g2); g2.connect(g); o.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.05); g.gain.setValueAtTime(0.32, t + 0.19);
    g.gain.exponentialRampToValueAtTime(0.03, t + 0.24); g.gain.exponentialRampToValueAtTime(0.34, t + 0.32); g.gain.setValueAtTime(0.34, t + 1.0);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    o.start(t); o2.start(t); lfo.start(t); o.stop(t + 1.9); o2.stop(t + 1.9); lfo.stop(t + 1.9);
    sweep(2500, 4000, 1.4, 0.015, 3);
  }
  /* ===== interaction three: the head moves into a dim room; a red wig waits in a spotlight; drag it onto the head ===== */
  var st3 = { on: false, t0: 0, drag: false, seated: false, settled: false, touched: false, offx: 0, offy: 0, vx: 0, px: 0, py: 0, seatT: 0, lastPx: 0 };
  var c3 = { x: Sp(0, 24, 8), y: Sp(0, 24, 8), s: Sp(1, 24, 8) };
  var wig = { x: Sp(380, 170, 15), y: Sp(404, 170, 15), s: Sp(0.5, 170, 15), r: Sp(0, 120, 9) };
  var wigG = $('wigG'), wigIn = $('wigIn'), room = $('room'), cue3 = $('cue3');
  var WIGP = 'M-205 345 C-215 240 -205 90 -150 -5 C-100 -62 100 -62 150 -5 C205 90 215 240 205 345 C190 372 150 372 135 340 C128 290 128 230 126 190 C124 130 112 90 96 70 C60 52 20 50 0 54 C-20 50 -60 52 -96 70 C-112 90 -124 130 -126 190 C-128 230 -128 290 -135 340 C-150 372 -190 372 -205 345 Z';
  var WIGBACK = 'M-135 340 C-128 290 -128 230 -126 190 C-124 130 -112 90 -96 70 C-60 52 -20 50 0 54 C20 50 60 52 96 70 C112 90 124 130 126 190 C128 230 128 290 135 340 C60 372 -60 372 -135 340Z';
  (function () {
    var i, t;
    $('wigClipP').setAttribute('d', WIGP);
    for (i = -9; i <= 9; i++) { var x = 800 + i * 70; }
    var bd = $('boards'); for (i = 0; i < 24; i++) { var xb = 300 + i * 80, xe = 300 + (xb - 300) * 2.6 - 560; mk('line', { x1: xb, y1: 612, x2: xe, y2: 910 }, bd); }
    mk('path', { d: WIGP, fill: '#000', opacity: 0.45, filter: 'url(#b2)', transform: 'translate(0 9)' }, wigIn);
    var back = mk('path', { id: 'wigBack', d: WIGBACK, fill: '#3a070c' }, wigIn);
    /* a darker under-layer so the strands read as hair over a cap, then a few hundred curly, stringy locks */
    mk('path', { d: WIGP, fill: '#6a0910', transform: 'translate(0 140) scale(0.93 0.95) translate(0 -140)' }, wigIn);
    var mclip = mk('mask', { id: 'wigMask', maskUnits: 'userSpaceOnUse', x: -320, y: -140, width: 640, height: 620 }, DEFS);
    mk('rect', { x: -320, y: -140, width: 640, height: 620, fill: '#fff' }, mclip);
    mk('path', { d: 'M-104 104 C-62 74 62 74 104 104 L130 190 L138 440 L-138 440 L-130 190 Z', fill: '#000' }, mclip);
    var R2 = rng(7), cg = mk('g', { mask: 'url(#wigMask)', 'stroke-linecap': 'round', fill: 'none' }, wigIn);
    var PAL = ['#8e0c14', '#b3121b', '#cf1a22', '#e22a30', '#a30f17', '#f2494a', '#7a0a11'];
    function strand(sg, u, layer) {
      var sx = sg * u * 128, sy = -56 + 40 * u * u, ex = sg * (112 + R2() * 98), ey = 270 + R2() * 150 - (layer === 0 ? 40 : 0),
        A0 = 9 + R2() * 20, lam = 34 + R2() * 44, ph = R2() * 6.28, pts = [], n = 64, i, t, X, Y, yy, th;
      for (i = 0; i <= n; i++) {
        t = i / n; Y = sy + (ey - sy) * Math.pow(t, 1.08); X = sx + (ex - sx) * Math.min(1, Math.pow(t * 1.5, 0.62));
        th = ph + (Y - sy) * 6.283 / lam; yy = A0 * t * t * 0.75;
        pts.push([(X + A0 * t * Math.cos(th) * (0.4 + 0.6 * t)), (Y + yy * Math.sin(th))]);
      }
      var d = 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L');
      var col = PAL[Math.floor(R2() * PAL.length)], w = layer === 2 ? 1.1 + R2() * 0.8 : 1.8 + R2() * 2.2;
      mk('path', { d: d, stroke: layer === 0 ? '#870c14' : col, 'stroke-width': w, 'stroke-opacity': layer === 0 ? 0.6 : layer === 2 ? 0.7 : 0.88 }, cg);
      if (layer === 1 && R2() < 0.4) mk('path', { d: d, stroke: '#ff9087', 'stroke-width': 0.9, 'stroke-opacity': 0.35, transform: 'translate(-1.4 0)' }, cg);
    }
    var q;
    for (q = 0; q < 60; q++) strand(q % 2 ? 1 : -1, 0.1 + R2() * 0.9, 0);
    for (q = 0; q < 150; q++) strand(q % 2 ? 1 : -1, 0.03 + R2() * 0.97, 1);
    for (q = 0; q < 34; q++) strand(q % 2 ? 1 : -1, 0.1 + R2() * 0.9, 2);
    /* curly bangs hanging over the forehead */
    for (q = 0; q < 26; q++) {
      var bx = -96 + q * 7.4 + R2() * 4, by0 = -48 + 0.0042 * bx * bx, len = 70 + R2() * 26 - Math.abs(bx) * 0.12, ph2 = R2() * 6.28, pts2 = [], j;
      for (j = 0; j <= 20; j++) { var tt = j / 20; pts2.push([bx + 8 * tt * Math.cos(ph2 + tt * 9) + (bx > 0 ? 1 : -1) * 10 * tt * tt, by0 + len * tt + 5 * tt * Math.sin(ph2 + tt * 9)]); }
      mk('path', { d: 'M' + pts2.map(function (z) { return z[0].toFixed(1) + ' ' + z[1].toFixed(1); }).join(' L'), fill: 'none', 'stroke-linecap': 'round', stroke: PAL[Math.floor(R2() * 6)], 'stroke-width': 2.2 + R2() * 1.6, 'stroke-opacity': 0.92 }, wigIn);
    }
    mk('ellipse', { cx: -48, cy: -22, rx: 78, ry: 11, fill: '#ffb4aa', opacity: 0.34, transform: 'rotate(-12 -48 -22)', filter: 'url(#b2)' }, wigIn);
  })();
  var cue3Dots = [], cue3Ring, cue3Dot;
  (function () { for (var i = 0; i < 6; i++) cue3Dots.push(mk('circle', { r: 8 - i, fill: '#fff', 'fill-opacity': 0.4 - i * 0.06 }, cue3)); cue3Ring = mk('circle', { r: 19, fill: 'rgba(255,255,255,0.16)', stroke: '#fff', 'stroke-width': 2.6, 'stroke-opacity': 0.9 }, cue3); cue3Dot = mk('circle', { r: 3.8, fill: '#fff' }, cue3); })();
  function camK() { return window.__clayScale || 1; }
  function camScale() { return cam2.x * c3.s.x; }
  function camStr() { return 'translate(' + c3.x.x.toFixed(2) + ' ' + c3.y.x.toFixed(2) + ') translate(800 430) scale(' + camScale().toFixed(4) + ') translate(-800 -430)'; }
  var hd = { x: Sp(0, 70, 12), y: Sp(0, 70, 12), s: Sp(1, 70, 12) };
  function headPtWith(lx, ly, hx, hy, hs) {
    var k = camK(), cs = camScale(), bx = 800 + (lx - 800) * k, by = 630 + (ly - 630) * k, cy = 630 + (440 - 630) * k;
    bx = 800 + (bx - 800) * hs; by = cy + (by - cy) * hs; bx += hx; by += hy;
    return { x: 800 + c3.x.x + (bx - 800) * cs, y: 430 + c3.y.x + (by - 430) * cs };
  }
  function headPt(lx, ly) { return headPtWith(lx, ly, hd.x.x, hd.y.x, hd.s.x); }
  function seatScale() { return camK() * hd.s.x * camScale(); }
  window.__applyBall = function () {
    var k = camK(), t = 'translate(800 630) scale(' + k + ') translate(-800 -630)', cy = 630 + (440 - 630) * k;
    $('ball').setAttribute('transform', 'translate(' + hd.x.x.toFixed(2) + ' ' + hd.y.x.toFixed(2) + ') translate(800 ' + cy + ') scale(' + hd.s.x.toFixed(4) + ') translate(-800 -' + cy + ') ' + t);
  };
  function rootPt(e) { var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; var q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); }
  function chime() {
    if (!AC || !soundOn) return;
    [660, 880, 1320, 1760].forEach(function (f, i) {
      var t = AC.currentTime + 0.05 + i * 0.09, o = AC.createOscillator(), g = AC.createGain();
      o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.8);
    });
  }
  function startStage3(now) { st3.on = true; st3.t0 = now; stage = 3; cam2.t = 1; c3.x.t = 255; c3.y.t = 62; c3.s.t = 0.86; sweep(200, 900, 1.4, 0.3, 0.8); }
  wigG.addEventListener('pointerdown', function (e) {
    if (!st3.on || st3.seated || performance.now() - st3.t0 < 1800) return;
    initAudio(); var q = rootPt(e); st3.drag = true; st3.touched = true; st3.offx = wig.x.t - q.x; st3.offy = wig.y.t - q.y; st3.lastPx = q.x; st3.vx = 0;
    try { wigG.setPointerCapture(e.pointerId); } catch (err) {}
    wigG.style.cursor = 'grabbing'; sweep(400, 1600, 0.3, 0.28, 0.9); e.stopPropagation(); e.preventDefault();
  });
  wigG.addEventListener('pointermove', function (e) {
    if (!st3.drag) return; var q = rootPt(e);
    st3.vx = st3.vx * 0.5 + (q.x - st3.lastPx) * 0.5; st3.lastPx = q.x; st3.px = q.x; st3.py = q.y;
    wig.x.t = q.x + st3.offx; wig.y.t = q.y + st3.offy; e.stopPropagation();
  });
  function wigRelease(e) {
    if (!st3.drag) return; st3.drag = false; wigG.style.cursor = 'grab';
    var hp = headPt(800, 245), d = Math.hypot(wig.x.t - hp.x, wig.y.t - hp.y);
    if (d < 190) { st3.seated = true; st3.seatT = performance.now(); sweep(1800, 300, 0.5, 0.3, 0.9); } else { wig.r.t = 0; wig.s.t = Math.max(wig.s.t, 0.6); }
  }
  wigG.addEventListener('pointerup', wigRelease); wigG.addEventListener('pointercancel', wigRelease);
  function stage3Frame(now, dt) {
    var sec = (now - st3.t0) / 1000;
    ['x', 'y', 's'].forEach(function (k) { stepSp(c3[k], dt); });
    if (st3.settled && !st4.on && now - st3.settledT > 2600) startStage4(now);
    if (st4.on) stage4Frame(now, dt);
    room.setAttribute('opacity', clamp(sec / 1.8, 0, 1).toFixed(3));
    wigG.setAttribute('opacity', clamp((sec - 0.9) / 1.0, 0, 1).toFixed(3));
    var hp = headPt(800, 245), ss = seatScale();
    if (st3.drag) {
      var dist = Math.hypot(wig.x.t - hp.x, wig.y.t - hp.y), prox = clamp(1 - dist / 700, 0, 1);
      wig.s.t = 0.62 + (ss - 0.62) * prox; wig.r.t = clamp(st3.vx * 1.3, -20, 20); st3.vx *= 0.88;
    } else if (st3.seated) {
      wig.x.t = hp.x; wig.y.t = hp.y; wig.s.t = ss; wig.r.t = 0;
      if (st4.attached) { wig.x.x = hp.x; wig.y.x = hp.y; wig.s.x = ss; wig.x.v = wig.y.v = wig.s.v = 0; }
      var back = $('wigBack'); back.setAttribute('opacity', clamp(1 - (now - st3.seatT) / 500, 0, 1).toFixed(3));
      if (!st3.settled && now - st3.seatT > 650 && Math.hypot(wig.x.x - hp.x, wig.y.x - hp.y) < 3) { st3.settled = true; st3.settledT = now; thud(); chime(); }
      $('spotTop').setAttribute('opacity', clamp((now - st3.seatT - 500) / 1200, 0, 1).toFixed(3));
      $('spotCone').setAttribute('opacity', (1 - 0.65 * clamp((now - st3.seatT) / 1200, 0, 1)).toFixed(3));
    } else { wig.r.t = Math.sin(now / 1100) * 1.2; }
    ['x', 'y', 's', 'r'].forEach(function (k) { stepSp(wig[k], dt); });
    wigG.setAttribute('transform', 'translate(' + wig.x.x.toFixed(1) + ' ' + wig.y.x.toFixed(1) + ') rotate(' + wig.r.x.toFixed(2) + ') scale(' + wig.s.x.toFixed(4) + ')');
    if (st4.done) { endFrame(now); return; }
    var showCue = !st3.touched && sec > 2.6;
    cue3.setAttribute('opacity', showCue ? 1 : 0);
    if (showCue) {
      var ph = ((now - st3.t0) % 4200) / 4200, f = clamp((ph - 0.12) / 0.62, 0, 1), e1 = ease(f);
      function pos(g) { var ee = ease(clamp(g, 0, 1)); return [380 + (hp.x - 380) * ee, 440 + (hp.y + 40 - 440) * ee - 70 * Math.sin(Math.PI * ee)]; }
      var pp = pos(f); for (var i = 0; i < cue3Dots.length; i++) { var q2 = pos(f - i * 0.025); cue3Dots[i].setAttribute('cx', q2[0].toFixed(1)); cue3Dots[i].setAttribute('cy', q2[1].toFixed(1)); }
      cue3Ring.setAttribute('cx', pp[0].toFixed(1)); cue3Ring.setAttribute('cy', pp[1].toFixed(1)); cue3Dot.setAttribute('cx', pp[0].toFixed(1)); cue3Dot.setAttribute('cy', pp[1].toFixed(1));
      cue3.setAttribute('opacity', (ph < 0.08 ? ph / 0.08 : ph > 0.85 ? (1 - ph) / 0.15 : 1).toFixed(2));
    }
  }
  /* the ending: after she leaves, the room fades away and the camera returns to the empty banding wheel in the studio */
  function endFrame(now) {
    var e = clamp((now - st4.endT - 700) / 1400, 0, 1), f = (1 - e).toFixed(3);
    if (e > 0 && !st4.endStarted) { st4.endStarted = true; c3.x.t = 0; c3.y.t = 0; c3.s.t = 1; cam2.t = 1; dark.t = 0; $('ball').setAttribute('opacity', 0); }
    room.setAttribute('opacity', f); wigG.setAttribute('opacity', f);
    $('woman').setAttribute('opacity', f); $('spotW').setAttribute('opacity', f); $('spotTop').setAttribute('opacity', f);
    $('contact').setAttribute('opacity', 0);
  }
  window.__clayJump3 = function () { if (!st3.on) startStage3(performance.now()); };
  window.__reset3 = function () {
    st3 = { on: false, t0: 0, drag: false, seated: false, settled: false, touched: false, offx: 0, offy: 0, vx: 0, px: 0, py: 0, seatT: 0, lastPx: 0 };
    ['x', 'y'].forEach(function (k) { c3[k].x = c3[k].t = 0; c3[k].v = 0; }); c3.s.x = c3.s.t = 1; c3.s.v = 0;
    wig.x.x = wig.x.t = 380; wig.y.x = wig.y.t = 404; wig.s.x = wig.s.t = 0.5; wig.r.x = wig.r.t = 0; ['x', 'y', 's', 'r'].forEach(function (k) { wig[k].v = 0; });
    room.setAttribute('opacity', 0); wigG.setAttribute('opacity', 0); cue3.setAttribute('opacity', 0); $('spotTop').setAttribute('opacity', 0); $('spotCone').setAttribute('opacity', 1); $('wigBack').setAttribute('opacity', 1);
    wigG.setAttribute('transform', 'translate(380 404) scale(0.5)');
  };
  /* ===== interaction four: the camera moves to the face, a woman in a white dress appears at the right; drag the head onto her; she walks away ===== */
  var st4 = { on: false, t0: 0, drag: false, touched: false, attached: false, attachT: 0, walk: false, v: 0, phase: 0, done: false, q0: null, h0: null, lastStep: 0 };
  var wm = { x: 1800, y: 290, s: 0.84 }, headHit = $('headHit'), cue4 = $('cue4'), cue4Dots = [], cue4Ring, cue4Dot;
  (function () { for (var i = 0; i < 6; i++) cue4Dots.push(mk('circle', { r: 8 - i, fill: '#fff', 'fill-opacity': 0.4 - i * 0.06 }, cue4)); cue4Ring = mk('circle', { r: 19, fill: 'rgba(255,255,255,0.16)', stroke: '#fff', 'stroke-width': 2.6, 'stroke-opacity': 0.9 }, cue4); cue4Dot = mk('circle', { r: 3.8, fill: '#fff' }, cue4); })();
  function neckPt() { return { x: wm.x, y: wm.y + (-10 + 16) * wm.s }; }
  function startStage4(now) {
    st4.on = true; st4.t0 = now; c3.x.t = -285; c3.y.t = 0; c3.s.t = 1.28;
    sweep(200, 1000, 1.4, 0.25, 0.8);
  }
  headHit.addEventListener('pointerdown', function (e) {
    if (!st4.on || st4.attached || performance.now() - st4.t0 < 1800) return;
    initAudio(); var q = rootPt(e); st4.drag = true; st4.touched = true; st4.q0 = q; st4.h0 = { x: hd.x.t, y: hd.y.t };
    hd.s.t = 0.7; try { headHit.setPointerCapture(e.pointerId); } catch (err) {} headHit.style.cursor = 'grabbing'; sweep(400, 1500, 0.3, 0.26, 0.9); e.stopPropagation(); e.preventDefault();
  });
  headHit.addEventListener('pointermove', function (e) {
    if (!st4.drag) return; var q = rootPt(e), cs = camScale();
    hd.x.t = st4.h0.x + (q.x - st4.q0.x) / cs; hd.y.t = st4.h0.y + (q.y - st4.q0.y) / cs; e.stopPropagation();
  });
  function headRelease() {
    if (!st4.drag) return; st4.drag = false; headHit.style.cursor = 'grab';
    var chin = headPtWith(800, 628, hd.x.t, hd.y.t, hd.s.t), N = neckPt();
    if (Math.hypot(chin.x - N.x, chin.y - N.y) < 230) { st4.attached = true; st4.attachT = performance.now(); hd.s.t = 0.4; thud(); sweep(1800, 300, 0.5, 0.25, 0.9); }
    else { hd.x.t = 0; hd.y.t = 0; hd.s.t = 1; }
  }
  headHit.addEventListener('pointerup', headRelease); headHit.addEventListener('pointercancel', headRelease);
  function step() { if (!AC || !soundOn) return; var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.1); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2); }
  function stage4Frame(now, dt) {
    var sec = (now - st4.t0) / 1000;
    $('room').setAttribute('transform', 'translate(' + (-300 * ease(sec / 1.6)).toFixed(1) + ' 0)');
    if (!st4.walk) wm.x = 1800 - 470 * ease((sec - 0.8) / 1.4);
    var bob = 0, sw = 0;
    if (st4.attached && !st4.walk && now - st4.attachT > 1300) { st4.walk = true; }
    if (st4.walk && !st4.done) {
      st4.v = Math.min(340, st4.v + 230 * dt); wm.x += st4.v * dt; st4.phase += st4.v * dt / 40;
      bob = -7 * Math.abs(Math.sin(st4.phase)); sw = Math.sin(st4.phase);
      if (Math.floor(st4.phase / Math.PI) !== st4.lastStep) { st4.lastStep = Math.floor(st4.phase / Math.PI); step(); }
      if (wm.x > 1960 && !st4.done) { st4.done = true; st4.endT = now; $('bye').classList.add('show'); }
    }
    $('woman').setAttribute('transform', 'translate(' + wm.x.toFixed(1) + ' ' + (wm.y + bob).toFixed(1) + ') scale(' + wm.s + ')');
    $('wArmL').setAttribute('transform', 'rotate(' + (-13 * sw).toFixed(2) + ' -82 58)'); $('wArmR').setAttribute('transform', 'rotate(' + (13 * sw).toFixed(2) + ' 82 58)');
    $('wSkirt').setAttribute('transform', 'translate(0 190) skewX(' + (-3 * sw).toFixed(2) + ') translate(0 -190)');
    $('spotW').setAttribute('transform', 'translate(' + (wm.x - 1330).toFixed(1) + ' 0)'); $('spotW').setAttribute('opacity', (0.9 * clamp((sec - 0.8) / 1.2, 0, 1)).toFixed(3));
    var cs = camScale();
    if (st4.attached) {
      var N = neckPt(); N.y += bob; var p0 = headPtWith(800, 628, 0, 0, 0.4), hx = (N.x - p0.x) / cs, hy = (N.y - p0.y) / cs;
      hd.x.t = hx; hd.y.t = hy; hd.s.t = 0.4;
      if (now - st4.attachT > 800) { hd.x.x = hx; hd.y.x = hy; hd.x.v = hd.y.v = 0; }
    }
    ['x', 'y', 's'].forEach(function (kk) { stepSp(hd[kk], dt); });
    window.__applyBall();
    var lifted = Math.min(1, Math.hypot(hd.x.x, hd.y.x) / 40 + Math.abs(1 - hd.s.x) * 3);
    $('contact').setAttribute('opacity', (0.6 * (1 - lifted)).toFixed(3));
    var c = headPt(800, 440);
    headHit.setAttribute('cx', c.x.toFixed(1)); headHit.setAttribute('cy', c.y.toFixed(1)); headHit.setAttribute('r', (st4.attached || sec < 1.8 ? 0 : 175 * camK() * hd.s.x * cs).toFixed(1));
    headHit.setAttribute('pointer-events', st4.attached || sec < 1.8 ? 'none' : 'all');
    $('spotTop').setAttribute('transform', 'translate(' + (c.x - 1050).toFixed(1) + ' 0)');
    var showCue = !st4.touched && sec > 2.8;
    cue4.setAttribute('opacity', showCue ? 1 : 0);
    if (showCue) {
      var ph = ((now - st4.t0) % 4400) / 4400, f = clamp((ph - 0.12) / 0.62, 0, 1), N2 = neckPt();
      var pos = function (g) { var ee = ease(clamp(g, 0, 1)); return [c.x + (N2.x - c.x) * ee, c.y + (N2.y + 60 - c.y) * ee - 90 * Math.sin(Math.PI * ee)]; };
      var pp = pos(f), i2; for (i2 = 0; i2 < cue4Dots.length; i2++) { var q2 = pos(f - i2 * 0.025); cue4Dots[i2].setAttribute('cx', q2[0].toFixed(1)); cue4Dots[i2].setAttribute('cy', q2[1].toFixed(1)); }
      cue4Ring.setAttribute('cx', pp[0].toFixed(1)); cue4Ring.setAttribute('cy', pp[1].toFixed(1)); cue4Dot.setAttribute('cx', pp[0].toFixed(1)); cue4Dot.setAttribute('cy', pp[1].toFixed(1));
      cue4.setAttribute('opacity', (ph < 0.08 ? ph / 0.08 : ph > 0.85 ? (1 - ph) / 0.15 : 1).toFixed(2));
    }
  }
  window.__reset4 = function () {
    st4 = { on: false, t0: 0, drag: false, touched: false, attached: false, attachT: 0, walk: false, v: 0, phase: 0, done: false, q0: null, h0: null, lastStep: 0 };
    wm.x = 1800; hd.x.x = hd.x.t = hd.y.x = hd.y.t = 0; hd.x.v = hd.y.v = hd.s.v = 0; hd.s.x = hd.s.t = 1; window.__applyBall();
    $('woman').setAttribute('transform', 'translate(1800 290) scale(0.84)'); $('spotW').setAttribute('opacity', 0); $('room').removeAttribute('transform'); $('contact').setAttribute('opacity', 0.6); $('spotTop').removeAttribute('transform');
    headHit.setAttribute('r', 0); headHit.setAttribute('pointer-events', 'none'); cue4.setAttribute('opacity', 0);
    $('bye').classList.remove('show'); $('ball').removeAttribute('opacity'); $('woman').removeAttribute('opacity');
  };
  $('byeBtn').addEventListener('click', function () { if (window.__clayReset) window.__clayReset(); });
  function audioTick(now) {
    if (!AC || !gN) return;
    if (stage >= 2) {
      var dv = pressed && now - lastT < 90 ? dragVel : 0, sq = clamp(dv / 1.1, 0, 1), t2 = AC.currentTime;
      gN.gain.setTargetAtTime(sq * 0.34 * (0.8 + 0.2 * Math.sin(now / 55)), t2, 0.04); bp.frequency.setTargetAtTime(150 + sq * 480, t2, 0.05); bp.Q.setTargetAtTime(2.6, t2, 0.05);
      return;
    }
    var sp = Math.abs(omega); if (pressed && !morph.active && now - lastT > 100) sp = 0;
    var s1 = clamp(sp / 12, 0, 1), t = AC.currentTime, pulse = 0.78 + 0.22 * Math.sin(yaw * 2.0);
    gN.gain.setTargetAtTime(Math.pow(s1, 1.25) * 0.55 * pulse, t, 0.05);
    bp.frequency.setTargetAtTime(220 + s1 * 2100, t, 0.06);
  }

  var tPrev = performance.now(), stone = $('stoneLight');
  $('contact').setAttribute('cy', CY + R - 2);
  function frame(now) {
    var dt = Math.min(0.05, (now - tPrev) / 1000); tPrev = now;
    if (!pressed || morph.active) { yaw += omega * dt; omega *= Math.exp(-(morph.active ? 0.22 : 1.25) * dt); if (Math.abs(omega) < 0.01) omega = 0; }
    if (morph.active || (morph.done && morph.m < 1)) {
      var mt = now - morph.t0, zin = 1.35, z;
      function eio(x) { x = clamp(x, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
      if (mt < 750) z = 1 + zin * eio(mt / 750); else if (mt < 3450) z = 1 + zin + 0.06 * (mt - 750) / 2700; else z = 1 + (zin + 0.06) * (1 - eio((mt - 3450) / 900));
      morph.m = eio((mt - 2650) / 850);
      var k = window.__clayScale || 1, cyb = 630 - R * k;
      $('cam').setAttribute('transform', 'translate(800 ' + cyb.toFixed(1) + ') scale(' + z.toFixed(4) + ') translate(-800 -' + cyb.toFixed(1) + ')');
      setOutline(morph.m);
      if (!morph.s1) { morph.s1 = true; sweep(260, 2600, 0.55, 0.7, 1.1); }
      if (!morph.s1b && mt > 1500) { morph.s1b = true; sweep(500, 3000, 1.2, 0.45, 1.0); }
      if (!morph.s2 && mt > 3350) { morph.s2 = true; sweep(2400, 260, 0.9, 0.6, 1.0); }
      if (!morph.s3 && mt > 4200) { morph.s3 = true; thud(); }
      var keep = (1 - morph.m).toFixed(3);
      ['lumps', 'grooves', 'dimples', 'grit', 'drops'].forEach(function (id) { $(id).setAttribute('opacity', keep); });
      $('faceform').setAttribute('opacity', morph.m.toFixed(3));
      if (mt > 4350) { morph.active = false; morph.done = true; morph.m = 1; $('cam').removeAttribute('transform'); setOutline(1); }
    }
    if (morph.m < 1) updateMarks();
    audioTick(now);
    if (morph.done && stage === 0 && !pend) { pend = true; setTimeout(function () { stage = 2; dark.t = 1; st2.t0 = performance.now(); }, 1000); }
    if (Math.abs(dark.t - dark.v) > 0.0008) { dark.v += (dark.t - dark.v) * (1 - Math.exp(-1.6 * dt)); window.__bgDark = dark.v; if (window.__bgRefresh) window.__bgRefresh(); }
    if (stage >= 2) stage2Frame(now, dt);

    /* the patch of light: sweeps left to right across the clay, pauses, repeats, until the first drag */
    if (dragged) stoneFade = Math.max(0, stoneFade - dt * 1.8);
    var cyc = ((now - stoneT0) / 1000) % 3.6, tt = clamp(cyc / 2.5, 0, 1), sx = CX + (-1.05 + 2.1 * ease(tt)) * R;
    var lim = Math.sin(Math.PI * tt);
    stone.setAttribute('cx', sx.toFixed(1)); stone.setAttribute('cy', (CY - 0.05 * R + Math.sin(tt * 3.14) * -0.1 * R).toFixed(1));
    stone.setAttribute('transform', 'rotate(-18 ' + sx.toFixed(1) + ' ' + CY + ')');
    stone.setAttribute('opacity', (stoneFade * (tt >= 1 ? 0 : 0.35 + 0.65 * lim)).toFixed(3));

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* fixed settings: the studies' Tools panel defaults, plus the sound toggle */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var BG = '#2563ff';
  function hex2rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
  function rgb2hex(c) { return '#' + c.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  function hex2hsl(h) {
    var c = hex2rgb(h).map(function (v) { return v / 255; }), mx = Math.max.apply(null, c), mn = Math.min.apply(null, c), l = (mx + mn) / 2, d = mx - mn, hu = 0, sa = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d) { if (mx === c[0]) hu = ((c[1] - c[2]) / d) % 6; else if (mx === c[1]) hu = (c[2] - c[0]) / d + 2; else hu = (c[0] - c[1]) / d + 4; hu *= 60; if (hu < 0) hu += 360; }
    return [hu, sa * 100, l * 100];
  }
  function hsl2hex(h, sa, l) {
    sa /= 100; l /= 100; var a = sa * Math.min(l, 1 - l);
    function f(n) { var k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }
    return rgb2hex([f(0) * 255, f(8) * 255, f(4) * 255]);
  }
  /* the background darkens while the face is sculpted */
  window.__bgDark = 0;
  function show(h) {
    var d = window.__bgDark || 0, dh = h;
    if (d > 0) { var q = hex2hsl(h); dh = hsl2hex(q[0], q[1] * (1 - 0.12 * d), q[2] * (1 - 0.72 * d)); }
    $('bgrect').setAttribute('fill', dh); document.body.style.background = dh;
  }
  window.__bgRefresh = function () { show(BG); };
  /* feature proportions (eyes, nose, mouth) at the study defaults: width x, length y */
  window.__ft = { e: { x: 1.00, y: 1.38 }, n: { x: 0.85, y: 0.93 }, m: { x: 1.07, y: 1.30 } };
  if (window.__featXf) window.__featXf();
  /* clay size 100% */
  window.__clayScale = 1;
  var t = 'translate(800 630) scale(1) translate(-800 -630)';
  if (window.__applyBall) window.__applyBall(); $('contact').setAttribute('transform', t); $('cue2g').setAttribute('transform', t);
  $('snd').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on); this.textContent = 'Sound: ' + (on ? 'on' : 'off'); if (window.__claySound) window.__claySound(on); });
  show(BG);
})();
