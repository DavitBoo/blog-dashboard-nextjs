import { Extension, type CommandProps } from '@tiptap/core';
import { Node, type NodeConfig } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CarouselComponent from './CarouselComponent';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    carousel: {
      insertCarousel: (options: { images: string[] }) => ReturnType;
    };
  }
}

const CarouselExtension = Node.create<NodeConfig>({
  name: 'carousel',
  group: 'block',
  content: 'image*',
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="carousel"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'carousel' }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CarouselComponent);
  },

  addCommands() {
    return {
      insertCarousel: (options: { images: string[] }) => ({ commands }: CommandProps) => {
        return commands.insertContent({
          type: this.name,
          content: options.images.map((url) => ({
            type: 'image',
            attrs: { src: url },
          })),
        });
      },
    };
  },
});

export default CarouselExtension;