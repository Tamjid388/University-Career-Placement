import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { UseForgotPassword } from "../../hooks/useAuth.js";
import { Spinner } from "../../components/loading/loader/Spinner.jsx";

export const ForgotPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const { mutate: forgotPassword, isPending, isSuccess } = UseForgotPassword();
  const [sentTo, setSentTo] = useState("");

  const onSubmit = (data) => {
    forgotPassword(data.email, {
      onSuccess: (res) => {
        setSentTo(data.email);
        reset();
        toast.success(res?.message || "Reset link sent. Check your email.");
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to send reset link");
      },
    });
  };

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-white to-purple-100 px-4 sm:px-6 lg:px-8">
      <title>Job Portal | Forgot Password</title>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-lg ring-1 ring-gray-200 shadow-purple-600">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Forgot password?
        </h2>
        <p className="text-gray-500 text-center mt-2 mb-6">
          Enter your account email. If an account exists, we will send a reset link valid for 30 minutes.
        </p>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4 mb-5">
            If an account exists{sentTo ? ` for ${sentTo}` : ""}, a reset link has been sent. Check your inbox and spam folder.
          </div>
        ) : null}

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

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-5">
          Remembered your password?{" "}
          <Link to="/SignIn" className="text-purple-600 hover:underline font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
