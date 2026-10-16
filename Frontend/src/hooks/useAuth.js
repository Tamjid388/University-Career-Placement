import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ChangePassword,
  CurrentUser,
  ForgotPassword,
  LoginUser,
  LogoutUser,
  RegisterUser,
  ResetPassword,
  UpdateProfileUser,
} from "../api/auth.js";

export const UseLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LoginUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

//registation
export const UseRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RegisterUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

//Logout

export const UseLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LogoutUser,
    onSuccess: () => {
      queryClient.removeQueries(["user"]);
    },
  });
};

// Fetch User Informations

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: CurrentUser,
    retry: false,
    placeholderData: null,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateProfileUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);

      console.log("Profile updated successfully:", data);
    },
    onError: (error) => {
      console.error("Profile update error:", error.message);
    },
  });
};

export const UseForgotPassword = () => {
  return useMutation({
    mutationFn: ForgotPassword,
  });
};

export const UseResetPassword = () => {
  return useMutation({
    mutationFn: ResetPassword,
  });
};

export const UseChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ChangePassword,
    onSuccess: () => {
      queryClient.removeQueries(["user"]);
    },
  });
};
