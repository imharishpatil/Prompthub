"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { PROMPTS_QUERY } from "@/lib/gql/explore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Heart,
  Share2,
  Star,
  Filter,
  MessageCircle,
  ImageIcon,
  GitBranch,
} from "lucide-react";

// Types based on Prisma schema
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
  isPublic: boolean;
  author: User;
  remixOf: string | null;
  remixCount: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string | null;
  feedbacks: Feedback[];
}

const getAverageRating = (feedbacks: Feedback[]): number => {
  if (!feedbacks || feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
  return sum / feedbacks.length;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return formatDate(dateString);
};

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");

  // Fetch all public prompts from backend
  const { data, loading, error } = useQuery<{ prompts: Prompt[] }>(PROMPTS_QUERY, {
    variables: {
      search: searchQuery || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      isPublic: true,
    },
    fetchPolicy: "cache-and-network",
  });

  const allPrompts = data?.prompts ?? [];

  // Get all unique tags from prompts
  const allTags = Array.from(new Set(allPrompts.flatMap((prompt) => prompt.tags))).sort();

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "recent", label: "Most Recent" },
    { value: "rating", label: "Highest Rated" },
    { value: "remixed", label: "Most Remixed" },
  ];

  let filteredPrompts = allPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => prompt.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  if (sortBy === "recent") {
    filteredPrompts = [...filteredPrompts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortBy === "rating") {
    filteredPrompts = [...filteredPrompts].sort(
      (a, b) => getAverageRating(b.feedbacks) - getAverageRating(a.feedbacks)
    );
  } else if (sortBy === "remixed") {
    filteredPrompts = [...filteredPrompts].sort((a, b) => b.remixCount - a.remixCount);
  } else {
    // Default: "popular" (by feedback count)
    filteredPrompts = [...filteredPrompts].sort(
      (a, b) => (b.feedbacks?.length || 0) - (a.feedbacks?.length || 0)
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore Prompts</h1>
          <p className="text-muted-foreground">Discover amazing prompts created by the community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card text-foreground border-border"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="border-border text-foreground">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Tag Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-foreground">Filter by tags:</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
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
                  className={`text-xs ${selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-background text-foreground border-border"}`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="text-center py-12">Loading prompts...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Error loading prompts: {error.message}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No prompts found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
            {filteredPrompts.map((prompt) => {
              const avgRating = getAverageRating(prompt.feedbacks);
              return (
                <Card key={prompt.id} className="bg-card border border-border hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 text-foreground">{prompt.title}</CardTitle>
                        <CardDescription className="mt-2 line-clamp-3 text-muted-foreground">
                          {prompt.content.substring(0, 150)}...
                        </CardDescription>
                      </div>
                      {prompt.remixOf && (
                        <Badge variant="outline" className="ml-2 text-xs bg-background text-foreground border-border flex items-center">
                          <GitBranch className="h-3 w-3 mr-1" />
                          Remix
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {prompt.imageUrl && (
                        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-background text-foreground border-border">
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs bg-background text-foreground border-border">
                            +{prompt.tags.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
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
                        <span className="text-xs text-muted-foreground">by {prompt.author.name}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{formatDate(prompt.createdAt)}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-border text-foreground">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-border text-foreground">
                            <GitBranch className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-border text-foreground">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}