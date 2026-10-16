import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { CreateInterviewShedule, fetchInterview } from "../api/interview.js";


export const UseInterviewSheddule = (params = {}) => {
  return useQuery({
    queryKey: ['interview', params],
    queryFn: () => fetchInterview(params),
    placeholderData: keepPreviousData,
  });
};


export const UseCreateInterviewShedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateInterviewShedule,
    onSuccess: () => {
      queryClient.invalidateQueries(['interview']); 
    },
  });
};