/* =====================================================================
   LÓGICA DE CÁLCULO (funciones puras, sin acceso al DOM)
   Se usa en el navegador (window.Calc) y en las pruebas de Node.
   ===================================================================== */
(function (root) {
  "use strict";

  /** Convierte cualquier entrada en un entero >= 0 (vacío, negativo o no numérico => 0). */
  function normalizeQty(value, max) {
    var n = typeof value === "number" ? value : parseFloat(String(value == null ? "" : value).replace(",", "."));
    if (!isFinite(n) || n < 0) return 0;
    n = Math.floor(n);                       // los decimales se truncan
    return Math.min(n, max || 99999);
  }

  /** Devuelve la escala aplicable a una cantidad (con 0 se muestra la primera escala). */
  function getTier(product, qty) {
    var tiers = product.tiers, found = tiers[0];
    for (var i = 0; i < tiers.length; i++) if (qty >= tiers[i].min) found = tiers[i];
    return found;
  }

  /** Rango legible de una escala: "1 a 9", "30 o más". */
  function tierLabel(product, i) {
    var t = product.tiers, next = t[i + 1];
    if (!next) return t[i].min + " o más";
    return next.min - 1 === t[i].min ? String(t[i].min) : t[i].min + " a " + (next.min - 1);
  }

  /** Línea de pedido de una referencia. */
  function calcLine(product, qty) {
    var tier = getTier(product, qty);
    return { product: product, qty: qty, unit: tier.price, subtotal: qty * tier.price };
  }

  /** Pedido completo. qtyMap = { idProducto: cantidad }. Solo incluye líneas con cantidad > 0. */
  function calcOrder(products, qtyMap) {
    var lines = [], units = 0, total = 0;
    products.forEach(function (p) {
      var q = normalizeQty(qtyMap[p.id]);
      if (q > 0) { var l = calcLine(p, q); lines.push(l); units += q; total += l.subtotal; }
    });
    return { lines: lines, units: units, total: total };
  }

  /** Formato moneda colombiana: 27000 => "$27.000" (independiente del navegador). */
  function formatMoney(n, symbol) {
    return (symbol || "$") + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /** Texto del pedido (se usa para copiar y para WhatsApp). */
  function buildOrderText(order, config, date) {
    var s = config.currencySymbol, d = date || new Date();
    var L = ["*Pedido – " + config.business.name + "*",
             "Fecha: " + d.toLocaleDateString("es-CO"), ""];
    order.lines.forEach(function (l, i) {
      L.push((i + 1) + ". " + l.product.name + " " + l.product.presentation);
      L.push("   " + l.qty + " x " + formatMoney(l.unit, s) + " = " + formatMoney(l.subtotal, s));
    });
    L.push("", "Total unidades: " + order.units, "*TOTAL: " + formatMoney(order.total, s) + "*");
    if (config.demoPrices) L.push("", "(Precios de ejemplo)");
    return L.join("\n");
  }

  /** URL de WhatsApp. Sin número => wa.me/?text= (el usuario elige contacto o grupo). */
  function buildWhatsAppUrl(number, text) {
    var digits = String(number || "").replace(/\D/g, "");
    return "https://wa.me/" + digits + "?text=" + encodeURIComponent(text);
  }

  var api = { normalizeQty: normalizeQty, getTier: getTier, tierLabel: tierLabel, calcLine: calcLine,
              calcOrder: calcOrder, formatMoney: formatMoney, buildOrderText: buildOrderText,
              buildWhatsAppUrl: buildWhatsAppUrl };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Calc = api;
})(typeof window !== "undefined" ? window : this);
