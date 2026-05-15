import { Contact } from "../components/Contact";
import { Fortune } from "../constants/fortunes";

interface GachaPageProps {
  onOpenFortune: () => void;
  dailyFortune: Fortune | null;
}

export function GachaPage({ onOpenFortune, dailyFortune }: GachaPageProps) {
  return (
    <Contact 
      onOpenFortune={onOpenFortune} 
      dailyFortune={dailyFortune}
    />
  );
}
