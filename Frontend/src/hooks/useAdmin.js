import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { deleteSingleCompanyByAdmin, deletesingleJobsByAdmin, deleteUserByAdmin, fetchAdminAllApplication, fetchAdminAllCompany, fetchAdminAllJobs, fetchAdminAllUsers, fetchSingleCompanyByAdmin, fetchSingleJobsByAdmin, UpdateSingleCompanyByAdmin } from "../api/admin.js";
import { updateJobStatus } from "../api/jobs.js";


//user

export const UseAdminAllUser = (params = {}) => {
  return useQuery({
    queryKey: ['admin-user', params],
    queryFn: () => fetchAdminAllUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, 
  refetchOnWindowFocus: false,
  });
};


export const UseAdminDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-user']);
    },
  });
};


//jobs

export const UseFetchAllJobByAdmin = (params = {}) => {
  return useQuery({
    queryKey: ['admin-job', params],
    queryFn: () => fetchAdminAllJobs(params),
    placeholderData: keepPreviousData,
  });
};

export const UseFetchSingleJobByAdmin = (id) => {
  return useQuery({
    queryKey: ["admin-job", id],
    queryFn: () => fetchSingleJobsByAdmin(id),
    enabled: !!id,
  
    select: (data) => data.job,
  });
};


export const useDeleteJobByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletesingleJobsByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-job']);
    },
  });
};



//company

export const UsefetchAllCompanyByAdmin = (params = {}) => {
  return useQuery({
    queryKey: ['admin-company', params],
    queryFn: () => fetchAdminAllCompany(params),
    placeholderData: keepPreviousData,
  });
};

export const UseFetchSingleCompanyByAdmin = (id) => {
  return useQuery({
    queryKey: ["admin-company", id],
    queryFn: () => fetchSingleCompanyByAdmin(id),
    enabled: !!id,
  
    select: (data) => data.company,
  });
};


// Delete a individual company

export const UseDeleteSingleCompanyByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSingleCompanyByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-company']);
    },
  });
};
export const UseUpdateSingleCompanyByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateSingleCompanyByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-company']);
    },
  });
};



//application
export const UseFetchAllApplicationByAdmin = (params = {}) => {
  return useQuery({
    queryKey: ['admin-application', params],
    queryFn: () => fetchAdminAllApplication(params),
    placeholderData: keepPreviousData,
  });
};

//Approve-Reject Jobs

export const UseupdateJobStatus=()=>{
   const queryClient = useQueryClient();

   return useMutation({
    mutationFn:(payload)=>updateJobStatus(payload),
      onSuccess: () => {
      queryClient.invalidateQueries(["job"]); // refetch jobs after update
    },
   })
}