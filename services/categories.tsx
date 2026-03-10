"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

import { Sops } from "./sops";

export interface Category {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    reference: string;
    created_by: string;
    updated_by: string;
    code: string;
    is_active: boolean;
    sops: Sops[];
}

interface createCategory {
    name: string;
    description: string;
    is_active: boolean;
}

interface updateCategory {
    name?: string;
    description?: string;
    is_active?: boolean;
}

interface addSOPToCategory {
    sops: string[]; //SOP Title
}

interface removeSOPFromCategory {
    sops: string[];
}


export const getCategories = async (
    headers: { headers: { Authorization: string } }
): Promise<Category[]> => {
    const response: AxiosResponse<PaginatedResponse<Category>> =
        await apiActions.get(`/api/v1/categories/`, headers);
    return response.data.results ?? [];
};

export const getCategory = async (
    reference: string,
    headers: { headers: { Authorization: string } }
): Promise<Category> => {
    const response: AxiosResponse<Category> =
        await apiActions.get(`/api/v1/categories/${reference}/`, headers);
    return response.data;
};

export const createCategory = async (
    formData: createCategory | FormData,
    headers: { headers: { Authorization: string } }
): Promise<Category> => {
    const response: AxiosResponse<Category> = await apiActions.post(
        `/api/v1/categories/`,
        formData,
        headers
    );
    return response.data;
};

export const updateCategory = async (
    reference: string,
    formData: updateCategory | FormData,
    headers: { headers: { Authorization: string } }
): Promise<Category> => {
    const response: AxiosResponse<Category> = await apiActions.patch(
        `/api/v1/categories/${reference}/`,
        formData,
        headers
    );
    return response.data;
};

export const deleteCategory = async (
    reference: string,
    headers: { headers: { Authorization: string } }
): Promise<void> => {
    await apiActions.delete(`/api/v1/categories/${reference}/`, headers);
};

export const addSOPToCategory = async (
    reference: string,
    formData: addSOPToCategory | FormData,
    headers: { headers: { Authorization: string } }
): Promise<Category> => {
    const response: AxiosResponse<Category> = await apiActions.patch(
        `/api/v1/categories/${reference}/`,
        formData,
        headers
    );
    return response.data;
};

export const removeSOPFromCategory = async (
    reference: string,
    formData: removeSOPFromCategory | FormData,
    headers: { headers: { Authorization: string } }
): Promise<Category> => {
    const response: AxiosResponse<Category> = await apiActions.patch(
        `/api/v1/categories/${reference}/`,
        formData,
        headers
    );
    return response.data;
};

