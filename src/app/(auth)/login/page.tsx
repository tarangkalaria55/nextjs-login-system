"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginHandler: SubmitHandler<LoginFormValues> = async (data) => {
    setLoading(true);
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
          callbackURL: "/",
        },
        {
          onRequest: (ctx) => {
            console.log("onRequest", ctx);
            setLoading(true);
          },
          onResponse: (ctx) => {
            console.log("onResponse", ctx);
            setLoading(false);
          },
          onSuccess: (ctx) => {
            console.log("onSuccess", ctx);
            router.push("/");
          },
          onError: (ctx) => {
            console.log("onError", ctx);
            toast.error(ctx.error.message);
          },
          onRetry: (ctx) => {
            console.log("onRetry", ctx);
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const oAuthHandler = async (provider: "google") => {
    setLoading(true);
    try {
      await authClient.signIn.social(
        {
          provider,
          callbackURL: "/",
        },
        {
          onRequest: (ctx) => {
            console.log("onRequest", ctx);
            setLoading(true);
          },
          onResponse: (ctx) => {
            console.log("onResponse", ctx);
            setLoading(false);
          },
          onSuccess: (ctx) => {
            console.log("onSuccess", ctx);
          },
          onError: (ctx) => {
            console.log("onError", ctx);
            toast.error(ctx.error.message);
          },
          onRetry: (ctx) => {
            console.log("onRetry", ctx);
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(loginHandler)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="password"
                autoComplete="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>

            <Field orientation="horizontal">
              <Controller
                control={control}
                name="rememberMe"
                render={({ field }) => (
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                  />
                )}
              />
              <FieldLabel htmlFor="remember">Remember me</FieldLabel>
            </Field>

            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Login </p>
                )}
              </Button>
            </Field>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>

            <Field>
              <Button
                type="button"
                disabled={loading}
                onClick={() => oAuthHandler("google")}
              >
                Login with Google
              </Button>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
