type SwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function Switch({ label, checked, onCheckedChange }: SwitchProps) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
      <span
        className={`w-10 h-6 rounded-full p-1 transition-colors ${
          checked ? "bg-accent" : "bg-white/15"
        }`}
        onClick={() => onCheckedChange(!checked)}
      >
        <span
          className={`block w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        ></span>
      </span>
      <span className="text-muted">{label}</span>
    </label>
  );
}
