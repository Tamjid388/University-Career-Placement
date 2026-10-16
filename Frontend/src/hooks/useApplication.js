import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { createApply, fetchAllApplicationBySingleCompany, fetchJobSeekerApplication } from "../api/application.js";




export const UseCreateApply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApply,
    onSuccess: () => {
      queryClient.invalidateQueries(['application']); 
    },
  });
};


export const UseMyCompanyApplications = (params = {}) => {
  return useQuery({
    queryKey: ['all-applications', params],
    queryFn: () => fetchAllApplicationBySingleCompany(params),
    placeholderData: keepPreviousData,
  });
};


export const UseJobSeekerApplications = (params = {}) => {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => fetchJobSeekerApplication(params),
    placeholderData: keepPreviousData,
  });
};