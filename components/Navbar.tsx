"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, LogIn, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.role === "admin"));
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    setIsOpen(false);
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm fixed w-full z-50">
      <nav className="container flex items-center justify-between px-6 py-4 relative">
        {/* Left: Heart Icon */}
        <div className="flex items-center">
          <Link href="/">
            <Heart className="h-6 w-6 text-rose-500" />
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/rsvp"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            RSVP
          </Link>

          <Link
            href="/gifts"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Gift Registry
          </Link>

        </div>

        {/* Right: Auth and Admin Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  passHref
                >
                  <Button variant="outline">Admin</Button>
                </Link>
              )}
              <Button onClick={handleSignOut}>
                <LogOut className="mr-1 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth/signin" passHref>
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-8">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/gifts"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Gift Registry
              </Link>
              {isAuthenticated && (
                <Link
                  href="/rsvp"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  RSVP
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start px-0"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Link href="/auth/signin" passHref>
                  <Button onClick={() => setIsOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}