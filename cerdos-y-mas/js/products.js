/* =====================================================================
   CONFIGURACIÓN CENTRAL – Cerdos y Más
   Aquí se edita TODO lo comercial: negocio, WhatsApp, productos y precios.
   Los precios existen únicamente en este archivo.
   ===================================================================== */
window.CONFIG = {
  business: {
    name: "Cerdos y Más",
    tagline: "Tradición artesanal para distribuidores y mayoristas",
    logo: "assets/logo.svg",          // Reemplaza el archivo o cambia la ruta
    schedule: "Pedidos: lunes a sábado, 7:00 a. m. – 5:00 p. m.",
    contact: "Atención a distribuidores por WhatsApp",
    notes: [
      "Los precios por volumen se aplican a cada referencia de forma individual.",
      "Despachos, fechas de entrega y formas de pago se confirman por WhatsApp."
    ]
  },
  // Número en formato internacional, solo dígitos (ej. Colombia: "573001234567").
  // Si queda vacío (""), WhatsApp deja elegir el contacto o grupo.
  whatsappNumber: "573003908078",
  currencySymbol: "$",
  // true = muestra aviso de "precios de ejemplo" en la página y en el pedido.
  demoPrices: true,
  maxQuantity: 99999
};

/* Cada presentación es una referencia independiente.
   tiers: escalas por cantidad. "min" es la cantidad desde la que aplica el precio.
   Deben ir de menor a mayor y la primera debe empezar en 1.
   image: ruta en /assets (ej. "assets/manteca-500.jpg"). Vacío = espacio provisional. */
window.PRODUCTS = [
  { id: "manteca-200", group: "Manteca de cerdo", name: "Manteca de cerdo", presentation: "200 g",
    description: "Manteca pura, ideal para cocina tradicional.", image: "",
    tiers: [{ min: 1, price: 9000 }, { min: 10, price: 8500 }, { min: 30, price: 8000 }] },
  { id: "manteca-500", group: "Manteca de cerdo", name: "Manteca de cerdo", presentation: "500 g",
    description: "Manteca pura, presentación familiar.", image: "",
    tiers: [{ min: 1, price: 27000 }, { min: 10, price: 25500 }, { min: 30, price: 24000 }] },
  { id: "manteca-900", group: "Manteca de cerdo", name: "Manteca de cerdo", presentation: "900 g",
    description: "Manteca pura, formato para restaurantes.", image: "",
    tiers: [{ min: 1, price: 45000 }, { min: 10, price: 42500 }, { min: 30, price: 40000 }] },
  { id: "migas", group: "Otros productos", name: "Migas de chicharrón", presentation: "250 g",
    description: "Crocantes y sabrosas, para acompañar o cocinar.", image: "",
    tiers: [{ min: 1, price: 18000 }, { min: 12, price: 16500 }, { min: 36, price: 15000 }] },
  { id: "miel", group: "Otros productos", name: "Miel de abejas", presentation: "500 g",
    description: "Miel natural de abejas, sin aditivos.", image: "",
    tiers: [{ min: 1, price: 22000 }, { min: 10, price: 20500 }, { min: 30, price: 19000 }] },
  { id: "tocineta", group: "Otros productos", name: "Tocineta", presentation: "500 g",
    description: "Tocineta ahumada, corte tradicional.", image: "",
    tiers: [{ min: 1, price: 30000 }, { min: 8, price: 28000 }, { min: 24, price: 26000 }] },
  { id: "chorizo", group: "Otros productos", name: "Chorizo", presentation: "500 g (paquete)",
    description: "Chorizo artesanal con especias seleccionadas.", image: "",
    tiers: [{ min: 1, price: 24000 }, { min: 10, price: 22500 }, { min: 30, price: 21000 }] }
];
