"use client";
import { useEffect, useState, useRef } from "react";

export default function GuestbookPage({ params }) {
  const [id, setId] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState(null);
  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [context, setContext] = useState(null);

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
        });
    });
  }, [params]);

  const addEntry = async () => {
    if (!nameInput.trim() || !messageInput.trim()) return;
    
    let currentImageData = null;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      let hasContent = false;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        if (!(r === 255 && g === 255 && b === 255 && a === 255) && a > 0) {
          hasContent = true;
          break;
        }
      }
      
      if (hasContent) {
        currentImageData = canvas.toDataURL('image/png');
      }
    }
    
    const newEntry = {
      name: nameInput.trim(),
      message: messageInput.trim(),
      timestamp: new Date().toISOString(),
      image: currentImageData
    };
    
    const response = await fetch(`/api/guestbook/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    });
    const data = await response.json();
    setEntries(data.entries);
    setNameInput("");
    setMessageInput("");
    setImageData(null);
  };

  const shareGuestbook = async () => {
    const shareUrl = `${window.location.origin}/guestbook/${id}/share`;
    navigator.clipboard.writeText(shareUrl);
    window.alert("Link copied to clipboard!");
  };

  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = color;
          ctx.lineWidth = brushSize;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          setContext(ctx);
        }
      }
    };
    
    initCanvas();
    const timer1 = setTimeout(initCanvas, 100);
    const timer2 = setTimeout(initCanvas, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, [color, brushSize, context]);
  const startDrawing = (e) => {
    if (!context) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    if (context) {
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
        <button 
            onClick={shareGuestbook}
            style={{
              padding: "1.5vh 1.2vw",
              backgroundColor: "#A8CCC9",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "400",
              position: "absolute",
              right: "2vw",
              top: "2vh"
            }}
          >
            <img src="/clink.png" alt="Share" style={{ width: "3vh", height: "3vh" }} />
          </button>
      </div>
      <div style={{
        width: "50vw",
        padding: "12vh 4vw 2vh 3vw",
        marginTop: "2vh",
        backgroundColor: "#f5f5f5",
        minHeight: "90vh",
        overflowY: "auto"
      }}>
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
              minWidth: "8vw",
              marginRight: "1vw"
            }}>
            Submit
        </button>
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
            Add a message:
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
        </div>
        <div style={{ 
          padding: "4vh 3vw 3vh 3vw", 
          border: "1px solid #ccc", 
          borderRadius: "6px",
          backgroundColor: "#fff",
          marginTop: "2vh"
        }}>
          <h3 style={{ 
            color: "#444", 
            fontSize: "1.3rem",
            margin: "0 0 2vh 0",
            fontWeight: "300",
            textAlign: "left"
          }}>
            Draw a picture:
          </h3>
          <div style={{ 
            marginBottom: "2vh",
            display: "flex",
            gap: "2vw",
            alignItems: "center"
          }}>
            <div>
              <label style={{ fontSize: "0.9rem", color: "#666", marginRight: "1vw" }}>
                Color:
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ 
                  width: "40px", 
                  height: "30px", 
                  border: "1px solid #ccc",
                  borderRadius: "3px"
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", color: "#666", marginRight: "1vw" }}>
                Size:
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                style={{ width: "80px" }}
              />
              <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "0.5vw" }}>
                {brushSize}px
              </span>
            </div>
            <button 
              onClick={clearCanvas}
              style={{
                padding: "1vh 1vw",
                backgroundColor: "#A8CCC9",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "400",
                width: "auto",
                marginRight: "1vw"
              }}
            > Clear
            </button>
          </div>
          <canvas 
            ref={canvasRef} 
            width={350} 
            height={200}
            onMouseDown={startDrawing} 
            onMouseMove={draw} 
            onMouseUp={stopDrawing} 
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
              });
              startDrawing(mouseEvent);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
              });
              draw(mouseEvent);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stopDrawing();
            }}
            style={{
              border: "1px solid #ddd", 
              borderRadius: "6px",
              backgroundColor: "#fff",
              cursor: "crosshair",
              touchAction: "none",
              width: "100%",
              maxWidth: "350px"
            }} 
          />
        </div>
      </div>
        <div style={{
          width: "50vw",
          padding: "12vh 3vw 2vh 2vw",
          marginTop: "5vh",
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
                borderLeft: "4px solid #A8CCC9 ",
                display: "flex",
                gap: "2vw",
                alignItems: "flex-start"
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ 
                  margin: "0 0 1.5vh 0", 
                  fontSize: "0.95rem", 
                  lineHeight: "1.5",
                  color: "#444",
                  fontFamily: "Arial, sans-serif",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap"
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
              {entry.image && (
                <div style={{ 
                  flexShrink: 0,
                  maxWidth: "150px"
                }}>
                  <img 
                    src={entry.image} 
                    alt="Drawing" 
                    style={{
                      width: "100%",
                      maxWidth: "150px",
                      height: "auto",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}