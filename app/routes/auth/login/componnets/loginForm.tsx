"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/componnets/ui/appIcon";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firbase";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: Yup.boolean().default(false),
});

type LoginFormValues = Yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm=({ onSuccess }: LoginFormProps) =>{
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");

    try {
      try {
        const result = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        if (data.rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("userEmail", data.email);
        }

        onSuccess?.();
        router.push("/product-catalog");
        return;
      } catch (firebaseError) {
        console.log("Firebase login failed, trying API fallback…");
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Invalid credentials");
      }

      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", data.email);
      }

      onSuccess?.();
      router.push("/routes/product-catalog");
    } catch (err: any) {
      let msg = err.message || "Login failed. Try again.";

      if (msg.includes("auth/invalid-credential")) {
        msg = "Incorrect email or password.";
      }

      setServerError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary">
          Email Address
        </label>

        <div className="relative">
          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            disabled={isSubmitting}
            className={`w-full pl-10 pr-4 py-3 border rounded-md min-h-touch
              ${errors.email ? "border-error focus:ring-error" : "border-input focus:ring-ring"}
              focus:outline-none focus:ring-2 transition-smooth`}
          />

          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon name="EnvelopeIcon" size={20} variant="outline" />
          </div>
        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-2 text-text-primary">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            disabled={isSubmitting}
            className={`w-full pl-10 pr-10 py-3 border rounded-md min-h-touch
              ${errors.password ? "border-error focus:ring-error" : "border-input focus:ring-ring"}
              focus:outline-none focus:ring-2 transition-smooth`}
          />

          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon name="LockClosedIcon" size={20} variant="outline" />
          </div>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <Icon
              name={showPassword ? "EyeSlashIcon" : "EyeIcon"}
              size={20}
              variant="outline"
            />
          </button>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="w-4 h-4 border-input rounded cursor-pointer focus:ring-ring"
            disabled={isSubmitting}
          />
          <span className="text-sm">Remember me</span>
        </label>

        <button
          type="button"
          className="text-sm text-accent hover:opacity-80"
          disabled={isSubmitting}
        >
          Forgot Password?
        </button>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="p-4 bg-error/10 border border-error rounded-md text-sm text-error flex gap-2">
          <Icon name="ExclamationTriangleIcon" size={20} variant="solid" />
          {serverError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-md flex items-center justify-center gap-2 min-h-touch hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-white rounded-full animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <Icon name="ArrowRightIcon" size={20} variant="outline" />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}

export default LoginForm;