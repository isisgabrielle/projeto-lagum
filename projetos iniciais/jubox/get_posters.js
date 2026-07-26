import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const ids = [211672, 438148, 20352, 93456];
    for (const id of ids) {
      await page.goto('https://www.themoviedb.org/movie/' + id);
      try {
        await page.waitForSelector('img.poster', { timeout: 5000 });
        const src = await page.$eval('img.poster', el => el.src);
        console.log(id + ': ' + src);
      } catch (e) {
        console.log(id + ': not found');
      }
    }
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
