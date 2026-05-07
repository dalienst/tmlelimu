"use client"

import { useFetchAccount } from "@/hooks/accounts/actions"

export default function EmployeeDashboard() {

    const { data: employee, isLoading: isLoadingEmployee } = useFetchAccount()

    console.log(employee)

    return (
        <div>
            Employee Dashboard
        </div>
    )
}