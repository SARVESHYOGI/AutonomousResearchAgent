"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Zap, Shield, AlertCircle } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a new report request
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to process research query");
        return;
      }

      const data = await response.json();
      router.push(`/report/${data.reportId}`);
    } catch (error) {
      console.error("[v0] Search error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl mx-auto px-4 py-12 md:py-16">
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <div className="inline-block">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  Autonomous Research Agent
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Ask any question and let AI research the internet autonomously
                  to provide you with a comprehensive, cited report
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="max-w-2xl mx-auto w-full p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">Error</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto w-full">
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-lg">Deep Research</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      AI autonomously searches, reads, and synthesizes
                      information from multiple sources
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-lg">Verified Sources</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Every claim is backed by citations and links to original
                      sources
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-lg">Fast & Smart</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Real-time streaming reports with structured insights and
                      key concepts
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Example Queries */}
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground font-medium">
                  Try asking about:
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "Explain vector databases and their use cases",
                    "What are the latest trends in AI and machine learning?",
                    "How does blockchain technology work?",
                    "Comparison of cloud computing platforms",
                  ].map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(example)}
                      className="text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary transition-colors group"
                    >
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {example}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
