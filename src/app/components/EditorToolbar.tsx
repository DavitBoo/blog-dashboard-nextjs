'use client';

import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { Level } from '@tiptap/extension-heading';
import { MdFormatColorText, MdImage } from 'react-icons/md';
import {
  ALIGN_ACTIONS,
  BLOCK_ACTIONS,
  EMBED_ACTIONS,
  HIGHLIGHT_ACTIONS,
  HISTORY_ACTIONS,
  LINK_ACTIONS,
  LIST_ACTIONS,
  MARK_ACTIONS,
  TABLE_ACTIONS,
  type ToolbarAction,
} from './editorActions';
import MediaPickerModal from './MediaPickerModal';

const HEADING_LEVELS: Level[] = [1, 2, 3, 4, 5, 6];

type ToolbarButtonProps = {
  onClick: () => void;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

// type="button" es imprescindible: el editor vive dentro de un <form> y un
// botón sin tipo lo enviaría al hacer clic.
export const ToolbarButton = ({
  onClick,
  title,
  isActive = false,
  disabled = false,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    aria-pressed={isActive}
    disabled={disabled}
    className={isActive ? 'active' : ''}
  >
    {children}
  </button>
);

const Divider = () => <span className="toolbar-divider" aria-hidden="true" />;

const ActionGroup = ({ editor, actions }: { editor: Editor; actions: ToolbarAction[] }) => (
  <>
    {actions.map((action) => (
      <ToolbarButton
        key={action.title}
        title={action.title}
        onClick={() => action.run(editor)}
        isActive={action.isActive?.(editor)}
        disabled={action.isDisabled?.(editor)}
      >
        {action.content}
      </ToolbarButton>
    ))}
  </>
);

const BlockTypeSelect = ({ editor }: { editor: Editor }) => {
  const currentLevel = HEADING_LEVELS.find((level) => editor.isActive('heading', { level }));

  const setBlockType = (value: string) => {
    if (value === 'p') {
      editor.chain().focus().setParagraph().run();
      return;
    }
    editor
      .chain()
      .focus()
      .setHeading({ level: Number(value.slice(1)) as Level })
      .run();
  };

  return (
    <select
      className="toolbar-select"
      aria-label="Tipo de bloque"
      value={currentLevel ? `h${currentLevel}` : 'p'}
      onChange={(e) => setBlockType(e.target.value)}
    >
      <option value="p">Párrafo</option>
      {HEADING_LEVELS.map((level) => (
        <option key={level} value={`h${level}`}>
          Título {level}
        </option>
      ))}
    </select>
  );
};

const TextColorPicker = ({ editor }: { editor: Editor }) => (
  <label className="toolbar-color" title="Color del texto">
    <MdFormatColorText />
    <input
      type="color"
      aria-label="Color del texto"
      value={(editor.getAttributes('textStyle').color as string | undefined) ?? '#000000'}
      onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
    />
  </label>
);

const EditorToolbar = ({ editor }: { editor: Editor }) => {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const handleImageSelect = (url: string) => {
    const alt = window.prompt('Texto alternativo de la imagen (accesibilidad/SEO):', '') ?? '';
    editor.chain().focus().setImage({ src: url, alt }).run();
    setIsMediaPickerOpen(false);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-row" role="toolbar" aria-label="Formato del texto">
        <ActionGroup editor={editor} actions={HISTORY_ACTIONS} />
        <Divider />
        <BlockTypeSelect editor={editor} />
        <Divider />
        <ActionGroup editor={editor} actions={MARK_ACTIONS} />
        <Divider />
        <TextColorPicker editor={editor} />
        <ActionGroup editor={editor} actions={HIGHLIGHT_ACTIONS} />
        <Divider />
        <ActionGroup editor={editor} actions={LINK_ACTIONS} />
        <Divider />
        <ActionGroup editor={editor} actions={ALIGN_ACTIONS} />
      </div>

      <div className="toolbar-row" role="toolbar" aria-label="Bloques e inserciones">
        <ActionGroup editor={editor} actions={LIST_ACTIONS} />
        <Divider />
        <ActionGroup editor={editor} actions={BLOCK_ACTIONS} />
        <Divider />
        <ToolbarButton
          title="Insertar imagen de la mediateca"
          onClick={() => setIsMediaPickerOpen(true)}
        >
          <MdImage />
        </ToolbarButton>
        <ActionGroup editor={editor} actions={EMBED_ACTIONS} />
      </div>

      {editor.isActive('table') && (
        <div className="toolbar-row toolbar-table" role="toolbar" aria-label="Opciones de tabla">
          <span className="toolbar-label">Tabla:</span>
          <ActionGroup editor={editor} actions={TABLE_ACTIONS} />
        </div>
      )}

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
};

export default EditorToolbar;
