"use client";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const hash = async (str) => {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(str),
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 6);
  };
  const createGuestbook = async () => {
    const hashValue = await hash(`guestbook-${Date.now()}`);
    window.location.href = `/guestbook/${hashValue}`;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <button onClick={createGuestbook}>
          Create a guestbook
        </button>
      </main>
    </div>
  );
}
