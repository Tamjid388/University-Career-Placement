import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { UseResetPassword } from "../../hooks/useAuth.js";
import { Spinner } from "../../components/loading/loader/Spinner.jsx";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });
  const { mutate: resetPassword, isPending } = UseResetPassword();
  const [showPassword, setShowPassword] = useState(false);

  const token = searchParams.get("token") || "";
  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (String(data.newPassword).length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    resetPassword(
      { email: data.email, token, newPassword: data.newPassword },
      {
        onSuccess: (res) => {
          reset();
          toast.success(res?.message || "Password reset successfully. Please login.");
          navigate("/SignIn");
        },
        onError: (err) => {
          toast.error(err?.message || "Password reset failed");
        },
      }
    );
  };

  if (isPending) {
    return <Spinner />;
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-white to-purple-100 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg ring-1 ring-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Invalid reset link</h2>
          <p className="text-gray-500 mt-2 mb-5">
            This link is missing its token. Please request a new one.
          </p>
          <Link to="/forgot-password" className="text-purple-600 hover:underline font-medium">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-white to-purple-100 px-4 sm:px-6 lg:px-8">
      <title>Job Portal | Reset Password</title>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-lg ring-1 ring-gray-200 shadow-purple-600">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Set a new password
        </h2>
        <p className="text-gray-500 text-center mt-2 mb-6">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              {...register("newPassword")}
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password
            </label>
            <input
              {...register("confirmPassword", {
                validate: (value) => value === newPassword || "Passwords do not match",
              })}
              type={showPassword ? "text" : "password"}
              required
              placeholder="Repeat new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          >
            {isPending ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-5">
          <Link to="/SignIn" className="text-purple-600 hover:underline font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
