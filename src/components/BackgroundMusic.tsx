import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const MUSIC_PATH = "/Luv(sic.) Part 3 (feat. MC赵小六).mp3";
const MUSIC_NAME = "Luv(sic.) Part 3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;

    const startPlayback = () => {
      if (hasStarted) return;
      
      audio.play().then(() => {
        hasStarted = true;
        setShowNotification(true);
        // 清理所有交互监听
        window.removeEventListener("click", startPlayback);
        window.removeEventListener("touchstart", startPlayback);
        window.removeEventListener("keydown", startPlayback);

        setTimeout(() => {
          setShowNotification(false);
          setShowIcon(true);
        }, 3000);
      }).catch(() => {
        // 仍然被阻止，等待下一次交互
        console.log("Autoplay blocked, waiting for interaction...");
      });
    };

    // 1. 尝试直接播放（处理刷新或已有交互的情况）
    const handleCanPlay = () => {
      if (!hasStarted) startPlayback();
    };

    if (audio.readyState >= 3) {
      handleCanPlay();
    } else {
      audio.addEventListener("canplay", handleCanPlay, { once: true });
    }

    // 2. 添加全局交互监听以解锁音频
    window.addEventListener("click", startPlayback);
    window.addEventListener("touchstart", startPlayback);
    window.addEventListener("keydown", startPlayback);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      window.removeEventListener("click", startPlayback);
      window.removeEventListener("touchstart", startPlayback);
      window.removeEventListener("keydown", startPlayback);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_PATH}
        loop
        preload="auto"
        style={{ display: "none" }}
      />

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-white shadow-2xl px-6 py-4 flex items-center gap-4" style={{
              clipPath: "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)"
            }}>
              <div className="flex items-center gap-1 h-6">
                {[3, 6, 4].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-black rounded-sm"
                    style={{ height: h * 4 }}
                    animate={{
                      scaleY: [0.5, 1, 0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-black tracking-wider">
                BGM: {MUSIC_NAME}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIcon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-8 right-8 z-50 cursor-pointer"
            onClick={() => {
              if (audioRef.current) {
                if (audioRef.current.paused) {
                  audioRef.current.play();
                } else {
                  audioRef.current.pause();
                }
              }
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-black">
              <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}