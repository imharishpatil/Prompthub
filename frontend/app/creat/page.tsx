"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
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

// Types based on Prisma schema
interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  googleId: string | null
  password: string | null
  createdAt: string
  updatedAt: string
}

interface Prompt {
  id: string
  title: string
  content: string // Rich text content
  tags: string[]
  isPublic: boolean
  authorId: string
  author: User
  remixOf: string | null
  remixCount: number
  createdAt: string
  updatedAt: string
  imageUrl: string | null
  feedbacks: Feedback[]
}

interface Feedback {
  id: string
  userId: string
  user: User
  promptId: string
  comment: string
  rating: number // 1-5
  createdAt: string
}

// Static Data matching schema structure
const staticUser: User = {
  id: "user_1",
  email: "alex.johnson@example.com",
  name: "Alex Johnson",
  avatarUrl: "/placeholder.svg?height=40&width=40",
  googleId: "google_123456789",
  password: null, // OAuth user
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z",
}

const staticUsers: User[] = [
  staticUser,
  {
    id: "user_2",
    email: "sarah.chen@example.com",
    name: "Sarah Chen",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    googleId: "google_987654321",
    password: null,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
  {
    id: "user_3",
    email: "maria.rodriguez@example.com",
    name: "Maria Rodriguez",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    googleId: null,
    password: "hashed_password",
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-19T09:15:00Z",
  },
]

const staticFeedbacks: Feedback[] = [
  {
    id: "feedback_1",
    userId: "user_2",
    user: staticUsers[1],
    promptId: "prompt_1",
    comment: "This is an excellent prompt for creative writing! Really helped me overcome writer's block.",
    rating: 5,
    createdAt: "2024-01-21T10:30:00Z",
  },
  {
    id: "feedback_2",
    userId: "user_3",
    user: staticUsers[2],
    promptId: "prompt_1",
    comment: "Good structure, but could use more specific examples.",
    rating: 4,
    createdAt: "2024-01-20T16:45:00Z",
  },
  {
    id: "feedback_3",
    userId: "user_1",
    user: staticUsers[0],
    promptId: "prompt_2",
    comment: "Perfect for code reviews! Using this in my team now.",
    rating: 5,
    createdAt: "2024-01-19T14:20:00Z",
  },
]

const staticPrompts: Prompt[] = [
  {
    id: "prompt_1",
    title: "Creative Writing Assistant",
    content: `You are a creative writing assistant designed to help writers overcome blocks and develop compelling narratives.

**Your Role:**
- Provide story ideas and plot suggestions
- Help develop complex, multi-dimensional characters
- Suggest narrative techniques and writing styles
- Offer constructive feedback on writing samples

**Instructions:**
1. When given a genre or theme, provide 3-5 unique story concepts
2. For character development, create detailed backstories and motivations
3. Always encourage creativity while maintaining narrative coherence
4. Provide specific, actionable writing advice

**Example Usage:**
"I'm writing a sci-fi story about time travel but I'm stuck on the plot. Can you help me develop some interesting complications?"`,
    tags: ["creative-writing", "storytelling", "characters", "plot-development"],
    isPublic: true,
    authorId: "user_1",
    author: staticUser,
    remixOf: null,
    remixCount: 3,
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
    imageUrl: "/placeholder.svg?height=200&width=400",
    feedbacks: staticFeedbacks.filter((f) => f.promptId === "prompt_1"),
  },
  {
    id: "prompt_2",
    title: "Code Review Expert",
    content: `You are a senior software engineer conducting thorough code reviews.

**Review Checklist:**
- **Code Structure & Organization**
  - Is the code well-organized and modular?
  - Are functions/classes appropriately sized?
  - Is there proper separation of concerns?

- **Performance & Efficiency**
  - Are there any performance bottlenecks?
  - Can algorithms be optimized?
  - Is memory usage efficient?

- **Security Considerations**
  - Are there potential security vulnerabilities?
  - Is input validation proper?
  - Are sensitive data handled correctly?

- **Best Practices**
  - Does the code follow language conventions?
  - Is error handling comprehensive?
  - Are there adequate tests?

**Output Format:**
Provide feedback in this structure:
1. **Strengths:** What's done well
2. **Issues:** Problems that need fixing
3. **Suggestions:** Improvements and optimizations
4. **Security:** Any security concerns
5. **Overall Rating:** 1-10 with justification`,
    tags: ["code-review", "programming", "best-practices", "security"],
    isPublic: true,
    authorId: "user_1",
    author: staticUser,
    remixOf: null,
    remixCount: 1,
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
    imageUrl: null,
    feedbacks: staticFeedbacks.filter((f) => f.promptId === "prompt_2"),
  },
  {
    id: "prompt_3",
    title: "Marketing Copy Generator Pro",
    content: `You are a professional copywriter specializing in high-converting marketing content.

**Your Expertise:**
- Persuasive sales copy
- Email marketing campaigns
- Social media content
- Landing page optimization
- Brand voice development

**Process:**
1. **Audience Analysis:** Understand the target demographic
2. **Value Proposition:** Identify key benefits and unique selling points
3. **Emotional Triggers:** Incorporate psychological persuasion techniques
4. **Call-to-Action:** Create compelling CTAs that drive conversions

**Copy Types:**
- Headlines that grab attention
- Product descriptions that sell
- Email subject lines with high open rates
- Social media posts that engage
- Ad copy that converts

**Guidelines:**
- Use active voice and strong verbs
- Focus on benefits, not just features
- Create urgency and scarcity when appropriate
- A/B test different approaches
- Maintain brand consistency`,
    tags: ["marketing", "copywriting", "sales", "conversion", "branding"],
    isPublic: false,
    authorId: "user_1",
    author: staticUser,
    remixOf: null,
    remixCount: 0,
    createdAt: "2024-01-16T11:15:00Z",
    updatedAt: "2024-01-17T16:20:00Z",
    imageUrl: "/placeholder.svg?height=200&width=400",
    feedbacks: [],
  },
]

const featuredPrompts: Prompt[] = [
  {
    id: "prompt_4",
    title: "Data Analysis Wizard",
    content: `You are a data scientist expert in statistical analysis and data visualization.

**Analysis Framework:**
1. **Data Exploration**
   - Examine data structure and quality
   - Identify missing values and outliers
   - Understand variable distributions

2. **Statistical Analysis**
   - Descriptive statistics
   - Correlation analysis
   - Hypothesis testing
   - Regression modeling

3. **Visualization Strategy**
   - Choose appropriate chart types
   - Create compelling narratives
   - Highlight key insights

4. **Actionable Insights**
   - Translate findings into business recommendations
   - Identify trends and patterns
   - Suggest next steps

**Tools & Techniques:**
- Python/R for analysis
- Tableau/PowerBI for visualization
- Statistical modeling
- Machine learning applications`,
    tags: ["data-analysis", "statistics", "visualization", "python", "insights"],
    isPublic: true,
    authorId: "user_2",
    author: staticUsers[1],
    remixOf: null,
    remixCount: 5,
    createdAt: "2024-01-22T08:45:00Z",
    updatedAt: "2024-01-22T08:45:00Z",
    imageUrl: "/placeholder.svg?height=200&width=400",
    feedbacks: [],
  },
  {
    id: "prompt_5",
    title: "Language Learning Companion",
    content: `You are an experienced language tutor providing personalized learning experiences.

**Teaching Methodology:**
- **Immersive Conversations:** Practice real-world scenarios
- **Grammar in Context:** Learn rules through practical usage
- **Cultural Integration:** Understand cultural nuances
- **Progressive Difficulty:** Adapt to learner's level

**Lesson Structure:**
1. **Warm-up:** Review previous concepts
2. **New Material:** Introduce new vocabulary/grammar
3. **Practice:** Interactive exercises and conversations
4. **Application:** Real-world usage scenarios
5. **Feedback:** Corrections and encouragement

**Specializations:**
- Business language skills
- Travel and tourism vocabulary
- Academic writing
- Pronunciation coaching
- Cultural communication`,
    tags: ["language-learning", "education", ",conversation", "tutoring", "culture"],
    isPublic: true,
    authorId: "user_3",
    author: staticUsers[2],
    remixOf: null,
    remixCount: 2,
    createdAt: "2024-01-21T13:20:00Z",
    updatedAt: "2024-01-21T13:20:00Z",
    imageUrl: null,
    feedbacks: [],
  },
  {
    id: "prompt_6",
    title: "Enhanced Creative Writing Assistant",
    content: `You are an advanced creative writing assistant with specialized expertise in narrative development.

**Enhanced Features:**
- Character psychology and development
- World-building for fantasy/sci-fi
- Dialogue authenticity
- Plot structure optimization
- Genre-specific techniques

**This is a remix of the original Creative Writing Assistant with additional focus on:**
- Advanced character development techniques
- Detailed world-building frameworks
- Genre-specific writing conventions
- Publishing industry insights

**New Capabilities:**
1. **Character Archetypes:** Create compelling character templates
2. **World Consistency:** Maintain logical world rules
3. **Pacing Control:** Balance action and exposition
4. **Market Awareness:** Understand current publishing trends`,
    tags: ["creative-writing", "storytelling", "characters", "world-building", "advanced"],
    isPublic: true,
    authorId: "user_2",
    author: staticUsers[1],
    remixOf: "prompt_1", // This is a remix of the Creative Writing Assistant
    remixCount: 0,
    createdAt: "2024-01-23T10:15:00Z",
    updatedAt: "2024-01-23T10:15:00Z",
    imageUrl: "/placeholder.svg?height=200&width=400",
    feedbacks: [],
  },
]

// Helper functions
const getAverageRating = (feedbacks: Feedback[]): number => {
  if (feedbacks.length === 0) return 0
  const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0)
  return sum / feedbacks.length
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
  return formatDate(dateString)
}



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

  const handleSave = () => {
    toast({
      title: "Prompt saved!",
      description: "Your prompt has been saved as a draft.",
    })
  }

  const handlePublish = () => {
    if (!promptData.title.trim() || !promptData.content.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please add a title and content before publishing.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Prompt published!",
      description: "Your prompt is now available to the community.",
    })
  }

  const handleImageUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setPromptData({ ...promptData, imageUrl: "/placeholder.svg?height=200&width=400" })
      setIsUploading(false)
      toast({
        title: "Image uploaded!",
        description: "Your image has been added to the prompt.",
      })
    }, 2000)
  }

  const handleRemix = (originalPromptId: string) => {
    const originalPrompt = [...staticPrompts, ...featuredPrompts].find((p) => p.id === originalPromptId)
    if (originalPrompt) {
      setPromptData({
        title: `Enhanced ${originalPrompt.title}`,
        content: originalPrompt.content,
        tags: originalPrompt.tags.join(", "),
        isPublic: true,
        remixOf: originalPromptId,
        imageUrl: originalPrompt.imageUrl,
      })
      toast({
        title: "Prompt loaded for remix!",
        description: "You can now modify and enhance the original prompt.",
      })
    }
  }

  const parseTagsFromString = (tagsString: string): string[] => {
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
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
                <Button onClick={handlePublish} className="flex w-full bg-primary text-primary-foreground">
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

