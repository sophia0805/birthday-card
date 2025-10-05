"use client";
import { useEffect, useState, useRef } from 'react';

export default function SharePage({ params }) {
    const [id, setId] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

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

    useEffect(() => {
        if (!loading && canvasRef.current) {
            startConfetti();
        }
    }, [loading]);

    const startConfetti = () => {
        let W = window.innerWidth;
        let H = window.innerHeight;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const maxConfettis = 150;
        const particles = [];

        const possibleColors = [
            "DodgerBlue",
            "OliveDrab", 
            "Gold",
            "Pink",
            "SlateBlue",
            "LightBlue",
            "Gold",
            "Violet",
            "PaleGreen",
            "SteelBlue",
            "SandyBrown",
            "Chocolate",
            "Crimson"
        ];

        function randomFromTo(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        }

        function confettiParticle() {
            this.x = Math.random() * W;
            this.y = Math.random() * H - H;
            this.r = randomFromTo(11, 33);
            this.d = Math.random() * maxConfettis + 11;
            this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
            this.tilt = Math.floor(Math.random() * 33) - 11;
            this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
            this.tiltAngle = 0;

            this.draw = function() {
                context.beginPath();
                context.lineWidth = this.r / 2;
                context.strokeStyle = this.color;
                context.moveTo(this.x + this.tilt + this.r / 3, this.y);
                context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
                return context.stroke();
            };
        }

        function Draw() {
            requestAnimationFrame(Draw);
            context.clearRect(0, 0, W, window.innerHeight);

            for (var i = 0; i < maxConfettis; i++) {
                particles[i].draw();
            }

            let particle = {};
            for (var i = 0; i < maxConfettis; i++) {
                particle = particles[i];
                particle.tiltAngle += particle.tiltAngleIncremental;
                particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 5;
                particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

                if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
                    particle.x = Math.random() * W;
                    particle.y = -30;
                    particle.tilt = Math.floor(Math.random() * 10) - 20;
                }
            }
        }

        window.addEventListener("resize", function() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, false);

        for (var i = 0; i < maxConfettis; i++) {
            particles.push(new confettiParticle());
        }

        canvas.width = W;
        canvas.height = H;
        Draw();
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
        <div style={{ position: "relative" }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: -1,
                    pointerEvents: "none"
                }}
            />
            
            <div style={{
                padding: "12vh 3vw 2vh 2vw",
                backgroundColor: "rgba(0, 0, 0, 0)",
                minHeight: "90vh",
                overflowY: "auto",
                position: "relative",
                zIndex: 1
            }}>
            <h3 style={{ 
                color: "#333", 
                fontSize: "7.5rem",
                textAlign: "left",
                margin: "0 0 0 0",
                fontWeight: "300",
                fontFamily: "Georgia, serif"
            }}>
                Happy Birthday!
            </h3>
            <h4 style={{ 
                color: "#333", 
                fontSize: "1.5rem",
                textAlign: "left",
                margin: "0 0 0 0",
                fontWeight: "300",
                fontFamily: "Georgia, serif"
            }}>
                You have {entries.length} messages:
            </h4>
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
                        borderLeft: "4px solid #A8CCC9"
                    }}
                >
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
                ))
            )}
        </div>
        </div>
    );
}