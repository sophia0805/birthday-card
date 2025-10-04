"use client";
import { useEffect, useState } from "react";

export default function GuestbookPage({ params }) {
  const [id, setId] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/guestbook/${id}`)
        .then(response => response.json())
        .then(data => {
          console.log("Guestbook loaded:", data);
          if (data.entries) {
            setEntries(data.entries);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error loading guestbook:", error);
          setLoading(false);
        });
    });
  }, [params]);

  const addEntry = async () => {
    if (!nameInput.trim() || !messageInput.trim()) return;
    
    const newEntry = {
      name: nameInput.trim(),
      message: messageInput.trim(),
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch(`/api/guestbook/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    });
      
    const data = await response.json();
    if (data.entries) {
      setEntries(data.entries);
      setNameInput("");
      setMessageInput("");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px"
      }}>
        Loading guestbook...
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex",
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
          margin: "0 0 0.3vh 0",
          fontWeight: "400",
          fontFamily: "Georgia, serif"
        }}>
          Birthday Guestbook
        </h1>
        <p style={{ 
          color: "#666", 
          fontSize: "0.9rem",
          margin: "0",
          fontStyle: "italic"
        }}>
          ID: {id}
        </p>
      </div>
      <div style={{
        width: "50vw",
        padding: "12vh 4vw 2vh 3vw",
        marginTop: "10vh",
        backgroundColor: "#f5f5f5",
        minHeight: "90vh",
        overflowY: "auto"
      }}>
        <div style={{ 
          padding: "4vh 3vw 3vh 3vw", 
          border: "1px solid #ccc", 
          borderRadius: "6px",
          backgroundColor: "#fff",
          height: "fit-content",
          marginTop: "2vh"
        }}>
          <h3 style={{ 
            color: "#444", 
            fontSize: "1.3rem",
            margin: "0 0 3vh 0",
            fontWeight: "300",
            textAlign: "left"
          }}>
            Add your message
          </h3>
          <div style={{ marginBottom: "2vh" }}>
            <input
              type="text"
              placeholder="your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                width: "100%",
                padding: "1.2vh 1.5vw",
                marginBottom: "2vh",
                borderRadius: "3px",
                border: "1px solid #999",
                fontSize: "0.95rem",
                backgroundColor: "#fafafa",
                boxSizing: "border-box",
                fontFamily: "Arial, sans-serif"
              }}
            />
          </div>
          <div style={{ marginBottom: "2.5vh" }}>
            <textarea
              placeholder="write your message here..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={{
                width: "100%",
                padding: "1.5vh 1.5vw",
                height: "12vh",
                borderRadius: "3px",
                border: "1px solid #999",
                fontSize: "0.95rem",
                resize: "vertical",
                backgroundColor: "#fafafa",
                boxSizing: "border-box",
                fontFamily: "Arial, sans-serif"
              }}
            />
          </div>
          <button 
            onClick={addEntry}
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
              minWidth: "8vw"
            }}
          >
            Submit
          </button>
        </div>
      </div>
        <div style={{
          width: "50vw",
          padding: "12vh 3vw 2vh 2vw",
          marginTop: "10vh",
          backgroundColor: "#ffffff",
          minHeight: "90vh",
          overflowY: "auto"
        }}>
          <h3 style={{ 
            color: "#333", 
            fontSize: "1.4rem",
            textAlign: "left",
            margin: "0 0 4vh 0",
            fontWeight: "300",
            fontFamily: "Georgia, serif"
          }}>
            Messages ({entries.length})
          </h3>
        {entries.length === 0 ? (
          <div style={{
            textAlign: "left", 
            padding: "6vh 2vw",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginTop: "2vh"
          }}>
            <p style={{ 
              color: "#666", 
              fontSize: "1rem",
              margin: "0",
              fontStyle: "italic"
            }}>
              No messages yet
            </p>
            </div>
        ) : (
          entries
            .filter(entry => entry.name && entry.message)
            .map((entry, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: "3vh", 
                padding: "2vh 2.5vw", 
                border: "1px solid #ddd", 
                borderRadius: "4px",
                backgroundColor: "#fafafa",
                borderLeft: "4px solid #A8CCC9 "
              }}
            >
              <p style={{ 
                margin: "0 0 1.5vh 0", 
                fontSize: "0.95rem", 
                lineHeight: "1.5",
                color: "#444",
                fontFamily: "Arial, sans-serif"
              }}>
                "{entry.message}"
              </p>
              <div style={{
                fontSize: "0.85rem",
                color: "#666",
                marginBottom: "0.8vh"
              }}>
                - {entry.name}
              </div>
              <small style={{ 
                color: "#888", 
                fontSize: "0.8rem"
              }}>
                {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                {new Date(entry.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}