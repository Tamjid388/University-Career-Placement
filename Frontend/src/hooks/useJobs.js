import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { createJob, deleteJob, fetchJobs, fetchJobsForAdmin, fetchRelatedJobs,  fetchSearchJobs,  fetchSingleJobs, fetchSingleMyJobs, updateJob } from "../api/jobs.js";



export const UseJobs = (params = {}) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => fetchJobs(params),
    placeholderData: keepPreviousData,
  });
};
export const UseJobsForAdmin = (params = {}) => { //for admin
  return useQuery({
    queryKey: ['job', 'admin', params],
    queryFn: () => fetchJobsForAdmin(params),
    placeholderData: keepPreviousData,
  });
};


export const UseMyJobs = (params = {}) => {
  return useQuery({
    queryKey: ['my-jobs', params],
    queryFn: () => fetchSingleMyJobs(params),
    placeholderData: keepPreviousData,
  });
};




export const UseRelatedJobs = (jobId) => {
  return useQuery({
    queryKey: ['relatedJobs', jobId],
    queryFn: () => fetchRelatedJobs(jobId), 
    enabled: !!jobId,
  });
};

export const UseFetchSingleJobById = (id) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchSingleJobs(id),
    enabled: !!id,
  
    select: (data) => data.job,
  });
};


export const UseCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['job'], exact: false });
    },
  });
};



export const UseUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['job'], exact: false });
    },
  });
};


export const UseDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['job'], exact: false });
    },
  });
};





export const UseSearchJobs = (filters = {}) => {
  const params = typeof filters === "string" ? { title: filters } : filters;
  const hasFilter = Object.values(params || {}).some((value) => String(value ?? "").trim() !== "");
  return useQuery({
    queryKey: ["searchJobs", params],
    queryFn: () => fetchSearchJobs(params),
    enabled: hasFilter,
    placeholderData: keepPreviousData,
  });
};

