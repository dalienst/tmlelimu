"use client"

import { apiActions, apiMultipartActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface SOPReadRecords {
    id: string;
    sop: string;
    user: string;
    read_at: string;
    created_at: string;
    updated_at: string;
    reference: string;
}

export interface CreateSOPReadRecord {
    sop: string; //sop title
}

export const getSOPReadRecords = async (headers: { headers: { Authorization: string } }): Promise<SOPReadRecords[]> => {
    const response: AxiosResponse<PaginatedResponse<SOPReadRecords>> =
        await apiActions.get(`/api/v1/sopreadrecords/`, headers);
    return response.data.results ?? [];
};

export const getSOPReadRecord = async (headers: { headers: { Authorization: string } }, reference: string): Promise<SOPReadRecords> => {
    const response: AxiosResponse<SOPReadRecords> =
        await apiActions.get(`/api/v1/sopreadrecords/${reference}/`, headers);
    return response.data;
};

export const createSOPReadRecord = async (headers: { headers: { Authorization: string } }, sopReadRecord: CreateSOPReadRecord): Promise<SOPReadRecords> => {
    const response: AxiosResponse<SOPReadRecords> =
        await apiActions.post(`/api/v1/sopreadrecords/`, sopReadRecord, headers);
    return response.data;
};