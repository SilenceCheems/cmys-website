/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DecorativeScrollbar } from "./components/DecorativeScrollbar";
import { FortuneSystem } from "./components/FortuneSystem";
import { Fortune } from "./constants/fortunes";

const STORAGE_DATE_KEY = "esu_fortune_date";
const STORAGE_KEY = "esu_fortune_daily";

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getStoredDailyFortune(fortunes: Fortune[]): Fortune | null {
  try {
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
    const today = getTodayDate();
    if (storedDate === today) {
      const storedId = localStorage.getItem(STORAGE_KEY);
      return fortunes.find((f) => f.id === storedId) || null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function App() {
  const [isFortuneOpen, setIsFortuneOpen] = useState(false);
  const [dailyFortune, setDailyFortune] = useState<Fortune | null>(null);
  const [fortunes, setFortunes] = useState<Fortune[]>([]);

  useEffect(() => {
    const loadFortunes = async () => {
      const { FORTUNES } = await import("./constants/fortunes");
      setFortunes(FORTUNES);
      setDailyFortune(getStoredDailyFortune(FORTUNES));
    };
    loadFortunes();
  }, []);

  const handleOpenFortune = () => {
    setIsFortuneOpen(true);
  };

  return (
    <div className="relative">
      <DecorativeScrollbar />
      <Header />
      <main className="relative z-20 min-h-screen bg-canvas text-primary font-sans selection:bg-primary selection:text-canvas">
        <Hero />
        <Timeline />
        <Contact 
          onOpenFortune={handleOpenFortune} 
          dailyFortune={dailyFortune}
        />
      </main>
      <Footer />

      <FortuneSystem 
        isOpen={isFortuneOpen} 
        onClose={() => setIsFortuneOpen(false)} 
        onDailyFortuneSet={setDailyFortune}
      />
    </div>
  );
}

