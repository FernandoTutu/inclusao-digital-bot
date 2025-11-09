const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const TOKEN = 'SEU_TOKEN_AQUI';
const bot = new TelegramBot(TOKEN, { polling: true });

const STORE_DIR = path.join(__dirname, "store");
if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR);
const DOCS_FILE = path.join(STORE_DIR, "docs.json");

const DEFAULT_DOCS = [
  {
    id: "o_que_e",
    title: "O que é Acessibilidade Digital?",
    text: "Acessibilidade digital significa projetar sites, apps e conteúdos para que todas as pessoas possam usá-los, incluindo pessoas com deficiência. Isso inclui compatibilidade com leitores de tela, navegação por teclado, textos alternativos para imagens, legendas em vídeos e documentos acessíveis."
  },
  {
    id: "boas_praticas",
    title: "Boas práticas gerais",
    text: "Boas práticas: fornecer textos alternativos em imagens (alt), usar títulos e cabeçalhos semânticos, garantir contraste de cores suficiente, tornar campos de formulário claramente rotulados, evitar conteúdo piscante, legendar vídeos e fornecer versões em texto de documentos."
  },
  {
    id: "imagens_alt",
    title: "Imagens e texto alternativo (alt text)",
    text: "O texto alternativo (alt) descreve a imagem para quem usa leitores de tela. Deve ser breve e informativo, explicando o propósito da imagem. Para imagens decorativas, use alt vazio (alt=\"\"). Evite descrições excessivamente longas; se precisar, ofereça uma descrição detalhada separada."
  },
  {
    id: "videos_legendas",
    title: "Vídeos: legendas e descrição",
    text: "Sempre ofereça legendas sincronizadas para diálogos e informações relevantes. Para pessoas com deficiência visual, considere fornecer audiodescrição (descrição em áudio do que aparece visualmente). Inclua transcrições textuais quando possível."
  },
  {
    id: "pdfs_acessiveis",
    title: "Como criar PDFs acessíveis",
    text: "Ao gerar PDFs: certifique-se de que o PDF tenha texto pesquisável (não apenas imagem), use marcadores/headings semânticos, inclua descrições alternativas para imagens e verifique com ferramentas de acessibilidade (ex.: leitor de tela). Evite digitalizações sem OCR."
  },
  {
    id: "formularios",
    title: "Formulários acessíveis",
    text: "Formulários devem ter labels claros, instruções visíveis, foco lógico ao tabular, mensagens de erro compreensíveis e associações corretas entre labels e campos. Evite placeholders como única instrução, pois não são lidos consistentemente por leitores de tela."
  },
  {
    id: "legislacao",
    title: "Leis, normas e referências (WCAG / Brasil)",
    text: "Padrões internacionais: WCAG (Web Content Accessibility Guidelines). No Brasil, há legislações e decretos que exigem acessibilidade em serviços públicos e materiais digitais. Consulte normas técnicas e orientações locais para adequação legal."
  },
  {
    id: "recursos_contatos",
    title: "Recursos e contatos úteis",
    text: "Recursos úteis:\n• SaferNet (www.safernet.org.br)\n• Ouvidorias locais e Defensoria Pública\n• Delegacias de crimes cibernéticos\n• Instagram: https://www.instagram.com/webacessibilidade/\nUse esses canais para orientação, denúncias e materiais de apoio."
  }
];

function loadDocs() {
  try {
    if (!fs.existsSync(DOCS_FILE)) {
      fs.writeFileSync(DOCS_FILE, JSON.stringify(DEFAULT_DOCS, null, 2));
      return DEFAULT_DOCS.slice();
    }
    const raw = fs.readFileSync(DOCS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const ids = new Set(parsed.map(p => p.id));
    const missing = DEFAULT_DOCS.some(d => !ids.has(d.id));
    if (missing) {
      fs.writeFileSync(DOCS_FILE, JSON.stringify(DEFAULT_DOCS, null, 2));
      return DEFAULT_DOCS.slice();
    }
    return parsed;
  } catch (e) {
    fs.writeFileSync(DOCS_FILE, JSON.stringify(DEFAULT_DOCS, null, 2));
    return DEFAULT_DOCS.slice();
  }
}

let docs = loadDocs();

function getDocById(id) {
  let doc = docs.find(d => d.id === id);
  if (doc) return doc;
  doc = docs.find(d => d.id && d.id.includes(id));
  if (doc) return doc;
  doc = docs.find(d => d.title && d.title.toLowerCase().includes(id.replace(/_/g, ' ').toLowerCase()));
  if (doc) return doc;
  doc = docs.find(d => d.id && d.id.replace(//g, '').toLowerCase() === id.replace(//g, '').toLowerCase());
  return doc || null;
}

function mainMenuOptions() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "O que é Acessibilidade Digital?", callback_data: "o_que_e" }],
        [{ text: "Boas práticas gerais", callback_data: "boas_praticas" }, { text: "Imagens e alt text", callback_data: "imagens_alt" }],
        [{ text: "Vídeos: legendas & descrição", callback_data: "videos_legendas" }, { text: "PDFs acessíveis", callback_data: "pdfs_acessiveis" }],
        [{ text: "Formulários acessíveis", callback_data: "formularios" }, { text: "Leis e normas (WCAG)", callback_data: "legislacao" }],
        [{ text: "Recursos & Contatos (Instagram)", callback_data: "recursos_contatos" }],
        [{ text: "🔄 Recarregar conteúdo", callback_data: "reload_docs" }]
      ]
    }
  };
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "👋 Bem-vindo(a) ao Inclusão Digital Bot — tema: Acessibilidade Digital.\nEscolha uma opção no menu abaixo para obter informações detalhadas.", { parse_mode: "Markdown", ...mainMenuOptions() });
});

bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "📚 Menu — Acessibilidade Digital:", mainMenuOptions());
});

bot.on('callback_query', async (callbackQuery) => {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;

  if (data === "menu_back") {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.sendMessage(chatId, "📚 Menu — Acessibilidade Digital:", mainMenuOptions());
    return;
  }

  if (data === "reload_docs") {
    docs = DEFAULT_DOCS.slice();
    fs.writeFileSync(DOCS_FILE, JSON.stringify(docs, null, 2));
    await bot.answerCallbackQuery(callbackQuery.id, { text: "Conteúdo recarregado." });
    await bot.sendMessage(chatId, "Conteúdo recarregado. Volte ao menu:", mainMenuOptions());
    return;
  }

  const doc = getDocById(data);
  if (doc) {
    const text = *${doc.title}*\n\n${doc.text}\n\n🔙 Pressione abaixo para voltar ao menu.;
    await bot.answerCallbackQuery(callbackQuery.id).catch(()=>{});
    await bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅ Voltar ao menu", callback_data: "menu_back" }]
        ]
      }
    });
    return;
  }

  await bot.answerCallbackQuery(callbackQuery.id, { text: "Opção não reconhecida. Abrindo menu..." });
  await bot.sendMessage(chatId, "Opção não reconhecida. Abra o menu novamente:", mainMenuOptions());
  console.warn("Callback desconhecido recebido:", data);
});

bot.on('message', (msg) => {
  const text = (msg.text || "").trim();
  if (text === '/start' || text === '/menu') return;
  bot.sendMessage(msg.chat.id, "Use o menu para escolher uma opção sobre Acessibilidade Digital:", mainMenuOptions());
});

bot.on('polling_error', err => {
  console.error('polling_error', err);
});

console.log('Bot iniciado e aguardando interações...');