"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PROMPT_MUTATION } from "@/lib/gql/create";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  X,
  Star,
  Save,
  Globe,
  MessageCircle,
  ImageIcon,
  Upload,
  GitBranch,
} from "lucide-react";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("editor");
  const [promptData, setPromptData] = useState({
    title: "",
    content: "",
    tags: "",
    isPublic: true,
    remixOf: null as string | null,
    imageUrl: null as string | null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [createPrompt, { loading }] = useMutation(CREATE_PROMPT_MUTATION);

  useEffect(() => {
    const title = searchParams.get("title") || "";
    const content = searchParams.get("content") || "";
    const tags = searchParams.get("tags") || "";
    const image = searchParams.get("image") || null;
    const remixOf = searchParams.get("remixOf") || null;
    const isEditing = searchParams.get("edit") !== null;

    if (title || content || tags || image || remixOf || isEditing) {
      setPromptData({
        title,
        content,
        tags,
        imageUrl: image || null,
        remixOf,
        isPublic: true,
      });
    }
  }, [searchParams]);

  const parseTagsFromString = (tagsString: string): string[] => {
    return tagsString
      .split(/[\s,]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const handlePublish = async () => {
    if (!promptData.title.trim() || !promptData.content.trim()) {
      toast("Missing required fields", {
        description: "Please add a title and content before publishing.",
      });
      return;
    }
    try {
      await createPrompt({
        variables: {
          title: promptData.title,
          content: promptData.content,
          tags: parseTagsFromString(promptData.tags),
          isPublic: promptData.isPublic,
          remixOf: promptData.remixOf,
          imageUrl: promptData.imageUrl,
        },
      });
      toast("Prompt published!", {
        description: "Your prompt is now available to the community.",
      });
      setPromptData({
        title: "",
        content: "",
        tags: "",
        isPublic: true,
        remixOf: null,
        imageUrl: null,
      });
    } catch (err: any) {
      toast("Failed to publish prompt", {
        description: err.message || "An error occurred.",
      });
    }
  };

  const handleImageUpload = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast("File too large", {
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }
      setIsUploading(true);
      try {
        await new Promise((res) => setTimeout(res, 1200));
        const imageUrl = URL.createObjectURL(file);
        setPromptData((prev) => ({ ...prev, imageUrl }));
        toast("Image uploaded!", {
          description: "Your image has been attached to the prompt.",
        });
      } catch (err: any) {
        toast("Upload failed", {
          description: err.message || "Could not upload image.",
        });
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {searchParams.get("edit") ? "Edit Prompt" : promptData.remixOf ? "Remix Prompt" : "Create Prompt"}
          </h1>
          {(promptData.remixOf || searchParams.get("edit")) && (
            <div className="flex items-center text-blue text-sm mt-1">
              <GitBranch className="h-4 w-4 mr-1" />
              <span>{searchParams.get("edit") ? "Editing existing prompt" : "Remixing existing prompt"}</span>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 bg-muted rounded-lg">
            <TabsTrigger value="editor" className={activeTab === "editor" ? "bg-primary/10 h-full rounded-lg" : "cursor-pointer"}>Editor</TabsTrigger>
            <TabsTrigger value="preview" className={activeTab === "preview" ? "bg-primary/10 h-full rounded-lg" : "cursor-pointer"}>Preview</TabsTrigger>
            <TabsTrigger value="settings" className={activeTab === "settings" ? "bg-primary/10 h-full rounded-lg" : "cursor-pointer"}>Settings</TabsTrigger>
          </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div>
            <Label>Prompt Title</Label>
            <Input
              placeholder="Enter a descriptive title"
              value={promptData.title}
              onChange={(e) => setPromptData({ ...promptData, title: e.target.value })}
            />
          </div>

          <div>
            <Label>Prompt Content</Label>
            <Textarea
              placeholder="What do you want the AI to do?"
              rows={10}
              value={promptData.content}
              onChange={(e) => setPromptData({ ...promptData, content: e.target.value })}
            />
          </div>

          <div>
            <Label>Tags</Label>
            <Input
              placeholder="e.g. writing, productivity, blog-helper"
              value={promptData.tags}
              onChange={(e) => setPromptData({ ...promptData, tags: e.target.value })}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {parseTagsFromString(promptData.tags).map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Prompt Image (Optional)</Label>
            {promptData.imageUrl ? (
              <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden">
                <img src={promptData.imageUrl} alt="Prompt" className="w-full h-full object-cover" />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setPromptData({ ...promptData, imageUrl: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <Button variant="outline" onClick={handleImageUpload} disabled={isUploading} className="cursor-pointer">
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6">
            <Button onClick={handlePublish} className="bg-primary text-primary-foreground cursor-pointer">
              <Globe className="h-4 w-4 mr-2" />
              {promptData.isPublic ? "Publish Prompt" : "Save Private"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>{promptData.title || "Untitled Prompt"}</CardTitle>
            </CardHeader>
            <CardContent>
              {promptData.imageUrl && (
                <img src={promptData.imageUrl} alt="Preview" className="mb-4 rounded-lg" />
              )}
              <pre className="whitespace-pre-wrap text-sm mb-4">{promptData.content}</pre>
              <div className="flex flex-wrap gap-2">
                {parseTagsFromString(promptData.tags).map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Prompt Settings</CardTitle>
            </CardHeader> 
            <CardContent> 
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={promptData.isPublic}
                onChange={(e) => setPromptData({ ...promptData, isPublic: e.target.checked })}
              />
              <Label htmlFor="isPublic">Make this prompt public</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Public prompts can be discovered, used, and remixed by others.
            </p>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
