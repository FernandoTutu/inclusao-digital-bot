// telegram_bot.js
import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// =============================
// 🔧 CONFIGURAÇÕES INICIAIS
// =============================
dotenv.config();

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 10000;

// Express App
const app = express();
app.use(express.static("public")); // Permite servir arquivos (como PDF, imagens, etc.)

// Corrigir __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// 🤖 INICIALIZANDO O BOT
// =============================
const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${WEBHOOK_URL}/bot${TOKEN}`);

app.post(`/bot${TOKEN}`, (req, res) => bot.processUpdate(req.body));

// =============================
// 📜 FUNÇÕES AUXILIARES
// =============================

// Função de retorno ao menu principal
function mainMenu(chatId) {
  const menu = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: "📘 O que é Acessibilidade Digital?" }],
        [{ text: "⚙️ Como tornar o conteúdo acessível" }],
        [{ text: "🧰 Ferramentas úteis" }],
        [{ text: "📜 Direitos e Leis" }],
        [{ text: "💡 Saiba mais" }],
      ],
    },
  };
  bot.sendMessage(chatId, "Escolha uma das opções abaixo 👇", menu);
}

// =============================
// 🎯 COMANDOS DO BOT
// =============================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `👋 Olá, *${msg.from.first_name || "usuário"}!*  
Sou o *Bot da Inclusão Digital* 🤖  

Aqui você encontra informações sobre **acessibilidade digital e inclusão**.  
Escolha abaixo o que deseja aprender 👇`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{ text: "📘 O que é Acessibilidade Digital?" }],
          [{ text: "⚙️ Como tornar o conteúdo acessível" }],
          [{ text: "🧰 Ferramentas úteis" }],
          [{ text: "📜 Direitos e Leis" }],
          [{ text: "💡 Saiba mais" }],
        ],
      },
    }
  );
});

// =============================
// 🗂️ RESPOSTAS AOS BOTÕES
// =============================
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // --- Opção 1
  if (text === "📘 O que é Acessibilidade Digital?") {
    bot.sendMessage(
      chatId,
      "🌍 *Acessibilidade digital* é o conjunto de práticas que garantem que todas as pessoas, incluindo pessoas com deficiência, possam usar sites, aplicativos e conteúdos online com autonomia e respeito.",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🔙 Voltar ao menu", callback_data: "menu" }]],
        },
      }
    );
  }

  // --- Opção 2
  else if (text === "⚙️ Como tornar o conteúdo acessível") {
    bot.sendMessage(
      chatId,
      "💡 Dicas para deixar seu conteúdo mais acessível:\n\n" +
        "• Adicione *descrições (alt text)* em imagens.\n" +
        "• Garanta bom contraste entre texto e fundo.\n" +
        "• Evite textos importantes apenas em imagens.\n" +
        "• Legende vídeos e ofereça transcrições de áudios.\n" +
        "• Permita navegação por teclado.\n" +
        "• Use headings (H1, H2, etc.) corretamente.",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🔙 Voltar ao menu", callback_data: "menu" }]],
        },
      }
    );
  }

  // --- Opção 3
  else if (text === "🧰 Ferramentas úteis") {
    bot.sendMessage(
      chatId,
      "🧩 *Ferramentas de acessibilidade:*\n\n" +
        "🔹 WAVE — analisa acessibilidade de sites.\n" +
        "🔹 NVDA — leitor de tela gratuito.\n" +
        "🔹 Lighthouse — auditoria de acessibilidade do Chrome.\n" +
        "🔹 Contrast Checker — mede contraste de cores.",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🔙 Voltar ao menu", callback_data: "menu" }]],
        },
      }
    );
  }

  // --- Opção 4
  else if (text === "📜 Direitos e Leis") {
    bot.sendMessage(
      chatId,
      "⚖️ *Leis sobre acessibilidade digital no Brasil:*\n\n" +
        "📘 *Lei Brasileira de Inclusão (13.146/2015)*\n" +
        "📗 *Lei nº 10.098/2000* — Normas gerais e critérios básicos de acessibilidade.\n" +
        "📘 *Decreto nº 5.296/2004* — Regulamenta e detalha essas normas.",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🔙 Voltar ao menu", callback_data: "menu" }]],
        },
      }
    );
  }

  // --- Opção 5
  else if (text === "💡 Saiba mais") {
    bot.sendMessage(
      chatId,
      "💬 Deseja acessar nossa *Cartilha Digital* ou saber mais sobre o projeto?",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📘 Baixar Cartilha Digital", url: `${WEBHOOK_URL}/cartilha.pdf` }],
            [{ text: "📢 Sobre o Projeto", callback_data: "sobre" }],
            [{ text: "🔙 Voltar ao menu", callback_data: "menu" }],
          ],
        },
      }
    );
  }
});

// =============================
// 🔁 CALLBACKS DOS BOTÕES INLINE
// =============================
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "menu") {
    mainMenu(chatId);
  }

  if (data === "sobre") {
    bot.sendMessage(
      chatId,
      "📖 *Projeto Inclusão Digital e Acessibilidade*\n\n" +
        "Este projeto foi desenvolvido pelo grupo formado por *Fernando, Henrique, Thaylan e Erik*, com o objetivo de promover conhecimento sobre acessibilidade digital e inclusão tecnológica.\n\n" +
        "💙 A inclusão digital é cidadania!",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🔙 Voltar ao menu", callback_data: "menu" }]],
        },
      }
    );
  }
});

// =============================
// 🚀 SERVIDOR EXPRESS
// =============================
app.get("/", (req, res) => {
  res.send(`
    <body style="font-family: Arial; text-align: center; margin-top: 50px">
      <h2>🤖 Inclusão Digital Bot</h2>
      <p>O bot está online e conectado com o Telegram!</p>
      <a href="https://t.me/SeuBotUsername" target="_blank">Abrir no Telegram</a>
    </body>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor ativo na porta ${PORT}`);
  console.log(`🌐 Webhook configurado em: ${WEBHOOK_URL}/bot${TOKEN}`);
});
