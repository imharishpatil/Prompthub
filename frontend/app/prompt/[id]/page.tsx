"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { PROMPT_DETAILS_QUERY } from "@/lib/gql/promptDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  GitBranch,
  Share2,
  MessageCircle,
  ImageIcon,
  Check,
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}
interface Feedback {
  id: string;
  user: User;
  comment: string;
  rating: number;
  createdAt: string;
}
interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  createdAt: string;
  remixCount: number;
  feedbacks: Feedback[];
  imageUrl?: string | null;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export default function PromptDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, loading, error } = useQuery<{ prompt: Prompt }>(PROMPT_DETAILS_QUERY, {
    variables: { id },
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (error || !data?.prompt) return <div className="py-12 text-center text-red-500">Prompt not found.</div>;

  const prompt = data.prompt;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{prompt.title}</h1>
      <p className="text-muted-foreground mb-4">Created by {prompt.author?.name}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {prompt.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-sm">
            {tag}
          </Badge>
        ))}
      </div>

      {prompt.imageUrl ? (
        <img
          src={prompt.imageUrl}
          alt={prompt.title}
          className="w-full max-h-64 object-cover rounded-lg mb-8"
        />
      ) : (
        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center mb-8">
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}

      <ScrollArea className="h-30 mb-8 rounded-md border border-muted-foreground">
        <p className="mb-8 text-base text-foreground">{prompt.content}</p>
      </ScrollArea>

      <div className="flex gap-8 mb-8">
        {/* Copy Button with Animation */}
        <div className="flex flex-col items-center">
          <Button
            variant={copied ? "default" : "outline"}
            size="icon"
            className="mb-1 p-2 cursor-pointer transition-colors"
            onClick={() => handleCopy(prompt.content)}
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </Button>
          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
        </div>

        <div className="flex flex-col items-center">
  <Button
  onClick={() =>
    router.push(
      `/create?remixOf=${prompt.id}&title=${encodeURIComponent(prompt.title)}&content=${encodeURIComponent(prompt.content)}&tags=${encodeURIComponent(prompt.tags.join(","))}&imageUrl=${encodeURIComponent(prompt.imageUrl || "")}`
    )
  }
  variant="outline"
  size="icon"
  className="mb-1 p-2 cursor-pointer"
>
  <GitBranch className="h-5 w-5" />
</Button>
  <span className="text-xs">Remix</span>
</div>

        <div className="flex flex-col items-center">
          <Button variant="outline" size="icon" className="mb-1 p-2 cursor-pointer">
            <Share2 className="h-5 w-5" />
          </Button>
          <span className="text-xs">Share</span>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <span className="flex items-center text-muted-foreground text-sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          {prompt.feedbacks.length}
        </span>
        <span className="flex items-center text-muted-foreground text-sm">
          <GitBranch className="h-4 w-4 mr-1" />
          {prompt.remixCount}
        </span>
      </div>

      <div className="text-xs text-muted-foreground mb-8">{formatDate(prompt.createdAt)}</div>

      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-6">
        {prompt.feedbacks.length === 0 && (
          <div className="text-muted-foreground text-sm">No comments yet.</div>
        )}

        {prompt.feedbacks.map((fb) => (
          <div key={fb.id} className="flex items-start gap-3">
            <div>
              {fb.user.avatarUrl ? (
                <img
                  src={fb.user.avatarUrl}
                  alt={fb.user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                  {fb.user.name?.[0] || "?"}
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-sm">{fb.user.name}</div>
              <div className="text-xs text-muted-foreground mb-1">
                {Math.floor((Date.now() - new Date(fb.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </div>
              <div className="text-base">{fb.comment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
