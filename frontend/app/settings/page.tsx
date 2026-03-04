"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Settings {
  research_depth?: "quick" | "standard" | "deep";
  preferred_sources?: string[];
  ai_model?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    research_depth: "standard",
    preferred_sources: [],
    ai_model: "gpt-4",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Configure your research agent preferences
                </p>
              </div>

              {saved && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm font-medium">
                  Settings saved successfully!
                </div>
              )}

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Research Preferences</CardTitle>
                  <CardDescription>
                    Configure how the AI conducts research
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="depth" className="font-medium">
                      Research Depth
                    </Label>
                    <Select
                      value={settings.research_depth || "standard"}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          research_depth: value as
                            | "quick"
                            | "standard"
                            | "deep",
                        })
                      }
                    >
                      <SelectTrigger
                        id="depth"
                        className="bg-secondary border-secondary"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">
                          Quick (Fast results)
                        </SelectItem>
                        <SelectItem value="standard">
                          Standard (Balanced)
                        </SelectItem>
                        <SelectItem value="deep">
                          Deep (Comprehensive)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="font-medium">
                      AI Model
                    </Label>
                    <Select
                      value={settings.ai_model || "gpt-4"}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          ai_model: value,
                        })
                      }
                    >
                      <SelectTrigger
                        id="model"
                        className="bg-secondary border-secondary"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-opus">Claude Opus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
