import { useEffect, useRef } from "react";

const MUSIC_PATH = "/Luv(sic.) Part 3 (feat. MC赵小六).mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {
        // Autoplay blocked by browser, user needs interaction first
      });
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src={MUSIC_PATH}
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
}