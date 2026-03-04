"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Zap } from "lucide-react";

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/report/${data.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
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
          <div className="container max-w-3xl mx-auto px-4 py-12">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Ask Anything
                </h1>
                <p className="text-muted-foreground text-lg">
                  Get comprehensive, cited research on any topic in seconds
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              </div>

              <div className="grid gap-4 mt-12">
                <div className="text-sm font-medium text-muted-foreground">
                  Popular topics:
                </div>
                {[
                  {
                    title: "Explain vector databases and their use cases",
                    icon: Brain,
                  },
                  {
                    title:
                      "What are the latest trends in AI and machine learning?",
                    icon: Zap,
                  },
                  {
                    title: "How does blockchain technology work?",
                    icon: BookOpen,
                  },
                ].map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSearch(topic.title)}
                      className="text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary transition-colors group flex items-start gap-3"
                    >
                      <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground group-hover:text-primary transition-colors">
                        {topic.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
