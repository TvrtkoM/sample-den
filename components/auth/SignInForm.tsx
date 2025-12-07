"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { emailRegex } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange"
  });

  const submit: SubmitHandler<FormData> = async (data) => {
    setAuthError(null);
    setIsSubmitting(true);

    const { email, password } = data;

    await signIn.email(
      { email, password },
      {
        onSuccess: () => {
          router.push("/samples");
          reset();
        },
        onError: (err) => {
          setAuthError(err.error.message);
        }
      }
    );

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="card p-6">
      <FieldGroup>
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
              required: "Password is required"
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

        <Field orientation="horizontal">
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Sign In
          </Button>
          {authError && <FieldError>{authError}</FieldError>}
        </Field>
      </FieldGroup>
    </form>
  );
}
