import { MapPin, Clock, Users, BadgeCheck } from "lucide-react";
import { MiniMap } from "./MiniMap";
import type { Course } from "@/lib/types";
import { haversine } from "@/lib/distance";

type Props = {
  course: Course;
  home: { lat: number; lng: number };
  selected?: boolean;
  onSelect: () => void;
};

export function CourseCard({ course, home, selected, onSelect }: Props) {
  const dist = haversine(home.lat, home.lng, course.lat, course.lng);
  return (
    <article
      className={`glass rounded-2xl p-4 flex gap-4 border ${
        selected ? "border-accent" : "border-white/10"
      }`}
      onClick={onSelect}
    >
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wide">
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
            {course.status}
          </span>
          <span
            className={`px-2 py-1 rounded-full border text-xs ${
              course.mode === "실기"
                ? "bg-orange-500/20 border-orange-400/50 text-orange-100"
                : "bg-blue-500/20 border-blue-400/50 text-blue-100"
            }`}
          >
            {course.mode}
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">{course.title}</h3>
        <p className="text-muted flex items-center gap-2 text-sm">
          <Clock size={16} /> {course.start} ~ {course.end}
        </p>
        <p className="text-muted flex items-center gap-2 text-sm">
          <MapPin size={16} /> {course.addr}
        </p>
        <p className="text-muted flex items-center gap-2 text-sm">
          <BadgeCheck size={16} />
          수강비 {course.cost} · 정원 {course.seats}명
        </p>
        <p className="text-accent font-bold text-sm">{dist.toFixed(1)} km</p>
      </div>
      <div className="flex flex-col items-end justify-between gap-2">
        <MiniMap center={[course.lat, course.lng]} mode={course.mode} />
        <button className="text-xs text-muted hover:text-white underline" onClick={onSelect}>
          지도에서 보기
        </button>
      </div>
    </article>
  );
}
