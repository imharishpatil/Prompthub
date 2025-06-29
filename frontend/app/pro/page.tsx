"use client";
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Share2,
  Calendar,
  Star,
  Edit3,
  Save,
  Users,
  Award,
  Globe,
  MessageCircle,
  GitBranch,
  ThumbsUp,
  MoreHorizontal,
  Settings as SettingsIcon
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
const user:User = {
  id: "user_1",
  email: "demo@prompthub.com",
  name: "Harish",
  avatarUrl: null,
  googleId:  null,
  password:  null,
  createdAt: "today",
  updatedAt: "today",
}


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email,
    bio: "Passionate about AI and prompt engineering. Love creating helpful prompts for the community.",
    location: "San Francisco, CA",
    website: "https://example.com",
  })

  React.useEffect(() => {
    if (isEditing) setActiveTab("settings")
  }, [isEditing])

  const userPrompts = staticPrompts.filter((p) => p.authorId === user.id)
  const totalFeedbacks = userPrompts.reduce((sum, prompt) => sum + prompt.feedbacks.length, 0)
  const totalRemixes = userPrompts.reduce((sum, prompt) => sum + prompt.remixCount, 0)
  const avgRating =
    userPrompts.length > 0
      ? userPrompts.reduce((sum, prompt) => sum + getAverageRating(prompt.feedbacks), 0) / userPrompts.length
      : 0

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated!",
      description: "Your profile has been updated successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8 bg-card border border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-24 w-24 bg-muted">
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name || "User"} />
                <AvatarFallback className="text-2xl text-foreground bg-muted">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
                    <p className="text-muted-foreground">{profileData.email}</p>
                    <p className="text-muted-foreground mt-1">{profileData.bio}</p>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="mt-4 sm:mt-0">
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {formatDate(user.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {profileData.location}
                  </span>
                  {user.googleId && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                      </svg>
                      Google Account
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-card border border-border">
              <CardHeader>
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <div className="relative">
      <TabsList
        className="
          grid w-full grid-cols-4 bg-muted
        "
        style={{ minWidth: 0 }}
      >
        <TabsTrigger
          value="overview"
          className={
            activeTab === "overview"
              ? "bg-primary text-primary-foreground h-full rounded-lg flex flex-col items-center"
              : "flex flex-col items-center"
          }
        >
          <span className="block sm:hidden">
            <Award className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="prompts"
          className={
            activeTab === "prompts"
              ? "bg-primary text-primary-foreground h-full rounded-lg flex flex-col items-center"
              : "flex flex-col items-center"
          }
        >
          <span className="block sm:hidden">
            <Edit3 className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">My Prompts</span>
        </TabsTrigger>
        <TabsTrigger
          value="feedback"
          className={
            activeTab === "feedback"
              ? "bg-primary text-primary-foreground h-full rounded-lg flex flex-col items-center"
              : " flex flex-col items-center"
          }
        >
          <span className="block sm:hidden">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Feedback</span>
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className={
            activeTab === "settings"
              ? "bg-primary text-primary-foreground h-full rounded-lg flex flex-col items-center"
              : "flex flex-col items-center"
          }
        >
          <span className="block sm:hidden">
            <SettingsIcon className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>
      {/* Optional: subtle gradient fade on mobile for overflow */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-muted to-transparent sm:hidden" />
    </div>
  </Tabs>
</CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-card border border-border">
                        <CardHeader>
                          <CardTitle className="text-lg text-foreground">Activity Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Prompts</span>
                              <span className="font-semibold text-primary">{userPrompts.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Feedback</span>
                              <span className="font-semibold text-primary">{totalFeedbacks}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Times Remixed</span>
                              <span className="font-semibold text-primary">{totalRemixes}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Rating</span>
                              <span className="font-semibold flex items-center text-primary">
                                {avgRating > 0 ? (
                                  <>
                                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                                    {avgRating.toFixed(1)}
                                  </>
                                ) : (
                                  "No ratings yet"
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card border border-border">
                        <CardHeader>
                          <CardTitle className="text-lg text-foreground">Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-yellow-100 rounded-full">
                                <Award className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-foreground">First Prompt</p>
                                <p className="text-xs text-muted-foreground">Created your first prompt</p>
                              </div>
                            </div>
                            {userPrompts.some((p) => p.isPublic) && (
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">Community Member</p>
                                  <p className="text-xs text-muted-foreground">Shared prompts publicly</p>
                                </div>
                              </div>
                            )}
                            {totalFeedbacks >= 5 && (
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                  <Star className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">Popular Creator</p>
                                  <p className="text-xs text-muted-foreground">Received 5+ feedback</p>
                                </div>
                              </div>
                            )}
                            {totalRemixes >= 1 && (
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-full">
                                  <GitBranch className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">Remix Master</p>
                                  <p className="text-xs text-muted-foreground">Your prompts were remixed</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userPrompts.slice(0, 5).map((prompt, index) => (
                            <div key={prompt.id} className="flex items-center space-x-3 text-sm">
                              <div className="w-2 h-2 bg-blue rounded-full" />
                              <span className="text-foreground">
                                Created <span className="font-medium">{`"${prompt.title}"`}</span>
                              </span>
                              <span className="text-muted-foreground">{formatRelativeTime(prompt.createdAt)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="prompts" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm md:text-lg font-medium text-foreground">My Prompts ({userPrompts.length})</h3>
                      <Button
                        size="sm"
                        className="flex gap-0 py-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "create" }))}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Prompt
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {userPrompts.map((prompt) => {
                        const avgRating = getAverageRating(prompt.feedbacks)
                        return (
<Card key={prompt.id} className="bg-card border border-border">
  <CardContent className="p-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
          <h4 className="font-medium text-foreground truncate text-sm md:text-base lg:text-lg">{prompt.title}</h4>
          <div className="flex flex-row flex-wrap gap-1 mt-1 sm:mt-0">
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-xs md:text-sm"
            >
              {prompt.isPublic ? "Public" : "Private"}
            </Badge>
            {prompt.remixOf && (
              <Badge
                variant="outline"
                className="px-2 py-0.5 text-xs md:text-sm flex items-center"
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Remix
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs md:text-sm  font-light px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between md:justify-start md:gap-2 lg:gap-4 text-xs md:text-sm lg:text-base text-muted-foreground">
          {avgRating > 0 && (
            <span className="flex items-center">
              <Star className="h-3 w-3 md:h-4 md:w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {avgRating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center">
            <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            {prompt.feedbacks.length}
          </span>
          {prompt.remixCount > 0 && (
            <span className="flex items-center">
              <GitBranch className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              {prompt.remixCount}
            </span>
          )}
          <span>{formatDate(prompt.createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-3 sm:mt-0">
        <Button size="sm" variant="outline" className="text-xs md:text-sm">
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="text-xs md:text-sm">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="text-xs md:text-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
                        )
                      })}
                    </div>
                  </TabsContent>
                  <TabsContent value="feedback" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground">Feedback Received ({totalFeedbacks})</h3>
                    </div>
                    <div className="space-y-4">
                      {userPrompts.flatMap((prompt) =>
                        prompt.feedbacks.map((feedback) => (
                          <Card key={feedback.id} className="bg-card border border-border">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-10 w-10 bg-muted">
                                  <AvatarImage
                                    src={feedback.user.avatarUrl || "/placeholder.svg"}
                                    alt={feedback.user.name || "User"}
                                  />
                                  <AvatarFallback className="text-foreground">
                                    {feedback.user.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="font-medium text-sm text-foreground">{feedback.user.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        on "{prompt.title}" • {formatRelativeTime(feedback.createdAt)}
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < feedback.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-foreground">{feedback.comment}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Button size="sm" variant="ghost" className="flex gap-0">
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      Helpful
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                      {totalFeedbacks === 0 && (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">No feedback yet</h3>
                          <p className="text-muted-foreground">Share your prompts publicly to start receiving feedback</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="settings" className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="mt-1"
                            disabled={!!user.googleId}
                          />
                          {user.googleId && (
                            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed for Google accounts</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={handleSave} className="flex gap-0">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Account Information</h3>
                          <div className="space-y-4">
                            <div>
                              <Label>Name</Label>
                              <p className="text-sm text-muted-foreground mt-1">{profileData.name}</p>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <p className="text-sm text-muted-foreground mt-1">{profileData.email}</p>
                            </div>
                            <div>
                              <Label>Account Type</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {user.googleId ? "Google Account" : "Email Account"}
                              </p>
                            </div>
                            <div>
                              <Label>Member Since</Label>
                              <p className="text-sm text-muted-foreground mt-1">{formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label>Public Profile</Label>
                                <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                              </div>
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label>Show Activity</Label>
                                <p className="text-sm text-muted-foreground">Display your recent activity</p>
                              </div>
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive email updates</p>
                              </div>
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                          <div className="space-y-4">
                            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                              Delete Account
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              This action cannot be undone. All your prompts and data will be permanently deleted.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue">{userPrompts.length}</div>
                    <div className="text-sm text-muted-foreground">Total Prompts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green">{totalFeedbacks}</div>
                    <div className="text-sm text-muted-foreground">Total Feedback</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-perpole">{totalRemixes}</div>
                    <div className="text-sm text-muted-foreground">Times Remixed</div>
                  </div>
                  {avgRating > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                        <Star className="h-6 w-6 mr-1 fill-yellow-400 text-yellow-400" />
                        {avgRating.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6 bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Badge Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="p-3 bg-yellow-100 rounded-full w-12 h-12 mx-auto mb-2">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="text-xs text-muted-foreground">Creator</div>
                  </div>
                  {userPrompts.some((p) => p.isPublic) && (
                    <div className="text-center">
                      <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-xs text-muted-foreground">Community</div>
                    </div>
                  )}
                  {totalFeedbacks >= 5 && (
                    <div className="text-center">
                      <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2">
                        <Star className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-xs text-muted-foreground">Popular</div>
                    </div>
                  )}
                  {totalRemixes >= 1 && (
                    <div className="text-center">
                      <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2">
                        <GitBranch className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-xs text-muted-foreground">Remix Master</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}