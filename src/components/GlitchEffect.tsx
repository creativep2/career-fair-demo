import { useEffect, useRef, useState } from "react";

interface GlitchEffectProps {
  imageUrl: string;
}

const GlitchEffect = ({ imageUrl }: GlitchEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const [dotsGenerated, setDotsGenerated] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    layersRef.current = [];
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'w-full h-full object-cover';
    containerRef.current.appendChild(img);
    imageRef.current = img;

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
    const layerCount = 5;

    for (let i = 0; i < layerCount; i++) {
      const layer = document.createElement('div');
      layer.className = 'absolute inset-0 opacity-0 mix-blend-screen';
      layer.style.backgroundImage = `url(${imageUrl})`;
      layer.style.backgroundSize = 'cover';
      layer.style.backgroundPosition = 'center';
      layer.style.backgroundColor = colors[i % colors.length];
      layer.style.mixBlendMode = 'screen';
      
      containerRef.current.appendChild(layer);
      layersRef.current.push(layer);
    }

    generateShapes();
    setDotsGenerated(true);

    let animationFrameId: number;
    const animate = () => {
      layersRef.current.forEach((layer, i) => {
        const time = Date.now() / 1000;
        const offsetX = Math.sin(time * (i + 1) * 0.5) * 10;
        const offsetY = Math.cos(time * (i + 1) * 0.5) * 10;
        const opacity = Math.sin(time * 0.5) * 0.15 + 0.15;
        
        layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        layer.style.opacity = opacity.toString();
        
        if (Math.sin(time * 0.2 + i) > 0.7) {
          const y1 = Math.floor(Math.random() * 100);
          const y2 = Math.floor(Math.random() * 100);
          layer.style.clipPath = `inset(${y1}% 0 ${y2}% 0)`;
        } else {
          layer.style.clipPath = 'none';
        }
      });

      if (imageRef.current && Math.random() > 0.95) {
        const y1 = Math.floor(Math.random() * 100);
        const y2 = Math.floor(Math.random() * 100);
        imageRef.current.style.clipPath = `inset(${y1}% 0 ${y2}% 0)`;
        
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.style.clipPath = 'none';
          }
        }, 100);
      }

      if (dotsGenerated && containerRef.current) {
        const dots = containerRef.current.querySelectorAll('.floating-dot');
        dots.forEach((dot) => {
          const dotElement = dot as HTMLElement;
          const time = Date.now() / 1000;
          const offsetX = Math.sin(time * parseFloat(dotElement.dataset.speed || "1")) * 5;
          const offsetY = Math.cos(time * parseFloat(dotElement.dataset.speed || "1")) * 5;
          
          dotElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        const rects = containerRef.current.querySelectorAll('.floating-rect');
        rects.forEach((rect) => {
          const rectElement = rect as HTMLElement;
          const time = Date.now() / 1000;
          const offsetX = Math.sin(time * parseFloat(rectElement.dataset.speed || "1")) * 3;
          const offsetY = Math.cos(time * parseFloat(rectElement.dataset.speed || "1")) * 3;
          
          rectElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        const tiles = containerRef.current.querySelectorAll('.matrix-tile');
        tiles.forEach((tile) => {
          const tileElement = tile as HTMLElement;
          const time = Date.now() / 1000;
          const speed = parseFloat(tileElement.dataset.speed || "1");
          const offsetX = Math.sin(time * speed) * 2;
          const offsetY = Math.cos(time * speed) * 2;
          
          tileElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageUrl, dotsGenerated]);

  const generateShapes = () => {
    if (!containerRef.current) return;

    const colors = [
      '#ff0000', '#ff5252', // Primary reds
      '#2196f3', '#90caf9', // Primary blues
      '#e0e0e0', '#bdbdbd', // Neutral grays
      '#00c853', '#b2ff59', // Accent greens
    ];

    const rows = 6;
    const cols = 6;
    const tileSize = 60; // Larger tiles

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const posX = (col / cols) * 100;
        const posY = (row / rows) * 100;
        const zIndex = Math.random() > 0.5 ? 1 : -1;
        const speed = 0.2 + Math.random() * 0.4; // Slower, more subtle movement
        
        tile.className = 'absolute matrix-tile';
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.backgroundColor = color;
        tile.style.left = `${posX}%`;
        tile.style.top = `${posY}%`;
        tile.style.zIndex = `${zIndex}`;
        tile.style.opacity = (0.1 + Math.random() * 0.3).toString(); // Lower opacity
        tile.style.mixBlendMode = 'multiply';
        tile.style.transition = 'transform 0.5s ease-out';
        tile.dataset.speed = speed.toString();
        
        const isCenterX = col >= cols/3 && col < (cols*2)/3;
        const isCenterY = row >= rows/3 && row < (rows*2)/3;
        if (!(isCenterX && isCenterY)) {
          containerRef.current.appendChild(tile);
        }
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden rounded-lg border border-border bg-black"
    ></div>
  );
};

export default GlitchEffect;
