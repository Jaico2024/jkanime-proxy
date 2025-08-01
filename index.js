// Paso 1: Creamos el backend proxy con Playwright en Node.js
// Archivo principal: index.js

const express = require('express');
const { chromium } = require('playwright');
const app = express();

app.get('/jkanime', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Falta el parametro ?q=' });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://jkanime.net/buscar/${query.toLowerCase().replace(/ /g, '-')}`, {
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
  res.json(results);
});

app.get('/', (req, res) => {
  res.send('✅ Servidor de JkAnime proxy funcionando');
});

const PORT = 8080;
