import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useState } from "react";

const signupSchema = z.object({
  fullName: z.string().nonempty({ message: "Full name is required!" }),
  email: z
    .string()
    .nonempty({ message: "Email is required!" })
    .email({ message: "Enter a valid email address!" }),
  telephone: z
    .string()
    .nonempty({ message: "Telephone is required!" })
    .regex(/^[0-9]+$/, { message: "Telephone must contain numbers only!" }),
  password: z
    .string()
    .nonempty({ message: "Password is required!" })
    .min(8, { message: "Password must be at least 8 characters!" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const errorClass = "text-red-500 text-xs mt-1";

const SignupPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setServerError("");
    setSubmitting(true);
    try {
      await api.post("/auth/signup", data);
      navigate("/signin", {
        state: { message: "Account created successfully! Please sign in." },
      });
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Signup failed");
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
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Join SportsNet</p>
        </div>

        {serverError && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            {serverError}
          </p>
        )}

        <div>
          <label className={labelClass}>Full Name</label>
          <input
            placeholder="e.g. Your Name"
            {...register("fullName")}
            className={inputClass}
          />
          {errors.fullName && (
            <p className={errorClass}>{errors.fullName.message}</p>
          )}
        </div>

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
          <label className={labelClass}>Telephone</label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="e.g. 0771234567"
            {...register("telephone")}
            className={inputClass}
          />
          {errors.telephone && (
            <p className={errorClass}>{errors.telephone.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
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
          {submitting ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-700 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
