const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');

// Directories to scan
const SECTIONS = {
  FOLHETOS: {
    dir: path.join(ROOT_DIR, 'assets', 'img', 'folhetos'),
    urlPath: 'assets/img/folhetos',
    startMarker: '<!-- START_FOLHETOS -->',
    endMarker: '<!-- END_FOLHETOS -->',
    indent: '            '
  },
  OFERTAS: {
    dir: path.join(ROOT_DIR, 'assets', 'img', 'ofertas'),
    urlPath: 'assets/img/ofertas',
    startMarker: '<!-- START_OFERTAS -->',
    endMarker: '<!-- END_OFERTAS -->',
    indent: '            '
  },
  KITS: {
    dir: path.join(ROOT_DIR, 'assets', 'img', 'kits'),
    urlPath: 'assets/img/kits',
    startMarker: '<!-- START_KITS -->',
    endMarker: '<!-- END_KITS -->',
    indent: '            '
  },
  HAMBURGUERES: {
    dir: path.join(ROOT_DIR, 'assets', 'img', 'hamburgueres'),
    urlPath: 'assets/img/hamburgueres',
    startMarker: '<!-- START_HAMBURGUERES -->',
    endMarker: '<!-- END_HAMBURGUERES -->',
    indent: '            '
  },
  GALERIA: {
    dir: path.join(ROOT_DIR, 'assets', 'img', 'galeria'),
    urlPath: 'assets/img/galeria',
    startMarker: '<!-- START_GALERIA -->',
    endMarker: '<!-- END_GALERIA -->',
    indent: '            '
  }
};

const NAME_MAP = {
  'mussarela': 'Mussarela',
  'alcatra': 'Alcatra',
  'costela': 'Costela',
  'pao-queijo': 'Pão de Queijo',
  'carne-moida': 'Carne Moída',
  'kibe-almondegas': 'Kibe e Almôndegas',
  'kibe-500g': 'Kibe 500g',
  'kafta': 'Kafta',
  'hamburguer': 'Hambúrguer',
  'espetos': 'Espetos',
  'economico': 'Kit Econômico',
  'mistura': 'Kit Mistura',
  'tradicional': 'Tradicional',
  'cheddar': 'Cheddar',
  'bacon-queijo-rucula': 'Bacon, Queijo e Rúcula',
  'frangos-assando': 'Frangos Assando',
  'frango-assado': 'Frango Assado',
  'espetinhos-assados': 'Espetinhos Assados',
  'carne-assada': 'Carne Assada'
};

function formatTitle(filename) {
  const baseName = path.parse(filename).name;
  if (NAME_MAP[baseName]) return NAME_MAP[baseName];

  let name = baseName;
  name = name.replace(/^(oferta|promo|kit|hamburguer)-/i, '');
  name = name.replace(/[-_]+/g, ' ');
  
  return name.split(' ').map(w => {
    if (['de', 'da', 'do', 'e', 'em', 'com', 'para'].includes(w.toLowerCase())) return w.toLowerCase();
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ').replace(/^\w/, c => c.toUpperCase());
}

const KITS_DATA = {
  'economico': {
    title: 'KIT ECONÔMICO',
    selo: 'ECONOMIZE',
    price: '109',
    cents: ',90',
    sub: 'Bandejas de 500g',
    items: [
      'Coxão mole bife',
      'Músculo ou acém em cubos',
      'Linguiça suína',
      'Bisteca suína',
      'Filé de peito de frango',
      'Carne moída',
      'Coxinha da asa'
    ],
    wppText: 'Quero o Kit Economico.'
  },
  'mistura': {
    title: 'KIT MISTURA',
    selo: 'MAIS VARIEDADE',
    price: '129',
    cents: ',90',
    sub: 'Bandejas de 500g',
    items: [
      'Coxão mole bife',
      'Músculo ou acém em cubos',
      'Linguiça suína',
      'Nuggets',
      'Bisteca suína',
      'Filé de peito de frango',
      'Carne moída',
      'Coxinha da asa',
      'Linguiça cabo de rédeo'
    ],
    wppText: 'Quero o Kit Mistura.'
  }
};

const HAMBURGUERES_DATA = {
  'tradicional': {
    title: 'TRADICIONAL',
    description: 'Blend bovino temperado no ponto certo. O clássico que nunca falha.'
  },
  'cheddar': {
    title: 'CHEDDAR',
    description: 'Carne suculenta recheada com cheddar cremoso. Irresistível a cada mordida.'
  },
  'costela': {
    title: 'COSTELA',
    description: 'Blend especial com costela bovina. Sabor marcante e textura macia.'
  },
  'bacon-queijo-rucula': {
    title: 'BACON, QUEIJO E RÚCULA',
    description: 'Combinação cheia de sabor: bacon crocante, queijo derretido e rúcula fresca.'
  }
};

const IMAGE_EXTENSIONS = ['.webp', '.jpeg', '.jpg', '.png', '.svg', '.gif'];

function getImagesInDir(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
}

function generateFolhetosHTML(images, indent, urlPath) {
  return images.map((filename, index) => {
    const badge = index === 0 ? 'NOVO!' : 'IMPERDÍVEL';
    const selo = index === 0 ? 'VÁLIDO ATÉ DOMINGO' : 'SÓ ESTA SEMANA';
    const delay = index % 2 === 1 ? ' reveal-delay' : '';
    const priorityAttr = index === 0 ? 'width="800" height="1000" fetchpriority="high"' : 'width="800" height="1000" loading="lazy"';
    const num = index + 1;
    return `${indent}<figure class="folheto-card reveal${delay} js-lightbox" tabindex="0" role="button" aria-label="Ampliar folheto ${num}">\n` +
           `${indent}  <span class="folheto-badge">${badge}</span>\n` +
           `${indent}  <span class="folheto-selo">${selo}</span>\n` +
           `${indent}  <img src="${urlPath}/${filename}" alt="Folheto de ofertas da semana - Casa de Carnes Mais Sabor" ${priorityAttr}>\n` +
           `${indent}</figure>`;
  }).join('\n\n');
}

function generateOfertasHTML(images, indent, urlPath) {
  return images.map((filename, index) => {
    const friendlyName = formatTitle(filename);
    const delay = index % 2 === 1 ? ' reveal-delay' : '';
    return `${indent}<figure class="oferta-card reveal${delay} js-lightbox" tabindex="0" role="button" aria-label="Ampliar promoção de ${friendlyName}">\n` +
           `${indent}  <img src="${urlPath}/${filename}" alt="Promoção ${friendlyName} - Casa de Carnes Mais Sabor" loading="lazy">\n` +
           `${indent}</figure>`;
  }).join('\n');
}

function generateKitsHTML(images, indent, urlPath) {
  return images.map((filename, index) => {
    const baseName = path.parse(filename).name;
    const friendlyName = formatTitle(filename);
    const delay = index % 2 === 1 ? ' reveal-delay' : '';
    const kit = KITS_DATA[baseName] || {
      title: friendlyName.toUpperCase(),
      selo: 'NOVIDADE',
      price: '99',
      cents: ',90',
      sub: 'Consulte tamanhos e itens',
      items: [
        'Consulte a composição pelo WhatsApp!',
      ],
      wppText: `Quero o Kit ${friendlyName}.`
    };

    const itemsHTML = kit.items.map(item => `${indent}    <li>${item}</li>`).join('\n');

    return `${indent}<article class="kit-card reveal${delay}">\n` +
           `${indent}  <div class="kit-media js-lightbox" tabindex="0" role="button" aria-label="Ampliar ${kit.title}">\n` +
           `${indent}    <img src="${urlPath}/${filename}" alt="${kit.title} - Casa de Carnes Mais Sabor" loading="lazy">\n` +
           `${indent}  </div>\n` +
           `${indent}  <div class="kit-body">\n` +
           `${indent}    <span class="kit-selo">${kit.selo}</span>\n` +
           `${indent}    <h3>${kit.title}</h3>\n` +
           `${indent}    <p class="kit-price"><span class="kit-price-currency">R$</span>${kit.price}<span class="kit-price-cents">${kit.cents}</span></p>\n` +
           `${indent}    <p class="kit-sub">${kit.sub}</p>\n` +
           `${indent}    <ul class="kit-list">\n` +
           `${itemsHTML}\n` +
           `${indent}    </ul>\n` +
           `${indent}    <a class="btn btn-secondary" href="https://wa.me/5516996344348?text=${encodeURIComponent(kit.wppText)}" target="_blank" rel="noopener">Pedir no Zap</a>\n` +
           `${indent}  </div>\n` +
           `${indent}</article>`;
  }).join('\n\n');
}

function generateHamburgueresHTML(images, indent, urlPath) {
  return images.map((filename, index) => {
    const baseName = path.parse(filename).name;
    const friendlyName = formatTitle(filename);
    const delay = index % 2 === 1 ? ' reveal-delay' : '';
    const burger = HAMBURGUERES_DATA[baseName] || {
      title: friendlyName.toUpperCase(),
      description: `Hambúrguer artesanal premium de ${friendlyName}. Peça pelo WhatsApp!`
    };

    return `${indent}<figure class="hamburguer-card reveal${delay} js-lightbox" tabindex="0" role="button" aria-label="Ampliar Hambúrguer ${friendlyName}">\n` +
           `${indent}  <img src="${urlPath}/${filename}" alt="Hambúrguer ${friendlyName} - Casa de Carnes Mais Sabor" loading="lazy">\n` +
           `${indent}  <figcaption>\n` +
           `${indent}    <h3>${burger.title}</h3>\n` +
           `${indent}    <p>${burger.description}</p>\n` +
           `${indent}  </figcaption>\n` +
           `${indent}</figure>`;
  }).join('\n\n');
}

function generateGaleriaHTML(images, indent, urlPath) {
  return images.map((filename, index) => {
    const friendlyName = formatTitle(filename);
    const delay = index % 2 === 1 ? ' reveal-delay' : '';
    return `${indent}<figure class="galeria-card reveal${delay} js-lightbox" tabindex="0" role="button" aria-label="Ampliar ${friendlyName}">\n` +
           `${indent}  <img src="${urlPath}/${filename}" alt="${friendlyName} - Casa de Carnes Mais Sabor" loading="lazy">\n` +
           `${indent}</figure>`;
  }).join('\n');
}

// Main execution
function sync() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`Erro: Arquivo index.html não encontrado em ${INDEX_HTML_PATH}`);
    process.exit(1);
  }

  let htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
  let totalSynchronized = 0;

  for (const [sectionKey, section] of Object.entries(SECTIONS)) {
    const images = getImagesInDir(section.dir);
    let newHTML = '';

    if (images.length === 0) {
      newHTML = `${section.indent}<!-- Nenhuma imagem encontrada nesta pasta -->`;
    } else {
      switch (sectionKey) {
        case 'FOLHETOS':
          newHTML = generateFolhetosHTML(images, section.indent, section.urlPath);
          break;
        case 'OFERTAS':
          newHTML = generateOfertasHTML(images, section.indent, section.urlPath);
          break;
        case 'KITS':
          newHTML = generateKitsHTML(images, section.indent, section.urlPath);
          break;
        case 'HAMBURGUERES':
          newHTML = generateHamburgueresHTML(images, section.indent, section.urlPath);
          break;
        case 'GALERIA':
          newHTML = generateGaleriaHTML(images, section.indent, section.urlPath);
          break;
      }
    }

    const startIndex = htmlContent.indexOf(section.startMarker);
    const endIndex = htmlContent.indexOf(section.endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
      const before = htmlContent.substring(0, startIndex + section.startMarker.length);
      const after = htmlContent.substring(endIndex);
      htmlContent = before + '\n' + newHTML + '\n' + after;
      console.log(`✓ Seção [${sectionKey}] atualizada com sucesso (${images.length} imagens encontradas)`);
      totalSynchronized += images.length;
    } else {
      console.warn(`⚠ Marcadores não encontrados para a seção [${sectionKey}] em index.html`);
    }
  }

  fs.writeFileSync(INDEX_HTML_PATH, htmlContent, 'utf8');
  console.log(`Sincronização completa! Total de ${totalSynchronized} imagens mapeadas nas sessões do site.`);
}

sync();
