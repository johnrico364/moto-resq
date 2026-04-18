interface LoginButtonProps {
  text: string;
  onPress: () => void;
}

export function LoginButton({ text, onPress }: LoginButtonProps) {
  return (
    <button
      onClick={onPress}
      className="w-full text-white text-xs tracking-[0.25em] uppercase font-semibold py-4 active:scale-[0.98] transition-all duration-150"
      style={{ backgroundColor: "#1e88e5" }}
    >
      {text}
    </button>
  );
}
