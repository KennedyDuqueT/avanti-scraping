const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://citytv.eltiempo.com/noticias/orden-publico');

  await page.waitForSelector('body');

  await page.evaluate(() => {
    // Eliminar imágenes y SVG
    const images = document.querySelectorAll('img, svg');
    images.forEach(el => el.remove());

    // Eliminar scripts y estilos
    const scriptsAndStyles = document.querySelectorAll('script, style');
    scriptsAndStyles.forEach(el => el.remove());

    // Eliminar iframes, objetos embebidos, y etiquetas <noscript>
    const iframesAndNoscripts = document.querySelectorAll('iframe, object, noscript');
    iframesAndNoscripts.forEach(el => el.remove());

    // Eliminar elementos de navegación, encabezado y pie de página
    const navigation = document.querySelectorAll('nav, header, footer, aside');
    navigation.forEach(el => el.remove());

    // Eliminar botones y formularios
    const buttonsAndForms = document.querySelectorAll('button, form, input');
    buttonsAndForms.forEach(el => el.remove());

    // Eliminar elementos que que se encuentran vacios
    const divsAndSpans = document.querySelectorAll('div, span');
    divsAndSpans.forEach(el => {
      // Verificar si el elemento está vacío o solo contiene estilos
      if ((el.textContent && el.textContent.trim() === '') || el.getAttribute('style')) {
        el.remove();
      }
    });
  });

  const htmlContent = await page.content();

  fs.writeFileSync('modifiedPage.txt', htmlContent, 'utf-8');

  await browser.close();
})();
