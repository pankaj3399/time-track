"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link } from "@heroui/react";
import { Eye, EyeOff, Sun, Moon, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/lib/zod";

import { signup } from "@/actions/auth.actions";

type Data = {
  id: string;
  name: string;
  email: string;
};

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate form data before submission
      const validationResult = signUpSchema.safeParse(formData);
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        errors.forEach((error) => {
          toast.error(error.message);
        });
        return;
      }

      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const result = await signup(
        formData.username,
        formData.email,
        formData.password,
      );

      if (result.status) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      } else {
        toast.error(typeof result.data === 'string' ? result.data : 'Registration failed');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = {
    inputWrapper: [
      "border-transparent",
      isDark ? "bg-gray-800/50" : "bg-white/50",
      "backdrop-blur-md",
      "group-data-[focus=true]:border-blue-500",
      "data-[hover=true]:border-blue-400",
    ].join(" "),
    input: isDark
      ? "text-white placeholder:text-gray-400"
      : "text-gray-900 placeholder:text-gray-500",
    label: isDark ? "text-gray-300" : "text-gray-700",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Theme Toggle */}
      <button
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
        onClick={() => setIsDark(!isDark)}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600" />
        )}
      </button>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-10 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          }`}
        />
        <div
          className={`absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl ${
            isDark ? "bg-purple-500" : "bg-purple-300"
          }`}
        />
      </div>

      <div
        className={`w-full max-w-md backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-8 ${
          isDark
            ? "bg-gray-900/80 shadow-blue-500/10 border border-gray-700/50"
            : "bg-white/80 shadow-gray-500/10 border border-gray-200/50"
        }`}
      >
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isDark
                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                  : "bg-gradient-to-br from-blue-600 to-purple-700"
              }`}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <h1
              className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Create Account
            </h1>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Join us today and get started
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            isRequired
            classNames={inputClasses}
            label="Username"
            placeholder="Enter your fullname"
            type="text"
            value={formData.username}
            variant="bordered"
            onChange={(e) => handleInputChange("username", e.target.value)}
          />

          <Input
            isRequired
            classNames={inputClasses}
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            variant="bordered"
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          <Input
            isRequired
            classNames={inputClasses}
            endContent={
              <button
                className={`${isDark ? "text-gray-400" : "text-gray-600"} hover:text-blue-500`}
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            value={formData.password}
            variant="bordered"
            onChange={(e) => handleInputChange("password", e.target.value)}
          />

          <Input
            isRequired
            classNames={inputClasses}
            endContent={
              <button
                className={`${isDark ? "text-gray-400" : "text-gray-600"} hover:text-blue-500`}
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
            label="Confirm Password"
            placeholder="Confirm your password"
            type={isVisible ? "text" : "password"}
            value={formData.confirmPassword}
            variant="bordered"
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
          />

          <Button
            className={`w-full font-semibold ${
              isDark
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                : "bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
            } text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
            radius="lg"
            size="lg"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            Create Account
          </Button>

          <div className="text-center mt-4">
            <span
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Already have an account?{" "}
            </span>
            <Link
              className={`text-sm font-medium ${isDark ? "text-blue-400" : "text-blue-600"} hover:underline`}
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
