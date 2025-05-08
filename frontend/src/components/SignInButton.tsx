'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function SignInButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn('microsoft-entra-id')}>Sign in with Microsoft</button>
    </>
  )
}
