"use client";
import { useEffect, useState } from "react";

export default function GuestbookPage({ params }) {
  const [id, setId] = useState(null);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/guestbook/${id}`)
        .then(response => response.json())
        .then(data => {
          console.log("Guestbook entry added:", data);
        })
        .catch(error => {
          console.error("Error adding guestbook entry:", error);
        });
    });
  }, [params]);

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Birthday Guestbook</h1>
      <p>Guestbook ID: {id}</p>
    </div>
  );
}