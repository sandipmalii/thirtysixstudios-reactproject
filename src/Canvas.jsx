import { useEffect, useRef, useState } from "react"; 
import canvasImages from "./canvasimages";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Canvas({ details }) {
  const { startIndex, numImages, duration, size, top, left, zIndex } = details;

  const [index, setIndex] = useState({ value: startIndex }); // Tracks the current image index
  const canvasRef = useRef(null); // Reference to the canvas element

  useGSAP(() => {
    // Animates the image index and fades in the canvas on load
    gsap.to(index, {
      value: startIndex + numImages - 1,
      duration: duration,
      repeat: -1, // Infinite loop
      ease: "linear",
      onUpdate: () => {
        setIndex({ value: Math.round(index.value) }); // Updates the state with the new index
      },
    });

    gsap.from(canvasRef.current, {
      opacity: 0, // Fade-in effect
      duration: 1,
      ease: "power2.inOut",
    });
  });

  useEffect(() => {
    // Handles canvas drawing based on the current image index
    const scale = window.devicePixelRatio; // Ensures high-quality rendering
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = canvasImages[index.value]; // Selects the current image
    img.onload = () => {
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";

      ctx.scale(scale, scale); // Adjusts scaling for the device
      ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight); // Draws the image on the canvas
    };
  }, [index]); // Runs every time the image index changes

  return (
    <canvas
      data-scroll
      data-scroll-speed={Math.random().toFixed(1)} // Adds random scroll speed for animation
      ref={canvasRef}
      className="absolute"
      style={{
        width: `${size * 1.8}px`, // Canvas size
        height: `${size * 1.8}px`,
        top: `${top}%`, // Canvas position
        left: `${left}%`,
        zIndex: `${zIndex}`,
      }}
      id="canvas"
    ></canvas>
  );
}

export default Canvas;
