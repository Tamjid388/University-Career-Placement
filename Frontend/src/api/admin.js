import axiosInstance from "./axiosInstance.js";


//user
export const fetchAdminAllUsers = async (params = {}) => {
  const res = await axiosInstance.get('/admin/user', { params });
  return res.data;
};


export const deleteUserByAdmin = async (id) => {
  const res = await axiosInstance.delete(`/admin/user/${id}`);
  return res.data;
};


//jobs

export const fetchAdminAllJobs = async (params = {}) => {
  const res = await axiosInstance.get('/admin/job', { params });
  return res.data;
};

export const fetchSingleJobsByAdmin = async (id) => {
  const res = await axiosInstance.get(`/admin/job/${id}`);
  return res.data;
};

export const deletesingleJobsByAdmin = async (id) => {
  const res = await axiosInstance.delete(`/admin/job/${id}`);
  return res.data;
};



//company

export const fetchAdminAllCompany = async (params = {}) => {
  const res = await axiosInstance.get('/admin/company', { params });
  return res.data;
};

export const fetchSingleCompanyByAdmin = async (id) => {
  const res = await axiosInstance.get(`/admin/company/${id}`);
  return res.data;
};




export const UpdateSingleCompanyByAdmin = async ({ id, badge }) => {
  const res = await axiosInstance.put(`/admin/company/${id}`, {
    badges: badge,
  });
  return res.data;
};

export const deleteSingleCompanyByAdmin = async (id) => {
  const res = await axiosInstance.delete(`/admin/company/${id}`);
  return res.data;
};



//application
export const fetchAdminAllApplication = async (params = {}) => {
  const res = await axiosInstance.get('/admin/application', { params });
  return res.data;
};