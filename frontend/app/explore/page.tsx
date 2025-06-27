"use client";
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Heart,
  Share2,
  Star,
  Filter,
  MessageCircle,
  ImageIcon,
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
    imageUrl: "/placeholder.svg?height=200&width=400",
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
    imageUrl: null,
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
    imageUrl: "/placeholder.svg?height=200&width=400",
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


export default function ExplorePage() {

    const [searchQuery, setSearchQuery] = useState("")
      const [selectedTags, setSelectedTags] = useState<string[]>([])
      const [sortBy, setSortBy] = useState("popular")
    
      // Get all unique tags from prompts
      const allTags = Array.from(new Set([...staticPrompts, ...featuredPrompts].flatMap((prompt) => prompt.tags))).sort()
    
      const sortOptions = [
        { value: "popular", label: "Most Popular" },
        { value: "recent", label: "Most Recent" },
        { value: "rating", label: "Highest Rated" },
        { value: "remixed", label: "Most Remixed" },
      ]
    
      const allPrompts = [...staticPrompts, ...featuredPrompts].filter((p) => p.isPublic)
    
      const filteredPrompts = allPrompts.filter((prompt) => {
        const matchesSearch =
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
        const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => prompt.tags.includes(tag))
    
        return matchesSearch && matchesTags
      })
    
      const toggleTag = (tag: string) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
      }
    
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Prompts</h1>
          <p className="text-gray-600">Discover amazing prompts created by the community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prompts, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Tag Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => {
            const avgRating = getAverageRating(prompt.feedbacks)
            return (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-3">
                        {prompt.content.substring(0, 150)}...
                      </CardDescription>
                    </div>
                    {prompt.remixOf && (
                      <Badge variant="outline" className="ml-2">
                        <GitBranch className="h-3 w-3 mr-1" />
                        Remix
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prompt.imageUrl && (
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{prompt.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        {avgRating > 0 && (
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            {avgRating.toFixed(1)}
                          </span>
                        )}
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {prompt.feedbacks.length}
                        </span>
                        {prompt.remixCount > 0 && (
                          <span className="flex items-center">
                            <GitBranch className="h-4 w-4 mr-1" />
                            {prompt.remixCount}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">by {prompt.author.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatDate(prompt.createdAt)}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <GitBranch className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}