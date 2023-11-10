import { createClient } from '~/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { db } from '~/server/db'
import { createUserInDatabase } from '../../../utils/dbUtils'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/api/auth/callback`,
    },
  })

  if (data.user) {
    await createUserInDatabase(db, data.user.id, data.user.email);
  }

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/signup?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/signup?message=Check email to continue sign in process`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  )
}
