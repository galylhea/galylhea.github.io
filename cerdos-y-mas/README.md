# Cerdos y Más – Calculadora de precios para distribuidores

Página estática (HTML, CSS y JavaScript puro). Sin backend, sin dependencias, sin servicios pagos. Todo se calcula en el navegador.

```
index.html
css/styles.css
js/products.js      <- TODO lo comercial se edita aquí (productos, precios, WhatsApp)
js/calculator.js    <- lógica de cálculo (no necesita edición)
js/main.js          <- interfaz y botones
assets/             <- fotografías y logotipo
tests/calculator.test.js
```

## 1. Probar localmente
Abre `index.html` con doble clic. También puedes usar un servidor local:
`python3 -m http.server 8000` y entrar a http://localhost:8000.
Pruebas de cálculo (requiere Node.js): `node tests/calculator.test.js`

## 2. Crear el repositorio en GitHub
Entra a https://github.com/new, ponle un nombre (ej. `cerdos-y-mas`), déjalo **Public** y crea el repositorio.

## 3. Subir los archivos
En el repositorio pulsa **Add file → Upload files**, arrastra el contenido de la carpeta (index.html, css, js, assets, README.md, tests) y pulsa **Commit changes**. Con Git: `git init`, `git add .`, `git commit -m "Primera versión"`, `git remote add origin URL`, `git push -u origin main`.

## 4. Activar GitHub Pages
**Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`, **Save**. En uno o dos minutos la página queda en `https://TU-USUARIO.github.io/NOMBRE-REPO/` (con HTTPS).

## 5. Modificar productos y precios
Edita `js/products.js`. Cada referencia tiene `name`, `presentation`, `description`, `image` y `tiers`:
```js
tiers: [{ min: 1, price: 27000 }, { min: 10, price: 25500 }, { min: 30, price: 24000 }]
```
`min` es la cantidad desde la que aplica ese precio. Para agregar una escala, añade otro `{ min, price }`. Para agregar un producto, copia un bloque completo y usa un `id` único. Cuando tengas precios reales, pon `demoPrices: false`. Las etiquetas de rangos se generan solas.

## 6. Agregar fotografías
Copia la imagen en `assets/` (recomendado 800×600 px, JPG/WebP liviano) y escribe la ruta en el producto: `image: "assets/manteca-500.jpg"`. Para el logotipo, reemplaza `assets/logo.svg` o cambia `business.logo`.

## 7. Configurar WhatsApp
En `js/products.js`: `whatsappNumber: "573001234567"` (código de país + número, solo dígitos). Si lo dejas vacío (`""`), WhatsApp abre el selector para elegir contacto o grupo.

## Ejemplos para verificar cálculos manualmente (precios de ejemplo)
| Referencia | Cantidad | Unitario | Subtotal |
|---|---:|---:|---:|
| Manteca 500 g | 9 | $27.000 | $243.000 |
| Manteca 500 g | 10 | $25.500 | $255.000 |
| Manteca 500 g | 30 | $24.000 | $720.000 |
| Tocineta | 8 | $28.000 | $224.000 |
Manteca 500 g ×10 + Tocineta ×8 = **$479.000** (18 unidades).
