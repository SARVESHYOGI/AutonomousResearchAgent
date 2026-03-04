"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Star, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryItem {
  id: string;
  title: string;
  overview: string;
  created_at: string;
  is_favorite: boolean;
}

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function HistoryList({
  items,
  onSelect,
  onToggleFavorite,
}: HistoryListProps) {
  if (items.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No research history yet. Start by making a search!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card
          key={item.id}
          className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => onSelect(item.id)}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {item.overview}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className="hover:bg-secondary"
                >
                  <Star
                    className="h-4 w-4"
                    fill={item.is_favorite ? "currentColor" : "none"}
                    color={
                      item.is_favorite ? "hsl(var(--primary))" : "currentColor"
                    }
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
