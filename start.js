console.log(`Created by xxspell | https://github.com/xxspell`);
import puppeteer from "puppeteer";
import fs from "fs";
import readline from "readline";
import promptSync from "prompt-sync";

async function sass() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const rl = readline.createInterface({
    input: fs.createReadStream("address.txt"),
    crlfDelay: Infinity,
  });
  const sessions = [];
  for await (const line of rl) {
    const loginSearch = line.match(/(.+)\s+/);
    const [completeMatch, login] = loginSearch;
    const password = line.slice(completeMatch.length);
    console.log(`Запрашиваю токены на кошелек ${login}`);
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.goto("https://testfaucet.polkaswap.io", {
      waitUntil: "domcontentloaded",
    });

    //identify element with relative xpath then click
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    await sleep(20000);

    //   await page.click('#app > div > div.el-card.s-card.faucet.is-never-shadow.s-status-default.s-size-medium.s-border-radius-small > div.el-card__body > div > div:nth-child(4) > div > div > div > input', login, {delay: 20});
    //   await page.keyboard.type(login);
    // //  const address = (await page.$x('//*[@id="app"]/div/div[1]/div[2]/div/div[4]/div/div/div/input'));
    // await page.click('#app > div > div.el-card.s-card.faucet.is-never-shadow.s-status-default.s-size-medium.s-border-radius-small > div.el-card__body > div > div:nth-child(5) > div > div > div > input', login, {delay: 20});
    // //  const amount = (await page.$x('//*[@id="app"]/div/div[1]/div[2]/div/div[5]/div/div/div/input'));

    //  await page.keyboard.type("5");
    // /html/body/div/div/div[1]/div[2]/div/div[4]/div/div/div/input
    // /html/body/div/div/div[1]/div[2]/div/div[5]/div/div/div/input
    await page.type('input[placeholder="Address"]', login);
    await page.type('input[placeholder="Amount"]', "5");
    await page.click(
      "#app > div > div.el-card.s-card.faucet.is-never-shadow.s-status-default.s-size-medium.s-border-radius-small > div.el-card__body > div > button"
    );
    sleep(20000);

    if (
      (await page.$("body > div.el-message-box__wrapper > div > div.el-message-box__content > div.el-message-box__container > div > p")) !== null
    ) {
      console.log(`Сутки еще не прошли, скипаем`);
    } else {
      console.log(`Запрос токенов на кошелек ${login} сделан`);
      await page.click('input[readonly="readonly"]');
      await page.click(".token-logo--val");
      await page.click(
        "#app > div > div.el-card.s-card.faucet.is-never-shadow.s-status-default.s-size-medium.s-border-radius-small > div.el-card__body > div > button"
      );
      sleep(20000);
      await page.waitForNavigation({
        waitUntil: "networkidle0",
      });
      await page.click('input[readonly="readonly"]');
      await page.click(".token-logo--pswap");
      await page.click(
        "#app > div > div.el-card.s-card.faucet.is-never-shadow.s-status-default.s-size-medium.s-border-radius-small > div.el-card__body > div > button"
      );
      sleep(20000);
      await page.waitForNavigation({
        waitUntil: "networkidle0",
      });
      sleep(1000);
    }

    await context.close();
  }

  await browser.close();
}
sass();
