import { useEffect, useRef, useState } from "react";
import { useMouse } from "@/hooks/use-mouse";
import { useIsMobile } from "@/hooks/use-mobile";

interface TypographyRoomProps {
  imageUrl: string;
}

const TypographyRoom = ({ 
  imageUrl
}: TypographyRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mouse = useMouse();
  const isMobile = useIsMobile();
  const [zoom, setZoom] = useState(0.6);
  
  useEffect(() => {
    if (!containerRef.current || !sceneRef.current) return;
    
    const updatePerspective = () => {
      if (!sceneRef.current) return;
      
      const container = containerRef.current!;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate relative mouse position (-1 to 1)
      const mouseX = ((mouse.x - centerX) / (rect.width / 2)) * (isMobile ? 0.5 : 1);
      const mouseY = ((mouse.y - centerY) / (rect.height / 2)) * (isMobile ? 0.5 : 1);
      
      // Apply rotation based on mouse position
      const rotateX = mouseY * -8; 
      const rotateY = mouseX * 8;
      
      sceneRef.current.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(${zoom})
      `;
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Adjust zoom based on wheel direction with smaller increments for smoother zooming
      const zoomDelta = e.deltaY > 0 ? -0.03 : 0.03;
      // Allow much further zoom out (from 0.1 to 2)
      const newZoom = Math.max(0.1, Math.min(2, zoom + zoomDelta));
      setZoom(newZoom);
    };
    
    // Update on mouse move
    updatePerspective();
    window.addEventListener('mousemove', updatePerspective);
    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('mousemove', updatePerspective);
      containerRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [mouse, isMobile, zoom]);
  
  // Determine which corridor to show based on zoom level
  const getCorridorLayer = () => {
    if (zoom <= 0.2) {
      return 6; // INFINITE
    } else if (zoom <= 0.4) {
      return 5; // BEYOND
    } else if (zoom <= 0.6) {
      return 4; // DEEPER
    } else if (zoom <= 0.8) {
      return 3; // HARD MODE
    } else if (zoom <= 1.2) {
      return 2; // RULES HAVE CHANGED
    } else if (zoom <= 1.5) {
      return 1; // START THE NEW GAME
    }
    return 0; // Default ONE MORE corridor
  };
  
  const corridorLayer = getCorridorLayer();
  
  // Generate grid lines for floor and ceiling
  const generateGridLines = (count: number) => {
    const lines = [];
    const spacing = 100 / count;
    
    for (let i = 0; i <= count; i++) {
      const position = i * spacing;
      // Horizontal lines (going into z-depth)
      lines.push(
        <div 
          key={`h-${i}`} 
          className="absolute h-[1px] bg-white/30 w-full"
          style={{ top: `${position}%`, transform: 'translateZ(0)' }}
        />
      );
      
      // Vertical lines
      lines.push(
        <div 
          key={`v-${i}`} 
          className="absolute w-[1px] bg-white/30 h-full"
          style={{ left: `${position}%`, transform: 'translateZ(0)' }}
        />
      );
    }
    
    // Removed diagonal perspective lines
    
    return lines;
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-lg bg-[#E61E2A]"
    >
      <div 
        ref={sceneRef}
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            transform: 'translateZ(-650px)',
            width: '100%',
            height: '100%',
            overflow: 'visible'
          }}
        >
          <img 
            src={imageUrl}
            alt="Background"
            className="max-w-none w-auto h-auto"
            style={{
              transform: 'scale(1)',
              imageRendering: 'crisp-edges'
            }}
          />
        </div>
        
        {/* Enhanced 3D Floor */}
        {/* <div
          className="absolute bottom-0 left-0 w-[300%] h-[150%] overflow-hidden"
          style={{ 
            transform: 'rotateX(90deg) translateZ(-320px) translateY(50%) translateX(-33%)', 
            transformOrigin: 'center bottom',
            perspective: '2000px',
            backgroundColor: 'rgba(230, 30, 42, 0.1)'
          }}
        >
          <div className="relative w-full h-full">
            {generateGridLines(30)}
            <div className="absolute inset-0 bg-gradient-to-t from-[#E61E2A] to-transparent opacity-70"></div>
          </div>
        </div> */}
        
        
        {/* Enhanced 3D Ceiling */}
        {/* <div
          className="absolute top-0 left-0 w-[300%] h-[150%] overflow-hidden"
          style={{ 
            transform: 'rotateX(-90deg) translateZ(-320px) translateY(-50%) translateX(-33%)', 
            transformOrigin: 'center top',
            perspective: '2000px',
            backgroundColor: 'rgba(230, 30, 42, 0.1)'
          }}
        >
          <div className="relative w-full h-full">
            {generateGridLines(30)}
            <div className="absolute inset-0 bg-gradient-to-b from-[#E61E2A] to-transparent opacity-70"></div>
          </div>
        </div>
         */}
        {/* Enhanced 3D Left Wall - Layer 1 (Closest) */}
        {/* <div
          className="absolute top-0 left-0 h-[300%] w-[150%] overflow-hidden"
          style={{ 
            transform: 'rotateY(90deg) translateZ(-75px) translateX(-50%) translateY(-33%)', 
            transformOrigin: 'left center',
            perspective: '2000px',
            backgroundColor: 'rgba(230, 30, 42, 0.1)'
          }}
        >
          <div className="relative w-full h-full">
            {generateGridLines(30)}
            <div className="absolute inset-0 bg-gradient-to-r from-[#E61E2A] to-transparent opacity-70"></div>
          </div>
        </div>
         */}
        {/* Enhanced 3D Right Wall - Layer 1 (Closest) */}
        {/* <div
          className="absolute top-0 right-0 h-[300%] w-[150%] overflow-hidden"
          style={{ 
            transform: 'rotateY(-90deg) translateZ(-75px) translateX(50%) translateY(-33%)', 
            transformOrigin: 'right center',
            perspective: '2000px',
            backgroundColor: 'rgba(230, 30, 42, 0.1)'
          }}
        >
          <div className="relative w-full h-full">
            {generateGridLines(30)}
            <div className="absolute inset-0 bg-gradient-to-l from-[#E61E2A] to-transparent opacity-70"></div>
          </div>
        </div> */}
        
        {/* Layer 1 - START THE NEW GAME */}
        {corridorLayer >= 1 && (
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-250px)' }}>
            {/* Top wall */}
            <div
              className="absolute top-0 left-0 w-full h-[40%] flex items-center justify-center"
              style={{ transform: 'rotateX(-90deg) translateZ(-320px) translateY(-0%)', transformOrigin: 'center top' }}
            >
              <div className="text-[11vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
                START THE <br /> NEW GAME
              </div>
            </div>
            
            {/* Bottom wall */}
            <div
              className="absolute bottom-0 left-0 w-full h-[40%] flex items-center justify-center "
              style={{ transform: 'rotateX(90deg) translateZ(-320px) translateY(0%)', transformOrigin: 'center bottom' }}
            >
              <div className="text-[11vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
                START THE <br /> NEW GAME
              </div>
            </div>
            
            {/* Left wall */}
            <div
              className="absolute top-0 left-0 h-full w-[30%] flex items-center justify-center"
              style={{ transform: 'rotateY(90deg) translateZ(-150px) translateX(-0%)', transformOrigin: 'left center' }}
            >
              <div className="text-[13vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                HARDMODE <br /> HARDMODE 
              </div>
            </div>
            
            {/* Right wall */}
            <div
              className="absolute top-0 right-0 h-full w-[30%] flex items-center justify-center"
              style={{ transform: 'rotateY(-90deg) translateZ(-150px) translateX(0%)', transformOrigin: 'right center' }}
            >
              <div className="text-[13vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                HARDMODE <br /> HARDMODE
              </div>
            </div>
          </div>
        )}
        {/* Layer 2 - RULES HAVE CHANGED */}
        {corridorLayer >= 2 && (
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-250px)' }}>
            {/* Top wall */}
            <div
              className="absolute top-0 left-0 w-full h-[40%] flex items-center justify-center"
              style={{ transform: 'rotateX(-90deg) translateZ(-320px) translateY(-110%)', transformOrigin: 'center top' }}
            >
              <div className="text-[5vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
                RULES HAVE CHANGED <br /> RULES HAVE CHANGED <br /> RULES HAVE CHANGED
              </div>
            </div>
            
            {/* Bottom wall */}
            <div
              className="absolute bottom-0 left-0 w-full h-[40%] flex items-center justify-center "
              style={{ transform: 'rotateX(90deg) translateZ(-320px) translateY(110%)', transformOrigin: 'center bottom' }}
            >
              <div className="text-[5vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
                RULES HAVE CHANGED <br /> RULES HAVE CHANGED <br /> RULES HAVE CHANGED
              </div>
            </div>
            
            {/* Left wall */}
            <div
              className="absolute top-0 left-0 h-full w-[30%] flex items-center justify-center"
              style={{ transform: 'rotateY(90deg) translateZ(-150px) translateX(-150%)', transformOrigin: 'left center' }}
            >
              <div className="text-[12vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                NEW BOSSES
              </div>
            </div>
            
            {/* Right wall */}
            <div
              className="absolute top-0 right-0 h-full w-[30%] flex items-center justify-center"
              style={{ transform: 'rotateY(-90deg) translateZ(-150px) translateX(150%)', transformOrigin: 'right center' }}
            >
              <div className="text-[12vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                NEW BOSSES  
              </div>
            </div>
          </div>
      )}

      {corridorLayer >= 1 && (
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-250px)' }}>
          {/* Top wall */}
          <div
            className="absolute top-0 left-0 w-full h-[40%] flex items-center justify-center"
            style={{ transform: 'rotateX(-90deg) translateZ(-320px) translateY(-220%)', transformOrigin: 'center top' }}
          >
            <div className="text-[11vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
              START THE <br /> NEW GAME
            </div>
          </div>
          
          {/* Bottom wall */}
          <div
            className="absolute bottom-0 left-0 w-full h-[40%] flex items-center justify-center "
            style={{ transform: 'rotateX(90deg) translateZ(-320px) translateY(220%)', transformOrigin: 'center bottom' }}
          >
            <div className="text-[11vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
              START THE <br /> NEW GAME
            </div>
          </div>
          
          {/* Left wall */}
          <div
            className="absolute top-0 left-0 h-full w-[30%] flex items-center justify-center"
            style={{ transform: 'rotateY(90deg) translateZ(-150px) translateX(-290%)', transformOrigin: 'left center' }}
          >
            <div className="text-[13vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              HARDMODE <br /> HARDMODE 
            </div>
          </div>
          
          {/* Right wall */}
          <div
            className="absolute top-0 right-0 h-full w-[30%] flex items-center justify-center"
            style={{ transform: 'rotateY(-90deg) translateZ(-150px) translateX(290%)', transformOrigin: 'right center' }}
          >
            <div className="text-[13vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none "
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              HARDMODE <br /> HARDMODE
            </div>
          </div>
        </div>
      )}  

      {/* Layer 2 - RULES HAVE CHANGED */}
      {corridorLayer >= 2 && (
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-250px)' }}>
          {/* Top wall */}
          <div
            className="absolute top-0 left-0 w-full h-[40%] flex items-center justify-center"
            style={{ transform: 'rotateX(-90deg) translateZ(-320px) translateY(-330%)', transformOrigin: 'center top' }}
          >
            <div className="text-[5vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
              RULES HAVE CHANGED <br /> RULES HAVE CHANGED <br /> RULES HAVE CHANGED
            </div>
          </div>
          
          {/* Bottom wall */}
          <div
            className="absolute bottom-0 left-0 w-full h-[40%] flex items-center justify-center "
            style={{ transform: 'rotateX(90deg) translateZ(-320px) translateY(330%)', transformOrigin: 'center bottom' }}
          >
            <div className="text-[5vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
              RULES HAVE CHANGED <br /> RULES HAVE CHANGED <br /> RULES HAVE CHANGED
            </div>
          </div>
          
          {/* Left wall */}
          <div
            className="absolute top-0 left-0 h-full w-[30%] flex items-center justify-center"
            style={{ transform: 'rotateY(90deg) translateZ(-150px) translateX(-450%)', transformOrigin: 'left center' }}
          >
            <div className="text-[12vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              NEW BOSSES
            </div>
          </div>
          
          {/* Right wall */}
          <div
            className="absolute top-0 right-0 h-full w-[30%] flex items-center justify-center"
            style={{ transform: 'rotateY(-90deg) translateZ(-150px) translateX(450%)', transformOrigin: 'right center' }}
          >
            <div className="text-[12vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              NEW BOSSES  
            </div>
          </div>
        </div>
      )}

      {corridorLayer >= 1 && (
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-250px)' }}>
          {/* Top wall */}
          <div
            className="absolute top-0 left-0 w-full h-[40%] flex items-center justify-center"
            style={{ transform: 'rotateX(-90deg) translateZ(-320px) translateY(-440%)', transformOrigin: 'center top' }}
          >
            <div className="text-[11vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
              START THE <br /> NEW GAME
            </div>
          </div>
          
          {/* Bottom wall */}
          <div
            className="absolute bottom-0 left-0 w-full h-[40%] flex items-center justify-center "
            style={{ transform: 'rotateX(90deg) translateZ(-320px) translateY(440%)', transformOrigin: 'center bottom' }}
          >
            <div className="text-[11vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
              START THE <br /> NEW GAME
            </div>
          </div>
          
          {/* Left wall */}
          <div
            className="absolute top-0 left-0 h-full w-[30%] flex items-center justify-center"
            style={{ transform: 'rotateY(90deg) translateZ(-150px) translateX(-590%)', transformOrigin: 'left center' }}
          >
            <div className="text-[13vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              HARDMODE <br /> HARDMODE 
            </div>
          </div>
          
          {/* Right wall */}
          <div
            className="absolute top-0 right-0 h-full w-[30%] flex items-center justify-center"
            style={{ transform: 'rotateY(-90deg) translateZ(-150px) translateX(590%)', transformOrigin: 'right center' }}
          >
            <div className="text-[13vw] font-bold tracking-tighter text-white whitespace-nowrap leading-none "
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              HARDMODE <br /> HARDMODE
            </div>
          </div>
        </div>
      )}  
    </div>
    </div>
  );
};

export default TypographyRoom;
