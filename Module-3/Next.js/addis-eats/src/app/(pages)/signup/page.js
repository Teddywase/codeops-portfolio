import Link from "next/link";
import { signOut, signUp } from "../../auth-actions";
import { getSession } from "../../../lib/session";
import { getSafeRedirectPath } from "../../../lib/safe-redirect";
import styles from "../signin/signin.module.css";

export const metadata = {
  title: "Create an Account",
  description: "Create an Addis Eats account to place and track your orders.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignUpPage({ searchParams }) {
  const params = await searchParams;
  const destination = getSafeRedirectPath(params?.next);
  const session = await getSession();
  const signInHref = `/signin?next=${encodeURIComponent(destination)}`;

  if (session) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <p className={styles.eyebrow}>Signed in</p>
          <h1 className={styles.heading}>Welcome, {session.name}</h1>
          <p className={styles.description}>
            You already have an account. Continue or sign out to create a
            different one.
          </p>
          <div className={styles.actions}>
            <Link className={styles.submit} href={destination}>
              Continue
            </Link>
            <form action={signOut}>
              <button className={styles.secondary} type="submit">
                Sign out
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Addis Eats account</p>
        <h1 className={styles.heading}>Create your account</h1>
        {params?.error === "email-in-use" && (
          <p className={styles.error} role="alert">
            An account with this email already exists.{" "}
            <Link href={signInHref}>Sign in instead.</Link>
          </p>
        )}
        {params?.error === "invalid-input" && (
          <p className={styles.error} role="alert">
            Enter a name, a valid email, and a password between 8 and 128
            characters.
          </p>
        )}
        <form action={signUp} className={styles.form}>
          <input name="next" type="hidden" value={destination} />
          <label className={styles.label} htmlFor="name">
            Full name
          </label>
          <input
            autoComplete="name"
            className={styles.input}
            id="name"
            maxLength={80}
            minLength={2}
            name="name"
            required
            type="text"
          />
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className={styles.input}
            id="email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            autoComplete="new-password"
            className={styles.input}
            id="password"
            maxLength={128}
            minLength={8}
            name="password"
            required
            type="password"
          />
          <button className={styles.submit} type="submit">
            Create account
          </button>
        </form>
        <p className={styles.description}>
          Already have an account? <Link href={signInHref}>Sign in</Link>
        </p>
      </section>
    </main>
  );
}
