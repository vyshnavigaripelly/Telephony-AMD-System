import Link from "next/link";

import { SignUpForm } from "@/components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Request an account</h1>
        <p className="text-sm text-muted-foreground">
          Better Auth handles secure enrollment and multi-factor authentication.
        </p>
      </div>
      <SignUpForm />
      <p className="text-center text-xs text-muted-foreground">
        Already have credentials?
        <Link href="/sign-in" className="ml-1 font-medium text-blue-600 hover:underline">
          Sign in.
        </Link>
      </p>
    </main>
  );
}
