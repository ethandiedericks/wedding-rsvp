"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, Mail, Lock, User } from "lucide-react";
import { getSession, signIn, signUp } from "@/app/actions/actions";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    // Check if user was redirected from a protected page
    if (redirectedFrom) {
      if (redirectedFrom === "/rsvp") {
        setRedirectMessage("Please sign in to access the RSVP page");
      } else if (redirectedFrom === "/admin") {
        setRedirectMessage("Please sign in to access the admin dashboard");
      } else {
        setRedirectMessage(
          `Please sign in to access the ${redirectedFrom.replace("/", "")} page`
        );
      }
    }

    // Check if user is already signed in
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          // If already signed in and was redirected, go back to that page
          if (redirectedFrom) {
            router.push(redirectedFrom);
          }
        }
      } catch (error) {
        // User is not signed in, which is expected on this page
      }
    };

    checkSession();
  }, [redirectedFrom, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, role } = await signIn(email, password);
      console.log("Sign-in successful, redirecting with role:", role);

      toast.success("Signed in successfully!");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If user was redirected from a protected page, send them back there
      // But check if they're trying to access admin and don't have admin role
      if (redirectedFrom) {
        if (redirectedFrom.startsWith("/admin") && role !== "admin") {
          router.push("/rsvp");
        } else {
          router.push(redirectedFrom);
        }
      } else {
        router.push(role === "admin" ? "/admin" : "/rsvp");
      }
    } catch (err: unknown) {
      console.error("Sign-in error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during sign-in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName) {
      toast.error("Please enter your full name");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, fullName);
      toast.success("Account created successfully! Please check your email.");
      setIsSignUp(false);
    } catch (err: unknown) {
      console.error("Sign-up error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during sign-up"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="container mx-auto py-20 px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center mb-8"
      >
        <Heart className="mx-auto text-[#D4B56A] mb-3" size={32} />
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2 text-[#2D2D2D]">
          {isSignUp ? "Join Our Celebration" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground">
          {isSignUp
            ? "Create an account to RSVP to our special day"
            : "Sign in to manage your RSVP and view wedding details"}
        </p>

        {redirectMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 p-3 bg-[#D4B56A]/10 text-[#D4B56A] rounded-md border border-[#D4B56A]/20"
          >
            {redirectMessage}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={formVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <Card className="max-w-md mx-auto border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="inline-block text-sm text-[#D4B56A] font-medium uppercase tracking-wider mb-2">
              {isSignUp ? "Sign Up" : "Sign In"}
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={isSignUp ? handleSignUp : handleSignIn}
              className="space-y-5"
            >
              {isSignUp && (
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="relative"
                >
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                  />
                </motion.div>
              )}

              <motion.div
                custom={isSignUp ? 1 : 0}
                variants={inputVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative"
              >
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                />
              </motion.div>

              <motion.div
                custom={isSignUp ? 2 : 1}
                variants={inputVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative"
              >
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                />
              </motion.div>

              {isSignUp && (
                <motion.div
                  custom={3}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="relative"
                >
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 border-[#D4B56A]/30 focus:border-[#D4B56A] focus-visible:ring-[#D4B56A]/20"
                  />
                </motion.div>
              )}

              <motion.div
                custom={isSignUp ? 4 : 2}
                variants={inputVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <Button
                  type="submit"
                  className="w-full bg-[#D4B56A] hover:bg-[#C4A55A] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </span>
                  ) : (
                    <>{isSignUp ? "Create Account" : "Sign In"}</>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              custom={isSignUp ? 5 : 3}
              variants={inputVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mt-6 text-center"
            >
              <button
                type="button"
                className="text-sm text-[#D4B56A] hover:text-[#C4A55A] transition-colors"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Need an account? Sign Up"}
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
