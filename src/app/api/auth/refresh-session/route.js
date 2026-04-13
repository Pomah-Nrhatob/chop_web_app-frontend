import { auth, unstable_update } from '@/configs/auth'

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { accessToken, refreshToken, expiresAt } = await request.json()

  await unstable_update({
    user: {
      ...session.user,
      accessToken,
      refreshToken,
      expiresAt,
    },
  })

  return NextResponse.json({ success: true })
}
