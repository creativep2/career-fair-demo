import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import GlitchEffect from "@/components/GlitchEffect";
import TypographyRoom from "@/components/TypographyRoom";

const Index = () => {
  // Use local image from public directory as default
  const defaultImage = "/image.png";
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [effectGenerated, setEffectGenerated] = useState(false);

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

  const handleReset = () => {
    setUploadedImage(null);
    setEffectGenerated(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E61E2A]/5">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 border-b border-[#E61E2A] backdrop-blur-sm bg-white/90 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-4xl font-mono font-bold tracking-tighter text-[#E61E2A]">
            ID
          </h1>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="border-[#E61E2A] text-[#E61E2A] hover:bg-[#E61E2A]/10"
            >
              RESET
            </Button>
            <Button 
              size="sm" 
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating || effectGenerated}
              className="bg-[#E61E2A] hover:bg-[#E61E2A]/90 text-white font-mono"
            >
              {isGenerating ? "PROCESSING..." : "TRANSCEND"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 text-gray-900">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Intro Section */}
          <section className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-6xl font-mono font-bold tracking-tighter text-[#E61E2A]">
              Intellectual <span className="text-gray-900">Divergence</span>
            </h2>
            <p className="text-gray-600 text-lg font-light">
              Experience the fusion of human creativity and artificial intelligence. Upload an image and witness the transformation through AI-powered reality augmentation.
            </p>
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
                  <div className="mt-4 p-4 border-2 border-[#E61E2A] rounded-lg bg-white">
                    <p className="text-sm text-[#E61E2A] mb-2 font-mono font-bold">NEURAL BASELINE:</p>
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
                      className="border-[#E61E2A] text-[#E61E2A] hover:bg-[#E61E2A]/10 font-mono"
                    >
                      RESET
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleGenerate}
                      disabled={isGenerating || effectGenerated}
                      className="bg-[#E61E2A] hover:bg-[#E61E2A]/90 text-white font-mono min-w-[120px]"
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
                  className="border-[#E61E2A] text-[#E61E2A] hover:bg-[#E61E2A]/10 font-mono"
                >
                  RESET
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleGenerate}
                  disabled={true}
                  className="bg-[#E61E2A]/50 text-white/50 font-mono cursor-not-allowed"
                >
                  TRANSCENDED
                </Button>
              </div>
              
              <Tabs defaultValue="glitch" className="w-full">
                <div className="flex justify-center mb-6">
                  <TabsList className="bg-[#E61E2A]/10">
                    <TabsTrigger 
                      value="glitch"
                      className="data-[state=active]:bg-[#E61E2A] data-[state=active]:text-white"
                    >
                      NEURAL BREACH
                    </TabsTrigger>
                    <TabsTrigger 
                      value="typography"
                      className="data-[state=active]:bg-[#E61E2A] data-[state=active]:text-white"
                    >
                      COGNITIVE SPACE
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="glitch" className="w-full">
                  <div className="aspect-[4/3] max-w-[50vw] mx-auto">
                    <GlitchEffect imageUrl={uploadedImage} colorMode="blue" />
                  </div>
                </TabsContent>
                
                <TabsContent value="typography" className="w-full">
                  <div className="space-y-4">
                    <div className="aspect-square max-w-3xl mx-auto">
                      <TypographyRoom imageUrl={uploadedImage} />
                    </div>
                    
                    <p className="text-center text-sm text-gray-600 font-mono">
                      NAVIGATE THE VOID: MOVE TO SHIFT PERSPECTIVE / SCROLL TO TRAVERSE REALITIES
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          )}

          {/* Instructions */}
          <section className="max-w-3xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-lg border border-[#E61E2A]/20">
                <div className="w-12 h-12 bg-[#E61E2A] rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-mono font-bold">01</span>
                </div>
                <h3 className="text-lg font-medium mb-2 font-mono text-[#E61E2A]">Neural Input</h3>
                <p className="text-gray-600 text-sm">
                  Submit your visual data to our AI system for cognitive enhancement
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border border-[#E61E2A]/20">
                <div className="w-12 h-12 bg-[#E61E2A] rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-mono font-bold">02</span>
                </div>
                <h3 className="text-lg font-medium mb-2 font-mono text-[#E61E2A]">AI Processing</h3>
                <p className="text-gray-600 text-sm">
                  Watch as artificial intelligence transforms your input into new intellectual dimensions
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg border border-[#E61E2A]/20">
                <div className="w-12 h-12 bg-[#E61E2A] rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-mono font-bold">03</span>
                </div>
                <h3 className="text-lg font-medium mb-2 font-mono text-[#E61E2A]">Cognitive Expansion</h3>
                <p className="text-gray-600 text-sm">
                  Experience the breakthrough as AI amplifies your creative potential
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white backdrop-blur-sm border-t border-[#E61E2A] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#E61E2A] font-mono">
          <p>ID - INTELLECTUAL DIVERGENCE SYSTEM V1.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
