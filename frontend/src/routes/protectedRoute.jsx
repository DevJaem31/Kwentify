import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ShieldCheck } from "lucide-react";

import { auth } from "../../firebase.js";
import { Card, CardContent } from "@/components/ui/card";

function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return (
      <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <Card className="relative w-full max-w-sm border-border/60 bg-card/90 shadow-xl shadow-black/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center px-8 py-10 text-center">
            {/* Animated icon */}
            <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5">
              <div className="absolute inset-0 animate-ping rounded-2xl border border-primary/20 [animation-duration:2.5s]" />

              <ShieldCheck className="size-8 text-primary" strokeWidth={1.7} />
            </div>

            {/* Loading indicator */}
            <div className="mb-3 flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Secure access
              </p>
            </div>

            <h1 className="text-xl font-semibold tracking-tight">
              Verifying your session
            </h1>

            <p className="mt-2 max-w-[260px] text-sm leading-6 text-muted-foreground">
              Please wait while Kwentify securely checks your account.
            </p>

            {/* Progress indicator */}
            <div className="mt-7 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500" />
              Connecting to authentication service
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
