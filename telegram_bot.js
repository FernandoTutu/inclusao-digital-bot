require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = process.env.PORT || 3000;
const token = process.env.TOKEN;

app.get('/', (req, res) => {
  res.send('Inclusão Digital Bot — ativo');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Servidor web ativo na porta ${port}`);

  if (!token) {
    console.error('TOKEN não definido em process.env.TOKEN');
    return;
  }

  const bot = new TelegramBot(token, { polling: true, filepath: false });

  const mainMenu = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'O que é acessibilidade digital?', callback_data: 'what' }],
        [{ text: 'Como tornar um site acessível', callback_data: 'how' }],
        [{ text: 'Boas práticas rápidas', callback_data: 'tips' }],
        [{ text: 'Ferramentas e recursos', callback_data: 'tools' }],
        [{ text: 'Leis e direitos (Brasil)', callback_data: 'laws' }],
        [{ text: 'Por que a inclusão importa?', callback_data: 'why' }],
        [{ text: 'Dicas para testar acessibilidade', callback_data: 'test' }],
        [{ text: 'Saiba mais (Instagram)', callback_data: 'learn_more' }]
      ]
    },
    parse_mode: 'HTML'
  };

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcome = `<b>Olá!</b>\n\nSou o <b>Inclusão Digital Bot</b>. Escolha um tópico abaixo para aprender sobre Acessibilidade Digital.`;
    bot.sendMessage(chatId, welcome, mainMenu);
  });

  bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Menu principal:', mainMenu);
  });

  bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = msg.chat.id;

    const backButton = {
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Voltar ao menu', callback_data: 'menu' }]]
      },
      parse_mode: 'HTML'
    };

    try {
      if (data === 'menu') {
        await bot.editMessageText('<b>Menu principal</b>\nEscolha um tópico:', {
          chat_id: chatId,
          message_id: msg.message_id,
          reply_markup: mainMenu.reply_markup,
          parse_mode: 'HTML'
        });
        await bot.answerCallbackQuery(callbackQuery.id);
        return;
      }

      if (data === 'what') {
        const text = `<b>O que é Acessibilidade Digital?</b>\n\nAcessibilidade digital significa projetar e construir conteúdo, ferramentas e serviços online de forma que pessoas com diferentes habilidades — incluindo deficiências visuais, auditivas, motoras ou cognitivas — possam acessar, entender e usar a informação com independência. É sobre igualdade de acesso, não apenas sobre conformidade técnica.`;
        await bot.sendMessage(chatId, text, backButton);
      } else if (data === 'how') {
        const text = `<b>Como tornar um site acessível</b>\n\n1. Use marcação semântica (headings, listas, labels).\n2. Forneça textos alternativos (alt) para imagens.\n3. Garanta navegação por teclado.\n4. Ofereça legendas e transcrições para mídias.\n5. Verifique contraste de cores e tamanhos de fonte.\n6. Teste com leitores de tela.`;
        await bot.sendMessage(chatId, text, backButton);
      } else if (data === 'tips') {
        const text = `<b>Boas práticas rápidas</b>\n\n• Não dependa apenas da cor para transmitir informação.\n• Use texto claro e objetivo.\n• Crie focos visíveis para navegação por teclado.\n• Evite elementos piscantes.\n• Mantenha formulários simples e com instruções.`;
        await bot.sendMessage(chatId, text, backButton);
      } else if (data === 'tools') {
        const text = `<b>Ferramentas e recursos</b>\n\n• NVDA — leitor de tela (gratuito).\n• WAVE — avaliador de acessibilidade.\n• Accessibility Insights — auditoria automática.\n• Contrast Checker — testa contraste entre cores.\n• Lighthouse (Chrome DevTools) — checagem rápida.`;
        await bot.sendMessage(chatId, text, backButton);
      } else if (data === 'laws') {
        const text = `<b>Leis e direitos (Brasil)</b>\n\nA Lei Brasileira de Inclusão (Lei nº 13.146/2015) garante direitos e promove acessibilidade para pessoas com deficiência. Também há normas técnicas (ex.: WCAG) que orientam a implementação. Acessibilidade digital é tanto legal quanto ética.`;
        await bot.sendMessage(chatId, text, backButton);
      } else if (data === 'why') {
        const text = `<b>Por que a inclusão é importante?</b>\n\nInclusão digital amplia oportunidades de educação, trabalho e participação social. Bons projetos acessíveis atendem mais pessoas, melhoram a experiência geral e demonstram responsabilidade social. É um ganho para todos.`;
        await bot.sendMessage(chatId, text, backButton);
      } else if (data === 'test') {
        const text = `<b>Dicas para testar</b>\n\n• Navegue somente com o teclado.\n• Ative um leitor de tela e acompanhe a ordem lógica.\n• Teste contrastes e tamanhos de fonte.\n• Peça pessoas reais com diferentes necessidades para testar.\n• Use ferramentas de auditoria e corrija os pontos críticos.`;
        await bot.sendMessage(chatId, text, backButton);
      } else if (data === 'learn_more') {
        const text = `<b>Saiba mais</b>\n\nSiga o @webacessibilidade no Instagram para materiais, dicas e exemplos práticos:\nhttps://www.instagram.com/webacessibilidade/\n\nSe quiser, peça aqui para receber a cartilha digital ou agendar uma oficina.`;
        const moreButtons = {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Abrir Instagram', url: 'https://www.instagram.com/webacessibilidade/' }],
              [{ text: 'Receber cartilha (PDF)', callback_data: 'get_pdf' }],
              [{ text: '🔙 Voltar ao menu', callback_data: 'menu' }]
            ]
          },
          parse_mode: 'HTML'
        };
        await bot.sendMessage(chatId, text, moreButtons);
      } else if (data === 'get_pdf') {
        await bot.sendMessage(chatId, 'Envie aqui o seu e-mail ou digite "link" para receber o link público da cartilha.');
      } else {
        await bot.sendMessage(chatId, 'Opção desconhecida. Volte ao menu usando o botão.', backButton);
      }

      await bot.answerCallbackQuery(callbackQuery.id);
    } catch (err) {
      console.error('callback_query error', err);
      try {
        await bot.answerCallbackQuery(callbackQuery.id, { text: 'Ocorreu um erro. Tente novamente.' });
      } catch (e) {}
    }
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = String(msg.text || '').trim();

    if (text.toLowerCase() === 'link') {
      await bot.sendMessage(chatId, 'Aqui está o link público para a cartilha: https://inclusao-digital-bot.onrender.com/cartilha.pdf');
      return;
    }

    if (text.includes('@')) {
      await bot.sendMessage(chatId, 'Obrigado! Recebemos seu contato. Em breve enviaremos a cartilha por e-mail (simulação).', {
        reply_markup: {
          inline_keyboard: [[{ text: '🔙 Voltar ao menu', callback_data: 'menu' }]]
        }
      });
      return;
    }

    if (text.startsWith('/')) {
      await bot.sendMessage(chatId, 'Comando não reconhecido. Use /start para abrir o menu ou /menu.', {
        reply_markup: {
          inline_keyboard: [[{ text: '🔙 Voltar ao menu', callback_data: 'menu' }]]
        }
      });
      return;
    }

    await bot.sendMessage(chatId, 'Use o menu para navegar pelos assuntos. Se quiser o menu novamente, envie /menu.', mainMenu);
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
});
