import { useEffect, useRef, useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "../lib/utils";

const SONGS = [
  { id: "1", title: "Luv(sic.) Part 3", artist: "MC赵小六", path: "/musics/Luv(sic.) Part 3 (feat. MC赵小六).mp3" },
  { id: "2", title: "The Great Gig in the Sky", artist: "Pink Floyd", path: "/musics/The Great Gig in the Sky.mp4" },
];

const SHUTTLE_HEIGHT = 56;

interface BackgroundMusicProps {
  disableScrollAutoplay?: boolean;
}

export function BackgroundMusic({ disableScrollAutoplay = false }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlayingStatus, setShowPlayingStatus] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shuttleRef = useRef<HTMLDivElement>(null);

  const currentSong = SONGS[currentSongIndex];

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;

    const startPlayback = () => {
      if (hasStarted) return;
      
      audio.play().then(() => {
        hasStarted = true;
        setIsPlaying(true);
        setIsExpanded(true);
        setShowPlayingStatus(true);
        
        window.removeEventListener("wheel", handleScroll);
        window.removeEventListener("scroll", handleScroll);

        setTimeout(() => {
          setShowPlayingStatus(false);
          setTimeout(() => {
            setIsExpanded(false);
          }, 1000);
        }, 3000);
      }).catch(() => {
        console.log("Autoplay blocked, waiting for interaction...");
      });
    };

    const handleCanPlay = () => {
      if (!hasStarted) startPlayback();
    };

    if (audio.readyState >= 3) {
      handleCanPlay();
    } else {
      audio.addEventListener("canplay", handleCanPlay, { once: true });
    }

    const handleScroll = () => {
      if (hasStarted) return;
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      startPlayback();
    };

    if (!disableScrollAutoplay) {
      window.addEventListener("wheel", handleScroll);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [disableScrollAutoplay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.path;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (isTouchDevice && isExpanded) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [isExpanded, isTouchDevice]);

  useEffect(() => {
    if (!isTouchDevice) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (isExpanded && shuttleRef.current && !shuttleRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside as any);
    return () => {
      document.removeEventListener("click", handleClickOutside as any);
    };
  }, [isExpanded, isTouchDevice]);

  const toggleExpand = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setIsExpanded(!isExpanded);
  };

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
        setShowPlayingStatus(true);
        setTimeout(() => setShowPlayingStatus(false), 3000);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    if (isTouchDevice) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }
  };

  const togglePrev = (e: MouseEvent) => {
    e.stopPropagation();
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setShowPlayingStatus(true);
    setTimeout(() => setShowPlayingStatus(false), 3000);
    if (isTouchDevice) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }
  };

  const toggleNext = (e: MouseEvent) => {
    e.stopPropagation();
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setShowPlayingStatus(true);
    setTimeout(() => setShowPlayingStatus(false), 3000);
    if (isTouchDevice) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.path}
        loop
        preload="auto"
        style={{ display: "none" }}
      />

      {/* Music Player Shuttle */}
      <motion.div
        ref={shuttleRef}
        initial={false}
        onClick={toggleExpand}
        onMouseEnter={() => !isTouchDevice && setIsExpanded(true)}
        onMouseLeave={() => {
          if (!isTouchDevice) {
            setTimeout(() => setIsExpanded(false), 100);
          }
        }}
        animate={{
          width: isExpanded ? 260 : SHUTTLE_HEIGHT,
          height: SHUTTLE_HEIGHT,
          clipPath: isExpanded 
            ? `polygon(${SHUTTLE_HEIGHT / 2}px 0%, calc(100% - ${SHUTTLE_HEIGHT / 2}px) 0%, 100% 50%, calc(100% - ${SHUTTLE_HEIGHT / 2}px) 100%, ${SHUTTLE_HEIGHT / 2}px 100%, 0% 50%)`
            : `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className={cn(
          "fixed bottom-8 left-8 z-[100] bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center overflow-hidden cursor-pointer"
        )}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="flex items-center gap-1.5 h-6">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isPlaying 
                        ? (i === 2 ? [8, 20, 12, 18, 8] : [4, 12, 8, 10, 4]) 
                        : (i === 2 ? 8 : 4),
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + i * 0.1,
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-black rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-5 px-10 w-full"
            >
              <div className="flex-initial overflow-hidden text-center">
                {showPlayingStatus ? (
                  <motion.div
                    key="P2-status"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">Playing:</span>
                    <h4 className="font-mono text-[10px] font-bold truncate tracking-tight uppercase">
                      {currentSong.title}
                    </h4>
                  </motion.div>
                ) : (
                  <motion.div
                    key="P1-controls"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <h4 className="font-mono text-[10px] font-bold truncate tracking-tight uppercase mb-1">
                      {currentSong.title}
                    </h4>
                    <div className="flex items-center justify-center gap-4">
                      <button onClick={togglePrev} className="hover:opacity-50 transition-opacity">
                        <SkipBack size={14} fill="black" />
                      </button>
                      <button onClick={togglePlay} className="hover:opacity-50 transition-opacity">
                        {isPlaying ? (
                          <Pause size={16} fill="black" />
                        ) : (
                          <Play size={16} fill="black" />
                        )}
                      </button>
                      <button onClick={toggleNext} className="hover:opacity-50 transition-opacity">
                        <SkipForward size={14} fill="black" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}