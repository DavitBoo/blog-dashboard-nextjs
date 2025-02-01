import React from 'react';

interface Props {
  message: string | null;
}

export default function InfoText({ message }: Props) {
  return (
    <h1 className="info-text" aria-live="polite" aria-atomic="true">
      {message || ''}
    </h1>
  );
}