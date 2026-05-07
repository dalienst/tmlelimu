"use client"

import { apiActions, apiMultipartActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { Department } from "./departments";
import { Category } from "./categories";

export interface Sops {
  id: string;
  title: string;
  description: string;
  file: string;
  created_at: string;
  updated_at: string;
  reference: string;
  created_by: string;
  updated_by: string;
  code: string;
  is_active: boolean;
  departments: Department[];
  categories: Category[];
}


export interface SopsMinified {
  title: string;
  description: string;
  file: string;
  is_active: boolean;
  code: string;
  reference: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface createSops {
  title: string;
  description: string;
  file: File; //file upload
  is_active: boolean;
}

interface updateSops {
  id: string;
  title: string;
  description: string;
  file: File; //file upload
  is_active: boolean;
}

export const getSops = async (
  headers: { headers: { Authorization: string } }
): Promise<Sops[]> => {
  const response: AxiosResponse<PaginatedResponse<Sops>> =
    await apiActions.get(`/api/v1/sops/`, headers);
  return response.data.results ?? [];
};

export const getSop = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Sops> => {
  const response: AxiosResponse<Sops> =
    await apiActions.get(`/api/v1/sops/${reference}/`, headers);
  return response.data;
};


// Authenticated
export const createSops = async (
  formData: createSops | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Sops> => {
  const response: AxiosResponse<Sops> = await apiMultipartActions.post(
    `/api/v1/sops/`,
    formData,
    headers
  );
  return response.data;
};

export const updateSops = async (
  reference: string,
  formData: updateSops | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Sops> => {
  const response: AxiosResponse<Sops> = await apiMultipartActions.patch(
    `/api/v1/sops/${reference}/`,
    formData,
    headers
  );
  return response.data;
};

export const deleteSops = async (
  reference: string,
  headers: { headers: { Authorization: string } }
): Promise<void> => {
  await apiActions.delete(`/api/v1/sops/${reference}/`, headers);
};


export interface SOPFetchParams {
  search?: string;
  page?: number;
  page_size?: number;
  category?: string;
}

export const getAuthSops = async (
  headers: { headers: { Authorization: string } },
  params?: SOPFetchParams
): Promise<PaginatedResponse<Sops>> => {
  const response: AxiosResponse<PaginatedResponse<Sops>> =
    await apiActions.get(`/api/v1/sops/`, {
      ...headers,
      params: params,
    });
  return response.data;
};

export const getAuthSop = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Sops> => {
  const response: AxiosResponse<Sops> =
    await apiActions.get(`/api/v1/sops/${reference}/`, headers);
  return response.data;
};