import axiosInstance from "./axiosInstance.js";


export const LoginUser = async (user) => {
  const res = await axiosInstance.post('/user/login', user);
  return res.data;
};


export const RegisterUser = async (userData) => {
  const res = await axiosInstance.post('/user/register', userData);
  return res.data;
};


// export const LogoutUser = async () => {
//   try {
//     const res = await axiosInstance.get('/user/logout');
//     return res.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Logout failed');
//   }
// };
export const LogoutUser = async () => {
  try {
    const res = await axiosInstance.post('/user/logout',
      {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

// ............................

// Fetch User Informations
export const CurrentUser = async () => {
  try {
    const res = await axiosInstance.get('/user/me');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Fetching user failed');
  }
};



//update profile details

export const UpdateProfileUser = async (formData) => {
  try {
    const res = await axiosInstance.put('/user/profile/update', formData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};

export const ForgotPassword = async (email) => {
  try {
    const res = await axiosInstance.post('/user/forgot-password', { email });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send reset link');
  }
};

export const ResetPassword = async ({ email, token, newPassword }) => {
  try {
    const res = await axiosInstance.post('/user/reset-password', { email, token, newPassword });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

export const ChangePassword = async ({ oldPassword, newPassword }) => {
  try {
    const res = await axiosInstance.put('/user/change-password', { oldPassword, newPassword });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
};
