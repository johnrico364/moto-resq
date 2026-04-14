interface LoginButtonProps {
  text: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
}

export function LoginButton({ text, onPress, disabled = false }: LoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className="w-full text-white text-xs tracking-[0.25em] uppercase font-semibold py-4 active:scale-[0.98] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
      style={{ backgroundColor: "#1e88e5" }}
    >
      {text}
    </button>
  );
}
