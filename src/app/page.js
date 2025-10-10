"use client";

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
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "#ffffff"
    }}>
      <div style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        backgroundColor: "#fafafa",
        padding: "1.5vh 3vw",
        borderBottom: "2px solid #ddd",
        zIndex: "100"
      }}>
        <h1 style={{ 
          color: "#333", 
          fontSize: "1.8rem", 
          margin: "0",
          fontWeight: "400",
          fontFamily: "Georgia, serif"
        }}>
          Birthday Guestbook
        </h1>
      </div>
      
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "12vh 4vw 2vh 3vw",
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{ 
          padding: "4vh 3vw 3vh 3vw", 
          border: "1px solid #ccc", 
          borderRadius: "6px",
          backgroundColor: "#fff",
          maxWidth: "500px",
          width: "100%"
        }}>
          <h2 style={{ 
            color: "#444", 
            fontSize: "1.5rem",
            margin: "0 0 3vh 0",
            fontWeight: "300",
            textAlign: "center",
            fontFamily: "Georgia, serif"
          }}>
            Create a new guestbook
          </h2>
          
          <p style={{
            fontSize: "1rem",
            color: "#666",
            margin: "0 0 3vh 0",
            textAlign: "center",
            lineHeight: "1.5"
          }}>
            Start collecting birthday messages from friends and family. Each guestbook gets a unique link you can share.
          </p>
          
          <div style={{ textAlign: "center" }}>
            <button 
              onClick={createGuestbook}
              style={{
                padding: "1.2vh 2.5vw",
                backgroundColor: "#A8CCC9",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "400",
                width: "auto",
                minWidth: "12vw"
              }}
            >
              Create A Guestbook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
