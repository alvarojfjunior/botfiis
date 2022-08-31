const puppeteer = require("puppeteer");

let browser;

module.exports = class Bot {
  constructor() {}

  async connect() {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    return browser;
  }

  async getFundInfo(asset) {
    const page = await await browser.newPage();
    await page.goto(`https://www.fundsexplorer.com.br/funds/${asset}`);

    try {
      let fund = {
        vlrPreco: await page.$eval(
          "#stock-price > span.price",
          (el) => el.innerText
        ),
        qtdeLiquidezDiaria: await page.$eval(
          "#main-indicators-carousel > div > div > div:nth-child(1) > span.indicator-value",
          (el) => el.innerText
        ),
        vlrUltimoDividendo: await page.$eval(
          "#main-indicators-carousel > div > div > div:nth-child(2) > span.indicator-value",
          (el) => el.innerText
        ),
        perDividendo: await page.$eval(
          "#main-indicators-carousel > div > div > div:nth-child(3) > span.indicator-value",
          (el) => el.innerText
        ),
        vlrValorizacao12M: await page.$eval(
          "#variation-12-months",
          (el) => el.innerText
        ),
        razaoSocial: await page.$eval(
          "#basic-infos > div > div > div.section-body > div > div:nth-child(1) > ul > li:nth-child(1) > div.text-wrapper > span.description",
          (el) => el.innerText
        ),
        resumo: `*${await page.$eval(
          "#description-content-description > div:nth-child(1) > div.simplebar-wrapper > div.simplebar-mask > div > div > p:nth-child(2) > b > span",
          (el) => el.innerText
        )}*${"\n"}${await page.$eval(
          "#description-content-description > div:nth-child(1) > div.simplebar-wrapper > div.simplebar-mask > div > div > p:nth-child(3) > span",
          (el) => el.innerText
        )}${await page.$eval(
          "#description-content-description > div:nth-child(1) > div.simplebar-wrapper > div.simplebar-mask > div > div > p:nth-child(4)",
          (el) => el.innerText
        )}`,
      };
      page.close();
      return fund;
    } catch (error) {
      page.close();
      return false;
    }
  }
};
