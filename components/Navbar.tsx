
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, LogIn, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      <nav className="container flex items-center justify-between px-6 py-4">
        {/* Left: Heart Icon */}
        <Link href="/" className="flex items-center">
          <Heart className="h-6 w-6 text-[#C8935F]" />
        </Link>

        {/* Right: Navigation Links and Auth (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-[#C8935F]"
          >
            Home
          </Link>
          <Link
            href="/rsvp"
            className="text-sm font-medium transition-colors hover:text-[#C8935F]"
          >
            RSVP
          </Link>
          <Link
            href="/gifts"
            className="text-sm font-medium transition-colors hover:text-[#C8935F]"
          >
            Gift Registry
          </Link>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin" passHref>
                  <Button variant="outline" className="border-[#C8935F] text-[#C8935F] hover:bg-[#C8935F] hover:text-white">
                    Admin
                  </Button>
                </Link>
              )}
              <Button onClick={handleSignOut} className="bg-[#C8935F] text-white hover:bg-[#B27F4E]">
                <LogOut className="mr-1 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth/signin" passHref>
              <Button className="bg-[#C8935F] text-white hover:bg-[#B27F4E]">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-[#C8935F]"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/gifts"
                className="text-sm font-medium transition-colors hover:text-[#C8935F]"
                onClick={() => setIsOpen(false)}
              >
                Gift Registry
              </Link>
              {isAuthenticated && (
                <Link
                  href="/rsvp"
                  className="text-sm font-medium transition-colors hover:text-[#C8935F]"
                  onClick={() => setIsOpen(false)}
                >
                  RSVP
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium transition-colors hover:text-[#C8935F]"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start px-0 text-[#C8935F] hover:text-[#B27F4E]"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Link href="/auth/signin" passHref>
                  <Button onClick={() => setIsOpen(false)} className="bg-[#C8935F] text-white hover:bg-[#B27F4E]">
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
