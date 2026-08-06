"use client";

import { QuickPick } from "@/types";
import Header from "./Header";
import Hero from "./Hero";
import QuickPickGrid from "./QuickPickGrid";
import CustomFilterButton from "./CustomFilterButton";
import CreatorCard from "./CreatorCard";
import Footer from "./Footer";

interface HomeScreenProps {
  onQuickPick: (pick: QuickPick) => void;
  onCustomFilters: () => void;
}

export default function HomeScreen({ onQuickPick, onCustomFilters }: HomeScreenProps) {
  return (
    <div className="min-h-screen pb-4">
      <Header />
      <Hero />
      <QuickPickGrid onSelect={onQuickPick} />
      <CustomFilterButton onClick={onCustomFilters} />
      <CreatorCard />
      <Footer />
    </div>
  );
}
