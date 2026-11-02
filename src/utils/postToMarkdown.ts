import TurndownService from 'turndown';
import { fetchPostById } from './api';

type ExportablePost = {
  id: number;
  title: string;
  slug?: string | null;
  content: string;
  coverUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: { name?: string | null } | null;
  labels?: { name: string }[];
};

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  hr: '---',
});

// Turndown no escapa "<": un texto como "&lt;hr&gt;" acabaría siendo una etiqueta HTML real
const escapeMarkdown = turndown.escape.bind(turndown);
turndown.escape = (text) => escapeMarkdown(text).replace(/</g, '\\<');

// Markdown no tiene equivalente para estos formatos; como HTML en línea se siguen viendo igual
turndown.keep(['u', 'sub', 'sup', 'mark']);

turndown.addRule('strikethrough', {
  filter: ['s', 'del'],
  replacement: (content) => `~~${content}~~`,
});

const listItemPrefix = (item: HTMLElement) => {
  if (item.getAttribute('data-type') === 'taskItem') {
    return `- [${item.getAttribute('data-checked') === 'true' ? 'x' : ' '}] `;
  }
  const list = item.parentElement;
  if (list?.nodeName !== 'OL') return '- ';
  const start = Number(list.getAttribute('start') ?? 1);
  return `${start + Array.from(list.children).indexOf(item)}. `;
};

// Sustituye a la regla por defecto, que deja líneas con solo espacios por el <p> de cada <li>
// de Tiptap y no reconoce las tareas, cuya casilla va en un <label> y su texto en un <div>
turndown.addRule('listItem', {
  filter: 'li',
  replacement: (content, node) => {
    const prefix = listItemPrefix(node as HTMLElement);
    const indent = ' '.repeat(prefix.startsWith('- ') ? 2 : prefix.length);
    const body = content.trim().replace(/\n(?=.)/g, `\n${indent}`);
    return `${prefix}${body}${node.nextSibling ? '\n' : ''}`;
  },
});

// Sin esto las imágenes de un carrusel salen pegadas en la misma línea
turndown.addRule('carouselImage', {
  filter: (node) =>
    node.nodeName === 'IMG' && node.parentElement?.getAttribute('data-type') === 'carousel',
  replacement: (_content, node) => {
    const image = node as HTMLElement;
    return `\n\n![${image.getAttribute('alt') ?? ''}](${image.getAttribute('src')})\n\n`;
  },
});

// Un iframe no se puede representar en Markdown: se exporta como enlace al vídeo
turndown.addRule('youtube', {
  filter: 'iframe',
  replacement: (_content, node) => {
    const src = (node as HTMLElement).getAttribute('src') ?? '';
    const videoId = src.match(/\/embed\/([\w-]+)/)?.[1];
    const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : src;
    return `\n\n[Ver vídeo](${url})\n\n`;
  },
});

const cellToMarkdown = (cell: Element) =>
  turndown
    .turndown(cell.innerHTML)
    .trim()
    .replace(/\s*\n+\s*/g, '<br>')
    .replace(/\|/g, '\\|');

const toTableRow = (cells: string[]) => `| ${cells.join(' | ')} |`;

// Regla propia en vez de turndown-plugin-gfm: ese plugin deja como HTML las tablas de Tiptap
// (por el <colgroup>) y rompe las filas con el <p> que Tiptap mete en cada celda
turndown.addRule('table', {
  filter: 'table',
  replacement: (_content, node) => {
    const table = node as HTMLElement;
    const cells = Array.from(table.querySelectorAll('th, td'));
    const hasMergedCells = cells.some(
      (cell) =>
        Number(cell.getAttribute('colspan') ?? 1) > 1 ||
        Number(cell.getAttribute('rowspan') ?? 1) > 1,
    );
    // Markdown no admite celdas combinadas ni tablas anidadas: se conservan como HTML
    if (hasMergedCells || table.querySelector('table')) {
      return `\n\n${table.outerHTML}\n\n`;
    }

    const [header, ...rows] = Array.from(table.querySelectorAll('tr')).map((row) =>
      Array.from(row.children).map(cellToMarkdown),
    );
    if (!header) return '';
    const separator = header.map(() => '---');
    const lines = [header, separator, ...rows].map(toTableRow);
    return `\n\n${lines.join('\n')}\n\n`;
  },
});

const buildFrontmatter = (post: ExportablePost) => {
  const fields: [string, unknown][] = [
    ['title', post.title],
    ['slug', post.slug],
    ['author', post.author?.name],
    ['date', post.createdAt],
    ['updated', post.updatedAt],
    ['published', post.published],
    ['labels', post.labels?.map((label) => label.name)],
    ['cover', post.coverUrl],
    ['metaTitle', post.metaTitle],
    ['metaDescription', post.metaDescription],
  ];
  // JSON.stringify produce valores válidos en YAML, con comillas y saltos de línea ya escapados
  const lines = fields
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return `---\n${lines.join('\n')}\n---`;
};

export const postToMarkdown = (post: ExportablePost) => {
  const sections = [buildFrontmatter(post), `# ${post.title}`];
  if (post.coverUrl) sections.push(`![${post.title}](${post.coverUrl})`);
  sections.push(turndown.turndown(post.content));
  return `${sections.join('\n\n')}\n`;
};

const downloadFile = (fileName: string, content: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

// El listado de posts no incluye las etiquetas, por eso se pide el post completo
export const exportPostAsMarkdown = async (id: number) => {
  const post: ExportablePost = await fetchPostById(id);
  downloadFile(`${post.slug || `articulo-${post.id}`}.md`, postToMarkdown(post));
};
