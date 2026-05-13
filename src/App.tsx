/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hero } from "./components/Hero";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";

export default function App() {
  return (
    <main className="min-h-screen bg-canvas text-primary font-sans selection:bg-primary selection:text-canvas">
      <Hero />
      <Timeline />
      <Contact />
    </main>
  );
}

