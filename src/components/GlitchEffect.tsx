
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

    // Reset any previous layers
    layersRef.current = [];
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create main image
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'w-full h-full object-cover';
    containerRef.current.appendChild(img);
    imageRef.current = img;

    // Create glitch layers
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

    // Create geometric shapes (dots and rectangles)
    generateShapes();
    setDotsGenerated(true);

    // Start animation
    let animationFrameId: number;
    const animate = () => {
      layersRef.current.forEach((layer, i) => {
        const time = Date.now() / 1000;
        const offsetX = Math.sin(time * (i + 1) * 0.5) * 10;
        const offsetY = Math.cos(time * (i + 1) * 0.5) * 10;
        const opacity = Math.sin(time * 0.5) * 0.15 + 0.15;
        
        layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        layer.style.opacity = opacity.toString();
        
        // Add clip-path occasionally
        if (Math.sin(time * 0.2 + i) > 0.7) {
          const y1 = Math.floor(Math.random() * 100);
          const y2 = Math.floor(Math.random() * 100);
          layer.style.clipPath = `inset(${y1}% 0 ${y2}% 0)`;
        } else {
          layer.style.clipPath = 'none';
        }
      });
      
      // Occasionally apply glitch to main image
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

      // Animate dots if they exist
      if (dotsGenerated && containerRef.current) {
        const dots = containerRef.current.querySelectorAll('.floating-dot');
        dots.forEach((dot) => {
          const dotElement = dot as HTMLElement;
          const time = Date.now() / 1000;
          const offsetX = Math.sin(time * parseFloat(dotElement.dataset.speed || "1")) * 5;
          const offsetY = Math.cos(time * parseFloat(dotElement.dataset.speed || "1")) * 5;
          
          dotElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        // Animate rectangles
        const rects = containerRef.current.querySelectorAll('.floating-rect');
        rects.forEach((rect) => {
          const rectElement = rect as HTMLElement;
          const time = Date.now() / 1000;
          const offsetX = Math.sin(time * parseFloat(rectElement.dataset.speed || "1")) * 3;
          const offsetY = Math.cos(time * parseFloat(rectElement.dataset.speed || "1")) * 3;
          
          rectElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
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
      '#ff0000', '#ff5252', '#ffcdd2', // Reds
      '#2196f3', '#90caf9', '#bbdefb', // Blues
      '#e0e0e0', '#bdbdbd', '#9e9e9e', // Grays
      '#00c853', '#b2ff59', '#69f0ae', // Greens
    ];

    // Generate dots
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      const size = 5 + Math.random() * 15; // Random size between 5px and 20px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const posX = Math.random() * 100; // Random position (%)
      const posY = Math.random() * 100;
      const zIndex = Math.random() > 0.5 ? 1 : -1; // Random z-index (in front or behind)
      const speed = 0.5 + Math.random() * 1.5; // Random animation speed
      
      dot.className = 'absolute rounded-full floating-dot';
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.backgroundColor = color;
      dot.style.left = `${posX}%`;
      dot.style.top = `${posY}%`;
      dot.style.zIndex = `${zIndex}`;
      dot.style.opacity = (0.4 + Math.random() * 0.6).toString(); // Random opacity
      dot.dataset.speed = speed.toString();
      
      containerRef.current.appendChild(dot);
    }

    // Generate rectangles
    for (let i = 0; i < 8; i++) {
      const rect = document.createElement('div');
      const width = 20 + Math.random() * 80; // Random width between 20px and 100px
      const height = 10 + Math.random() * 40; // Random height between 10px and 50px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const posX = Math.random() * 100; // Random position (%)
      const posY = Math.random() * 100;
      const zIndex = Math.random() > 0.5 ? 1 : -1; // Random z-index (in front or behind)
      const speed = 0.2 + Math.random() * 0.8; // Random animation speed
      
      rect.className = 'absolute floating-rect';
      rect.style.width = `${width}px`;
      rect.style.height = `${height}px`;
      rect.style.backgroundColor = color;
      rect.style.left = `${posX}%`;
      rect.style.top = `${posY}%`;
      rect.style.zIndex = `${zIndex}`;
      rect.style.opacity = (0.1 + Math.random() * 0.4).toString(); // Random opacity
      rect.style.mixBlendMode = 'multiply';
      rect.dataset.speed = speed.toString();
      
      containerRef.current.appendChild(rect);
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
