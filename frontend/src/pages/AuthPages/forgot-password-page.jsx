import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle2, KeyRound } from "lucide-react";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // TODO: Connect Firebase password reset.
      // await sendPasswordResetEmail(auth, email);

      setSubmitted(true);
    } catch {
      setError("Unable to send the reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-md">
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          {!submitted ? (
            <>
              <header className="mb-8 text-center">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <KeyRound className="size-7 text-primary" />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">
                  Reset your password
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Let's get you back to managing your money. Enter your
                  registered email address to reset your Kwentify password.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none"
                  >
                    Email Address
                  </label>

                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />

                    <InputGroupAddon>
                      <Mail className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="size-4" />
                Back to sign in
              </button>
            </>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="size-8 text-primary" />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                Check your email
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                If an account exists for this email, you'll receive instructions
                to reset your password.
              </p>

              <p className="mt-4 break-all text-sm font-medium">{email}</p>

              <Button
                type="button"
                className="mt-6 w-full"
                onClick={() => navigate("/login")}
              >
                Return to Sign In
              </Button>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setError("");
                }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Try another email
              </button>
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Kwentify · Make every peso count.
        </p>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
