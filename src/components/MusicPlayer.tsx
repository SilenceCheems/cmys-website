import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, MouseEvent } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "../lib/utils";

const SONGS = [
  { id: "1", title: "DECONSTRUCTION_RAVE", artist: "SYSTEM" },
  { id: "2", title: "SILENT_POETRY", artist: "MENGWA" },
  { id: "3", title: "AERIAL_DREAM", artist: "WING" },
];

interface MusicPlayerProps {
  MixDiff?: boolean;
}

export function MusicPlayer({ MixDiff = false }: MusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlayingStatus, setShowPlayingStatus] = useState(false);

  const song = SONGS[currentSongIndex];
  const shuttleHeight = 56; // Fixed height in pixels

  useEffect(() => {
    if (isPlaying) {
      setShowPlayingStatus(true);
      const timer = setTimeout(() => {
        setShowPlayingStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowPlayingStatus(false);
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  const nextSong = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
  };
  const prevSong = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
  };

  return (
    <motion.div
      initial={false}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      animate={{
        width: isExpanded ? 260 : shuttleHeight,
        height: shuttleHeight,
        clipPath: isExpanded 
          ? `polygon(${shuttleHeight / 2}px 0%, calc(100% - ${shuttleHeight / 2}px) 0%, 100% 50%, calc(100% - ${shuttleHeight / 2}px) 100%, ${shuttleHeight / 2}px 100%, 0% 50%)`
          : `polygon(50% 0%, 50% 0%, 100% 50%, 50% 100%, 50% 100%, 0% 50%)`
      }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className={cn(
        "fixed bottom-8 left-8 z-[100] bg-white text-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center overflow-hidden cursor-pointer",
        MixDiff && "mix-blend-difference",
        "transition-shadow duration-500"
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
            {/* Jumping lines visualizer */}
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
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center gap-5 px-10 w-full"
          >
            <div className="flex-initial overflow-hidden text-center">
              {showPlayingStatus ? (
                <div key="status">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">Playing:</span>
                  <h4 className="font-mono text-xs font-bold truncate tracking-tight uppercase">
                    {song.title}
                  </h4>
                </div>
              ) : (
                <div key="controls">
                  <h4 className="font-mono text-xs font-bold truncate tracking-tight uppercase mb-2">
                     {song.title}
                  </h4>
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={prevSong} className="hover:opacity-50 transition-opacity">
                      <SkipBack size={14} fill="black" />
                    </button>
                    <button onClick={togglePlay} className="hover:opacity-50 transition-opacity">
                      {isPlaying ? (
                        <Pause size={18} fill="black" />
                      ) : (
                        <Play size={18} fill="black" />
                      )}
                    </button>
                    <button onClick={nextSong} className="hover:opacity-50 transition-opacity">
                      <SkipForward size={14} fill="black" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
