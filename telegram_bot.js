import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

const TOKEN = "8587728506:AAGj2BaQT79Jp3-Xh59iZs2_t2ezW4zbBRE";
if (!TOKEN) {
  console.error("Falta BOT_TOKEN no ambiente");
  process.exit(1);
}

const deleteWebhook = () => {
  const url = `https://api.telegram.org/bot${TOKEN}/deleteWebhook`;
  https.get(url).on("error", () => {});
};

deleteWebhook();

const bot = new TelegramBot(TOKEN, { polling: true });

const mainKeyboard = [
  ["📘 O que é Acessibilidade Digital?"],
  ["⚙️ Ferramentas e Boas Práticas"],
  ["🧠 Dicas de Inclusão Online"],
  ["🔗 Saiba mais"]
];

function showMenu(chatId) {
  bot.sendMessage(chatId, "🌐 Bem-vindo ao Inclusao Digital Bot!\nEscolha uma opção:", {
    reply_markup: { keyboard: mainKeyboard, resize_keyboard: true, one_time_keyboard: false }
  });
}

bot.onText(/\/start/, (msg) => {
  showMenu(msg.chat.id);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = String(msg.text || "");

  if (text === "/start") return;

  if (text === "📘 O que é Acessibilidade Digital?") {
    bot.sendMessage(chatId, "Acessibilidade digital garante que todas as pessoas possam acessar, entender e usar conteúdos digitais. Exemplos: textos alternativos em imagens, estrutura semântica, contraste adequado e compatibilidade com leitores de tela.", { reply_markup: { inline_keyboard: [[{ text: "🔙 Voltar", callback_data: "menu" }]] } });
    return;
  }

  if (text === "⚙️ Ferramentas e Boas Práticas") {
    bot.sendMessage(chatId, "Ferramentas: WAVE, Lighthouse, NVDA. Boas práticas: textos claros, legendas em vídeos, descrições de imagens, navegação por teclado.", { reply_markup: { inline_keyboard: [[{ text: "🔙 Voltar", callback_data: "menu" }]] } });
    return;
  }

  if (text === "🧠 Dicas de Inclusão Online") {
    bot.sendMessage(chatId, "Dicas: 1) Escreva simples; 2) Use legendas; 3) Forneça alternativas textuais; 4) Evite conteúdos que dependam só de cor.", { reply_markup: { inline_keyboard: [[{ text: "🔙 Voltar", callback_data: "menu" }]] } });
    return;
  }

  if (text === "🔗 Saiba mais") {
    bot.sendMessage(chatId, "Confira recursos e nossa página:\nhttps://www.instagram.com/webacessibilidade/\n\nTambém disponibilizamos a cartilha digital.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📘 Baixar Cartilha (PDF)", url: "https://inclusao-digital-bot.onrender.com/cartilha.pdf" }],
          [{ text: "🔙 Voltar", callback_data: "menu" }]
        ]
      }
    });
    return;
  }

  showMenu(chatId);
});

bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id;
  if (q.data === "menu") showMenu(chatId);
  bot.answerCallbackQuery(q.id).catch(()=>{});
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err && err.code ? err.code : err);
});

process.on("SIGINT", () => {
  bot.stopPolling().then(() => process.exit(0)).catch(() => process.exit(0));
});
process.on("SIGTERM", () => {
  bot.stopPolling().then(() => process.exit(0)).catch(() => process.exit(0));
});
