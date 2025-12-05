"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const submit: SubmitHandler<FormData> = async (data) => {
    const { name, email, password } = data;
    const res = await signUp.email({
      name,
      email,
      password
    });

    if (res.error) {
      setAuthError(res.error.message || "Something went wrong.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="container-small">
      <h1 className="mb-8 mt-4">Sign Up</h1>

      <form onSubmit={handleSubmit(submit)} className="card p-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              {...register("name", { required: true })}
              placeholder="Full Name"
              autoComplete="off"
              id="name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...register("email", { required: true })}
              placeholder="Email"
              autoComplete="off"
              id="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              autoComplete="off"
              id="email"
            />
          </Field>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            {authError && <FieldError>{authError}</FieldError>}
          </Field>
        </FieldGroup>
      </form>
    </main>
  );
}
