
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
        // Color transition animation for matrix tiles
        const tiles = containerRef.current.querySelectorAll('.matrix-tile');
        tiles.forEach((tile) => {
          const tileElement = tile as HTMLElement;
          const time = Date.now() / 1000;
          
          // Random movement
          const speed = parseFloat(tileElement.dataset.speed || "1");
          const offsetX = Math.sin(time * speed) * 5;
          const offsetY = Math.cos(time * speed) * 5;
          tileElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          
          // Random color switching
          if (Math.random() > 0.995) {
            // Change color randomly between red, blue and white
            const colorOptions = ['#ea384c', '#1EAEDB', '#FFFFFF'];
            const newColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            tileElement.style.backgroundColor = newColor;
            
            // Add a subtle flash effect
            tileElement.style.opacity = "0.6";
            setTimeout(() => {
              if (tileElement) {
                tileElement.style.opacity = (0.1 + Math.random() * 0.3).toString();
              }
            }, 150);
          }
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
      '#ea384c', // Red
      '#1EAEDB', // Blue
      '#FFFFFF', // White
    ];

    // Use a 10x10 grid
    const rows = 10;
    const cols = 10;
    const tileSize = 40; // Smaller tiles for more rectangles

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const posX = (col / cols) * 100;
        const posY = (row / rows) * 100;
        const zIndex = Math.random() > 0.5 ? 1 : -1;
        const speed = 0.2 + Math.random() * 0.8; // Varied speed for more random movement
        
        tile.className = 'absolute matrix-tile transition-all duration-300';
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.backgroundColor = color;
        tile.style.left = `${posX}%`;
        tile.style.top = `${posY}%`;
        tile.style.zIndex = `${zIndex}`;
        tile.style.opacity = (0.1 + Math.random() * 0.3).toString();
        tile.style.mixBlendMode = 'screen';
        tile.dataset.speed = speed.toString();
        
        // Create a center empty space for the image
        // Consider center to be the middle 40% of width and height
        const isCenterX = col >= cols * 0.3 && col < cols * 0.7;
        const isCenterY = row >= rows * 0.3 && row < rows * 0.7;
        
        // Only add tiles that are not in the center area
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
