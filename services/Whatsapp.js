const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

module.exports = class Whatsapp {
  constructor() {
  }
  
  async start() {
    const client = new Client({
      authStrategy: new LocalAuth(),
    });

    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("Client is ready!");
    });

    client.on("authenticated", () => {
      console.log("AUTHENTICATED");
    });

    client.on("disconnected", async () => {
      client.destroy();
      whatsappStart();
    });

    client.initialize();
    return client;
  }
}
