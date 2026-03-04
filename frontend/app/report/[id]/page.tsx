"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { ReportDisplay } from "@/components/report-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface ReportData {
  id: string;
  query_id: string;
  title: string;
  overview: string;
  structured_content: {
    key_concepts: string[];
    technologies: string[];
    examples: string[];
  };
  markdown_content: string;
  sources: Array<{ title: string; url: string; snippet: string }>;
  created_at: string;
  is_favorite: boolean;
}

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/reports/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-8">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
            </Link>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-muted-foreground">Loading report...</p>
              </div>
            )}

            {error && (
              <Card className="bg-destructive/10 border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive font-medium">Error: {error}</p>
                </CardContent>
              </Card>
            )}

            {report && <ReportDisplay report={report} />}
          </div>
        </main>
      </div>
    </div>
  );
}
