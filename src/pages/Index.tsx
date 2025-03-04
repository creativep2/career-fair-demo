
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import GlitchEffect from "@/components/GlitchEffect";
import TypographyRoom from "@/components/TypographyRoom";

const Index = () => {
  // Default test image from Unsplash
  const defaultImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(defaultImage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [effectGenerated, setEffectGenerated] = useState(true); // Set to true to show effects immediately
  const [customText, setCustomText] = useState("ONE MORE ONE MORE ONE MORE ONE MORE");

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setEffectGenerated(true);
    toast.success("Image uploaded successfully!");
  };

  const handleGenerate = () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsGenerating(false);
      setEffectGenerated(true);
      toast.success("Your creative effect is ready!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 border-b border-border backdrop-blur-sm bg-background/80 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
            Creative<span className="text-accent">Effects</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setUploadedImage(null);
                setEffectGenerated(false);
              }}
            >
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {isGenerating ? "Generating..." : "Generate Effect"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Intro Section */}
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              Transform Your Images
            </h2>
            <p className="text-muted-foreground text-lg">
              Upload your photo and create stunning visual effects with just a click
            </p>
          </section>

          {/* Upload Section */}
          {!effectGenerated && (
            <section className="max-w-lg mx-auto">
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                isLoading={isGenerating}
              />
            </section>
          )}

          {/* Effects Section */}
          {effectGenerated && (
            <section className="max-w-5xl mx-auto space-y-8">
              <Tabs defaultValue="glitch" className="w-full">
                <div className="flex justify-center mb-6">
                  <TabsList>
                    <TabsTrigger value="glitch">Glitch Effect</TabsTrigger>
                    <TabsTrigger value="typography">Typography Room</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="glitch" className="w-full">
                  <div className="aspect-[4/3] max-w-3xl mx-auto">
                    <GlitchEffect imageUrl={uploadedImage!} />
                  </div>
                </TabsContent>
                
                <TabsContent value="typography" className="w-full">
                  <div className="space-y-4">
                    <div className="max-w-md mx-auto">
                      <label htmlFor="customText" className="block text-sm font-medium mb-2">
                        Customize Text (optional)
                      </label>
                      <input
                        id="customText"
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter custom text for the walls"
                      />
                    </div>
                    
                    <div className="aspect-square max-w-3xl mx-auto">
                      <TypographyRoom 
                        imageUrl={uploadedImage!} 
                        text={customText}
                      />
                    </div>
                    
                    <p className="text-center text-sm text-muted-foreground">
                      Move your mouse to change perspective. Scroll to zoom in/out.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          )}

          {/* Instructions */}
          <section className="max-w-3xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-accent font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Upload Image</h3>
                <p className="text-muted-foreground text-sm">
                  Drag and drop or browse to upload your favorite photo to transform
                </p>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Generate Effect</h3>
                <p className="text-muted-foreground text-sm">
                  Click the generate button and watch as your image transforms
                </p>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-accent font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Explore Effects</h3>
                <p className="text-muted-foreground text-sm">
                  Switch between different effects and customize to create your perfect visual
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/50 backdrop-blur-sm border-t border-border py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Created with creativity and code</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
