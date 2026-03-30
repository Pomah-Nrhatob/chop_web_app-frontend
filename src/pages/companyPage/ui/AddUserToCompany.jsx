import { useSearchUsers } from '@/features/users/api/use-user'
import React, { useEffect } from 'react'

export default function AddUserToCompany() {
  const { users, searchUsers, isLoading } = useSearchUsers()

  return <div>AddUserToCompany</div>
}
