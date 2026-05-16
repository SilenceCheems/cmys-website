import { Contact } from "../components/Contact";
import { BackgroundMusic } from "../components/BackgroundMusic";
import { Fortune } from "../constants/fortunes";

interface GachaPageProps {
  onOpenFortune: () => void;
  dailyFortune: Fortune | null;
}

export function GachaPage({ onOpenFortune, dailyFortune }: GachaPageProps) {
  return (
    <>
      <BackgroundMusic disableScrollAutoplay />
      <Contact 
        onOpenFortune={onOpenFortune} 
        dailyFortune={dailyFortune}
      />
    </>
  );
}
