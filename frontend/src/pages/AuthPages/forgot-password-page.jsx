import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
  KeyRound,
  CircleAlert,
  Check,
} from "lucide-react";
import { resetPassword } from "../../services/authServices";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const normalizedEmail = email.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const isEmailValid = emailPattern.test(normalizedEmail);

  const emailError =
    touched && normalizedEmail && !isEmailValid
      ? "Please enter a valid email address."
      : "";

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched(true);
    setError("");

    if (!isEmailValid) {
      return;
    }

    setLoading(true);

    try {
      await resetPassword(normalizedEmail);
      setSubmitted(true);
    } catch {
      setError("Unable to send the reset link. Please try again later.");
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

                  <InputGroup
                    className={
                      emailError
                        ? "border-destructive focus-within:ring-destructive"
                        : isEmailValid && touched
                          ? "border-green-600"
                          : ""
                    }
                  >
                    <InputGroupInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => setTouched(true)}
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={
                        emailError
                          ? "email-error"
                          : isEmailValid && touched
                            ? "email-valid"
                            : undefined
                      }
                      required
                    />

                    <InputGroupAddon>
                      {emailError ? (
                        <CircleAlert className="size-4 text-destructive" />
                      ) : isEmailValid && touched ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <Mail className="size-4 text-muted-foreground" />
                      )}
                    </InputGroupAddon>
                  </InputGroup>

                  {emailError && (
                    <p
                      id="email-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {emailError}
                    </p>
                  )}

                  {isEmailValid && touched && (
                    <p id="email-valid" className="text-sm text-green-600">
                      Email format looks good.
                    </p>
                  )}
                </div>

                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !isEmailValid}
                >
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

              <p className="mt-4 break-all text-sm font-medium">
                {normalizedEmail}
              </p>

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
                  setEmail("");
                  setError("");
                  setTouched(false);
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
