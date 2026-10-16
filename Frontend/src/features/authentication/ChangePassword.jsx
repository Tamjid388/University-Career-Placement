import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { UseChangePassword } from "../../hooks/useAuth.js";
import { Spinner } from "../../components/loading/loader/Spinner.jsx";

export const ChangePassword = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { mutate: changePassword, isPending } = UseChangePassword();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (String(data.newPassword).length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    changePassword(
      { oldPassword: data.oldPassword, newPassword: data.newPassword },
      {
        onSuccess: (res) => {
          reset();
          toast.success(res?.message || "Password changed. Please login again.");
          navigate("/SignIn");
        },
        onError: (err) => {
          toast.error(err?.message || "Password change failed");
        },
      }
    );
  };

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg ring-1 ring-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Change password</h2>
      <p className="text-gray-500 text-center mt-2 mb-6 text-sm">
        After changing, you will be logged out automatically. Login again with your new password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Old password
          </label>
          <input
            {...register("oldPassword")}
            type={showPasswords ? "text" : "password"}
            required
            placeholder="Current password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <input
            {...register("newPassword")}
            type={showPasswords ? "text" : "password"}
            required
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <span
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
          >
            {showPasswords ? <FiEye /> : <FiEyeOff />}
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
            type={showPasswords ? "text" : "password"}
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
          {isPending ? "Changing..." : "Change password & logout"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
