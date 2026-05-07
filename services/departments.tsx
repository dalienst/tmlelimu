"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { SopsMinified } from "./sops";
import { StaffMinified } from "./accounts";

export interface Department {
  id: string;
  name: string;
  email: string;
  description: string;
  head: string;
  created_at: string;
  updated_at: string;
  reference: string;
  created_by: string;
  updated_by: string;
  code: string;
  is_active: boolean;
  staff: string[];
  sops: string[];
  sops_detail: {
    title: string;
    code: string;
    reference: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }[]
}

export interface DepartmentMinified {
  name: string;
  email: string;
  description: string;
  head: string;
  is_active: boolean;
  code: string;
  reference: string;
  created_at: string;
  updated_at: string;
  staff: StaffMinified[]
  sops: SopsMinified[]
}

// step by step creation
interface createDepartment {
  name: string;
  email: string;
  description: string;
}

interface addHeadToDepartment {
  head: string;
}

interface addStaffToDepartment {
  staff: string[];
}

interface updateDepartment {
  name?: string;
  email?: string;
  description?: string;
  is_active?: boolean;
}

interface addSOPToDepartment {
  sops: string[]; // SOP Title
}

export const getDepartments = async (
  headers: { headers: { Authorization: string } }
): Promise<Department[]> => {
  const response: AxiosResponse<PaginatedResponse<Department>> =
    await apiActions.get(`/api/v1/departments/`, headers);
  return response.data.results ?? [];
};

export const getDepartment = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> =
    await apiActions.get(`/api/v1/departments/${reference}/`, headers);
  return response.data;
};

// Authenticated
export const createDepartment = async (
  formData: createDepartment | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.post(
    `/api/v1/departments/`,
    formData,
    headers
  );
  return response.data;
};

export const addHeadToDepartment = async (
  reference: string,
  formData: addHeadToDepartment | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.patch(
    `/api/v1/departments/${reference}/`,
    formData,
    headers
  );
  return response.data;
};

export const addStaffToDepartment = async (
  reference: string,
  formData: addStaffToDepartment | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.patch(
    `/api/v1/departments/${reference}/`,
    formData,
    headers
  );
  return response.data;
};

export const addSOPToDepartment = async (
  reference: string,
  formData: addSOPToDepartment | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.patch(
    `/api/v1/departments/${reference}/`,
    formData,
    headers
  );
  return response.data;
};

export const updateDepartment = async (
  reference: string,
  formData: updateDepartment | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Department> => {
  const response: AxiosResponse<Department> = await apiActions.patch(
    `/api/v1/departments/${reference}/`,
    formData,
    headers
  );
  return response.data;
};

export const deleteDepartment = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<void> => {
  await apiActions.delete(`/api/v1/departments/${reference}/`, headers);
};

export const getAuthDepartments = async (headers: { headers: { Authorization: string } }): Promise<Department[]> => {
  const response: AxiosResponse<PaginatedResponse<Department>> =
    await apiActions.get(`/api/v1/departments/`, headers);
  return response.data.results ?? [];
};

export const getAuthDepartment = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Department> => {
  const response: AxiosResponse<Department> =
    await apiActions.get(`/api/v1/departments/${reference}/`, headers);
  return response.data;
};