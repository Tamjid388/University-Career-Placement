import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { CreateMyCompany, fetchCompany, fetchMyCompany, fetchSingleCompany } from "../api/company.js";


export const UseMyCompany = () => {
  return useQuery({
    queryKey: ['company'],
    queryFn: fetchMyCompany,
  });
};


export const UseCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateMyCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['company']); 
    },
  });
};




// Fetch All Companies Data
export const useFetchCompanies=(params = {})=>{

  return useQuery({
    queryKey:['fetchcompanies', params],
    queryFn:() => fetchCompany(params),
    placeholderData: keepPreviousData,
  })

}


export const UseFetchSingleCompanyById = (id) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => fetchSingleCompany(id),
    enabled: !!id,
  
    select: (data) => data.company,
  });
};