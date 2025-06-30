"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/lib/gql/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react"

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; strength: number; feedback: string[] } => {
  const feedback: string[] = [];
  let strength = 0;

  if (password.length >= 8) strength += 1;
  else feedback.push("At least 8 characters");

  if (/[A-Z]/.test(password)) strength += 1;
  else feedback.push("One uppercase letter");

  if (/[a-z]/.test(password)) strength += 1;
  else feedback.push("One lowercase letter");

  if (/\d/.test(password)) strength += 1;
  else feedback.push("One number");

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  else feedback.push("One special character");

  return {
    isValid: strength >= 3,
    strength: (strength / 5) * 100,
    feedback,
  };
};

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const passwordValidation = validatePassword(formData.password);

  // Apollo mutation
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      newErrors.password = "Password does not meet requirements";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data } = await signup({
        variables: {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        },
      });

      if (data?.signup?.token) {
        localStorage.setItem("token", data.signup.token);
        toast("Registration successful!", {
          description: "Welcome to PromptHub. You can now start creating and sharing prompts.",
        });
        // Optionally redirect, e.g.:
        // window.location.href = "/pro";
      }
    } catch (err: any) {
      toast("Registration failed", {
        description: err.message || "An error occurred during registration.",
      });
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 40) return "Weak";
    if (strength < 70) return "Medium";
    return "Strong";
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card border border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-foreground">Welcome</CardTitle>
          <CardDescription className="text-muted-foreground">Continue with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full flex bg-muted hover:bg-muted/80 text-foreground border-border"
                >
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
                  Signup with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? "border-red-500 bg-muted text-foreground" : "bg-muted text-foreground"}
                    placeholder="Jhon Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={errors.email ? "border-red-500 bg-muted text-foreground" : "bg-muted text-foreground"}
                    placeholder="m@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={errors.password ? "border-red-500 bg-muted text-foreground" : "bg-muted text-foreground"}
                    placeholder="********"
                  />
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Password strength</span>
                      <span
                        className={`font-medium ${
                          passwordValidation.strength < 40
                            ? "text-red-600"
                            : passwordValidation.strength < 70
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {getPasswordStrengthText(passwordValidation.strength)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                          passwordValidation.strength
                        )}`}
                        style={{ width: `${passwordValidation.strength}%` }}
                      />
                    </div>
                    {passwordValidation.feedback.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Missing: {passwordValidation.feedback.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}

                <Button
                  type="submit"
                  variant="ghost"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-background"
                >
                  {loading && <Loader2Icon className="animate-spin mr-2" />}
                  Register
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 text-primary hover:text-primary/50">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}