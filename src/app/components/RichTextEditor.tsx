'use client';

import React from 'react';
import { BubbleMenu, EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import CarouselExtension from './CarouselExtension';
import EditorToolbar, { ToolbarButton } from './EditorToolbar';
import { promptForLink } from './editorActions';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdLink } from 'react-icons/md';

const lowlight = createLowlight(common);

// Palabras por minuto para estimar el tiempo de lectura
const WORDS_PER_MINUTE = 200;

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;
  return <EditorToolbar editor={editor} />;
};

// Menú flotante sobre el texto seleccionado con los formatos más usados
const SelectionMenu = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor: e, from, to }) =>
        from !== to && !e.isActive('image') && !e.isActive('codeBlock')
      }
    >
      <div className="bubble-menu">
        <ToolbarButton
          title="Negrita"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <MdFormatBold />
        </ToolbarButton>
        <ToolbarButton
          title="Cursiva"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <MdFormatItalic />
        </ToolbarButton>
        <ToolbarButton
          title="Subrayado"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        >
          <MdFormatUnderlined />
        </ToolbarButton>
        <ToolbarButton
          title="Enlace"
          onClick={() => promptForLink(editor)}
          isActive={editor.isActive('link')}
        >
          <MdLink />
        </ToolbarButton>
      </div>
    </BubbleMenu>
  );
};

const EditorFooter = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const words = editor.storage.characterCount.words() as number;
  const characters = editor.storage.characterCount.characters() as number;
  const readingMinutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return (
    <div className="editor-footer">
      {words} palabras · {characters} caracteres · ~{readingMinutes} min de lectura
    </div>
  );
};

const extensions = [
  StarterKit.configure({ codeBlock: false }),
  TextStyle,
  Color,
  Underline,
  Link.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => {
          promptForLink(this.editor);
          return true;
        },
      };
    },
  }).configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
  }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Highlight.configure({ multicolor: true }),
  Subscript,
  Superscript,
  TaskList,
  TaskItem.configure({ nested: true }),
  CodeBlockLowlight.configure({ lowlight }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'rich-text-table',
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  Image,
  Youtube.configure({ nocookie: true, width: 640, height: 360 }),
  CarouselExtension,
  Placeholder.configure({ placeholder: 'Empieza a escribir tu artículo…' }),
  CharacterCount,
];

type RichTextEditorProps = {
  value: string;
  onChange: (content: string) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="rich-text-editor">
      <EditorProvider
        slotBefore={<MenuBar />}
        slotAfter={<EditorFooter />}
        extensions={extensions}
        content={value}
        onUpdate={({ editor }) => onChange(editor.getHTML())}
      >
        <SelectionMenu />
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;
