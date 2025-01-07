'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

type RichTextEditorProps = {
  value: string;
  onChange: (content: string) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      apiKey="TINYMCE_API_KEY"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: false,
        plugins: ['link', 'table', 'lists'],
        toolbar:
          'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent',
      }}
    />
  );
};

export default RichTextEditor;
