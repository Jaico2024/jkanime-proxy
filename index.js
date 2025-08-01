// index.js completo y actualizado para Railway con Docker y CORS habilitado

const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();

// ✅ Habilitamos CORS para que SORA o cualquier origen pueda acceder
app.use(cors());

app.get('/jkanime', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Falta el parametro ?q=' });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const url = `https://jkanime.net/buscar/${query.toLowerCase().replace(/ /g, '-')}`;
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    const results = await page.$$eval('div.anime__item', items => {
      return items.map(el => {
        const title = el.querySelector('h5 a')?.innerText || 'Sin título';
        const url = el.querySelector('h5 a')?.href;
        const image = el.querySelector('.anime__item__pic')?.getAttribute('data-setbg');
        return { title, url, image };
      });
    });

    await browser.close();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(results);

  } catch (error) {
    console.error('❌ Error al procesar la búsqueda:', error);
    res.status(500).json({ error: 'Error interno en el servidor proxy' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Servidor JkAnime Proxy en funcionamiento');
});

// ✅ Railway usará process.env.PORT automáticamente
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
