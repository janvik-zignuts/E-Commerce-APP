"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "@/componnets/ui/appIcon";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firbase";


const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/\d/, "Must include a number"),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),

  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

type RegisterFormData = Yup.InferType<typeof RegisterSchema>;

const  RegistrationForm=() =>{
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterSchema) as any,
    mode: "onChange",
  });


  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // 1️⃣ Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.fullName,
      });

      // 2️⃣ Save to API (optional)
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      router.push("/login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak.");
      } else {
        alert("Registration failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="block text-sm mb-1 font-medium">Full Name</label>
        <div className="relative">
          <Icon name="UserIcon" size={20} className="absolute left-3 top-3 text-text-secondary" />
          <input
            {...register("fullName")}
            className={`w-full pl-10 pr-4 py-3 border rounded-md ${
              errors.fullName ? "border-error" : "border-input"
            }`}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-error mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm mb-1 font-medium">Email</label>
        <div className="relative">
          <Icon name="EnvelopeIcon" size={20} className="absolute left-3 top-3 text-text-secondary" />
          <input
            {...register("email")}
            className={`w-full pl-10 pr-4 py-3 border rounded-md ${
              errors.email ? "border-error" : "border-input"
            }`}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-error mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm mb-1 font-medium">Password</label>
        <div className="relative">
          <Icon name="LockClosedIcon" size={20} className="absolute left-3 top-3 text-text-secondary" />
          <input
            type="password"
            {...register("password")}
            className={`w-full pl-10 pr-4 py-3 border rounded-md ${
              errors.password ? "border-error" : "border-input"
            }`}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-error mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm mb-1 font-medium">Confirm Password</label>
        <div className="relative">
          <Icon name="LockClosedIcon" size={20} className="absolute left-3 top-3 text-text-secondary" />
          <input
            type="password"
            {...register("confirmPassword")}
            className={`w-full pl-10 pr-4 py-3 border rounded-md ${
              errors.confirmPassword ? "border-error" : "border-input"
            }`}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-error mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("acceptTerms")}
            disabled={isLoading}
            className={`mt-1 w-4 h-4 rounded ${errors.acceptTerms ? "border-error" : "border-input"}`}
          />
          <span className="text-sm">
            I agree to the{" "}
            <a className="text-accent underline">Terms</a> and{" "}
            <a className="text-accent underline">Privacy Policy</a>
          </span>
        </label>

        {errors.acceptTerms && (
          <p className="text-sm text-error mt-1">{errors.acceptTerms.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-500 text-white rounded-md hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}   


export default RegistrationForm