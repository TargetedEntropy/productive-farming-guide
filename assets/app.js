/* Productive Farming field guide: renders the map, tables, index and finder
   from window.PF_DATA (assets/data.js). No dependencies. */
(function () {
  "use strict";

  var D = window.PF_DATA;
  if (!D) return;

  var SVG = "http://www.w3.org/2000/svg";
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (kid) { if (kid) node.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid); });
    return node;
  }
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k]; else node.setAttribute(k, attrs[k]);
    });
    return node;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pct(x) { return Math.round(x * 100) + "%"; }

  var cropById = {};
  D.crops.forEach(function (c) { cropById[c.id] = c; });
  var VANILLA_NAMES = { potato: "Potato", beetroot: "Beetroot", cornflower: "Cornflower" };
  function cropName(id) {
    if (cropById[id]) return cropById[id].name;
    if (VANILLA_NAMES[id]) return VANILLA_NAMES[id];
    var base = id.replace(/_seeds$/, "");
    if (base !== id && cropById[base]) return cropById[base].name + " Seeds";
    return id.replace(/_/g, " ").replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }
  var LEVELS = ["", "Novice", "Apprentice", "Journeyman", "Expert"];
  var FORM_LABEL = {
    field: "Ground crop", grain: "Grain", tall: "Tall crop", water: "Water crop", herb: "Herb", bush: "Berry bush",
    trellis: "Fence-post crop", climber: "Fence-post climber", vine: "Fence-post vine", melon: "Melon", shroom: "Mushroom"
  };

  /* ---- meta ------------------------------------------------------------ */
  var modShort = D.meta.modVersion.split("-").pop();
  $$("[data-meta]").forEach(function (n) {
    var key = n.getAttribute("data-meta");
    if (key === "modShort") n.textContent = modShort;
    else if (key === "jar") n.textContent = "productivefarming-" + D.meta.modVersion + ".jar";
    else if (D.meta[key]) n.textContent = D.meta[key];
  });
  $$("[data-count]").forEach(function (n) { n.textContent = D.counts[n.getAttribute("data-count")]; });

  /* ---- theme ----------------------------------------------------------- */
  (function () {
    var btn = $("#theme-toggle");
    var label = $("[data-theme-label]", btn);
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    function current() {
      var set = document.documentElement.getAttribute("data-theme");
      return set || (mq.matches ? "dark" : "light");
    }
    function paint() {
      var dark = current() === "dark";
      btn.setAttribute("aria-pressed", String(dark));
      label.textContent = dark ? "Day map" : "Night map";
      btn.setAttribute("aria-label", dark ? "Switch to the day map (light theme)" : "Switch to the night map (dark theme)");
    }
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("pf-theme", next); } catch (e) { /* private mode */ }
      paint();
    });
    if (mq.addEventListener) mq.addEventListener("change", paint);
    paint();
  })();

  /* ---- contents rail --------------------------------------------------- */
  (function () {
    var rail = $("#rail"), toggle = $("#contents-toggle");
    function close() { rail.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    toggle.addEventListener("click", function () {
      var open = rail.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    rail.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && rail.classList.contains("is-open")) { close(); toggle.focus(); }
    });
    var links = {};
    $$("a", rail).forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].removeAttribute("aria-current"); });
        var a = links[entry.target.id];
        if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    $$(".sec").forEach(function (s) { io.observe(s); });
  })();

  /* ---- block diagrams -------------------------------------------------- */
  $$(".blockmap").forEach(function (map) {
    var rows = map.getAttribute("data-map").split("/");
    map.style.setProperty("--cols", rows[0].length);
    map.setAttribute("role", "img");
    map.setAttribute("aria-label", map.getAttribute("data-label"));
    rows.forEach(function (row) {
      row.split("").forEach(function (ch) {
        map.appendChild(el("span", { "class": "cell" + (ch === "." ? "" : " cell--" + ch) }));
      });
    });
  });
  $$(".pips").forEach(function (p) {
    var level = +p.getAttribute("data-level");
    for (var i = 1; i <= 4; i++) p.appendChild(el("i", { "class": i <= level ? "" : "off" }));
  });

  /* ---- small data-driven tables --------------------------------------- */
  (function () {
    var perLevel = {};
    D.crops.forEach(function (c) { if (c.trade) perLevel[c.trade.level] = (perLevel[c.trade.level] || 0) + 1; });
    $$("[data-trade-count]").forEach(function (n) { n.textContent = perLevel[n.getAttribute("data-trade-count")] || 0; });

    $$("[data-form-count]").forEach(function (n) {
      var forms = n.getAttribute("data-form-count").split(",");
      var count = D.crops.filter(function (c) { return !c.vanilla && forms.indexOf(c.form) !== -1; }).length;
      n.textContent = count + " crops";
    });

    var statRows = [
      ["stat_crops", "This mod's crops, vanilla crops, Croptopia, Silent Gear"],
      ["mystical_tier_1", "Mystical Agriculture tier 1 (Inferium, Stone, Dirt, Wood)"],
      ["mystical_tier_2", "Mystical Agriculture tier 2 (Coal, Aluminum, Honey)"],
      ["mystical_tier_3", "Mystical Agriculture tier 3 (Iron, Copper, Glowstone)"],
      ["mystical_tier_4", "Mystical Agriculture tier 4 (Blaze, Enderman, Experience)"],
      ["mystical_tier_5", "Mystical Agriculture tier 5 (Diamond, Emerald, Netherite)"],
      ["mystical_tier_6", "Mystical Agriculture tier 6 (Allthemodium, Nether Star, Unobtainium)"]
    ];
    var statBody = $("#stat-table tbody");
    var maxChance = Math.max.apply(null, statRows.map(function (r) { return D.statChance[r[0]] || 0; }));
    statRows.forEach(function (r) {
      var chance = D.statChance[r[0]];
      if (!chance) return;
      statBody.appendChild(el("tr", null, [
        el("th", { scope: "row", text: r[1] }),
        el("td", { "class": "num", text: pct(chance) }),
        el("td", { "class": "bar-cell" }, [el("span", { "class": "scale", style: "--w:" + (chance / maxChance * 100) + "%" })]),
        el("td", { "class": "num", text: String(Math.round(1 / chance)) })
      ]));
    });

    var mutBody = $("#mutation-table tbody");
    D.mutations.slice().sort(function (a, b) { return cropName(a.result).localeCompare(cropName(b.result)); }).forEach(function (m) {
      mutBody.appendChild(el("tr", null, [
        el("th", { scope: "row", text: cropName(m.result) }),
        el("td", { text: cropName(m.target) }),
        el("td", { text: cropName(m.pollen) + (m.pollenVanilla ? " (vanilla)" : "") }),
        el("td", { "class": "num", text: pct(m.chance) }),
        el("td", { "class": "bar-cell" }, [el("span", { "class": "scale", style: "--w:" + (m.chance * 100) + "%" })]),
        el("td", { "class": "num", text: pct(Math.min(1, m.chance * 3)) })
      ]));
    });

    var loads = [
      ["No upgrades", 0, 0], ["1 Time", 1, 0], ["2 Time", 2, 0], ["4 Time", 4, 0],
      ["2 Time II", 0, 2], ["3 Time II, fourth slot free for Stability", 0, 3], ["3 Time II and 1 Time", 1, 3], ["4 Time II", 0, 4]
    ];
    var cycleBody = $("#cycle-table tbody");
    loads.forEach(function (l) {
      var n = 1 + l[1] + l[2] * 2;
      var ticks = Math.floor(300 * (1 - Math.min(0.93, n * 0.12)) + 1e-6);
      cycleBody.appendChild(el("tr", null, [
        el("th", { scope: "row", text: l[0] }),
        el("td", { "class": "num", text: String(ticks) }),
        el("td", { "class": "num", text: (ticks / 20).toFixed(1) }),
        el("td", { "class": "bar-cell" }, [el("span", { "class": "scale", style: "--w:" + (ticks / 264 * 100) + "%" })])
      ]));
    });

    $("#wall-list").textContent = "Accepted wall blocks: " + D.farm.walls.join(", ").toLowerCase() + ".";
  })();

  $$("table.sign").forEach(function (table) {
    var heads = $$("thead th", table).map(function (th) { return th.textContent; });
    $$("tbody tr", table).forEach(function (tr) {
      Array.prototype.forEach.call(tr.children, function (cell, i) {
        if (cell.tagName === "TD" && !cell.classList.contains("bar-cell")) cell.setAttribute("data-label", heads[i]);
      });
    });
  });

  /* ---- crossbreeding network ------------------------------------------ */
  (function () {
    var map = $("#network-map"), board = $("#board"), figure = $("#network");
    var LINES = {
      corn: { name: "Corn line", c: "var(--l-amber)", on: "var(--on-amber)" },
      roma: { name: "Roma line", c: "var(--l-red)", on: "var(--on-line)" },
      cherry: { name: "Cherry line", c: "var(--l-orange)", on: "var(--on-line)" },
      berry: { name: "Berry line", c: "var(--l-magenta)", on: "var(--on-line)" },
      pepper: { name: "Pepper line", c: "var(--l-green)", on: "var(--on-line)" },
      grape: { name: "Grape line", c: "var(--l-purple)", on: "var(--on-line)" }
    };
    // [id, line, x, y, short label, label position]
    var STOPS = [
      ["yellow_dent_corn", "corn", 170, 70, "Yellow Dent", "above"],
      ["blue_jade_corn", "corn", 350, 70, "Blue Jade", "above"],
      ["black_aztec_corn", "corn", 530, 70, "Black Aztec", "above"],
      ["sugar_pearl_corn", "corn", 710, 70, "Sugar Pearl", "above"],
      ["rainbow_corn", "corn", 890, 70, "Rainbow", "above"],
      ["roma_tomato", "roma", 170, 200, "Roma", "above"],
      ["beefsteak_tomato", "roma", 350, 200, "Beefsteak", "above"],
      ["black_beauty_tomato", "roma", 530, 150, "Black Beauty", "right"],
      ["blue_beauty_tomato", "roma", 530, 200, "Blue Beauty", "right"],
      ["white_wonder_tomato", "roma", 530, 250, "White Wonder", "right"],
      ["red_grape", "grape", 810, 615, "Red", "above"],
      ["concord_grape", "grape", 970, 615, "Concord", "above"],
      ["cotton_candy_grape", "grape", 1130, 615, "Cotton Candy", "above"],
      ["cherry_tomato", "cherry", 170, 330, "Cherry", "above"],
      ["chocolate_pear_tomato", "cherry", 350, 330, "Chocolate Pear", "above"],
      ["yellow_pear_tomato", "cherry", 530, 330, "Yellow Pear", "above"],
      ["sungold_tomato", "cherry", 710, 330, "Sungold", "above"],
      ["raspberry", "berry", 530, 425, "Raspberry", "above"],
      ["golden_raspberry", "berry", 710, 425, "Golden Raspberry", "below"],
      ["miracle_berry", "berry", 890, 425, "Miracle Berry", "above"],
      ["yellow_bell_pepper", "pepper", 170, 545, "Yellow", "above"],
      ["orange_bell_pepper", "pepper", 350, 545, "Orange", "above"],
      ["black_bell_pepper", "pepper", 530, 545, "Black", "below"],
      ["purple_bell_pepper", "pepper", 710, 545, "Purple", "above"],
      ["white_bell_pepper", "pepper", 530, 615, "White", "right"]
    ];
    // feeders: [id, line, x, y, label, into]
    var FEEDS = [
      ["cornflower", "corn", 350, 120, "Cornflower", "blue_jade_corn"],
      ["potato", "roma", 350, 250, "Potato", "beefsteak_tomato"],
      ["beetroot", "cherry", 350, 380, "Beetroot", "chocolate_pear_tomato"],
      ["green_grape", "grape", 970, 665, "Green Grape", "concord_grape"],
      ["goji_berry", "berry", 890, 475, "Goji Berry", "miracle_berry"],
      ["red_bell_pepper", "pepper", 350, 597, "Red", "orange_bell_pepper"],
      ["green_bell_pepper", "pepper", 530, 493, "Green", "black_bell_pepper"]
    ];
    // [line, path, from station, to station]
    var ROUTES = [
      ["corn", "M170 70H350", "yellow_dent_corn", "blue_jade_corn"], ["corn", "M350 70H530", "blue_jade_corn", "black_aztec_corn"],
      ["corn", "M530 70H710", "black_aztec_corn", "sugar_pearl_corn"], ["corn", "M710 70H890", "sugar_pearl_corn", "rainbow_corn"],
      ["roma", "M170 200H350", "roma_tomato", "beefsteak_tomato"], ["roma", "M350 200H530", "beefsteak_tomato", "blue_beauty_tomato"],
      ["roma", "M350 200H440L490 150H530", "beefsteak_tomato", "black_beauty_tomato"],
      ["roma", "M350 200H440L490 250H530", "beefsteak_tomato", "white_wonder_tomato"],
      ["cherry", "M170 330H350", "cherry_tomato", "chocolate_pear_tomato"], ["cherry", "M350 330H530", "chocolate_pear_tomato", "yellow_pear_tomato"],
      ["cherry", "M530 330H710", "yellow_pear_tomato", "sungold_tomato"],
      ["berry", "M530 425H710", "raspberry", "golden_raspberry"], ["berry", "M710 425H890", "golden_raspberry", "miracle_berry"],
      ["pepper", "M170 545H350", "yellow_bell_pepper", "orange_bell_pepper"], ["pepper", "M350 545H530", "orange_bell_pepper", "black_bell_pepper"],
      ["pepper", "M530 545H710", "black_bell_pepper", "purple_bell_pepper"],
      ["pepper", "M350 545H420L490 615H530", "orange_bell_pepper", "white_bell_pepper"],
      ["grape", "M810 615H970", "red_grape", "concord_grape"], ["grape", "M970 615H1130", "concord_grape", "cotton_candy_grape"]
    ];
    var LINE_ORDER = ["corn", "roma", "cherry", "berry", "pepper", "grape"];
    var TAGS = [["corn", 26, 70, "CORN"], ["roma", 26, 200, "ROMA"], ["grape", 706, 615, "GRAPE"], ["cherry", 26, 330, "CHERRY"],
      ["berry", 404, 425, "BERRY"], ["pepper", 26, 545, "PEPPER"]];

    var stopById = {};
    STOPS.forEach(function (s) { stopById[s[0]] = s; });
    FEEDS.forEach(function (s) { stopById[s[0]] = s; });
    var recipesFor = {};
    D.mutations.forEach(function (m) { (recipesFor[m.result] = recipesFor[m.result] || []).push(m); });

    var gRoutes = svg("g"), gStops = svg("g");
    ROUTES.forEach(function (r, i) {
      var p = svg("path", { d: r[1], "class": "m-route", "data-a": r[2], "data-b": r[3] });
      p.style.setProperty("--c", LINES[r[0]].c);
      p.style.setProperty("--i", LINE_ORDER.indexOf(r[0]) + (i % 4) * 0.6);
      gRoutes.appendChild(p);
    });
    FEEDS.forEach(function (f) {
      var into = stopById[f[5]];
      var p = svg("path", { d: "M" + f[2] + " " + f[3] + "L" + into[2] + " " + into[3], "class": "m-feed", "data-a": f[0], "data-b": f[5] });
      p.style.setProperty("--c", LINES[f[1]].c);
      gRoutes.appendChild(p);
    });
    // transfer: Sungold feeds the berry line
    gRoutes.appendChild(svg("path", { d: "M710 330V425", "class": "m-link", "data-a": "sungold_tomato", "data-b": "golden_raspberry" }));
    gRoutes.appendChild(svg("path", { d: "M710 330V425", "class": "m-link-in", "data-a": "sungold_tomato", "data-b": "golden_raspberry" }));
    map.appendChild(gRoutes);

    TAGS.forEach(function (t) {
      var width = t[3].length * 10 + 22;
      var g = svg("g", { "class": "m-tag", "data-line": t[0], "aria-hidden": "true" });
      var rect = svg("rect", { x: t[1], y: t[2] - 12, width: width, height: 24, rx: 12, "class": "m-line-bg" });
      rect.style.setProperty("--c", LINES[t[0]].c);
      var text = svg("text", { x: t[1] + width / 2, y: t[2] + 5, "text-anchor": "middle", "class": "m-line", text: t[3] });
      text.style.setProperty("--on", LINES[t[0]].on);
      g.appendChild(rect); g.appendChild(text);
      map.appendChild(g);
    });

    function addStop(s, feeder, order) {
      var id = s[0], line = LINES[s[1]], x = s[2], y = s[3], label = s[4];
      var crop = cropById[id];
      var recipes = recipesFor[id];
      var g = svg("g", { "class": "m-stop", tabindex: "0", role: "button", "aria-pressed": "false", "data-id": id, "data-line": s[1] });
      g.style.setProperty("--c", line.c);
      g.style.setProperty("--o", order);
      var say = cropName(id) + ". " + (recipes ? "Mutation, " + pct(recipes[0].chance) + " base chance." : (crop && crop.trade ? "Sold by " + LEVELS[crop.trade.level].toLowerCase() + " farmers." : "Vanilla pollen donor."));
      g.setAttribute("aria-label", say);
      g.appendChild(svg("circle", { cx: x, cy: y, r: feeder ? 15 : 22, "class": "halo" }));
      g.appendChild(svg("circle", { cx: x, cy: y, r: 22, fill: "transparent" }));
      if (id === "sungold_tomato" || id === "golden_raspberry") g.appendChild(svg("circle", { cx: x, cy: y, r: 15.5, "class": "dot-x" }));
      if (feeder && (!crop || crop.vanilla)) {
        g.appendChild(svg("rect", { x: x - 6, y: y - 6, width: 12, height: 12, "class": "dot-feed" }));
      } else if (recipes) {
        g.appendChild(svg("circle", { cx: x, cy: y, r: 10.5, "class": "dot-mut" }));
        g.appendChild(svg("circle", { cx: x, cy: y, r: 4, "class": "dot-in" }));
      } else {
        g.appendChild(svg("circle", { cx: x, cy: y, r: feeder ? 6 : 8.5, "class": "dot-buy" }));
      }
      var chance = recipes ? pct(recipes[0].chance) : "";
      if (feeder) {
        g.appendChild(svg("text", { x: x + 16, y: y + 5, "class": "m-feedname", text: label }));
      } else if (s[5] === "right") {
        var t = svg("text", { x: x + 20, y: y + 5, "class": "m-name" });
        t.appendChild(svg("tspan", { text: label }));
        if (chance) t.appendChild(svg("tspan", { dx: 8, "class": "m-chance", text: chance }));
        g.appendChild(t);
      } else if (s[5] === "below") {
        g.appendChild(svg("text", { x: x, y: y + 34, "text-anchor": "middle", "class": "m-name", text: label }));
        if (chance) g.appendChild(svg("text", { x: x + 16, y: y - 12, "class": "m-chance", text: chance }));
      } else {
        g.appendChild(svg("text", { x: x, y: y - 22, "text-anchor": "middle", "class": "m-name", text: label }));
        if (chance) g.appendChild(svg("text", { x: x + 15, y: y + 25, "class": "m-chance", text: chance }));
      }
      gStops.appendChild(g);
    }
    STOPS.forEach(function (s, i) { addStop(s, false, i); });
    FEEDS.forEach(function (s, i) { addStop(s, true, STOPS.length + i); });
    map.appendChild(gStops);

    $$(".m-route", map).forEach(function (p) { p.style.setProperty("--len", Math.ceil(p.getTotalLength())); });

    var state = { id: "rainbow_corn", mutability: 0, duster: false, touched: false };

    function how(id) {
      var crop = cropById[id];
      if (recipesFor[id]) return "mutation, earlier on the map";
      if (crop && crop.trade) return LEVELS[crop.trade.level] + " farmer, " + crop.trade.cost + (crop.trade.cost > 1 ? " emeralds" : " emerald") + " for " + crop.trade.count;
      if (id === "cornflower") return "vanilla flower";
      return "vanilla crop";
    }
    function chain(id, seen) {
      seen = seen || {};
      if (seen[id]) return [];
      seen[id] = true;
      var out = [];
      (recipesFor[id] || []).slice(0, 1).forEach(function (m) {
        [m.target, m.pollen].forEach(function (p) { chain(p, seen).forEach(function (x) { if (out.indexOf(x) === -1) out.push(x); }); });
      });
      out.push(id);
      return out;
    }
    function related(id) {
      var ids = {};
      if (recipesFor[id]) { chain(id).forEach(function (x) { ids[x] = true; }); return ids; }
      ids[id] = true;
      D.mutations.forEach(function (m) {
        if (m.target === id || m.pollen === id) { ids[m.result] = true; ids[m.target] = true; ids[m.pollen] = true; }
      });
      return ids;
    }

    function renderBoard() {
      var id = state.id, stop = stopById[id], line = LINES[stop[1]], crop = cropById[id];
      var recipes = recipesFor[id];
      var html = '<div class="board__head"><h3><i class="linedot" style="--c:' + line.c + '" aria-hidden="true"></i>' + esc(cropName(id)) + "</h3>" +
        '<span class="board__how">' + esc(line.name) + "</span></div>";
      if (recipes) {
        var m = recipes[0];
        var siblings = D.mutations.filter(function (x) { return x.target === m.target && x.pollen === m.pollen; }).length;
        var chance = Math.min(1, m.chance * (1 + 0.5 * state.mutability) * (state.duster ? 5 : 1));
        html += "<dl>" +
          "<dt>Pollinate</dt><dd>" + esc(cropName(m.target)) + '<span class="board__how">' + esc(how(m.target)) + "</span></dd>" +
          "<dt>With</dt><dd>" + esc(cropName(m.pollen)) + '<span class="board__how">' + esc(how(m.pollen)) + "</span></dd>" +
          "<dt>Base</dt><dd class=\"mono\">" + pct(m.chance) + " per attempt</dd></dl>";
        html += '<div class="board__ctl"><div class="stepper"><span class="stepper__label" id="mut-label">Mutability of the target</span><div class="seg" role="group" aria-labelledby="mut-label">';
        ["None", "Low", "Med", "High", "V. High"].forEach(function (name, i) {
          html += '<button type="button" data-mut="' + i + '" aria-pressed="' + (state.mutability === i) + '">' + name + "</button>";
        });
        html += '</div></div><label class="check"><input type="checkbox" id="duster"' + (state.duster ? " checked" : "") + "> Crop Duster bee</label></div>";
        html += '<div class="meter" style="--c:' + line.c + '"><div class="meter__val">' + pct(chance) +
          "<small>" + (chance >= 1 ? "Certain on the next attempt" : "About " + Math.ceil(1 / chance) + " attempts on average") +
          (siblings > 1 ? ". Each attempt first picks one of " + siblings + " outcomes" : "") + ".</small></div>" +
          '<div class="meter__track" role="img" aria-label="Chance per attempt ' + pct(chance) + '"><div class="meter__fill" style="--w:' + (chance * 100) + '%"></div></div></div>';
        var route = chain(id).map(function (x) { return x === id ? "<b>" + esc(cropName(x)) + "</b>" : esc(cropName(x)); });
        html += '<p class="board__route">Everything you need, in order: ' + route.join(", ") + ".</p>";
      } else {
        var uses = D.mutations.filter(function (x) { return x.target === id || x.pollen === id; });
        html += '<div class="board__wide"><dl><dt>Source</dt><dd>' + esc(how(id).replace(/^./, function (c) { return c.toUpperCase(); })) + "</dd></dl>";
        if (uses.length) {
          html += '<p class="board__route">Used in ' + uses.length + (uses.length > 1 ? " crosses: " : " cross: ") + uses.map(function (u) {
            return "<b>" + esc(cropName(u.result)) + "</b> (as " + (u.target === id ? "target" : "pollen") + ")";
          }).join(", ") + ".</p>";
        }
        if (crop && crop.trade) html += '<p class="board__route">Buy it, plant it beside a hive, and add the partner crop within four blocks.</p>';
        html += "</div>";
      }
      board.innerHTML = html;
    }

    function paintMap() {
      var keep = related(state.id);
      var lines = {};
      $$(".m-stop", map).forEach(function (g) {
        var id = g.getAttribute("data-id");
        g.setAttribute("aria-pressed", String(id === state.id));
        g.classList.toggle("m-dim", state.touched && !keep[id]);
        if (keep[id]) lines[g.getAttribute("data-line")] = true;
      });
      $$("[data-a]", map).forEach(function (n) {
        n.classList.toggle("m-dim", state.touched && !(keep[n.getAttribute("data-a")] && keep[n.getAttribute("data-b")]));
      });
      $$(".m-tag", map).forEach(function (n) { n.classList.toggle("m-dim", state.touched && !lines[n.getAttribute("data-line")]); });
    }
    function select(id) { state.id = id; renderBoard(); paintMap(); }

    map.addEventListener("click", function (e) {
      var g = e.target.closest(".m-stop");
      if (g) { state.touched = true; select(g.getAttribute("data-id")); }
      else if (state.touched) { state.touched = false; paintMap(); }
    });
    map.addEventListener("keydown", function (e) {
      var g = e.target.closest && e.target.closest(".m-stop");
      if (!g) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); state.touched = true; select(g.getAttribute("data-id")); }
    });
    board.addEventListener("click", function (e) {
      var b = e.target.closest("[data-mut]");
      if (!b) return;
      state.mutability = +b.getAttribute("data-mut");
      renderBoard();
      var again = $('[data-mut="' + state.mutability + '"]', board);
      if (again) again.focus();
    });
    board.addEventListener("change", function (e) {
      if (e.target.id !== "duster") return;
      state.duster = e.target.checked;
      renderBoard();
      $("#duster", board).focus();
    });

    var scroller = $(".network__scroll");
    if (scroller.scrollWidth > scroller.clientWidth + 4) state.id = "blue_jade_corn";
    select(state.id);
    figure.classList.add("is-drawing");
    window.setTimeout(function () { figure.classList.remove("is-drawing"); }, 4200);
  })();

  /* ---- flowers --------------------------------------------------------- */
  (function () {
    function rgb(hex) { var v = parseInt(hex.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }
    function hex(c) { return "#" + c.map(function (x) { return ("0" + Math.round(x).toString(16)).slice(-2); }).join(""); }
    function nearest(color) {
      var t = rgb(color), best = null, bestD = Infinity;
      D.dyes.forEach(function (d) {
        var c = rgb(d.hex), dist = Math.pow(c[0] - t[0], 2) + Math.pow(c[1] - t[1], 2) + Math.pow(c[2] - t[2], 2);
        if (dist < bestD) { bestD = dist; best = d; }
      });
      return best;
    }
    var groups = [
      ["Wild flowers", function (f) { return f.wild; }],
      ["Recolourable vanilla flowers", function (f) { return !f.wild && !f.vine; }],
      ["Flowering vines", function (f) { return f.vine; }]
    ];
    var host = $("#flower-groups");
    groups.forEach(function (g) {
      var members = D.flowers.filter(g[1]);
      var list = el("ul", { "class": "flowers" });
      members.forEach(function (f) {
        var disc = el("i", { "class": "disc", "aria-hidden": "true" });
        disc.style.setProperty("--c", f.color);
        var dye = f.dye + " dye" + (f.tall ? ", two per flower" : "") + (f.dyenamics ? ". Dyenamics" : "");
        list.appendChild(el("li", null, [disc, el("b", { text: f.name }), el("span", { text: dye })]));
      });
      host.appendChild(el("div", { "class": "flower-group" }, [
        el("h3", null, [g[0], el("span", { "class": "tally", text: String(members.length) })]), list
      ]));
    });

    var a = $("#blend-a"), b = $("#blend-b"), out = $("#blend-out");
    D.flowers.forEach(function (f, i) {
      a.appendChild(el("option", { value: i, text: f.name }));
      b.appendChild(el("option", { value: i, text: f.name }));
    });
    function pick(sel, id) { D.flowers.forEach(function (f, i) { if (f.id === id) sel.value = i; }); }
    pick(a, "poppy"); pick(b, "dandelion");
    function paint() {
      var fa = D.flowers[+a.value], fb = D.flowers[+b.value];
      var ca = rgb(fa.color), cb = rgb(fb.color);
      out.textContent = "";
      [0.3, 0.4, 0.5, 0.6, 0.7].forEach(function (t) {
        var mix = hex([0, 1, 2].map(function (i) { return ca[i] * (1 - t) + cb[i] * t; }));
        var dye = nearest(mix);
        var disc = el("i", { "class": "disc", "aria-hidden": "true" });
        disc.style.setProperty("--c", mix);
        out.appendChild(el("li", null, [disc, el("b", { text: dye.name }), el("span", { "class": "mono", text: mix })]));
      });
    }
    a.addEventListener("change", paint); b.addEventListener("change", paint);
    paint();
  })();

  /* ---- chips helper ---------------------------------------------------- */
  function chipGroup(host, options, onChange) {
    var value = options[0].value;
    options.forEach(function (o) {
      var btn = el("button", { type: "button", "class": "chip", "aria-pressed": String(o.value === value), "data-value": o.value }, [
        o.label, o.count !== undefined ? el("span", { "class": "mono", text: String(o.count) }) : null
      ]);
      host.appendChild(btn);
    });
    host.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      value = btn.getAttribute("data-value");
      $$(".chip", host).forEach(function (c) { c.setAttribute("aria-pressed", String(c === btn)); });
      onChange(value);
    });
  }
  function emptyState(query, reset) {
    var li = el("li", { "class": "empty" }, [
      el("b", { text: "Nothing matches" + (query ? " “" + query + "”" : "") + "." }),
      "Check the spelling, try a shorter word, or ",
      reset
    ]);
    return li;
  }

  /* ---- crop index ------------------------------------------------------ */
  (function () {
    var list = $("#crop-list"), q = $("#crop-q"), status = $("#crop-status"), moreBtn = $("#crop-more");
    var CAP = 30, showAll = false;
    var filter = { form: "all", source: "all" };
    var GROUPS = [
      ["all", "All"], ["field", "Ground"], ["grain", "Grain"], ["tall", "Tall"], ["water", "Water"], ["herb", "Herb"],
      ["bush", "Berry"], ["fence", "Fence post"], ["melon", "Melon"], ["shroom", "Mushroom"]
    ];
    function group(c) { return c.form === "trellis" || c.form === "climber" || c.form === "vine" ? "fence" : c.form; }
    function source(c) { return c.vanilla ? "vanilla" : c.mutated ? "cross" : c.trade ? "l" + c.trade.level : "other"; }
    function mark(c) {
      var s = svg("svg", { viewBox: "0 0 20 20", "class": "mark", "aria-hidden": "true" });
      if (c.vanilla) s.appendChild(svg("rect", { x: 5, y: 5, width: 10, height: 10, "class": "mk-feed" }));
      else if (c.mutated) { s.appendChild(svg("circle", { cx: 10, cy: 10, r: 7.5, "class": "mk-mut" })); s.appendChild(svg("circle", { cx: 10, cy: 10, r: 3, "class": "mk-in" })); }
      else s.appendChild(svg("circle", { cx: 10, cy: 10, r: 6, "class": "mk-buy" }));
      return s;
    }
    function pips(level) {
      var p = el("span", { "class": "pips", "aria-hidden": "true" });
      for (var i = 1; i <= 4; i++) p.appendChild(el("i", { "class": i <= level ? "" : "off" }));
      return p;
    }

    chipGroup($("#crop-forms"), GROUPS.map(function (g) {
      return { value: g[0], label: g[1], count: g[0] === "all" ? D.crops.length : D.crops.filter(function (c) { return group(c) === g[0]; }).length };
    }), function (v) { filter.form = v; render(); });
    chipGroup($("#crop-sources"), [["all", "All"], ["l1", "Novice"], ["l2", "Apprentice"], ["l3", "Journeyman"], ["l4", "Expert"], ["cross", "Cross only"], ["vanilla", "Vanilla"]].map(function (s) {
      return { value: s[0], label: s[1], count: s[0] === "all" ? undefined : D.crops.filter(function (c) { return source(c) === s[0]; }).length };
    }), function (v) { filter.source = v; render(); });

    var mutByResult = {};
    D.mutations.forEach(function (m) { mutByResult[m.result] = m; });

    function planterText(c) {
      if (!c.planter) return c.form === "shroom" ? "Not a planter crop. Grows on a composter" : "No planter recipe";
      return c.planter.map(function (d) {
        return (d.chance < 1 ? pct(d.chance) + " chance of " : "") + (d.min === d.max ? d.min : d.min + " to " + d.max) + " " + cropName(d.item);
      }).join(", plus ");
    }
    function sourceText(c) {
      if (c.vanilla) return ["Vanilla crop", "gains traits from this mod"];
      if (c.mutated) { var m = mutByResult[c.id]; return ["Cross only", cropName(m.target) + " with " + cropName(m.pollen)]; }
      if (c.trade) return [LEVELS[c.trade.level] + " farmer", c.trade.cost + (c.trade.cost > 1 ? " emeralds" : " emerald") + " for " + c.trade.count];
      return ["Unknown", ""];
    }
    function row(c) {
      var src = sourceText(c);
      var summary = el("summary", null, [
        mark(c),
        el("span", { "class": "nm" }, [c.name, c.latin ? el("span", { "class": "lat", text: c.latin }) : null]),
        el("span", { "class": "col col--form", text: FORM_LABEL[c.form] }),
        el("span", { "class": "col" }, [c.trade ? pips(c.trade.level) : null, src[0], el("small", { text: src[1] })]),
        el("span", { "class": "col col--food", text: c.food ? "Food " + c.food[0] : "Not food" })
      ]);
      var facts = [];
      function fact(k, v) { facts.push(el("div", null, [el("dt", { text: k }), el("dd", { text: v })])); }
      fact("Form", FORM_LABEL[c.form]);
      if (!c.vanilla) fact("You plant", c.hasSeed ? c.plant : "The crop itself, there is no separate seed");
      fact("AgriTech: Evolved planter gives", planterText(c));
      if (c.food) fact("Eating it restores", c.food[0] + (c.food[0] === 1 ? " hunger point" : " hunger points") + ", saturation modifier " + c.food[1]);
      if (c.villages.length) fact("Found in village farms", c.villages.map(function (v) { return v.charAt(0).toUpperCase() + v.slice(1); }).join(", "));
      if (c.kitchen.length) fact("Shared item tags", c.kitchen.join(", "));
      var store = [c.crate ? "Crate (9 produce)" : null, c.bag ? "Seed bag (9 seeds)" : null].filter(Boolean);
      if (store.length) fact("Storage blocks", store.join(", "));
      if (c.startTraits && c.startTraits.yield) fact("Starting traits", "Yield starts at High");
      var parentOf = D.mutations.filter(function (m) { return m.target === c.id || m.pollen === c.id; });
      if (parentOf.length) fact("Parent of", parentOf.map(function (m) { return cropName(m.result); }).join(", "));
      facts.push(el("div", null, [el("dt", { text: "Item ID" }), el("dd", { "class": "mono id", html: (c.vanilla ? "minecraft:" : "productivefarming:") + "<wbr>" + esc(c.id).replace(/_/g, "_<wbr>") })]));
      return el("li", null, [el("details", null, [summary, el("dl", { "class": "more" }, facts)])]);
    }

    var all = D.crops.map(function (c) {
      return { crop: c, text: (c.name + " " + (c.latin || "") + " " + FORM_LABEL[c.form] + " " + c.kitchen.join(" ")).toLowerCase(), node: null };
    });
    function render() {
      var term = q.value.trim().toLowerCase();
      var hits = all.filter(function (item) {
        var c = item.crop;
        if (filter.form !== "all" && group(c) !== filter.form) return false;
        if (filter.source !== "all" && source(c) !== filter.source) return false;
        return !term || item.text.indexOf(term) !== -1;
      });
      var narrowed = term || filter.form !== "all" || filter.source !== "all";
      var limit = showAll || narrowed ? hits.length : Math.min(CAP, hits.length);
      list.textContent = "";
      hits.slice(0, limit).forEach(function (item) { list.appendChild(item.node || (item.node = row(item.crop))); });
      if (!hits.length) {
        var reset = el("button", { type: "button", "class": "chip", text: "clear the search and filters" });
        reset.addEventListener("click", function () {
          q.value = "";
          $('#crop-forms .chip[data-value="all"]').click();
          $('#crop-sources .chip[data-value="all"]').click();
          q.focus();
        });
        list.appendChild(emptyState(q.value.trim(), reset));
      }
      moreBtn.hidden = limit >= hits.length;
      moreBtn.textContent = "Show all " + hits.length + " crops";
      status.textContent = (limit < hits.length ? "First " + limit + " of " : "") + hits.length + (hits.length === 1 ? " crop" : " crops") +
        (narrowed ? " matching, out of " + D.crops.length : ", A to Z") + ". " + D.counts.crops + " are mod crops and " + (D.crops.length - D.counts.crops) + " are vanilla.";
    }
    moreBtn.addEventListener("click", function () { showAll = true; render(); });
    q.addEventListener("input", render);
    $("#crop-form").addEventListener("submit", function (e) { e.preventDefault(); });
    render();
  })();

  /* ---- recipe finder --------------------------------------------------- */
  (function () {
    var list = $("#recipe-list"), q = $("#recipe-q"), status = $("#recipe-status"), more = $("#recipe-more");
    var KIND = { craft: "Crafting", smoke: "Smoking", cross: "Cross", trade: "Trade", planter: "Planter", store: "Storage" };
    var LIMIT = 24, showAll = false, kind = "all";
    var items = [];
    function add(k, title, desc, extra) { items.push({ kind: k, title: title, desc: desc, extra: extra || null, text: (title + " " + desc.replace(/<[^>]+>/g, " ")).toLowerCase() }); }

    D.crafting.forEach(function (r) {
      var title = r.result + (r.count > 1 ? " x" + r.count : "");
      if (r.kind === "shaped") {
        var names = {};
        r.grid.forEach(function (row) { row.forEach(function (c) { if (c) names[c] = true; }); });
        add("craft", title, "Shaped. Uses " + Object.keys(names).map(function (n) { return "<b>" + esc(n) + "</b>"; }).join(", ") + "." +
          (r.needs ? " Only present with " + esc(r.needs) + ", which ATM11 includes." : ""), { grid: r.grid });
      } else {
        add("craft", title, "Shapeless. " + r.inputs.map(function (i) { return "<b>" + i.count + " " + esc(i.name) + "</b>"; }).join(" and ") + ".");
      }
    });
    add("craft", "Dye from a coloured flower", "Shapeless. <b>1 coloured flower</b> from this mod gives the dye nearest its colour. Tall flowers give 2.");
    D.cooking.forEach(function (r) {
      add("smoke", r.result, "<b>" + esc(r.input) + "</b> in a " + esc(r.station.toLowerCase()) + ", " + r.seconds + " seconds, " + r.xp + " experience.");
    });
    D.mutations.forEach(function (m) {
      add("cross", cropName(m.result), "Pollinate <b>" + esc(cropName(m.target)) + "</b> with <b>" + esc(cropName(m.pollen)) + "</b>. " + pct(m.chance) + " base chance per attempt.");
    });
    D.crops.forEach(function (c) {
      if (c.trade) add("trade", c.plant, "<b>" + LEVELS[c.trade.level] + " farmer</b> sells " + c.trade.count + " for " + c.trade.cost + (c.trade.cost > 1 ? " emeralds" : " emerald") + ". Restocks after " + c.trade.uses + " uses.");
    });
    D.crops.forEach(function (c) {
      if (!c.planter) return;
      add("planter", c.planter.map(function (d) { return cropName(d.item); }).join(" and "),
        "AgriTech: Evolved planter with <b>" + esc(c.plant) + "</b> on any farmland soil gives " + c.planter.map(function (d) {
          return (d.chance < 1 ? "a " + pct(d.chance) + " chance of " : "") + (d.min === d.max ? d.min : d.min + " to " + d.max) + " " + esc(cropName(d.item));
        }).join(" plus ") + ".");
    });
    D.crops.forEach(function (c) {
      if (c.crate) add("store", c.name + " Crate", "<b>9 " + esc(c.name) + "</b> in a full grid. Place one crate alone in the grid to unpack it.");
      if (c.bag) add("store", c.plant + " Bag", "<b>9 " + esc(c.plant) + "</b> in a full grid. Place one bag alone in the grid to unpack it.");
    });

    var kinds = [{ value: "all", label: "All", count: items.length }].concat(Object.keys(KIND).map(function (k) {
      return { value: k, label: KIND[k], count: items.filter(function (i) { return i.kind === k; }).length };
    }));
    chipGroup($("#recipe-kinds"), kinds, function (v) { kind = v; showAll = false; render(); });

    function node(item) {
      var body = el("div", null, [el("div", { "class": "rt", text: item.title }), el("div", { "class": "rd", html: item.desc })]);
      if (item.extra && item.extra.grid) {
        var grid = el("div", { "class": "grid3", role: "img", "aria-label": "Crafting grid" });
        grid.style.setProperty("--cols", item.extra.grid[0].length);
        item.extra.grid.forEach(function (row) {
          row.forEach(function (cell) { grid.appendChild(el("span", { "class": cell ? "" : "blank", text: cell || "" })); });
        });
        body.appendChild(grid);
      }
      return el("li", null, [el("span", { "class": "kind", text: KIND[item.kind] }), body]);
    }
    function render() {
      var term = q.value.trim().toLowerCase();
      var hits = items.filter(function (i) { return (kind === "all" || i.kind === kind) && (!term || i.text.indexOf(term) !== -1); });
      list.textContent = "";
      var limit = showAll || term ? hits.length : Math.min(LIMIT, hits.length);
      hits.slice(0, limit).forEach(function (i) { list.appendChild(i.node || (i.node = node(i))); });
      if (!hits.length) {
        var reset = el("button", { type: "button", "class": "chip", text: "clear the search and filter" });
        reset.addEventListener("click", function () { q.value = ""; $('#recipe-kinds .chip[data-value="all"]').click(); q.focus(); });
        list.appendChild(emptyState(q.value.trim(), reset));
      }
      more.hidden = limit >= hits.length;
      more.textContent = "Show all " + hits.length + " results";
      status.textContent = (limit < hits.length ? "First " + limit + " of " : "") + hits.length + (hits.length === 1 ? " recipe" : " recipes");
    }
    more.addEventListener("click", function () { showAll = true; render(); });
    q.addEventListener("input", function () { showAll = false; render(); });
    $("#recipe-form").addEventListener("submit", function (e) { e.preventDefault(); });
    render();
  })();
})();
