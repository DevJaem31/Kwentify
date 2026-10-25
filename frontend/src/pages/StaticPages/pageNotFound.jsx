import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";
import kwentifyLogo from "../../assets/logo/kwentify_icon_logo.png";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-background px-3 py-12 text-foreground sm:px-6">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 size-96 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="mb-5 flex flex-col items-center justify-center gap-1">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary-foreground text-secondary-foreground shadow-sm">
            <img
              src={kwentifyLogo}
              alt="Kwentify Logo"
              className="h-6 w-6 rounded-full object-cover"
            />
          </div>

          <span className="text-lg font-bold tracking-tight">Kwentify</span>
        </div>

        <Card className="overflow-hidden rounded-3xl border-border/70 bg-card/95 shadow-xl shadow-black/[0.03] backdrop-blur-sm">
          <CardContent className="px-6 pb-8 pt-10 sm:px-12 sm:pb-12 sm:pt-12">
            {/* Error illustration */}
            <div
              aria-hidden="true"
              className="relative mx-auto mb-8 flex h-36 items-center justify-center sm:h-44"
            >
              <span className="select-none text-[9rem] font-black leading-none tracking-[-0.09em] text-muted/70 sm:text-[11rem]">
                404
              </span>

              <span className="absolute right-[18%] top-3 size-3 rounded-full bg-primary/30" />
              <span className="absolute bottom-4 left-[18%] size-2 rounded-full bg-primary/50" />
            </div>

            {/* Message */}
            <div className="mx-auto max-w-md space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                Error 404
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Looks like you're{" "}
                <span className="text-primary">off track.</span>
              </h1>

              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                We couldn't find the page you're looking for. It may have moved,
                been removed, or the address might be incorrect. Let's get you
                back on track.
              </p>
            </div>

            {/* Actions */}
            <div className="mx-auto mt-8 flex w-full max-w-sm flex-row gap-3">
              <Button asChild className="h-11 min-w-0 flex-1 rounded-xl">
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2"
                >
                  <House className="size-4 shrink-0" />
                  <span>Dashboard</span>
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 min-w-0 flex-1 rounded-xl"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="size-4 shrink-0" />
                Go back
              </Button>
            </div>

            <Separator className="my-8" />

            {/* Footer message */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Having trouble? Check the URL and try again.
              </p>

              <span className="text-xs font-medium text-muted-foreground">
                Kwentify <span className="mx-1 text-border">·</span> Make every
                peso count.
              </span>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t bg-muted/30 px-3 py-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Kwentify. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
