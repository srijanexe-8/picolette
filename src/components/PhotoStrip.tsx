"use client";

import { useEffect, useRef } from "react";

export default function PhotoStrip({ photos }: { photos: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!photos.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    let loaded = 0;

    photos.forEach((src, index) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        images[index] = img;
        loaded++;

        if (loaded === photos.length) {
          const width = 300;
          const height = 400;

          canvas.width = width;
          canvas.height = height * photos.length;

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          images.forEach((image, i) => {
            ctx.drawImage(image, 0, i * height, width, height);
          });
        }
      };
    });
  }, [photos]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "picolette-strip.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <canvas ref={canvasRef} className="border rounded" />

      <button
        onClick={downloadImage}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Download Strip
      </button>
    </div>
  );
}