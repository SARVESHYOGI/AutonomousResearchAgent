"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { HistoryList } from "@/components/history-list";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Heart } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  overview: string;
  created_at: string;
  is_favorite: boolean;
}

export default function FavoritesPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleSelect = (id: string) => {
    router.push(`/report/${id}`);
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-favorite" }),
      });
      if (response.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_favorite: !item.is_favorite } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <Heart className="h-8 w-8 fill-primary text-primary" />
                  Favorite Reports
                </h1>
                <p className="text-muted-foreground">
                  Your saved research reports for quick access
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading favorites...</p>
                </div>
              ) : items.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      No favorite reports yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Star reports to save them here for easy access
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <HistoryList
                  items={items}
                  onSelect={handleSelect}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
