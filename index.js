const axios = require("axios");
const Whatsapp = require("./services/Whatsapp");
const Bot = require("./services/Bot");

const whatsapp = new Whatsapp();
const bot = new Bot();

bot.connect().then(async (b) => {
  const whatsappClient = await whatsapp.start();
  whatsappClient.on("message", async (msg) => {
    if (msg.from === "status@broadcast") return;
    if (msg.body.substring(0, 2) !== "--") return;
    msg.body = msg.body.replace("--", "");

    const taxes = await axios.get(
      `https://api.hgbrasil.com/finance/taxes?key=c8de4a9f`
    );
    const selic = taxes.data.results[0].selic;
    const cdi = taxes.data.results[0].cdi;
    const fatorDiario = taxes.data.results[0].daily_factor;

    console.log(msg.body);

    const fundInfo = await bot.getFundInfo(msg.body);

    console.log(fundInfo);

    msg.reply(
      `*INFORMAÇÕES DO MERCADO*${"\n"}*Selic:* ${selic}${"\n"}*cdi:* ${cdi}${"\n"}*fator diário:* ${fatorDiario} ${"\n\n"}*INFORMAÇÕES DO ATIVO*${"\n"}*Razão social:* ${
        fundInfo.razaoSocial
      }${"\n"}*Preço unitário:* ${
        fundInfo.vlrPreco
      }${"\n"}*Valorização nos últimos 12 meses:* ${
        fundInfo.vlrValorizacao12M
      }${"\n"}*Dividend Yield:* ${
        fundInfo.perDividendo
      }${"\n"}*Último dividendo:* ${
        fundInfo.vlrUltimoDividendo
      }${"\n"}*Resumo:* ${"\n"}${fundInfo.resumo}`
    );
  });
});
