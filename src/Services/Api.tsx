const baseUrl = import.meta.env.VITE_API_URL || "";


export const apiFetchSidebarData =baseUrl+"/api/user_approval/get_user_screens_and_permisssions/";
export const apiGetAllKycDatas =baseUrl+"/api/kyc/get_all_kycs";
export const apiPostKycData =baseUrl+"/api/kyc/create_kyc_records";
export const apiFetchCommonMaster=baseUrl+"/api/common_master/";
export const createWorkFlowApproval=baseUrl+"/api/workflow_approval/createWorkFlowApproval";
export const getAllRequiredMasterForOptions=baseUrl+"/api/common_master/getRequiredMasterForOptions";


