import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import GlitchEffect from "@/components/GlitchEffect";
import RandomGlitchEffect from "@/components/RandomGlitchEffect";
import TypographyRoom from "@/components/TypographyRoom";

const Index = () => {
  // Use local image from public directory as default
  const defaultImage = "/image.png";
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [effectGenerated, setEffectGenerated] = useState(false);
  const [regenerateCounter, setRegenerateCounter] = useState(0);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setEffectGenerated(false);
    toast.success("Image uploaded successfully!");
  };

  const handleGenerate = () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setEffectGenerated(true);
      toast.success("Your divergent reality is ready!");
    }, 1500);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      // Increment the counter to trigger a re-render of the RandomGlitchEffect
      setRegenerateCounter(prev => prev + 1);
      toast.success("New reality generated!");
    }, 1000);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setEffectGenerated(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-rmit-blue">
      {/* Header/Navbar */}
      <header className="w-full py-4 px-4 sm:px-6 border-b border-rmit-red bg-rmit-blue fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="RMIT Logo" className="h-12" />
            <div className="ml-4 bg-rmit-red text-white px-3 py-2">
              <span className="text-sm font-medium">Careers, Alumni &</span>
              <br />
              <span className="text-sm font-medium">Industry Relations</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="border-rmit-red text-white hover:bg-rmit-red/10"
            >
              RESET
            </Button>
            <Button 
              size="sm" 
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating || effectGenerated}
              className="bg-rmit-red hover:bg-rmit-red/90 text-white font-medium"
            >
              {isGenerating ? "PROCESSING..." : "TRANSCEND"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 text-white">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Intro Section */}
          <section className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">
              Careers Festival <span className="text-rmit-red">2025</span>
            </h2>
            <div className="text-rmit-red text-8xl font-bold tracking-tighter">
              INTELLECTUAL
              <br />
              <span className="text-white">DIVERGENCE</span>
            </div>
          </section>

          {/* Upload Section */}
          {!effectGenerated && (
            <section className="max-w-lg mx-auto">
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                isLoading={isGenerating}
              />
              {uploadedImage && (
                <div className="space-y-4">
                  <div className="mt-4 p-4 border-2 border-rmit-red rounded-lg bg-rmit-blue/50">
                    <p className="text-sm text-rmit-red mb-2 font-bold">NEURAL BASELINE:</p>
                    <img 
                      src={uploadedImage} 
                      alt="Upload preview" 
                      className="w-full h-48 object-contain rounded-md"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleReset}
                      className="border-rmit-red text-white hover:bg-rmit-red/10"
                    >
                      RESET
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleGenerate}
                      disabled={isGenerating || effectGenerated}
                      className="bg-rmit-red hover:bg-rmit-red/90 text-white min-w-[120px]"
                    >
                      {isGenerating ? "PROCESSING..." : "TRANSCEND"}
                    </Button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Effects Section */}
          {effectGenerated && uploadedImage && (
            <section className="max-w-5xl mx-auto space-y-8">
              <div className="flex justify-center gap-4 mb-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                  className="border-rmit-red text-white hover:bg-rmit-red/10"
                >
                  RESET
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="bg-rmit-red hover:bg-rmit-red/90 text-white"
                >
                  {isGenerating ? "GENERATING..." : "GENERATE NEW"}
                </Button>
              </div>
              
              <Tabs defaultValue="glitch" className="w-full">
                <div className="flex justify-center mb-6">
                  <TabsList className="bg-rmit-red/10">
                    <TabsTrigger 
                      value="glitch"
                      className="data-[state=active]:bg-rmit-red data-[state=active]:text-white"
                    >
                      NEURAL BREACH
                    </TabsTrigger>
                    <TabsTrigger 
                      value="typography"
                      className="data-[state=active]:bg-rmit-red data-[state=active]:text-white"
                    >
                      COGNITIVE SPACE
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="glitch" className="w-full">
                  <div className="aspect-[4/3] max-w-[50vw] mx-auto">
                    <RandomGlitchEffect 
                      imageUrl={uploadedImage} 
                      colorMode="blue" 
                      regenerate={regenerateCounter}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="typography" className="w-full">
                  <div className="space-y-4">
                    <div className="aspect-square max-w-3xl mx-auto">
                      <TypographyRoom imageUrl={uploadedImage} />
                    </div>
                    
                    <p className="text-center text-sm text-gray-400">
                      NAVIGATE THE VOID: MOVE TO SHIFT PERSPECTIVE / SCROLL TO TRAVERSE REALITIES
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-rmit-blue border-t border-rmit-red py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-white">
          <p>© 2025 Project Pluto and RMIT University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
