"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, BookOpen, Link as LinkIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Citation {
  title: string;
  url: string;
  snippet: string;
}

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
  sources: Citation[];
  created_at: string;
  is_favorite: boolean;
}

interface ReportDisplayProps {
  report: ReportData;
}

export function ReportDisplay({ report }: ReportDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{report.title}</h1>
        <p className="text-sm text-muted-foreground">
          Generated {new Date(report.created_at).toLocaleDateString()}
        </p>
      </div>

      <Tabs defaultValue="structured" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary">
          <TabsTrigger value="structured" className="gap-2">
            <FileText className="h-4 w-4" />
            Structured
          </TabsTrigger>
          <TabsTrigger value="markdown" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Markdown
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structured" className="space-y-4 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground leading-relaxed">
              {report.overview}
            </CardContent>
          </Card>

          {report.structured_content.key_concepts.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Key Concepts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2">
                  {report.structured_content.key_concepts.map(
                    (concept, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="text-foreground">{concept}</span>
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {report.structured_content.technologies.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Important Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2">
                  {report.structured_content.technologies.map((tech, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-foreground">{tech}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {report.structured_content.examples.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Real-World Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2">
                  {report.structured_content.examples.map((example, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-foreground">{example}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {report.sources.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {report.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="space-y-1 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      [{idx + 1}] {source.title}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {source.snippet}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="markdown" className="mt-6">
          {report.markdown_content ? (
            <Card className="bg-card border-border">
              <CardContent className="prose prose-invert dark:prose-invert max-w-none pt-6 text-foreground">
                <ReactMarkdown>{report.markdown_content}</ReactMarkdown>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Markdown version not available yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
