import { useEffect, useRef } from "react";

interface GlitchEffectProps {
  imageUrl?: string;
  colorMode?: 'white' | 'blue' | 'red';
}

// Define the fragment type
interface Fragment {
  left: string;
  top: string;
  width: string;
  height: string;
  zIndex: number;
  image: string;
  bgPos: string;
  scale: number;
  animate?: boolean; // Optional animate property
}

const GlitchEffect = ({ imageUrl = process.env.PUBLIC_URL + '/image.png', colorMode = 'white' }: GlitchEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    // Clear previous content
      containerRef.current.innerHTML = '';

    // Create gradient background
    const background = document.createElement('div');
    background.className = 'absolute inset-0';
    background.style.background = colorMode === 'blue' 
      ? 'linear-gradient(to right, #000054 0%, #000075 50%, #000054 100%)'
      : colorMode === 'red'
        ? 'linear-gradient(to right, #3a0a0a 0%, #5a1a1a 50%, #3a0a0a 100%)'
        : 'linear-gradient(to right, #000054 0%, #000075 50%, #000054 100%)';
    background.style.zIndex = '0';
    containerRef.current.appendChild(background);

    console.log('Loading image from:', imageUrl); // Add logging to debug image loading

    // Create layered center subject with overlapping effects
    createLayeredCenterSubject();
    
    // Then create the surrounding blocks
    createSurroundingBlocks();

    // Create the layered center subject with overlapping effects
    function createLayeredCenterSubject() {
      // Base layer - Main subject - centered and aligned to 18x18 grid
      const baseLayer = document.createElement('div');
      baseLayer.className = 'absolute';
      // Increase width to span 8 cols (44.44%) and center it
      baseLayer.style.left = '27.78%';
      // Increase height to span 14 rows (77.78%) and adjust top position
      baseLayer.style.top = '11.11%';
      baseLayer.style.width = '44.44%';
      baseLayer.style.height = '77.78%';
      baseLayer.style.zIndex = '10';
      baseLayer.style.backgroundImage = `url(${imageUrl})`;
      baseLayer.style.backgroundSize = 'cover';
      baseLayer.style.backgroundPosition = 'center';
      containerRef.current?.appendChild(baseLayer);

      // Define fragments with the Fragment type
      const fragments: Fragment[] = [
        // Overlay images without effects
        { 
          left: '63.44%',
          top: '3.78%',
          width: '16.67%',
          height: '22.22%',
          zIndex: 15,
          image: '/red1.png',
          bgPos: 'center',
          scale: 1,
          animate: true
        },
        { 
          left: '55.44%',
          top: '25.78%',
          width: '30.67%',
          height: '52.22%',
          zIndex: 15,
          image: '/img.png',
          bgPos: 'center',
          scale: 1,
          animate: true
        },
        { 
          left: '20.44%',
          top: '73.78%',
          width: '16.67%',
          height: '15.22%',
          zIndex: 13,
          scale: 1,
          image: '/red2.png',
          bgPos: 'center',
          animate: true
        },
        {
          left: '15.44%',
          top: '80.78%',
          width: '35.67%',
          height: '19%',
          bgPos: 'center',
          zIndex: 20,
          scale: 1,
          image: '/show.png'
        },
        {
          left: '73.44%',
          top: '0.5%',
          width: '25.67%',
          height: '19%',
          bgPos: 'center',
          zIndex: 25,
          scale: 1,
          image: '/logo.png'
        },
        {
          left: '60.44%',
          top: '72.78%',
          width: '18.67%',
          height: '30.22%',
          bgPos: 'center',
          zIndex: 15,
          scale: 1,
          image: '/white1.png',
          animate: true
        },
        {
          left: '15.44%',
          top: '5.78%',
          width: '25.67%',
          height: '22.22%',
          bgPos: 'center',
          zIndex: 16,
          scale: 1,
          image: '/yellow.png',
          animate: true
        }
      ];

      fragments.forEach(fragment => {
        const element = document.createElement('div');
        element.className = 'absolute';
        element.style.left = fragment.left;
        element.style.top = fragment.top;
        element.style.width = fragment.width;
        element.style.height = fragment.height;
        element.style.zIndex = fragment.zIndex.toString();
        element.style.backgroundImage = `url(${fragment.image})`;
        
        // Only scale the main image fragment, keep overlays at original size
        if (fragment.animate) {
          element.style.backgroundSize = 'contain';  // Maintain aspect ratio
          element.style.backgroundPosition = 'center';
          element.style.backgroundRepeat = 'no-repeat';
          element.style.animation = `pulse ${1 + Math.random() * 1.5}s infinite alternate`;
          element.style.opacity = '0.9';
        } else {
          element.style.backgroundSize = 'contain';  // This will maintain aspect ratio
          element.style.backgroundPosition = 'center';
          element.style.backgroundRepeat = 'no-repeat';
        }
        
        containerRef.current?.appendChild(element);
      });
    }

    // Create the surrounding blocks
    function createSurroundingBlocks() {
      const rows = 36;
      const cols = 36;
      
      // Add keyframe animation styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes glitchReveal {
          0%, 100% { opacity: 0; transform: translateX(0); }
          10%, 90% { opacity: 1; transform: translateX(0); }
          45%, 55% { opacity: 0.7; transform: translateX(${Math.random() > 0.5 ? '2' : '-2'}px); }
        }
        @keyframes blockFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(styleSheet);
      
      // Remove gapPercent entirely and ensure blocks are flush
      const blockWidth = Math.ceil(100 / cols);
      const blockHeight = Math.ceil(100 / rows);
      
      // Create a complete grid of blocks with slight overlap
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const block = document.createElement('div');
          block.className = 'absolute';
          
          const width = blockWidth + 0.05;
          const height = blockHeight + 0.05;
          
          const left = col * blockWidth;
          const top = row * blockHeight;
          
          block.style.left = `${left}%`;
          block.style.top = `${top}%`;
          block.style.width = `${width}%`;
          block.style.height = `${height}%`;
          
          block.style.backgroundColor = '#000054';
          block.style.zIndex = '5';

          // Reduce the animation probability for denser grid
          if (Math.random() < 0.15) {
            const delay = Math.random() * 5;
            const duration = 0.5 + Math.random() * 1;
            block.style.animation = `blockFlicker ${duration}s infinite ${delay}s`;
          }
          
          containerRef.current?.appendChild(block);
        }
      }

      // Add overlapping blocks that extend into the image area
      const overlappingBlocks = [
        // Left side overlap
        { 
          left: '27.78%',
          top: '25.22%',
          width: '5.11%',
          height: '44.44%',
          zIndex: '12',
          animationDelay: `${Math.random() * 2}s`
        },
        { 
          left: '27.78%',
          top: '83.4%',
          width: '11.11%',
          height: '5.44%',
          zIndex: '12',
          animationDelay: `${Math.random() * 2}s`
        },
        // Right side overlap
        {
          left: '67.11%',
          top: '37.33%',
          width: '5.11%',
          height: '23.33%',
          zIndex: '12',
          animationDelay: `${Math.random() * 2}s`
        },
        // Top overlap with extra width to ensure coverage
        {
          left: '53.89%',
          top: '11.11%',
          width: '19.22%',
          height: '5.11%',
          zIndex: '12',
          animationDelay: `${Math.random() * 2}s`
        },
        {
          left: '20.89%',
          top: '16.11%',
          width: '22.22%',
          height: '5.11%',
          zIndex: '12',
          animationDelay: `${Math.random() * 2}s`
        },
        // Bottom overlap with extra width
        {
          left: '50.44%',
          top: '81.78%',
          width: '22.67%',
          height: '14.11%',
          zIndex: '12',
          animationDelay: `${Math.random() * 2}s`
        }
      ];

      // Add larger accent blocks with slight overlap
      const accentBlocks = [
        { left: '0%', top: '0%', width: '22.32%', height: '11.21%' },
        { left: '77.78%', top: '0%', width: '22.32%', height: '16.77%' },
        { left: '0%', top: '88.89%', width: '16.77%', height: '11.21%' },
        { left: '88.89%', top: '77.78%', width: '11.21%', height: '22.32%' }
      ];

      // Create overlapping blocks with guaranteed coverage
      overlappingBlocks.forEach(block => {
        const element = document.createElement('div');
        element.className = 'absolute';
        element.style.left = block.left;
        element.style.top = block.top;
        element.style.width = block.width;
        element.style.height = block.height;
        element.style.backgroundColor = '#000054';
        element.style.zIndex = block.zIndex;
        element.style.animation = `blockFlicker 1s infinite ${block.animationDelay}`;
        containerRef.current?.appendChild(element);
      });

      // Create accent blocks with guaranteed coverage
      accentBlocks.forEach(block => {
        const element = document.createElement('div');
        element.className = 'absolute';
        element.style.left = block.left;
        element.style.top = block.top;
        element.style.width = block.width;
        element.style.height = block.height;
        element.style.backgroundColor = '#000054';
        element.style.zIndex = '15';
        const delay = Math.random() * 3;
        element.style.animation = `blockFlicker 1.5s infinite ${delay}s`;
        containerRef.current?.appendChild(element);
      });
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [imageUrl, colorMode]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-lg border border-border">
      <style>
        {`
          @keyframes glitchReveal {
            0%, 100% { opacity: 0.8; transform: translate(0, 0) scale(1); }
            33% { opacity: 0.9; transform: translate(2px, -2px) scale(1.01); }
            66% { opacity: 0.7; transform: translate(-2px, 1px) scale(0.99); }
          }
          
          @keyframes pulse {
            0% { 
              opacity: 0.3; 
              transform: scale(0.98); 
              filter: brightness(0.9);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
              filter: brightness(1.2);
            }
            100% { 
              opacity: 0.5; 
              transform: scale(1.02); 
              filter: brightness(1);
            }
          }
          
          @keyframes blockReveal {
            0% { opacity: 0; }
            100% { opacity: 0.15; }
          }
        `}
      </style>
    </div>
  );
};

export default GlitchEffect;
