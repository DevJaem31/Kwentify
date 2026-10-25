import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, User, CircleAlert, Check } from "lucide-react";

import { auth } from "../../../firebase";
import { signInWithUsername } from "../../services/authServices";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      } else {
        setCheckingAuth(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const normalizedUsername = username.trim();
  const isUsernameValid = /^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername);
  const isPasswordValid = password.length > 0;

  const usernameError =
    touched.username && !isUsernameValid
      ? "Enter a username with 3–30 letters, numbers, or underscores."
      : "";

  const passwordError =
    touched.password && !isPasswordValid ? "Please enter your password." : "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({
      username: true,
      password: true,
    });

    setError("");

    if (!isUsernameValid || !isPasswordValid || loading) {
      return;
    }

    setLoading(true);

    try {
      await signInWithUsername(normalizedUsername, password);

      const requestedPath = location.state?.from?.pathname;
      const redirectTo =
        requestedPath &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//") &&
        requestedPath !== "/login"
          ? requestedPath
          : "/dashboard";

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-12 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
            <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>

          <p className="text-sm text-muted-foreground">
            Preparing your secure session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-md">
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <header className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <img
                  src="/kwentify_icon_logo.png"
                  alt="Kwentify Logo"
                  className="size-8 object-contain"
                />
              </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your money with Kwentify.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none"
              >
                Username
              </label>

              <InputGroup className={usernameError ? "border-destructive" : ""}>
                <InputGroupInput
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError("");
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({
                      ...prev,
                      username: true,
                    }))
                  }
                  aria-invalid={Boolean(usernameError)}
                  aria-describedby={
                    usernameError ? "username-error" : undefined
                  }
                  required
                />

                <InputGroupAddon>
                  {usernameError ? (
                    <CircleAlert className="size-4 text-destructive" />
                  ) : isUsernameValid && touched.username ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <User className="size-4 text-muted-foreground" />
                  )}
                </InputGroupAddon>
              </InputGroup>

              {usernameError && (
                <p
                  id="username-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {usernameError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <InputGroup className={passwordError ? "border-destructive" : ""}>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({
                      ...prev,
                      password: true,
                    }))
                  }
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
                  required
                />

                <InputGroupAddon>
                  <Lock className="size-4 text-muted-foreground" />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((previous) => !previous)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {passwordError && (
                <p
                  id="password-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isUsernameValid || !isPasswordValid}
            >
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Kwentify · Make every peso count.
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
