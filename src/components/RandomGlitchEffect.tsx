import { useState, useEffect } from "react";
import GlitchEffect from "./GlitchEffect";
import GlitchEffect1 from "./GlitchEffect1";
import GlitchEffect2 from "./GlitchEffect2";

interface RandomGlitchEffectProps {
  imageUrl?: string;
  colorMode?: 'white' | 'blue' | 'red';
  regenerate?: number; // Counter to trigger regeneration
}

const RandomGlitchEffect = ({ 
  imageUrl = process.env.PUBLIC_URL + '/image.png', 
  colorMode = 'white',
  regenerate = 0
}: RandomGlitchEffectProps) => {
  const [selectedEffect, setSelectedEffect] = useState<number>(0);
  
  // Generate a random effect when the component mounts or regenerate changes
  useEffect(() => {
    // If this is the first render (regenerate is 0), just pick a random effect
    if (regenerate === 0) {
      const initialEffect = Math.floor(Math.random() * 3); // 0, 1, or 2
      setSelectedEffect(initialEffect);
      return;
    }
    
    // For regeneration, ensure we pick a different effect than the current one
    let newEffect;
    do {
      newEffect = Math.floor(Math.random() * 3); // 0, 1, or 2
    } while (newEffect === selectedEffect);
    
    setSelectedEffect(newEffect);
  }, [regenerate]);
  
  // Render the selected effect
  return (
    <>
      {selectedEffect === 0 && <GlitchEffect imageUrl={imageUrl} colorMode={colorMode} />}
      {selectedEffect === 1 && <GlitchEffect1 imageUrl={imageUrl} colorMode={colorMode} />}
      {selectedEffect === 2 && <GlitchEffect2 imageUrl={imageUrl} colorMode={colorMode} />}
    </>
  );
};

export default RandomGlitchEffect; 