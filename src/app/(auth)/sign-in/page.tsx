import Link from "next/link";

import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Authenticate with Better Auth credentials to access the dialer.
        </p>
      </div>
      <SignInForm />
      <p className="text-center text-xs text-muted-foreground">
        Don’t have access yet? Contact your administrator or
        <Link href="/sign-up" className="ml-1 font-medium text-blue-600 hover:underline">
          request an account.
        </Link>
      </p>
    </main>
  );
}
