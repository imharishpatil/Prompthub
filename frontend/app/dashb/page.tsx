import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  Settings,
  TrendingUp,
  Share2,
  BookOpen,
  Target,
  Calendar,
  Star,
  MessageCircle,
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

export default function Dashboard() {
  const userPrompts = staticPrompts.filter((p) => p.authorId === user.id)
    const totalViews = userPrompts.reduce((sum, prompt) => sum + prompt.feedbacks.length * 50, 0) // Simulated views
    const totalLikes = userPrompts.reduce(
      (sum, prompt) => sum + prompt.feedbacks.reduce((acc, f) => acc + f.rating, 0),
      0,
    )
    const publicPrompts = userPrompts.filter((p) => p.isPublic).length
  
    const weeklyGoal = 5
    const currentProgress = userPrompts.length % weeklyGoal
    const progressPercentage = (currentProgress / weeklyGoal) * 100
  
    const stats = [
      {
        title: "Total Prompts",
        value: userPrompts.length,
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Total Views",
        value: totalViews.toLocaleString(),
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Total Ratings",
        value: totalLikes,
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
      {
        title: "Public Prompts",
        value: publicPrompts,
        icon: Share2,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ]
  
    const recentActivity = [
      {
        id: "1",
        type: "created",
        title: `Created "${userPrompts[0]?.title || "New Prompt"}"`,
        time: formatRelativeTime(userPrompts[0]?.createdAt || new Date().toISOString()),
        icon: Plus,
      },
      {
        id: "2",
        type: "feedback",
        title: "Received new feedback on your prompt",
        time: "4 hours ago",
        icon: MessageCircle,
      },
      {
        id: "3",
        type: "remix",
        title: "Your prompt was remixed by another user",
        time: "1 day ago",
        icon: GitBranch,
      },
      {
        id: "4",
        type: "viewed",
        title: "Your prompts were viewed 47 times",
        time: "2 days ago",
        icon: TrendingUp,
      },
    ]
  
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name || "User"} />
                <AvatarFallback className="text-lg">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name?.split(" ")[0] || "User"}!</h1>
                <p className="text-gray-600">Ready to create some amazing prompts today?</p>
                <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                  {user.googleId && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                        </svg>
                        Google Account
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Goal Progress */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    Weekly Goal
                  </CardTitle>
                  <CardDescription>Create {weeklyGoal} prompts this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">
                        {currentProgress} of {weeklyGoal}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{weeklyGoal - currentProgress} prompts to go</span>
                      <span className="font-medium text-blue-600">{Math.round(progressPercentage)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Prompt
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Explore Community
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
  
            {/* Recent Prompts and Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Prompts */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Prompts</CardTitle>
                  <CardDescription>Your latest prompt creations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userPrompts.slice(0, 3).map((prompt) => {
                      const avgRating = getAverageRating(prompt.feedbacks)
                      return (
                        <div
                          key={prompt.id}
                          className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">{prompt.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge variant={prompt.isPublic ? "default" : "secondary"}>
                                  {prompt.isPublic ? "Public" : "Private"}
                                </Badge>
                                {prompt.remixOf && (
                                  <Badge variant="outline" className="text-xs">
                                    <GitBranch className="h-3 w-3 mr-1" />
                                    Remix
                                  </Badge>
                                )}
                              </div>
                            </div>
  
                            <div className="flex flex-wrap gap-1 mb-2">
                              {prompt.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
  
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {avgRating > 0 && (
                                <span className="flex items-center">
                                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                  {avgRating.toFixed(1)}
                                </span>
                              )}
                              <span className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {prompt.feedbacks.length} feedback{prompt.feedbacks.length !== 1 ? "s" : ""}
                              </span>
                              {prompt.remixCount > 0 && (
                                <span className="flex items-center">
                                  <GitBranch className="h-3 w-3 mr-1" />
                                  {prompt.remixCount} remix{prompt.remixCount !== 1 ? "es" : ""}
                                </span>
                              )}
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(prompt.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      View All Prompts
                    </Button>
                  </div>
                </CardContent>
              </Card>
  
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest activity on PromptHub</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-gray-100 rounded-full">
                            <activity.icon className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
}