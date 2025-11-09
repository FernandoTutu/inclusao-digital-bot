require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // <- serve o PDF

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // exemplo: https://inclusao-digital-bot.onrender.com

if (!TOKEN || !WEBHOOK_URL) {
  console.error('❌ Erro: faltando TOKEN ou WEBHOOK_URL no ambiente.');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN);
const webhookPath = `/bot${TOKEN}`;
const fullWebhookUrl = `${WEBHOOK_URL}${webhookPath}`;

(async () => {
  try {
    await bot.setWebHook(fullWebhookUrl);
    console.log(`✅ Webhook registrado em: ${fullWebhookUrl}`);
  } catch (err) {
    console.error('❌ Erro ao registrar webhook:', err);
  }
})();

const mainMenu = {
  inline_keyboard: [
    [
      { text: 'O que é acessibilidade?', callback_data: 'what' },
      { text: 'Como tornar acessível', callback_data: 'how' }
    ],
    [
      { text: 'Boas práticas', callback_data: 'tips' },
      { text: 'Ferramentas', callback_data: 'tools' }
    ],
    [
      { text: 'Leis e direitos', callback_data: 'laws' },
      { text: 'Por que incluir?', callback_data: 'why' }
    ],
    [
      { text: 'Testar acessibilidade', callback_data: 'test' },
      { text: 'Saiba mais 💡', callback_data: 'learn_more' }
    ]
  ]
};

const backButton = {
  inline_keyboard: [[{ text: '🔙 Voltar ao menu', callback_data: 'menu' }]]
};

function sendMenu(chatId) {
  const text = `<b>🤖 Inclusão Digital Bot</b>\n\nSelecione um tema para aprender sobre <b>acessibilidade digital</b> e como tornar a internet mais inclusiva!`;
  return bot.sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: mainMenu });
}

app.post(webhookPath, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Inclusão Digital Bot ativo 💬'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

bot.onText(/\/start|\/menu/i, (msg) => sendMenu(msg.chat.id));

bot.on('callback_query', async (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;
  await bot.answerCallbackQuery(query.id);

  try {
    switch (data) {
      case 'menu':
        return sendMenu(chatId);

      case 'what':
        return bot.sendMessage(
          chatId,
          `<b>O que é acessibilidade digital?</b>\n\nÉ garantir que todas as pessoas, com ou sem deficiência, possam usar sites, aplicativos e conteúdos online com autonomia.`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      case 'how':
        return bot.sendMessage(
          chatId,
          `<b>Como tornar um site acessível?</b>\n\n1️⃣ Use textos alternativos em imagens.\n2️⃣ Permita navegação por teclado.\n3️⃣ Tenha contraste adequado.\n4️⃣ Evite conteúdo piscante.\n5️⃣ Ofereça legendas e transcrições.`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      case 'tips':
        return bot.sendMessage(
          chatId,
          `<b>Boas práticas rápidas</b>\n\n✔️ Linguagem clara e inclusiva.\n✔️ Links descritivos (evite “clique aqui”).\n✔️ Evite excesso de texto.\n✔️ Revise contraste e fonte.`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      case 'tools':
        return bot.sendMessage(
          chatId,
          `<b>Ferramentas úteis</b>\n\n🧰 WAVE — verifica acessibilidade.\n🧰 NVDA — leitor de tela gratuito.\n🧰 Lighthouse — análise no Chrome.\n🧰 Contrast Checker — testa cores.`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      case 'laws':
        return bot.sendMessage(
          chatId,
          `<b>Leis e direitos (Brasil)</b>\n\n📘 Lei Brasileira de Inclusão (13.146/2015)\n📘 Lei nº 10.098/2000 — normas de acessibilidade\n📘 Decreto nº 5.296/2004 — acessibilidade em comunicação digital.`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      case 'why':
        return bot.sendMessage(
          chatId,
          `<b>Por que a inclusão importa?</b>\n\nPorque a acessibilidade digital é um direito humano. Promove igualdade, autonomia e participação social de todos.`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      case 'test':
        return bot.sendMessage(
          chatId,
          `<b>Dicas para testar acessibilidade</b>\n\n✅ Use só o teclado.\n✅ Teste leitores de tela.\n✅ Avalie cores e contraste.\n✅ Peça feedback de pessoas reais.`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      case 'learn_more':
        const more = {
          inline_keyboard: [
            [{ text: '🌐 Instagram Web Acessibilidade', url: 'https://www.instagram.com/webacessibilidade/' }],
            [{ text: '📘 Baixar Cartilha Digital', callback_data: 'get_pdf' }],
            [{ text: '🔙 Voltar ao menu', callback_data: 'menu' }]
          ]
        };
        return bot.sendMessage(
          chatId,
          `<b>Saiba mais sobre acessibilidade digital!</b>\n\nAcompanhe conteúdos e dicas no perfil oficial do projeto.`,
          { parse_mode: 'HTML', reply_markup: more }
        );

      case 'get_pdf':
        return bot.sendMessage(
          chatId,
          `📕 Aqui está a cartilha completa sobre acessibilidade digital:\n\n${WEBHOOK_URL}/cartilha.pdf`,
          { parse_mode: 'HTML', reply_markup: backButton }
        );

      default:
        return bot.sendMessage(chatId, 'Escolha uma opção válida no menu.', { reply_markup: backButton });
    }
  } catch (err) {
    console.error('❌ Erro no callback:', err);
    await bot.sendMessage(chatId, 'Ocorreu um erro. Tente novamente.');
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor online na porta ${PORT}`));
