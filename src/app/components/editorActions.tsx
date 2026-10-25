import React from 'react';
import type { Editor } from '@tiptap/react';
import {
  MdChecklist,
  MdCode,
  MdDataObject,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatClear,
  MdFormatColorFill,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdHorizontalRule,
  MdKeyboardReturn,
  MdLink,
  MdLinkOff,
  MdOndemandVideo,
  MdRedo,
  MdStrikethroughS,
  MdSubscript,
  MdSuperscript,
  MdTableChart,
  MdUndo,
  MdViewCarousel,
} from 'react-icons/md';

const DEFAULT_HIGHLIGHT = '#fff59d';

export const promptForLink = (editor: Editor) => {
  const previousUrl = editor.getAttributes('link').href as string | undefined;
  const url = window.prompt('URL del enlace (vacío para quitarlo):', previousUrl ?? 'https://');

  if (url === null) return;

  if (url.trim() === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
};

export type ToolbarAction = {
  title: string;
  content: React.ReactNode;
  run: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
};

export const HISTORY_ACTIONS: ToolbarAction[] = [
  {
    title: 'Deshacer (Ctrl+Z)',
    content: <MdUndo />,
    run: (e) => e.chain().focus().undo().run(),
    isDisabled: (e) => !e.can().undo(),
  },
  {
    title: 'Rehacer (Ctrl+Shift+Z)',
    content: <MdRedo />,
    run: (e) => e.chain().focus().redo().run(),
    isDisabled: (e) => !e.can().redo(),
  },
];

export const MARK_ACTIONS: ToolbarAction[] = [
  {
    title: 'Negrita (Ctrl+B)',
    content: <MdFormatBold />,
    run: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    title: 'Cursiva (Ctrl+I)',
    content: <MdFormatItalic />,
    run: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    title: 'Subrayado (Ctrl+U)',
    content: <MdFormatUnderlined />,
    run: (e) => e.chain().focus().toggleUnderline().run(),
    isActive: (e) => e.isActive('underline'),
  },
  {
    title: 'Tachado',
    content: <MdStrikethroughS />,
    run: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive('strike'),
  },
  {
    title: 'Código en línea',
    content: <MdCode />,
    run: (e) => e.chain().focus().toggleCode().run(),
    isActive: (e) => e.isActive('code'),
  },
  {
    title: 'Subíndice',
    content: <MdSubscript />,
    run: (e) => e.chain().focus().toggleSubscript().run(),
    isActive: (e) => e.isActive('subscript'),
  },
  {
    title: 'Superíndice',
    content: <MdSuperscript />,
    run: (e) => e.chain().focus().toggleSuperscript().run(),
    isActive: (e) => e.isActive('superscript'),
  },
];

export const HIGHLIGHT_ACTIONS: ToolbarAction[] = [
  {
    title: 'Resaltar',
    content: <MdFormatColorFill />,
    run: (e) => e.chain().focus().toggleHighlight({ color: DEFAULT_HIGHLIGHT }).run(),
    isActive: (e) => e.isActive('highlight'),
  },
  {
    title: 'Quitar formato',
    content: <MdFormatClear />,
    run: (e) => e.chain().focus().unsetAllMarks().clearNodes().run(),
  },
];

export const LINK_ACTIONS: ToolbarAction[] = [
  {
    title: 'Insertar/editar enlace (Ctrl+K)',
    content: <MdLink />,
    run: promptForLink,
    isActive: (e) => e.isActive('link'),
  },
  {
    title: 'Quitar enlace',
    content: <MdLinkOff />,
    run: (e) => e.chain().focus().extendMarkRange('link').unsetLink().run(),
    isDisabled: (e) => !e.isActive('link'),
  },
];

const ALIGNMENTS = [
  { value: 'left', title: 'Alinear a la izquierda', icon: <MdFormatAlignLeft /> },
  { value: 'center', title: 'Centrar', icon: <MdFormatAlignCenter /> },
  { value: 'right', title: 'Alinear a la derecha', icon: <MdFormatAlignRight /> },
  { value: 'justify', title: 'Justificar', icon: <MdFormatAlignJustify /> },
];

export const ALIGN_ACTIONS: ToolbarAction[] = ALIGNMENTS.map(({ value, title, icon }) => ({
  title,
  content: icon,
  run: (e) => e.chain().focus().setTextAlign(value).run(),
  isActive: (e) => e.isActive({ textAlign: value }),
}));

export const LIST_ACTIONS: ToolbarAction[] = [
  {
    title: 'Lista con viñetas',
    content: <MdFormatListBulleted />,
    run: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive('bulletList'),
  },
  {
    title: 'Lista numerada',
    content: <MdFormatListNumbered />,
    run: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    title: 'Lista de tareas',
    content: <MdChecklist />,
    run: (e) => e.chain().focus().toggleTaskList().run(),
    isActive: (e) => e.isActive('taskList'),
  },
];

export const BLOCK_ACTIONS: ToolbarAction[] = [
  {
    title: 'Cita',
    content: <MdFormatQuote />,
    run: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive('blockquote'),
  },
  {
    title: 'Bloque de código',
    content: <MdDataObject />,
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
    isActive: (e) => e.isActive('codeBlock'),
  },
  {
    title: 'Línea horizontal',
    content: <MdHorizontalRule />,
    run: (e) => e.chain().focus().setHorizontalRule().run(),
  },
  {
    title: 'Salto de línea (Shift+Enter)',
    content: <MdKeyboardReturn />,
    run: (e) => e.chain().focus().setHardBreak().run(),
  },
];

const editImageAlt = (editor: Editor) => {
  const currentAlt = (editor.getAttributes('image').alt as string | undefined) ?? '';
  const alt = window.prompt('Texto alternativo de la imagen:', currentAlt);
  if (alt !== null) {
    editor.chain().focus().updateAttributes('image', { alt }).run();
  }
};

const addCarousel = (editor: Editor) => {
  const urls = window.prompt('URLs de las imágenes separadas por comas:');
  if (urls) {
    editor.commands.insertCarousel({
      images: urls
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
    });
  }
};

const addYoutubeVideo = (editor: Editor) => {
  const url = window.prompt('URL del vídeo de YouTube:');
  if (url) {
    editor.commands.setYoutubeVideo({ src: url.trim() });
  }
};

export const EMBED_ACTIONS: ToolbarAction[] = [
  {
    title: 'Editar texto alternativo de la imagen seleccionada',
    content: 'Alt',
    run: editImageAlt,
    isDisabled: (e) => !e.isActive('image'),
  },
  { title: 'Insertar carrusel de imágenes', content: <MdViewCarousel />, run: addCarousel },
  { title: 'Insertar vídeo de YouTube', content: <MdOndemandVideo />, run: addYoutubeVideo },
  {
    title: 'Insertar tabla 3×3',
    content: <MdTableChart />,
    run: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    isDisabled: (e) => e.isActive('table'),
  },
];

export const TABLE_ACTIONS: ToolbarAction[] = [
  {
    title: 'Añadir columna antes',
    content: '← Col',
    run: (e) => e.chain().focus().addColumnBefore().run(),
  },
  {
    title: 'Añadir columna después',
    content: 'Col →',
    run: (e) => e.chain().focus().addColumnAfter().run(),
  },
  {
    title: 'Eliminar columna',
    content: '− Col',
    run: (e) => e.chain().focus().deleteColumn().run(),
  },
  {
    title: 'Añadir fila antes',
    content: '↑ Fila',
    run: (e) => e.chain().focus().addRowBefore().run(),
  },
  {
    title: 'Añadir fila después',
    content: 'Fila ↓',
    run: (e) => e.chain().focus().addRowAfter().run(),
  },
  { title: 'Eliminar fila', content: '− Fila', run: (e) => e.chain().focus().deleteRow().run() },
  {
    title: 'Combinar celdas',
    content: 'Combinar',
    run: (e) => e.chain().focus().mergeCells().run(),
    isDisabled: (e) => !e.can().mergeCells(),
  },
  {
    title: 'Dividir celda',
    content: 'Dividir',
    run: (e) => e.chain().focus().splitCell().run(),
    isDisabled: (e) => !e.can().splitCell(),
  },
  {
    title: 'Alternar fila de cabecera',
    content: 'Cabecera',
    run: (e) => e.chain().focus().toggleHeaderRow().run(),
  },
  {
    title: 'Eliminar tabla',
    content: 'Borrar tabla',
    run: (e) => e.chain().focus().deleteTable().run(),
  },
];
