// components/ui/card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  className,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onClick,
}) => {
  const cardStyle = {
    borderRadius: '8px',
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      {children}
    </div>
  );
};