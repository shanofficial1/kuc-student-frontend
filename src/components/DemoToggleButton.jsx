import { useStore } from "../store";

export default function DemoToggleButton() {
  const isSubmitted = useStore((s) => s.isSubmitted);
  const toggleSubmitted = useStore((s) => s.toggleSubmitted);

  return (
    <button
      onClick={toggleSubmitted}
      className="fixed bottom-5 left-5 z-[9999] px-4 py-2 text-xs font-semibold rounded-full shadow-lg transition-all
                 bg-black text-white opacity-20 hover:opacity-80"
      title="Demo Toggle"
    >
      {isSubmitted ? "Unlock (Demo)" : "Lock (Demo)"}
    </button>
  );
}