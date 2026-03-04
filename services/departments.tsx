"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

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

export const getDepartments = async (): Promise<Department[]> => {
  const response: AxiosResponse<PaginatedResponse<Department>> =
    await apiActions.get(`/api/v1/departments/`);
  return response.data.results ?? [];
};

export const getDepartment = async (reference: string): Promise<Department> => {
  const response: AxiosResponse<Department> =
    await apiActions.get(`/api/v1/departments/${reference}/`);
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