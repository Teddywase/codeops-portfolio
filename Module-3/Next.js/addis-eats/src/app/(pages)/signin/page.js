import Link from "next/link";
import { signIn, signOut } from "../../auth-actions";
import { getSession } from "../../../lib/session";
import { getSafeRedirectPath } from "../../../lib/safe-redirect";
import styles from "./signin.module.css";

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const session = await getSession();
  const destination = getSafeRedirectPath(
    params?.next,
    session?.role === "staff" ? "/kitchen" : "/checkout",
  );

  if (session) {
    return (
      <main className={styles.page}>
        <section className={styles.card}>
          <p className={styles.eyebrow}>Signed in</p>
          <h1 className={styles.heading}>Welcome, {session.name}</h1>
          <p className={styles.description}>
            Continue to your requested page or sign out.
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
        <h1 className={styles.heading}>Sign in</h1>
        {params?.error === "invalid-credentials" ? (
          <p className={styles.error} role="alert">
            Email or password is incorrect.
          </p>
        ) : null}
        <form action={signIn} className={styles.form}>
          <input name="next" type="hidden" value={destination} />
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            autoComplete="username"
            className={styles.input}
            id="email"
            name="email"
            required
            type="email"
          />
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className={styles.input}
            id="password"
            maxLength={128}
            name="password"
            required
            type="password"
          />
          <button className={styles.submit} type="submit">
            Sign in
          </button>
        </form>
        <p className={styles.description}>
          Demo customer: abebe@example.com · AddisEats42!
          <br />
          Demo customer: liya@example.com · LiyaEats42!
          <br />
          Demo staff: kitchen@example.com · Kitchen42!
        </p>
      </section>
    </main>
  );
}
