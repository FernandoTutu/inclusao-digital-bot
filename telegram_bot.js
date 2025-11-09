const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Olá! 🤖 Sou o Inclusão Digital Bot. Escolha uma opção:', {
    reply_markup: {
      keyboard: [
        ['O que é acessibilidade digital?'],
        ['Como tornar um site acessível?'],
        ['Boas práticas rápidas'],
        ['Ferramentas úteis'],
        ['Por que a inclusão é importante?'],
        ['Leis e direitos'],
        ['Dicas rápidas'],
        ['Saiba mais 🌐']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = String(msg.text || '').toLowerCase();

  if (text.includes('o que é acessibilidade digital')) {
    bot.sendMessage(chatId, 'Acessibilidade digital garante que todas as pessoas possam usar e interagir com conteúdos e serviços online de forma autônoma e igualitária.');
  } else if (text.includes('como tornar um site acessível')) {
    bot.sendMessage(chatId, 'Use contraste adequado, alt text nas imagens, legendas em vídeos, navegação por teclado e fontes legíveis.');
  } else if (text.includes('boas práticas') || text.includes('boas práticas rápidas')) {
    bot.sendMessage(chatId, 'Boas práticas: 1) textos claros 2) imagens com descrição 3) legendas 4) navegação por teclado 5) contraste adequado.');
  } else if (text.includes('ferramentas')) {
    bot.sendMessage(chatId, 'Ferramentas: NVDA (leitor de tela), WAVE (validação), Contrast Checker e Accessibility Insights.');
  } else if (text.includes('por que a inclusão')) {
    bot.sendMessage(chatId, 'A inclusão digital promove igualdade, acesso à educação e ao trabalho, além de fortalecer a participação social.');
  } else if (text.includes('leis') || text.includes('direitos')) {
    bot.sendMessage(chatId, 'No Brasil a Lei Brasileira de Inclusão (Lei nº 13.146/2015) prevê acessibilidade e igualdade de oportunidades.');
  } else if (text.includes('dicas') || text.includes('rápidas')) {
    bot.sendMessage(chatId, 'Dicas rápidas: 1) não use só cores, 2) prefira fontes legíveis, 3) teste com leitores de tela, 4) ofereça legendas.');
  } else if (text.includes('saiba mais') || text.includes('🌐')) {
    bot.sendMessage(chatId, 'Saiba mais em @webacessibilidade no Instagram: https://www.instagram.com/webacessibilidade/');
  } else {
    bot.sendMessage(chatId, 'Desculpe, não entendi. Use as opções do menu para escolher um tópico.');
  }
});

bot.on('polling_error', (error) => {
  console.error('polling_error', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  process.exit(1);
});

app.get('/', (req, res) => {
  res.send('Bot de Acessibilidade Digital está rodando!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Servidor web ativo na porta ${port}`);
});
