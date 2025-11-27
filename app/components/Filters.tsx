import { Switch } from "./Switch";

type FiltersProps = {
  showWritten: boolean;
  showPractical: boolean;
  onChange: (f: { showWritten?: boolean; showPractical?: boolean }) => void;
};

export function Filters({ showWritten, showPractical, onChange }: FiltersProps) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center gap-3">
        <Switch
          label="필기 포함"
          checked={showWritten}
          onCheckedChange={(v) => onChange({ showWritten: v })}
        />
        <Switch
          label="실기 포함"
          checked={showPractical}
          onCheckedChange={(v) => onChange({ showPractical: v })}
        />
      </div>
      <p className="text-muted text-sm">
        지도 클릭으로 기준 좌표를 바꾸면 거리 계산이 즉시 반영됩니다.
      </p>
    </div>
  );
}
