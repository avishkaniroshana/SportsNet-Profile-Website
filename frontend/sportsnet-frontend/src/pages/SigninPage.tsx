import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const signinSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required!" })
    .email({ message: "Enter a valid email address!" }),
  password: z
    .string()
    .nonempty({ message: "Password is required!" })
    .min(8, { message: "Password must be at least 8 characters!" }),
});

type SignInFormValues = z.infer<typeof signinSchema>;

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const errorClass = "text-red-500 text-xs mt-1";

const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { message?: string })?.message;
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    setServerError("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/signin", data);
      login(res.data);
      navigate("/");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm space-y-5"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back to SportsNet
          </p>
        </div>

        {successMessage && (
          <p className="text-emerald-700 text-sm text-center bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
            {successMessage}
          </p>
        )}
        {serverError && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {serverError}
          </p>
        )}

        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            placeholder="email@gmail.com"
            {...register("email")}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={inputClass}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-800 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-gray-500">
          No account?{" "}
          <Link
            to="/signup"
            className="text-blue-700 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignInPage;
