'use client'

import { useUser } from '@/features/users/api/use-user'

export default function Profile() {
  const { user, isLoading } = useUser()

  console.log(user)

  return <div>Profile</div>
}
