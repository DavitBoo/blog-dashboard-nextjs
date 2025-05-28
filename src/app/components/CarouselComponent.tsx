import React, { useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

const CarouselComponent: React.FC<NodeViewProps> = ({ node, deleteNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = node.content.content.map((child: any) => child.attrs.src);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <NodeViewWrapper className="carousel-container">
      <div className="carousel" style={{ position: 'relative' }}>
        <button 
          className="carousel-button prev" 
          onClick={prevSlide}
          style={{ position: 'absolute', left: 0, top: '50%', zIndex: 10 }}
        >
          &lt;
        </button>
        
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex}`}
          style={{ width: '100%', display: 'block' }}
        />
        
        <button 
          className="carousel-button next" 
          onClick={nextSlide}
          style={{ position: 'absolute', right: 0, top: '50%', zIndex: 10 }}
        >
          &gt;
        </button>
        
        <div className="carousel-indicators" style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10px'
        }}>
          {images.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                margin: '0 5px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentIndex === index ? '#000' : '#ccc',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
      
      <button 
        onClick={deleteNode}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          zIndex: 20
        }}
      >
        ×
      </button>
    </NodeViewWrapper>
  );
};

export default CarouselComponent;