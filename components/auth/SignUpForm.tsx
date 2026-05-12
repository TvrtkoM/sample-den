"use client";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { signUp } from "@/lib/auth-client";
import { emailRegex, passwordRegex } from "@/lib/constants";
import {
  getAnonymousUserIdCookie,
  getSignUpVerificationCookie
} from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export default function SignUpForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    control
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: ""
    },
    mode: "onChange"
  });

  const password = useWatch({ control, name: "password" });

  const submit: SubmitHandler<FormData> = async (data) => {
    setAuthError(null);

    const { name, email, password } = data;

    if (session?.user.isAnonymous) {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = getAnonymousUserIdCookie(session.user.id);
    }

    const res = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/samples"
    });

    startTransition(() => {
      if (res.error) {
        setAuthError(res.error.message || "Something went wrong.");
      } else {
        document.cookie = getSignUpVerificationCookie();
        router.push(`/verify`);
      }
    });
  };

  const isSubmitPending = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(submit)} className="card-shadow-sm p-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Username</FieldLabel>
          <Input
            {...register("name", { required: "Full name is required" })}
            placeholder="Username"
            autoComplete="off"
            id="name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: emailRegex,
                message: "Enter a valid email address"
              }
            })}
            placeholder="Email"
            type="email"
            autoComplete="off"
            id="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: passwordRegex,
                message:
                  "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
              }
            })}
            type="password"
            placeholder="Password"
            autoComplete="off"
            id="password"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="repeatPassword">Repeat Password</FieldLabel>
          <Input
            {...register("repeatPassword", {
              required: "Please repeat your password",
              validate: (value) =>
                value === password || "Passwords do not match"
            })}
            type="password"
            placeholder="Repeat password"
            autoComplete="off"
            id="repeatPassword"
            aria-invalid={Boolean(errors.repeatPassword)}
          />
          {errors.repeatPassword && (
            <FieldError>{errors.repeatPassword.message}</FieldError>
          )}
        </Field>
        <Field orientation="horizontal">
          <Button type="submit" disabled={!isValid || isSubmitPending}>
            Submit
          </Button>
          {authError && <FieldError>{authError}</FieldError>}
        </Field>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <GoogleSignInButton />
      </FieldGroup>
    </form>
  );
}
