"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Filters } from "./components/Filters";
import { MapView } from "./components/MapView";
import { CourseCard } from "./components/CourseCard";
import type { Course } from "@/lib/types";

type Home = { lat: number; lng: number };
const STORAGE_KEY = "homeCoord";
const defaultHome: Home = { lat: 37.5665, lng: 126.9780 };

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [home, setHome] = useState<Home>(defaultHome);
  const [selectedId, setSelectedId] = useState<string>();
  const [showWritten, setShowWritten] = useState(true);
  const [showPractical, setShowPractical] = useState(true);
  const TITLE_KEYWORDS = ["정보처리"]; // 제목에 이 키워드가 포함된 경우만 노출

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lng) setHome(parsed);
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data: Course[]) => setCourses(data));
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const hasKeyword = TITLE_KEYWORDS.some((k) => c.title.includes(k));
      if (!hasKeyword) return false; // 제목 기준 필터
      if (c.mode === "필기" && !showWritten) return false;
      if (c.mode === "실기" && !showPractical) return false;
      return true;
    });
  }, [courses, showWritten, showPractical]);

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <Header />
      <div className="px-4 sm:px-6 space-y-4">
        <Filters
          showWritten={showWritten}
          showPractical={showPractical}
          onChange={(f) => {
            if (f.showWritten !== undefined) setShowWritten(f.showWritten);
            if (f.showPractical !== undefined) setShowPractical(f.showPractical);
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <MapView
            courses={filtered}
            home={home}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
            onHomeChange={(lat, lng) => {
              setHome({ lat, lng });
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng }));
            }}
          />

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {filtered.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                home={home}
                selected={selectedId === c.id}
                onSelect={() => setSelectedId(c.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="glass rounded-2xl p-6 text-muted text-center">
                조건에 맞는 과정이 없습니다. 필터를 조정하세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
