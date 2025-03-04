
import { useEffect, useRef } from "react";

interface GlitchEffectProps {
  imageUrl: string;
}

const GlitchEffect = ({ imageUrl }: GlitchEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);

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
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageUrl]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden rounded-lg border border-border bg-black"
    ></div>
  );
};

export default GlitchEffect;
