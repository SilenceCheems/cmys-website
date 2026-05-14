/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Hero } from "./components/Hero";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DecorativeScrollbar } from "./components/DecorativeScrollbar";
import { FortuneSystem } from "./components/FortuneSystem";

export default function App() {
  const [isFortuneOpen, setIsFortuneOpen] = useState(false);

  return (
    <div className="relative">
      <DecorativeScrollbar />
      <Header />
      <main className="relative z-20 min-h-screen bg-canvas text-primary font-sans selection:bg-primary selection:text-canvas">
        <Hero />
        <Timeline />
        <Contact onOpenFortune={() => setIsFortuneOpen(true)} />
      </main>
      <Footer />

      <FortuneSystem 
        isOpen={isFortuneOpen} 
        onClose={() => setIsFortuneOpen(false)} 
      />
    </div>
  );
}

