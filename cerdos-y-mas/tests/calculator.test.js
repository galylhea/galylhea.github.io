// Ejecutar con:  node tests/calculator.test.js
const assert = require("assert");
global.window = {}; require("../js/products.js");
const C = require("../js/calculator.js");
const { PRODUCTS: P, CONFIG: CFG } = global.window;
const get = id => P.find(p => p.id === id);
const m500 = get("manteca-500");
let n = 0; const t = (name, fn) => { fn(); n++; console.log("OK  " + name); };

t("Cambio de precio en cada rango (1-9, 10-29, 30+)", () => {
  [[1,27000],[9,27000],[10,25500],[29,25500],[30,24000],[500,24000]]
    .forEach(([q, pr]) => assert.strictEqual(C.calcLine(m500, q).unit, pr));
});
t("Subtotal correcto: 10 x 25.500 = 255.000; 30 x 24.000 = 720.000", () => {
  assert.strictEqual(C.calcLine(m500, 10).subtotal, 255000);
  assert.strictEqual(C.calcLine(m500, 30).subtotal, 720000);
});
t("Productos combinados: 9x27.000 + 10x22.500 + 3x22.000", () => {
  const o = C.calcOrder(P, { "manteca-500": 9, chorizo: 10, miel: 3 });
  assert.strictEqual(o.total, 243000 + 225000 + 66000);
  assert.strictEqual(o.units, 22); assert.strictEqual(o.lines.length, 3);
});
t("Descuento por referencia independiente (200 g no suma con 500 g)", () => {
  const o = C.calcOrder(P, { "manteca-200": 6, "manteca-500": 6 });
  assert.strictEqual(o.total, 6*9000 + 6*27000);
});
t("Entradas inválidas => 0", () => {
  ["", "abc", "-5", -3, null, undefined, NaN, Infinity].forEach(v => assert.strictEqual(C.normalizeQty(v), 0));
  assert.strictEqual(C.normalizeQty("2.9"), 2); assert.strictEqual(C.normalizeQty(" 12 "), 12);
  assert.strictEqual(C.normalizeQty(1e12, 99999), 99999);
});
t("Pedido vacío => total 0", () => {
  const o = C.calcOrder(P, {}); assert.strictEqual(o.total, 0); assert.strictEqual(o.units, 0);
});
t("Etiquetas de rango", () => {
  assert.strictEqual(C.tierLabel(m500, 0), "1 a 9"); assert.strictEqual(C.tierLabel(m500, 1), "10 a 29");
  assert.strictEqual(C.tierLabel(m500, 2), "30 o más");
});
t("Formato de moneda", () => {
  assert.strictEqual(C.formatMoney(27000, "$"), "$27.000"); assert.strictEqual(C.formatMoney(1234567, "$"), "$1.234.567");
  assert.strictEqual(C.formatMoney(0, "$"), "$0");
});
t("Texto y URL de WhatsApp codificados y completos", () => {
  const o = C.calcOrder(P, { "manteca-500": 10, tocineta: 8 });
  const text = C.buildOrderText(o, CFG, new Date(2026, 10, 6));
  assert.ok(text.includes("Manteca de cerdo 500 g") && text.includes("10 x $25.500 = $255.000"));
  assert.ok(text.includes("8 x $28.000 = $224.000") && text.includes("*TOTAL: $479.000*"));
  const url = C.buildWhatsAppUrl("+57 300 123 4567", text);
  assert.ok(url.startsWith("https://wa.me/573001234567?text="));
  assert.strictEqual(decodeURIComponent(url.split("?text=")[1]), text);
  assert.ok(C.buildWhatsAppUrl("", text).startsWith("https://wa.me/?text="));
});
t("Integridad de la configuración", () => {
  P.forEach(p => { assert.strictEqual(p.tiers[0].min, 1);
    for (let i = 1; i < p.tiers.length; i++) { assert.ok(p.tiers[i].min > p.tiers[i-1].min); assert.ok(p.tiers[i].price <= p.tiers[i-1].price); } });
  assert.strictEqual(new Set(P.map(p => p.id)).size, P.length);
});
console.log("\n" + n + " pruebas aprobadas");
