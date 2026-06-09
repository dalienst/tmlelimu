"use client";


import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getSOPReadRecords, getSOPReadRecord } from "@/services/sopsreadrecords";


export function useFetchSOPReadRecords() {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["sop-read-records"],
    queryFn: () => getSOPReadRecords(headers),
    enabled: !!headers,
  });
}

export function useFetchSOPReadRecord(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["sop-read-record", reference],
    queryFn: () => getSOPReadRecord(headers, reference),
    enabled: !!headers && !!reference,
  });
}