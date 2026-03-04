"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { HistoryList } from "@/components/history-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

interface HistoryItem {
  id: string;
  query_id: string;
  title: string;
  overview: string;
  created_at: string;
  is_favorite: boolean;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/reports");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Research History
                </h1>
                <p className="text-muted-foreground">
                  View and manage all your previous research queries
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-secondary"
                />
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading history...</p>
                </div>
              ) : (
                <HistoryList
                  items={filteredItems}
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
