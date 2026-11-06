/* =====================================================================
   INTERFAZ: pinta el catálogo, conecta eventos y actualiza el resumen.
   Depende de products.js (CONFIG, PRODUCTS) y calculator.js (Calc).
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.CONFIG, PRODUCTS = window.PRODUCTS, C = window.Calc;
  var qty = {};                                   // estado: cantidad por referencia
  PRODUCTS.forEach(function (p) { qty[p.id] = 0; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var money = function (n) { return C.formatMoney(n, CFG.currencySymbol); };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* ---------- Cabecera, pie y avisos ---------- */
  function renderBrand() {
    var b = CFG.business;
    document.title = b.name + " | Precios para distribuidores";
    $("#brandName").textContent = b.name;
    $("#brandTagline").textContent = b.tagline;
    var logo = $("#brandLogo");
    logo.alt = "Logotipo de " + b.name;
    logo.onerror = function () { logo.style.display = "none"; };
    logo.src = b.logo;
    $("#schedule").textContent = b.schedule;
    $("#contact").textContent = b.contact;
    $("#notes").innerHTML = b.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
    $("#demoBanner").hidden = !CFG.demoPrices;
  }

  /* ---------- Catálogo ---------- */
  function cardHTML(p) {
    var label = esc(p.name + " " + p.presentation);
    var media = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + label + '" loading="lazy">'
      : '<div class="ph"><span>Foto del producto</span></div>';
    var rows = p.tiers.map(function (t, i) {
      return '<tr data-tier="' + i + '"><td>' + C.tierLabel(p, i) + ' unidades</td><td>' + money(t.price) + "</td></tr>";
    }).join("");
    return '<article class="card" data-id="' + esc(p.id) + '">' +
      '<div class="media">' + media + '</div><div class="body">' +
      "<h3>" + esc(p.name) + '</h3><p class="pres">' + esc(p.presentation) + "</p>" +
      '<p class="desc">' + esc(p.description) + "</p>" +
      '<table class="tiers"><caption>Precio por unidad según cantidad</caption><tbody>' + rows + "</tbody></table>" +
      '<div class="buy"><div class="stepper">' +
      '<button type="button" data-act="dec" aria-label="Disminuir cantidad de ' + label + '">−</button>' +
      '<input type="text" inputmode="numeric" autocomplete="off" value="0" aria-label="Cantidad de ' + label + '">' +
      '<button type="button" data-act="inc" aria-label="Aumentar cantidad de ' + label + '">+</button></div>' +
      '<div class="line"><span class="unit"></span><strong class="sub"></strong></div></div></div></article>';
  }

  function renderCatalog() {
    var groups = [], map = {};
    PRODUCTS.forEach(function (p) {
      if (!map[p.group]) { map[p.group] = []; groups.push(p.group); }
      map[p.group].push(p);
    });
    $("#catalog").innerHTML = groups.map(function (g) {
      return '<section class="group"><h2>' + esc(g) + '</h2><div class="grid">' +
        map[g].map(cardHTML).join("") + "</div></section>";
    }).join("");
  }

  /* ---------- Actualización de valores ---------- */
  function update() {
    PRODUCTS.forEach(function (p) {
      var card = $('.card[data-id="' + p.id + '"]'), q = qty[p.id], line = C.calcLine(p, q);
      var idx = p.tiers.indexOf(C.getTier(p, q));
      card.querySelectorAll("tr").forEach(function (tr) {
        tr.classList.toggle("active", q > 0 && Number(tr.dataset.tier) === idx);
      });
      card.classList.toggle("selected", q > 0);
      $(".unit", card).textContent = "Precio unitario: " + money(line.unit);
      $(".sub", card).textContent = "Subtotal: " + money(line.subtotal);
    });
    renderSummary();
  }

  function renderSummary() {
    var o = C.calcOrder(PRODUCTS, qty);
    $("#summaryList").innerHTML = o.lines.length ? o.lines.map(function (l) {
      return "<li><div><strong>" + esc(l.product.name) + "</strong> <span>" + esc(l.product.presentation) +
        "</span><small>" + l.qty + " × " + money(l.unit) + "</small></div><b>" + money(l.subtotal) + "</b></li>";
    }).join("") : '<li class="empty">Aún no hay productos. Elige cantidades en el catálogo.</li>';
    $("#totalUnits").textContent = o.units;
    $("#totalPrice").textContent = money(o.total);
    $("#barTotal").textContent = money(o.total);
    $("#barUnits").textContent = o.units + (o.units === 1 ? " unidad" : " unidades");
  }

  /* ---------- Eventos del catálogo ---------- */
  function setQty(id, value, rewriteInput) {
    qty[id] = C.normalizeQty(value, CFG.maxQuantity);
    if (rewriteInput) $('.card[data-id="' + id + '"] input').value = qty[id];
    update();
  }

  $("#catalog").addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-act]"); if (!btn) return;
    var id = btn.closest(".card").dataset.id;
    setQty(id, qty[id] + (btn.dataset.act === "inc" ? 1 : -1), true);
  });
  $("#catalog").addEventListener("input", function (e) {       // cálculo en vivo mientras se escribe
    if (e.target.tagName === "INPUT") setQty(e.target.closest(".card").dataset.id, e.target.value, false);
  });
  $("#catalog").addEventListener("change", function (e) {      // al terminar, corrige el texto mostrado
    if (e.target.tagName === "INPUT") setQty(e.target.closest(".card").dataset.id, e.target.value, true);
  });

  /* ---------- Avisos ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2800);
  }

  function currentText() {
    var o = C.calcOrder(PRODUCTS, qty);
    return o.lines.length ? C.buildOrderText(o, CFG) : null;
  }

  /* ---------- Botones del pedido ---------- */
  $("#btnClear").addEventListener("click", function () {
    PRODUCTS.forEach(function (p) { qty[p.id] = 0; });
    document.querySelectorAll(".card input").forEach(function (i) { i.value = 0; });
    update(); toast("Pedido limpiado.");
  });

  function fallbackCopy(text) {                  // método alternativo sin Clipboard API
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
    var ok = false; try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta); return ok;
  }

  $("#btnCopy").addEventListener("click", function () {
    var text = currentText();
    if (!text) { toast("Agrega al menos un producto."); return; }
    var done = function (ok) { toast(ok ? "Pedido copiado al portapapeles." : "No se pudo copiar. Usa el botón de WhatsApp."); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
    } else done(fallbackCopy(text));
  });

  $("#btnWhatsapp").addEventListener("click", function () {
    var text = currentText();
    if (!text) { toast("Agrega al menos un producto."); return; }
    var url = C.buildWhatsAppUrl(CFG.whatsappNumber, text);
    // Enlace temporal con click: abre una sola pestaña y no lo bloquean los navegadores
    var a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });

  renderBrand(); renderCatalog(); update();
})();