
import axiosInstance from "./axiosInstance.js";


export const fetchJobs = async (params = {}) => {
  const res = await axiosInstance.get('/job', { params });
  return res.data;
};
//for admin
export const fetchJobsForAdmin = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/job/admin/alljobs', { params });
    const data = res.data;
    return Array.isArray(data) ? { success: true, jobs: data, total: data.length, page: 1, limit: data.length, totalPages: 1 } : data;
  } catch (error) {
    console.error("Failed to fetch admin jobs:", error);
    throw error;
  }
};


export const fetchRelatedJobs = async (jobId) => {
  try {
    const res = await axiosInstance.get(`/job/recommendations/${jobId}`);
    console.log("Fetched Related Jobs:", res.data);
    if (!res.data.success) {
      console.warn("Related Jobs Error:", res.data.message);
      return []; 
    }
    return res.data.data || []; // Extract jobs array or return empty
  } catch (error) {
    console.error("Error fetching related jobs:", error);
    return []; // Return empty array to prevent crashes
  }
};

export const fetchSingleJobs = async (id) => {
  const res = await axiosInstance.get(`/job/${id}`);
  return res.data;
};


export const fetchSingleMyJobs = async (params = {}) => {
  const res = await axiosInstance.get('/job/my-jobs', { params });
  return res.data;
};


export const createJob = async (jobData) => {
  const res = await axiosInstance.post('/job', jobData);
  return res.data;
};


export const updateJob = async ({ id, jobData }) => {
  const res = await axiosInstance.put(`/job/${id}`, jobData);
  return res.data;
};


export const deleteJob = async (id) => {
  const res = await axiosInstance.delete(`/job/${id}`);
  return res.data;
};


export const fetchSearchJobs = async (params = {}) => {
  const normalized = typeof params === "string" ? { title: params } : params;
  const res = await axiosInstance.get("/job/search", {
    params: normalized,
  });
  return res.data;
}
//admin

export const updateJobStatus=async(payload)=>{
const {jobId,status}=payload
  try {
      const res = await axiosInstance.put(`/job/admin/${payload.jobId}/status`, {status});
  return res.data;
  } catch (error) {
    console.log("Error updating status");
  }
}
