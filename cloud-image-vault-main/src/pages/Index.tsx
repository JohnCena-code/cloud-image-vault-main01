import { useState, useEffect } from "react";
import { Cloud, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageGallery } from "@/components/ImageGallery";
import { AuthDialog } from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) {
        setAuthDialogOpen(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out",
    });
    setAuthDialogOpen(true);
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
                <Cloud className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cloud Storage</h1>
                <p className="text-sm text-muted-foreground">Store and manage your images</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {user ? (
          <>
            {/* Upload Section */}
            <section className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-6">Upload Images</h2>
              <ImageUpload onUploadSuccess={handleUploadSuccess} />
            </section>

            {/* Gallery Section */}
            <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-3xl font-bold text-foreground mb-6">Your Images</h2>
              <ImageGallery refreshTrigger={refreshTrigger} />
            </section>
          </>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft mx-auto mb-6">
              <Cloud className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Cloud Storage
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A modern, secure platform to store and manage your images in the cloud.
              Sign in to get started!
            </p>
            <Button 
              size="lg" 
              className="shadow-soft"
              onClick={() => setAuthDialogOpen(true)}
            >
              Get Started
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with Lovable Cloud • Secure & Scalable Image Storage
          </p>
        </div>
      </footer>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onAuthSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  );
};

export default Index;
