import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";

interface NavbarProps {
  user?: {
    name?: string;
    avatar?: string;
    type?: "donor" | "recipient";
  } | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const { user: curUser } = useUser(); // Access user context

  console.log("Current User:", curUser);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-bloodred text-2xl font-bold">
              Blood<span className="text-bloodblue">Link</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link to="/events" className="text-sm font-medium hover:text-primary">
            Events
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-primary"
          >
            Contact
          </Link>
          <Link
            to="/blood-requests"
            className="text-sm font-medium hover:text-primary"
          >
            Blood Request
          </Link>

          {curUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar ? (
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {curUser?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.type === "donor"
                        ? "Blood Donor"
                        : "Blood Recipient"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="px-2 py-1.5 text-sm font-medium"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-2 py-1.5 text-sm font-medium"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/blood-requests"
              className="px-2 py-1.5 text-sm font-medium"
              onClick={closeMenu}
            >
              Blood Request
            </Link>

            <div className="border-t my-2"></div>

            {curUser ? (
              <>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar className="h-10 w-10">
                    {user.avatar ? (
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {curUser.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.type === "donor"
                        ? "Blood Donor"
                        : "Blood Recipient"}
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="px-2 py-1.5 text-sm font-medium"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="px-2 py-1.5 text-sm font-medium"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <button
                  className="flex w-full items-center px-2 py-1.5 text-sm font-medium text-red-600"
                  onClick={() => {
                    onLogout?.();
                    closeMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-2">
                <Button asChild>
                  <Link to="/login" onClick={closeMenu}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/register" onClick={closeMenu}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
