import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, User, UserRound, Mail } from "lucide-react";
import { signUpWithEmail } from "../../services/authServices";

const initialValues = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validateField(name, value, values) {
  switch (name) {
    case "fullName":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) {
        return "Full name must contain at least 2 characters.";
      }
      return "";

    case "username":
      if (!value.trim()) return "Username is required.";
      if (value.trim().length < 3) {
        return "Username must contain at least 3 characters.";
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
        return "Use only letters, numbers, and underscores.";
      }
      return "";

    case "email":
      if (!value.trim()) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return "Enter a valid email address.";
      }
      return "";

    case "password":
      if (!value) return "Password is required.";
      if (value.length < 8) {
        return "Password must contain at least 8 characters.";
      }
      if (value.length > 128) {
        return "Password must not exceed 128 characters.";
      }
      return "";

    case "confirmPassword":
      if (!value) return "Please confirm your password.";
      if (value !== values.password) {
        return "Passwords do not match.";
      }
      return "";

    default:
      return "";
  }
}

function SignupPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const errors = Object.fromEntries(
    Object.keys(initialValues).map((field) => [
      field,
      validateField(field, values[field], values),
    ]),
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setTouched((previous) => ({
      ...previous,
      [name]: true,
      ...(name === "password" && previous.confirmPassword
        ? { confirmPassword: true }
        : {}),
    }));

    setError("");
    setSuccess("");
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  };

  const getFieldProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    "aria-invalid": touched[name] && Boolean(errors[name]),
    "aria-describedby":
      touched[name] && errors[name] ? `${name}-error` : undefined,
  });

  const renderFieldError = (name) =>
    touched[name] && errors[name] ? (
      <p id={`${name}-error`} role="alert" className="text-xs text-destructive">
        {errors[name]}
      </p>
    ) : null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const allTouched = Object.fromEntries(
      Object.keys(initialValues).map((field) => [field, true]),
    );

    setTouched(allTouched);

    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors) {
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail({
        fullname: values.fullName.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      setSuccess("Your account was created successfully.");
      setValues(initialValues);
      setTouched({});
    } catch (err) {
      setError(
        err?.message || "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start tracking your money and building better financial habits
              with Kwentify.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>

              <InputGroup>
                <InputGroupInput
                  {...getFieldProps("fullName")}
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
                <InputGroupAddon>
                  <UserRound className="size-4" />
                </InputGroupAddon>
              </InputGroup>

              {renderFieldError("fullName")}
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>

              <InputGroup>
                <InputGroupInput
                  {...getFieldProps("username")}
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  minLength={3}
                  required
                />
                <InputGroupAddon>
                  <User className="size-4" />
                </InputGroupAddon>
              </InputGroup>

              {renderFieldError("username")}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>

              <InputGroup>
                <InputGroupInput
                  {...getFieldProps("email")}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                <InputGroupAddon>
                  <Mail className="size-4" />
                </InputGroupAddon>
              </InputGroup>

              {renderFieldError("email")}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <InputGroup>
                <InputGroupInput
                  {...getFieldProps("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <InputGroupAddon>
                  <Lock className="size-4" />
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

              {renderFieldError("password")}

              <p className="text-xs text-muted-foreground">
                Use at least 8 characters.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>

              <InputGroup>
                <InputGroupInput
                  {...getFieldProps("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <InputGroupAddon>
                  <Lock className="size-4" />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {renderFieldError("confirmPassword")}
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-green-600">
                {success}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-primary hover:underline"
            >
              Sign in
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

export default SignupPage;
