"use client"

import { useFetchAccount } from "@/hooks/accounts/actions"

export default function EmployeeDashboard() {

    const { data: employee, isLoading: isLoadingEmployee } = useFetchAccount()

    return (
        <div>
            Employee Dashboard
        </div>
    )
}