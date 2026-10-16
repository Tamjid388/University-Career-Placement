import axiosInstance from "./axiosInstance.js";


export const fetchInterview = async (params = {}) => {
  const res = await axiosInstance.get('/interviews/employer', { params });
  return res.data;
};



export const CreateInterviewShedule = async (interviewdata) => {
  const res = await axiosInstance.post('/interviews/schedule',interviewdata);
  return res.data;
};