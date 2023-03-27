console.log(`Created by xxspell | https://github.com/xxspell`);
import puppeteer from "puppeteer";
import fs from "fs";
import readline from "readline";
import promptSync from "prompt-sync";

async () => {
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
    console.log(`Запрашиваю токены`);
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.goto("https://testfaucet.polkaswap.io", {
      waitUntil: "domcontentloaded",
    });

    await page.type('input[Placeholder="Address"]', login);
    await page.type('input[Placeholder="Amount"]', "5");
    await page.click(
      ".el-button el-tooltip faucet-body-action el-button--primary el-button--medium s-medium s-border-radius-medium s-primary"
    );

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    function sleep(ms) { 
        return new Promise((resolve) => { 
            setTimeout(resolve, ms); 
        }); 
    }
    await page.click('input[readonly="readonly"]');
    await page.click(".token-logo--val");
    await page.click(
      ".el-button el-tooltip faucet-body-action el-button--primary el-button--medium s-medium s-border-radius-medium s-primary"
    );
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    await page.click('input[readonly="readonly"]');
    await page.click(".token-logo--pswap");
    await page.click(
      ".el-button el-tooltip faucet-body-action el-button--primary el-button--medium s-medium s-border-radius-medium s-primary"
    );
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    sleep(1000)

    if (await page.$('.login_blocked_wrap') !== null) {
        console.log(`Есть табличка`);
    } else {
        console.log(`табблички не бьыло`);
        
    };
    await context.close();};
    
await browser.close();
};
