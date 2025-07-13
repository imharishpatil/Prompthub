"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ME_WITH_PROMPTS_QUERY } from "@/lib/gql/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User } from "@/lib/types";
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
} from "lucide-react";
import Loading from "../loading";
import CustomLayout from "@/components/layout/layout";

// Helper functions
const getAverageRating = (feedbacks: { rating: number }[] = []) =>
  feedbacks.length === 0
    ? 0
    : feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();

export default function Dashboard() {
  const router = useRouter();
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    if (!token) {
      router.replace("/login");
    } else {
      setTokenChecked(true);
    }
  }, [router]);

  const { data, loading, error } = useQuery<{ me: User }>(
    ME_WITH_PROMPTS_QUERY,
    {
      skip: !tokenChecked,
    }
  );

  if (!tokenChecked || loading) {
    return <Loading />;
  }

  if (error || !data?.me) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error?.message || "User not found or not authenticated."}
      </div>
    );
  }

  const user = data.me;
  const userPrompts = user.prompts ?? [];

  const totalViews = userPrompts.reduce(
    (sum, prompt) => sum + (prompt.feedbacks?.length || 0) * 50,
    0
  );
  const totalLikes = userPrompts.reduce(
    (sum, prompt) =>
      sum +
      (prompt.feedbacks?.reduce((acc, f) => acc + (f.rating || 0), 0) || 0),
    0
  );
  const publicPrompts = userPrompts.filter((p) => p.isPublic).length;
  const weeklyGoal: number = 5;
  const currentProgress = userPrompts.length % weeklyGoal;
  const progressPercentage =
    weeklyGoal === 0 ? 0 : (currentProgress / weeklyGoal) * 100;

  const stats = [
    { title: "Total Prompts", value: userPrompts.length, icon: BookOpen },
    { title: "Total Views", value: totalViews.toLocaleString(), icon: TrendingUp },
    { title: "Total Ratings", value: totalLikes, icon: Star },
    { title: "Public Prompts", value: publicPrompts, icon: Share2 },
  ];

  const recentActivity: {
    id: string;
    type: string;
    title: string;
    time: string;
    icon: any;
  }[] = [];

  if (userPrompts.length > 0) {
    recentActivity.push({
      id: "created",
      type: "created",
      title: `Created "${userPrompts[0].title}"`,
      time: formatDate(userPrompts[0].createdAt),
      icon: Plus,
    });

    if (userPrompts[0].feedbacks?.length > 0) {
      recentActivity.push({
        id: "feedback",
        type: "feedback",
        title: `Received new feedback on "${userPrompts[0].title}"`,
        time: formatDate(userPrompts[0].feedbacks[0].createdAt),
        icon: MessageCircle,
      });
    }

    if (userPrompts[0].remixCount > 0) {
      recentActivity.push({
        id: "remix",
        type: "remix",
        title: `"${userPrompts[0].title}" was remixed by another user`,
        time: formatDate(userPrompts[0].updatedAt),
        icon: GitBranch,
      });
    }
  }

  return (
    <CustomLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-card border border-border">
                <AvatarImage
                  src={user.avatarUrl || "/placeholder.svg"}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="text-lg bg-muted text-muted-foreground">
                  {user.name?.split(" ").map((n) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {user.name?.split(" ")[0] || "User"}!
                </h1>
                <p className="text-primary">
                  Ready to create some amazing prompts today?
                </p>
                <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                  {user.googleId && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-secondary">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* (rest of the dashboard content...) */}
          {/* You already have the rest implemented correctly: Weekly Goal, Quick Actions, Recent Prompts, Recent Activity */}
        </div>
      </div>
    </CustomLayout>
  );
}
