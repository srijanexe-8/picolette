"use client";
import { useEffect, useRef, useState } from "react";
import PhotoStrip from "./PhotoStrip";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showNextPose, setShowNextPose] = useState(false);
  const [totalShots, setTotalShots] = useState(4);

  // 🎥 Start camera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();
  }, []);

  // 📸 Capture single photo
  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    return canvas.toDataURL("image/png");
  };

  // 🎞️ Photobooth sequence
  const startCapture = async () => {
    setPhotos([]);
    setIsCapturing(true);

    for (let i = 0; i < totalShots; i++) {
      // countdown 3 → 1
      for (let t = 3; t > 0; t--) {
        setCountdown(t);
        await new Promise((res) => setTimeout(res, 1000));
      }

      setCountdown(null);

      const photo = takePhoto();
      if (photo) {
        setPhotos((prev) => [...prev, photo]);
      }

      // Show "Next Pose" between shots (not after last)
      if (i < totalShots - 1) {
        setShowNextPose(true);
        await new Promise((res) => setTimeout(res, 2000));
        setShowNextPose(false);
      }
    }

    setIsCapturing(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* 🎥 Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-80 rounded-xl"
      />

      {/* 🎮 Countdown / Next Pose */}
      {(countdown || showNextPose) && (
        <div
          className="text-4xl mt-2 animate-bounce text-center"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "yellow",
            textShadow: "3px 3px 0px black",
          }}
        >
          {countdown ? countdown : "Next Pose!"}
        </div>
      )}

      {/* 🔘 Layout selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setTotalShots(3)}
          className="px-3 py-1 border rounded"
        >
          3 Shots
        </button>
        <button
          onClick={() => setTotalShots(4)}
          className="px-3 py-1 border rounded"
        >
          4 Shots
        </button>
      </div>

      {/* ▶️ Start button */}
      <button
        onClick={startCapture}
        disabled={isCapturing}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {isCapturing ? "Capturing..." : "Start Booth"}
      </button>

      {/* 🖼️ Preview */}
      <div className="flex gap-2 mt-4">
        {photos.map((p, i) => (
          <img
            key={i}
            src={p}
            className="w-16 h-16 object-cover rounded"
          />
        ))}
      </div>
      {photos.length === totalShots && <PhotoStrip photos={photos} />}
    </div>
  );
}