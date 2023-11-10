import Link from 'next/link'
import Messages from '../login/messages'

export default function Signup() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center gap-2 h-full items-center">

      <form
        className="max-w-sm flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action="/api/auth/sign-up"
        method="post"
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          className="border bg-black text-white border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign up
        </button>
        <Messages />
        <p>
        Already have an account?
      <Link href="/login" className='ml-1 text-blue-600 underline'>
        Login
        </Link>
        </p>
      </form>
     

    </div>
  )
}
