
import { useEffect, useRef } from "react";
import { useMouse } from "@/hooks/use-mouse";
import { useIsMobile } from "@/hooks/use-mobile";

interface TypographyRoomProps {
  imageUrl: string;
  text?: string;
}

const TypographyRoom = ({ 
  imageUrl,
  text = "ONE MORE ONE MORE ONE MORE ONE MORE" 
}: TypographyRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mouse = useMouse();
  const isMobile = useIsMobile();
  
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
      const rotateX = mouseY * -10; // Invert Y axis for natural movement
      const rotateY = mouseX * 10;
      
      sceneRef.current.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    };
    
    const handleScroll = () => {
      if (!sceneRef.current) return;
      
      // Get scroll amount as percentage of document height
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      
      // Scale the room based on scroll (zoom effect)
      const scale = 1 + scrollPercent * 0.5;
      sceneRef.current.style.scale = scale.toString();
    };
    
    // Update on mouse move
    updatePerspective();
    window.addEventListener('mousemove', updatePerspective);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', updatePerspective);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mouse, isMobile]);
  
  // Split text into words for walls
  const words = text.split(' ');
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-lg"
    >
      <div 
        ref={sceneRef}
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Center Image */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: 'translateZ(0)' }}
        >
          <div className="w-[50%] h-[50%] relative">
            <img 
              src={imageUrl}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Walls with typography */}
        {/* Front wall */}
        <div
          className="absolute inset-0 flex items-end justify-center overflow-hidden"
          style={{ transform: 'translateZ(-200px) rotateX(90deg)', transformOrigin: 'bottom' }}
        >
          <div className="text-[5vw] font-bold tracking-tighter text-accent whitespace-nowrap">
            {words[0] || "ONE"}
          </div>
        </div>
        
        {/* Back wall */}
        <div
          className="absolute inset-0 flex items-start justify-center overflow-hidden"
          style={{ transform: 'translateZ(-200px) rotateX(-90deg)', transformOrigin: 'top' }}
        >
          <div className="text-[5vw] font-bold tracking-tighter text-accent whitespace-nowrap">
            {words[1] || "MORE"}
          </div>
        </div>
        
        {/* Left wall */}
        <div
          className="absolute inset-0 flex items-center justify-start overflow-hidden"
          style={{ transform: 'translateZ(-200px) rotateY(-90deg)', transformOrigin: 'left' }}
        >
          <div 
            className="text-[5vw] font-bold tracking-tighter text-accent whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {words[2] || "ONE"}
          </div>
        </div>
        
        {/* Right wall */}
        <div
          className="absolute inset-0 flex items-center justify-end overflow-hidden"
          style={{ transform: 'translateZ(-200px) rotateY(90deg)', transformOrigin: 'right' }}
        >
          <div 
            className="text-[5vw] font-bold tracking-tighter text-accent whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {words[3] || "MORE"}
          </div>
        </div>
        
        {/* Floor with additional typography */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: 'translateZ(-200px)' }}
        >
          <div className="text-[2vw] font-bold tracking-tighter text-accent opacity-50 rotate-45">
            2023
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyRoom;
