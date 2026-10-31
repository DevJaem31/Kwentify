import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

import { auth, db } from "../../../firebase";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { ChevronDown, LogOut, Mail, UserRound } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function OverviewHeader() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userRef);

        setProfile(userSnapshot.exists() ? userSnapshot.data() : null);
      } catch {
        toast.error("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const fullName = profile?.fullname || user?.displayName || "User";

  const firstName = fullName.trim().split(/\s+/)[0];

  const username = profile?.username || "No username";
  const email = profile?.email || user?.email || "No email";
  const photoURL = profile?.photoURL || user?.photoURL;

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await signOut(auth);
      toast.success("Logged out successfully.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <header className="flex flex-row justify-between gap-4 sm:items-center">
      {/* Greeting */}
      <div className="space-y-1 sm:w-fit">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl ">
          {getGreeting()}
          {loading ? "" : `, ${firstName}`}!
        </h1>

        <p className="text-sm text-muted-foreground">
          Here's your financial overview for this month.
        </p>
      </div>

      {/* Profile menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto justify-start gap-3 rounded-xl px-2 py-2 sm:justify-end"
            disabled={loading || !user}
          >
            <Avatar className="size-10">
              <AvatarImage src={photoURL || undefined} alt={fullName} />

              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 text-left hidden sm:flex sm:flex-col">
              <p className="max-w-36 truncate text-sm font-semibold">
                {fullName}
              </p>

              <p className="text-xs text-muted-foreground">@{username}</p>
            </div>

            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{fullName}</span>

                <span className="text-xs text-muted-foreground">
                  @{username}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem disabled>
              <UserRound className="mr-2 size-4" />
              <span>{fullName}</span>
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              <Mail className="mr-2 size-4" />
              <span className="truncate">{email}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            disabled={loggingOut}
            onSelect={handleLogout}
          >
            <LogOut className="mr-2 size-4" />
            {loggingOut ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
