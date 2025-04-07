"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LogIn, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation"; // Add usePathname

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  // Handle authentication
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    setIsOpen(false);
  };

  // Determine if on homepage
  const isHomePage = pathname === "/";

  // Text color logic
  const linkTextColor =
    isHomePage && !scrolled
      ? "text-white hover:text-white/80"
      : "text-[#2D2D2D] hover:text-primary";

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <h1
              className={`font-serif text-lg md:text-xl lg:text-2xl font-normal ${
                isHomePage && !scrolled ? "text-white" : "text-[#2D2D2D]"
              }`}
            >
              {"R & L"}
            </h1>
          </Link>
        </div>

        {/* Right: Navigation Links + Auth (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm tracking-wider  transition-colors ${linkTextColor}`}
          >
            HOME
          </Link>
          <Link
            href="/rsvp"
            className={`text-sm tracking-wider  transition-colors ${linkTextColor}`}
          >
            RSVP
          </Link>
          <Link
            href="/gifts"
            className={`text-sm tracking-wider  transition-colors ${linkTextColor}`}
          >
            GIFT REGISTRY
          </Link>

          {/* Authentication */}
          <div className="flex items-center space-x-4 ml-6">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" passHref>
                    <button className="border hover:cursor-pointer border-[#D4B56A] hover:bg-[#D4B56A]/5 text-[#D4B56A] px-6 py-2 inline-block transition-all duration-300 tracking-wider">
                      ADMIN
                    </button>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="bg-[#D4B56A] hover:cursor-pointer hover:bg-[#C6A55D] text-white px-6 py-2 inline-block transition-all duration-300 tracking-wider"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <Link href="/auth/signin">
                <span className="bg-[#D4B56A] hover:cursor-pointer hover:bg-[#C6A55D] text-white px-6 py-2 inline-block transition-all duration-300 tracking-wider">
                  SIGN IN
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={!scrolled && isHomePage ? "text-white" : ""}
            >
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
