"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { convertImageToBase64 } from "@/lib/utils";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const signupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
    image: z.instanceof(File).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // Password Confirmation validation
    const passwordFieldSchema = signupSchema.shape.password;
    const passwordResult = passwordFieldSchema.safeParse(data.password);
    if (passwordResult.success && data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        path: ["passwordConfirmation"],
        message: "Passwords do not match",
        code: "custom",
      });
    }

    // Image validation (optional)
    if (data.image) {
      if (data.image.size > MAX_IMAGE_SIZE) {
        ctx.addIssue({
          path: ["image"],
          message: "Image must be smaller than 2MB",
          code: "custom",
        });
      }
    }
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const signupHandler: SubmitHandler<SignupFormValues> = async (data) => {
    setLoading(true);
    try {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
        image: data.image ? await convertImageToBase64(data.image) : "",
        callbackURL: "/",
        fetchOptions: {
          // onRequest: () => setLoading(true),
          // onResponse: () => setLoading(false),
          // onError: (ctx) => toast.error(ctx.error.message),
          // onSuccess: async () => router.push("/"),
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
            if (!ctx.data.user.emailVerified) {
              toast.info("Check your email to verify account");
            } else {
              router.push("/");
            }
          },
          onError: (ctx) => {
            console.log("onError", ctx);
            toast.error(ctx.error.message);
          },
          onRetry: (ctx) => {
            console.log("onRetry", ctx);
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(signupHandler)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
              <Input
                id="fullname"
                placeholder="Robinson"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </Field>

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
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    {...register("passwordConfirmation")}
                    className={
                      errors.passwordConfirmation ? "border-red-500" : ""
                    }
                  />
                </Field>
              </Field>

              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}

              {errors.passwordConfirmation && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.passwordConfirmation.message}
                </p>
              )}

              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="image">Profile Image (optional)</FieldLabel>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 w-full">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={errors.image ? "border-red-500" : "w-full"}
                  />
                  {imagePreview && (
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", null);
                      }}
                    />
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.image.message}
                </p>
              )}
            </Field>

            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
