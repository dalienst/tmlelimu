"use client"

import { apiActions, apiMultipartActions } from "@/tools/axios"
import { AxiosResponse } from "axios";

export interface User {
    id: string;
    email: string;
    payroll_no: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_active: boolean;
    is_admin: boolean;
    is_deleted: boolean;
    last_login: string;
    is_employee: boolean;
    is_manager: boolean;
    is_trainer: boolean;
    is_hod: boolean;
    is_hr: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    reference: string;
}

interface createHRAccount {
    email: string;
    first_name: string;
    last_name: string;
    payroll_no: string;
    password: string;
    password_confirmation: string;
}


export interface forgotPassword {
  email: string;
}

export interface resetPassword {
  code: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface updateUser {
    first_name?: string;
    last_name?: string;
}

// HR Roles
interface createEmployeeByHR {
    email: string;
    first_name: string;
    last_name: string;
    payroll_no: string;
    password: string; // not required if email has been provided as an activation email will be sent to the user which will enable them set a password
}

interface createBulkEmployeeByHR {
    // usually a list of objects
    employees: createEmployeeByHR[];
}

interface createBulkEmployeeByHRCSV {
    file: File;
}

interface updateUserByHR {
    is_employee?: boolean;
    is_manager?: boolean;
    is_trainer?: boolean;
    is_hod?: boolean;
    is_hr?: boolean;
}

export const getAccount = async (userId: string, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.get(`/api/v1/auth/${userId}/`, headers)
    return response.data
}

export const updateAccount = async (userId: string, formData: updateUser | FormData, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiMultipartActions.patch(`/api/v1/auth/${userId}/`, formData, headers)
    return response.data
}

export const forgotPassword = async (data: forgotPassword): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/password/forgot/`, data)
    return response.data
}

export const resetPassword = async (data: resetPassword): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/password/reset/confirm/`, data)
    return response.data
}

// Private Endpoints: created by system admin or existing HR
export const createHRAccount = async (data: createHRAccount, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/signup/hr/`, data, headers)
    return response.data
}

export const createEmployeeByHR = async (data: createEmployeeByHR, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/employee/create/`, data, headers)
    return response.data
}

export const createBulkEmployeeByHR = async (data: createBulkEmployeeByHR, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/employee/bulk/create/`, data, headers)
    return response.data
}

export const createBulkEmployeeByHRCSV = async (data: createBulkEmployeeByHRCSV, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiMultipartActions.post(`/api/v1/auth/employee/bulk/create/csv/`, data, headers)
    return response.data
}

export const getEmployees = async (headers: { headers: { Authorization: string } }): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await apiActions.get(`/api/v1/auth/`, headers)
    return response.data
}

export const getEmployee = async (reference: string, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.get(`/api/v1/auth/${reference}/update/`, headers)
    return response.data
}

export const updateUserByHR = async (reference: string, formData: updateUserByHR, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.patch(`/api/v1/auth/employee/${reference}/update/`, formData, headers)
    return response.data
}


