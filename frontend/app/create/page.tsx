"use client"
import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_PROMPT_MUTATION } from "@/lib/gql/create"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  X,
  Star,
  Save,
  Globe,
  MessageCircle,
  ImageIcon,
  Upload,
  GitBranch,
} from "lucide-react"

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("editor")
  const [promptData, setPromptData] = useState({
    title: "",
    content: "",
    tags: "",
    isPublic: true,
    remixOf: null as string | null,
    imageUrl: null as string | null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [createPrompt, { loading }] = useMutation(CREATE_PROMPT_MUTATION)

  const parseTagsFromString = (tagsString: string): string[] => {
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  const handlePublish = async () => {
    if (!promptData.title.trim() && !promptData.content.trim()) {
      toast("Missing required fields", {
        description: "Please add a title and content before publishing.",
      })
      return
    }
    if (!promptData.title.trim()) {
      toast("Title required", {
        description: "Please enter a title for your prompt.",
      })
      return
    }
    if (!promptData.content.trim()) {
      toast("Content required", {
        description: "Please enter the content for your prompt.",
      })
      return
    }
    try {
      const { data } = await createPrompt({
        variables: {
          title: promptData.title,
          content: promptData.content,
          tags: parseTagsFromString(promptData.tags),
          isPublic: promptData.isPublic,
          remixOf: promptData.remixOf,
          imageUrl: promptData.imageUrl,
        },
      })
      toast("Prompt published!", {
        description: "Your prompt is now available to the community.",
      })
      setPromptData({
        title: "",
        content: "",
        tags: "",
        isPublic: true,
        remixOf: null,
        imageUrl: null,
      })
    } catch (err: any) {
      toast("Failed to publish prompt", {
        description: err.message || "An error occurred.",
      })
    }
  }

  async function handleImageUpload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/png, image/jpeg"
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) {
        toast("File too large", {
          description: "Please select an image smaller than 5MB.",
        })
        return
      }
      setIsUploading(true)
      try {
        await new Promise((res) => setTimeout(res, 1200))
        const imageUrl = URL.createObjectURL(file)
        setPromptData((prev) => ({ ...prev, imageUrl }))
        toast("Image uploaded!", {
          description: "Your image has been attached to the prompt.",
        })
      } catch (err: any) {
        toast("Upload failed", {
          description: err.message || "Could not upload image.",
        })
      } finally {
        setIsUploading(false)
      }
    }
    input.click()
  }

  async function handleSave(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    if (!promptData.title.trim() && !promptData.content.trim()) {
      toast("Nothing to save", {
        description: "Please enter a title or content before saving a draft.",
      })
      return
    }
    if (!promptData.title.trim()) {
      toast("Title required", {
        description: "Please enter a title for your draft.",
      })
      return
    }
    if (!promptData.content.trim()) {
      toast("Content required", {
        description: "Please enter the content for your draft.",
      })
      return
    }
    try {
      await new Promise((res) => setTimeout(res, 800))
      toast("Draft saved!", {
        description: "Your prompt draft has been saved locally.",
      })
      // Optionally, save to localStorage or backend
    } catch (err: any) {
      toast("Failed to save draft", {
        description: err.message || "An error occurred.",
      })
    }
  }

  function handleRemix(remixOf: string): void {
    setPromptData((prev) => ({
      ...prev,
      remixOf,
      title: "",
      content: "",
      tags: "",
      imageUrl: null,
      isPublic: true,
    }))
    setActiveTab("editor")
    toast("Remix mode enabled", {
      description: "You are now remixing an existing prompt. Start editing to make it your own.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {promptData.remixOf ? "Remix Prompt" : "Create New Prompt"}
          </h1>
          <p className="text-muted-foreground">
            {promptData.remixOf
              ? "Enhance and modify an existing prompt to create your own version"
              : "Design and share your AI prompts with the community"}
          </p>
          {promptData.remixOf && (
            <div className="mt-2 flex items-center text-sm text-blue">
              <GitBranch className="h-4 w-4 mr-1" />
              <span>Remixing from original prompt</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-muted">
                    <TabsTrigger value="editor" className={activeTab === "editor" ? "h-full rounded-lg bg-primary text-primary-foreground" : ""}>Editor</TabsTrigger>
                    <TabsTrigger value="preview" className={activeTab === "preview" ? "h-full rounded-lg bg-primary text-primary-foreground" : ""}>Preview</TabsTrigger>
                    <TabsTrigger value="settings" className={activeTab === "settings" ? "h-full rounded-lg bg-primary text-primary-foreground" : ""}>Settings</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="editor" className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-foreground">Prompt Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a descriptive title for your prompt"
                        value={promptData.title}
                        onChange={(e) => setPromptData({ ...promptData, title: e.target.value })}
                        className="mt-1 bg-background text-foreground border-border"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Prompt Content</Label>
                      <div className="mt-1 space-y-2">
                        <Textarea
                          id="content"
                          placeholder="Write your prompt here. Be specific and clear about what you want the AI to do..."
                          value={promptData.content}
                          onChange={(e) => setPromptData({ ...promptData, content: e.target.value })}
                          className="font-mono text-sm"
                          rows={16}
                        />
                        <div className="text-xs text-muted-foreground">
                          {promptData.content.length} characters • Supports rich text formatting
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags" className="text-foreground">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="Enter tags separated by commas (e.g., creative-writing, storytelling, characters)"
                        value={promptData.tags}
                        onChange={(e) => setPromptData({ ...promptData, tags: e.target.value })}
                        className="mt-1 bg-background text-foreground border-border"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tags help others discover your prompt. Use hyphens for multi-word tags.
                      </p>
                    </div>

                    <div>
                      <Label>Prompt Image (Optional)</Label>
                      <div className="mt-1">
                        {promptData.imageUrl ? (
                          <div className="relative">
                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                              <div className="text-center">
                                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                              </div>
                            </div>
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
                          <div className="w-full h-48 bg-background rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                            <div className="text-center">
                              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <Button variant="outline" onClick={handleImageUpload} disabled={isUploading}>
                                {isUploading ? "Uploading..." : "Upload Image"}
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 5MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-6">
                    <div className="border border-border rounded-lg p-6 bg-card">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-foreground">{promptData.title || "Untitled Prompt"}</h2>
                          {promptData.remixOf && (
                            <div className="flex items-center text-sm text-blue mt-1">
                              <GitBranch className="h-4 w-4 mr-1" />
                              <span>Remix of original prompt</span>
                            </div>
                          )}
                        </div>
                        <Badge variant={promptData.isPublic ? "default" : "secondary"}>
                          {promptData.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>

                      {promptData.imageUrl && (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}

                      <div className="bg-background rounded-lg p-4 font-mono text-sm mb-4 border border-border">
                        {promptData.content || "No content provided"}
                      </div>

                      {promptData.tags && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {parseTagsFromString(promptData.tags).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />0
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />0
                          </span>
                          <span className="flex items-center">
                            <GitBranch className="h-4 w-4 mr-1" />0
                          </span>
                        </div>
                        <span>by You</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={promptData.isPublic}
                        onChange={(e) => setPromptData({ ...promptData, isPublic: e.target.checked })}
                        className="h-4 w-4 text-blue bg-blue focus:ring-blue border-border rounded"
                      />
                      <Label htmlFor="isPublic">Make this prompt public</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Public prompts can be discovered, used, and remixed by the community
                    </p>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Remix Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="allowRemix"
                            defaultChecked
                            className="h-4 w-4 text-blue focus:ring-blue border-border rounded"
                          />
                          <Label htmlFor="allowRemix">Allow others to remix this prompt</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          When enabled, other users can create enhanced versions of your prompt
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Feedback Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="allowFeedback"
                            defaultChecked
                            className="h-4 w-4 text-blue focus:ring-blue border-border rounded"
                          />
                          <Label htmlFor="allowFeedback">Allow feedback and ratings</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Users can leave comments and rate your prompt (1-5 stars)
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleSave} variant="outline" className="w-full border-border text-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handlePublish} className="flex w-full bg-primary text-primary-foreground" disabled={loading}>
                  <Globe className="h-4 w-4 mr-2" />
                  {promptData.isPublic ? "Publish Prompt" : "Save Private"}
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Remix a Prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">Start with an existing prompt and make it your own</p>
                <Button variant="outline" className="w-full border-border text-foreground" onClick={() => handleRemix("prompt_1")}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Remix Writing Assistant
                </Button>
                <Button variant="outline" className="w-full border-border text-foreground" onClick={() => handleRemix("prompt_2")}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Remix Code Review
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0" />
                  <p>Be specific about what you want the AI to do</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0" />
                  <p>Provide context and examples when helpful</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0" />
                  <p>Use clear, structured formatting</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0" />
                  <p>Test your prompt before publishing</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0" />
                  <p>Add relevant tags for discoverability</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

