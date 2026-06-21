"use client";

import { ArrowUpRight, BookOpenCheck, MousePointerClick, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TooltipState = {
  x: number;
  y: number;
  title: string;
  detail: string;
} | null;

const TREND_VALUES = [42, 48, 46, 55, 58, 64, 62, 71, 74, 78, 82, 86];
const TREND_LABELS = TREND_VALUES.map((_, index) => `${index + 1}주차`);

function findWeeklyBar(target: Element | null) {
  let node = target;
  while (node && node !== document.body) {
    const parent = node.parentElement;
    if (parent?.matches("div.flex.h-32.items-end.gap-2")) return node as HTMLElement;
    node = parent;
  }
  return null;
}

export function DemoEnhancements() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const pinned = useRef(false);

  useEffect(() => {
    const showTrend = (event: PointerEvent, svg: SVGSVGElement) => {
      const rect = svg.getBoundingClientRect();
      const relativeX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
      const index = Math.min(TREND_VALUES.length - 1, Math.max(0, Math.round((relativeX / rect.width) * (TREND_VALUES.length - 1))));
      const previous = index === 0 ? TREND_VALUES[index] : TREND_VALUES[index - 1];
      const diff = TREND_VALUES[index] - previous;
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        title: `${TREND_LABELS[index]} · 성취도 ${TREND_VALUES[index]}점`,
        detail: index === 0 ? "첫 측정 기준점" : `이전 주보다 ${diff >= 0 ? "+" : ""}${diff}점`,
      });
    };

    const showBar = (event: PointerEvent, bar: HTMLElement) => {
      const day = bar.querySelector("small")?.textContent?.trim() || "선택한 날";
      const value = bar.querySelector("span")?.textContent?.trim() || "0";
      const isMinute = value.endsWith("m");
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        title: `${day}요일 · ${value}${isMinute ? "" : "회"}`,
        detail: isMinute ? "집중 시간 기록" : "실행을 시작한 횟수",
      });
    };

    const showHeat = (event: PointerEvent, button: HTMLButtonElement) => {
      const title = button.title || "0회 실행";
      const heatButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button[title$="회 실행"]'));
      const index = heatButtons.indexOf(button);
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        title: `활동일 ${index + 1} · ${title}`,
        detail: "클릭하면 선택한 날짜를 강조합니다.",
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const trend = target?.closest<SVGSVGElement>('svg[aria-label="성취도 상승 추이 그래프"]');
      if (trend) {
        showTrend(event, trend);
        return;
      }
      const bar = findWeeklyBar(target);
      if (bar) {
        showBar(event, bar);
        return;
      }
      const heat = target?.closest<HTMLButtonElement>('button[title$="회 실행"]');
      if (heat) showHeat(event, heat);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (pinned.current) return;
      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest('svg[aria-label="성취도 상승 추이 그래프"]') ||
        findWeeklyBar(target) ||
        target?.closest('button[title$="회 실행"]')
      ) {
        setTooltip(null);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const trend = target?.closest<SVGSVGElement>('svg[aria-label="성취도 상승 추이 그래프"]');
      if (trend) {
        pinned.current = !pinned.current;
        trend.classList.toggle("chart-pinned", pinned.current);
        if (!pinned.current) setTooltip(null);
        return;
      }

      const bar = findWeeklyBar(target);
      if (bar) {
        bar.parentElement?.querySelectorAll(".chart-item-selected").forEach((item) => item.classList.remove("chart-item-selected"));
        bar.classList.add("chart-item-selected");
        return;
      }

      const heat = target?.closest<HTMLButtonElement>('button[title$="회 실행"]');
      if (heat) {
        heat.parentElement?.querySelectorAll(".heat-item-selected").forEach((item) => item.classList.remove("heat-item-selected"));
        heat.classList.add("heat-item-selected");
      }
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <a
        href="https://app.notion.com/p/386b66e9767781e5a51df29cdf59690e"
        target="_blank"
        rel="noreferrer"
        className="learning-plan-cta"
        aria-label="AI 학습 계획서 새 창에서 열기"
      >
        <span className="learning-plan-cta__glow" aria-hidden="true" />
        <span className="learning-plan-cta__icon"><BookOpenCheck size={22} /></span>
        <span className="learning-plan-cta__copy">
          <small><Sparkles size={13} /> 제출 문서 바로가기</small>
          <strong>AI 학습 계획서 확인</strong>
          <em><MousePointerClick size={13} /> 여기를 눌러주세요</em>
        </span>
        <span className="learning-plan-cta__arrow"><ArrowUpRight size={22} /></span>
      </a>

      {tooltip && (
        <div
          className="chart-interaction-tooltip"
          style={{ left: tooltip.x + 18, top: tooltip.y - 18 }}
          role="status"
        >
          <strong>{tooltip.title}</strong>
          <span>{tooltip.detail}</span>
        </div>
      )}
    </>
  );
}
