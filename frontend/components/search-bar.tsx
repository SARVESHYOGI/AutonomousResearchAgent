"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Ask me anything... e.g., 'Explain vector databases and their use cases'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="pr-10 bg-secondary border-secondary text-foreground placeholder:text-muted-foreground"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Researching..." : "Research"}
        </Button>
      </div>
    </form>
  );
}
