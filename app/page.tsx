"use client";

import { createClient } from "@supabase/supabase-js";
import {
  Archive,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Flame,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type View = "today" | "memos" | "history";
type Phase = "capture" | "recommend" | "run" | "reflect";
type Recommendation = { action: string; step: string; reason: string; category: string };
type MemoItem = {
  id: number;
  title: string;
  body: string;
  category: string;
  created: string;
  priority: "높음" | "보통" | "낮음";
  starred: boolean;
  status: "아이디어" | "실행 대기" | "완료";
};
type HistoryItem = {
  id: number;
  date: string;
  action: string;
  step: string;
  duration: number;
  category: string;
  completed: boolean;
  reflection: string;
  score: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xwyycumeinkezapoxojz.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_C1UrdSBahBFdJgNVVl_oeg_ukWH1PWx",
);

const INITIAL_MEMOS: MemoItem[] = [
  { id: 1, title: "고객 인터뷰 질문 정리", body: "팀프로젝트의 핵심 문제를 확인할 사용자 인터뷰 질문을 만들자. 완벽주의 때문에 미루고 있다.", category: "프로젝트", created: "오늘 09:24", priority: "높음", starred: true, status: "실행 대기" },
  { id: 2, title: "포트폴리오 소개 문장", body: "내가 맡은 역할과 문제 해결 과정을 한 문장으로 설명할 수 있게 정리하기.", category: "커리어", created: "어제 22:10", priority: "보통", starred: true, status: "아이디어" },
  { id: 3, title: "메모 추천 프롬프트", body: "메모를 5분짜리 첫 행동으로 줄이는 프롬프트 평가 기준을 구체화해야 한다.", category: "AI", created: "6월 19일", priority: "높음", starred: false, status: "실행 대기" },
  { id: 4, title: "온보딩 첫 화면 카피", body: "처음 들어온 사용자가 서비스 가치를 5초 안에 이해하게 만드는 문장을 비교해보자.", category: "디자인", created: "6월 18일", priority: "보통", starred: false, status: "아이디어" },
  { id: 5, title: "팀 데모 시나리오", body: "발표에서 메모 입력부터 완료 회고까지 90초 안에 보여주는 흐름을 만들기.", category: "프로젝트", created: "6월 17일", priority: "높음", starred: true, status: "완료" },
  { id: 6, title: "주간 회고 자동 요약", body: "실행 기록을 바탕으로 이번 주에 잘 시작한 일과 자주 멈춘 일을 보여주면 어떨까.", category: "AI", created: "6월 16일", priority: "낮음", starred: false, status: "아이디어" },
  { id: 7, title: "모바일 타이머 UX", body: "화면을 꺼도 사용자가 실행 흐름을 잃지 않도록 상태를 어떻게 안내할지 조사하기.", category: "디자인", created: "6월 15일", priority: "보통", starred: false, status: "아이디어" },
  { id: 8, title: "README 구조", body: "문제, 해결책, 사용자 플로우, 기술적 선택, 검증 결과 순서로 README 뼈대 작성.", category: "커리어", created: "6월 14일", priority: "낮음", starred: false, status: "완료" },
  { id: 9, title: "AI 추천 실패 사례", body: "너무 크거나 추상적인 추천 결과를 모아서 나쁜 추천 평가셋으로 만들기.", category: "AI", created: "6월 13일", priority: "높음", starred: true, status: "실행 대기" },
  { id: 10, title: "사용자 모집 문구", body: "아이디어는 많지만 시작이 어려운 사람 10명을 모집할 짧은 안내문을 작성하기.", category: "리서치", created: "6월 12일", priority: "보통", starred: false, status: "아이디어" },
  { id: 11, title: "실행 완료 카드", body: "완료 후 사용자가 성취감을 느낄 수 있는 짧은 피드백과 공유 카드 구상.", category: "디자인", created: "6월 11일", priority: "낮음", starred: false, status: "아이디어" },
  { id: 12, title: "Supabase 이벤트 명세", body: "memo_submitted, action_started, action_completed 이벤트 속성을 문서화하기.", category: "개발", created: "6월 10일", priority: "보통", starred: false, status: "완료" },
];

const INITIAL_HISTORY: HistoryItem[] = [
  { id: 101, date: "오늘 · 08:40", action: "사용자 인터뷰 가설 한 문장 작성", step: "확인하고 싶은 불편을 한 줄로 적기", duration: 15, category: "프로젝트", completed: true, reflection: "문제 범위가 넓다는 것을 발견해서 타겟을 부트캠프 수강생으로 좁혔다.", score: 92 },
  { id: 102, date: "어제 · 21:15", action: "추천 프롬프트 출력 형식 고정", step: "action, step, reason 세 필드만 먼저 정의", duration: 24, category: "AI", completed: true, reflection: "구조화된 출력이 UI 연결과 평가에 훨씬 편했다.", score: 88 },
  { id: 103, date: "어제 · 14:05", action: "온보딩 화면 카피 3개 비교", step: "5초 안에 이해되는 문장 세 개 작성", duration: 12, category: "디자인", completed: false, reflection: "중간에 다른 화면 작업으로 이동했다. 다음에는 알림을 끄고 시작한다.", score: 54 },
  { id: 104, date: "6월 19일", action: "GitHub Issue 템플릿 작성", step: "문제와 완료 조건 필드부터 추가", duration: 18, category: "개발", completed: true, reflection: "작업 시작 전 완료 조건이 선명해졌다.", score: 84 },
  { id: 105, date: "6월 18일", action: "사용자 모집 안내문 완성", step: "대상과 소요 시간만 먼저 쓰기", duration: 15, category: "리서치", completed: true, reflection: "길게 설명하지 않아도 모집 목적이 전달됐다.", score: 79 },
  { id: 106, date: "6월 17일", action: "발표 데모 플로우 90초로 줄이기", step: "꼭 보여줄 장면 세 개 선택", duration: 27, category: "프로젝트", completed: true, reflection: "메모 입력, 추천, 실행 완료 세 장면이면 핵심 가치가 보인다.", score: 95 },
  { id: 107, date: "6월 16일", action: "모바일 타이머 레퍼런스 조사", step: "좋은 사례 화면 세 개 저장", duration: 10, category: "디자인", completed: false, reflection: "레퍼런스만 저장하고 기준을 정하지 못했다.", score: 48 },
  { id: 108, date: "6월 15일", action: "Supabase RLS 정책 점검", step: "공개 select 정책 존재 여부 확인", duration: 20, category: "개발", completed: true, reflection: "데모 데이터는 append-only로 제한했다.", score: 90 },
  { id: 109, date: "6월 14일", action: "나쁜 AI 추천 사례 10개 수집", step: "너무 큰 행동 사례 3개부터 적기", duration: 15, category: "AI", completed: true, reflection: "추상적 동사와 긴 소요 시간이 주요 실패 요인이었다.", score: 86 },
  { id: 110, date: "6월 13일", action: "README 첫 구조 만들기", step: "문제, 해결, 검증 제목만 만들기", duration: 15, category: "커리어", completed: true, reflection: "빈 문서의 부담이 줄어서 다음 날 내용을 채울 수 있었다.", score: 82 },
];

const WEEKLY = [
  { label: "월", actions: 2, minutes: 25 },
  { label: "화", actions: 3, minutes: 42 },
  { label: "수", actions: 2, minutes: 31 },
  { label: "목", actions: 4, minutes: 58 },
  { label: "금", actions: 3, minutes: 47 },
  { label: "토", actions: 5, minutes: 73 },
  { label: "일", actions: 4, minutes: 61 },
];
const MONTHLY = [42, 48, 46, 55, 58, 64, 62, 71, 74, 78, 82, 86];
const HEAT = [1, 2, 0, 3, 1, 2, 4, 3, 0, 2, 1, 3, 4, 4, 2, 1, 3, 0, 2, 4, 3, 2, 4, 1, 3, 4, 4, 2];
const SAMPLE_MEMOS = [
  "첫 사용자 인터뷰를 시작해야 하는데 질문을 못 정했다.",
  "포트폴리오 소개 문장을 써야 하는데 계속 미루고 있다.",
  "AI 추천 품질을 높이고 싶은데 무엇부터 검증할지 모르겠다.",
];

function getVisitorId() {
  let id = localStorage.getItem("action-switch-visitor");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("action-switch-visitor", id);
  }
  return id;
}
async function track(eventType: string, metadata: Record<string, unknown> = {}) {
  try {
    await supabase.from("demo_analytics").insert({ visitor_id: getVisitorId(), event_type: eventType, metadata });
  } catch {}
}
function recommend(memo: string): Recommendation {
  if (/인터뷰|사용자|고객|설문/.test(memo)) return { action: "첫 사용자 인터뷰 질문 5개 완성하기", step: "확인하고 싶은 가설 1개를 한 문장으로 적기", reason: "질문보다 먼저 가설을 고정하면 인터뷰 범위가 작아져 바로 시작할 수 있어요.", category: "리서치" };
  if (/포트폴리오|소개|README/.test(memo)) return { action: "대표 프로젝트 소개 문장 완성하기", step: "문제·내 역할·결과라는 제목만 먼저 적기", reason: "완벽한 문장보다 구조를 먼저 만들면 수정 가능한 첫 결과가 생겨요.", category: "커리어" };
  if (/AI|프롬프트|추천/.test(memo)) return { action: "추천 품질을 확인할 테스트 사례 5개 만들기", step: "좋은 추천 1개와 나쁜 추천 1개를 먼저 적기", reason: "평가 사례가 생기면 막연한 개선을 비교 가능한 실험으로 바꿀 수 있어요.", category: "AI" };
  if (/디자인|화면|UI|UX/.test(memo)) return { action: "핵심 화면 와이어프레임 1개 완성하기", step: "사용자가 가장 먼저 눌러야 할 버튼 하나를 표시하기", reason: "시각적 완성도보다 행동 흐름을 먼저 고정하면 다음 디자인 판단이 쉬워져요.", category: "디자인" };
  return { action: "가장 중요한 메모 하나를 실행 문장으로 바꾸기", step: "오늘 끝낼 수 있는 동사 하나에 밑줄 긋기", reason: "행동을 하나로 줄이면 선택 피로가 낮아지고 시작 가능성이 높아져요.", category: "개인" };
}

const card = "rounded-2xl border border-white/10 bg-gradient-to-br from-[#171a31]/90 to-[#0a0b18]/90 shadow-[0_22px_70px_rgba(0,0,0,.22)]";
const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-100 via-violet-300 to-cyan-300 px-5 text-xs font-bold text-slate-950 shadow-[0_12px_35px_rgba(130,100,255,.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40";
const ghost = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.025] px-4 text-xs text-slate-400 transition hover:border-white/20 hover:text-white";

export default function Page() {
  const [view, setView] = useState<View>("today");
  const [phase, setPhase] = useState<Phase>("capture");
  const [memo, setMemo] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [seconds, setSeconds] = useState(900);
  const [running, setRunning] = useState(false);
  const [reflection, setReflection] = useState("");
  const [memos, setMemos] = useState(INITIAL_MEMOS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [selectedMemoId, setSelectedMemoId] = useState<number | null>(1);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(101);
  const [memoSearch, setMemoSearch] = useState("");
  const [memoFilter, setMemoFilter] = useState("전체");
  const [historyFilter, setHistoryFilter] = useState<"전체" | "완료" | "중단">("전체");
  const [quickMemo, setQuickMemo] = useState("");

  const date = useMemo(() => new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(new Date()), []);
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const progress = Math.min(1, Math.max(0, 1 - seconds / 900));

  useEffect(() => {
    if (!running || phase !== "run") return;
    const id = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          setRunning(false);
          setPhase("reflect");
          void track("timer_finished");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, phase]);

  const openView = (next: View) => {
    setView(next);
    void track("navigation_clicked", { view: next });
  };
  const submitMemo = () => {
    if (memo.trim().length < 3) return;
    setRecommendation(recommend(memo));
    setPhase("recommend");
    void track("memo_submitted", { length: memo.length });
  };
  const resetAction = () => {
    setMemo("");
    setRecommendation(null);
    setSeconds(900);
    setRunning(false);
    setReflection("");
    setPhase("capture");
  };
  const completeAction = async () => {
    if (!recommendation) return;
    const duration = Math.max(1, Math.round((900 - seconds) / 60));
    const item: HistoryItem = {
      id: Date.now(),
      date: "방금 전",
      action: recommendation.action,
      step: recommendation.step,
      duration,
      category: recommendation.category,
      completed: true,
      reflection: reflection || "작은 행동을 시작했고 다음 실행의 단서를 남겼다.",
      score: 90,
    };
    setHistory((items) => [item, ...items]);
    try {
      await supabase.from("demo_sessions").insert({
        visitor_id: getVisitorId(),
        memo_text: memo,
        selected_action: recommendation.action,
        five_minute_step: recommendation.step,
        duration_minutes: duration,
        completed: true,
        reflection: item.reflection,
        context: { category: recommendation.category },
      });
    } catch {}
    void track("action_completed", { duration, category: recommendation.category });
    resetAction();
    setView("history");
    setSelectedHistoryId(item.id);
  };
  const runMemo = (item: MemoItem) => {
    setMemo(item.body);
    setRecommendation(recommend(item.body));
    setPhase("recommend");
    setView("today");
    setMemos((items) => items.map((value) => value.id === item.id ? { ...value, status: "실행 대기" } : value));
    void track("archive_memo_to_action", { memoId: item.id });
  };
  const addMemo = () => {
    if (quickMemo.trim().length < 2) return;
    const item: MemoItem = { id: Date.now(), title: quickMemo.trim(), body: quickMemo.trim(), category: "개인", created: "방금 전", priority: "보통", starred: false, status: "아이디어" };
    setMemos((items) => [item, ...items]);
    setSelectedMemoId(item.id);
    setQuickMemo("");
    void track("archive_memo_added");
  };

  const categories = ["전체", ...Array.from(new Set(memos.map((item) => item.category)))];
  const filteredMemos = memos.filter((item) => {
    const query = memoSearch.toLowerCase();
    return (memoFilter === "전체" || item.category === memoFilter) && (!query || `${item.title} ${item.body} ${item.category}`.toLowerCase().includes(query));
  });
  const filteredHistory = history.filter((item) => historyFilter === "전체" || (historyFilter === "완료" ? item.completed : !item.completed));
  const selectedMemo = memos.find((item) => item.id === selectedMemoId) || null;
  const selectedHistory = history.find((item) => item.id === selectedHistoryId) || null;

  return (
    <main className="min-h-screen bg-[#070812] text-[#f7f5ff] [background-image:radial-gradient(circle_at_85%_8%,rgba(118,78,255,.15),transparent_25%),linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] [background-size:auto,52px_52px,52px_52px] lg:grid lg:grid-cols-[248px_1fr]">
      <Sidebar view={view} onChange={openView} memoCount={memos.length} />
      <section className="min-w-0 px-4 pb-8 md:px-8">
        <header className="flex h-16 items-center justify-between border-b border-white/10 md:h-20">
          <div><p className="font-mono text-[8px] tracking-[.18em] text-slate-600">ACTION SWITCH · DEMO</p><strong className="text-xs">{date}</strong></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[.04] px-3 py-2 font-mono text-[8px] text-emerald-300 sm:flex"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#6fe9aa]" />SUPABASE CONNECTED</span><button onClick={() => openView("today")} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.025] lg:hidden"><Zap size={17} /></button></div>
        </header>
        <MobileNav view={view} onChange={openView} />
        {view === "today" && <TodayView phase={phase} memo={memo} setMemo={setMemo} recommendation={recommendation} submitMemo={submitMemo} setPhase={setPhase} seconds={seconds} timer={timer} progress={progress} running={running} setRunning={setRunning} reflection={reflection} setReflection={setReflection} resetAction={resetAction} completeAction={completeAction} />}
        {view === "memos" && <MemoArchive memos={filteredMemos} allCount={memos.length} categories={categories} filter={memoFilter} setFilter={setMemoFilter} search={memoSearch} setSearch={setMemoSearch} selected={selectedMemo} setSelected={setSelectedMemoId} runMemo={runMemo} quickMemo={quickMemo} setQuickMemo={setQuickMemo} addMemo={addMemo} toggleStar={(id) => setMemos((items) => items.map((item) => item.id === id ? { ...item, starred: !item.starred } : item))} />}
        {view === "history" && <HistoryView items={filteredHistory} allItems={history} filter={historyFilter} setFilter={setHistoryFilter} selected={selectedHistory} setSelected={setSelectedHistoryId} />}
      </section>
    </main>
  );
}

function Sidebar({ view, onChange, memoCount }: { view: View; onChange: (view: View) => void; memoCount: number }) {
  const nav = [
    { id: "today" as View, label: "오늘의 실행", icon: LayoutDashboard },
    { id: "memos" as View, label: "메모 보관함", icon: Inbox, count: memoCount },
    { id: "history" as View, label: "실행 기록", icon: BarChart3 },
  ];
  return <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/10 bg-[#070814]/90 p-5 backdrop-blur-2xl lg:flex"><div className="flex items-center gap-3 border-b border-white/10 px-2 pb-6"><b className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-100 via-violet-400 to-cyan-300 text-slate-950"><Zap size={18} /></b><span className="flex flex-col"><strong className="text-xs tracking-[.13em]">ACTION SWITCH</strong><small className="font-mono text-[7px] text-slate-500">THINK LESS. MOVE NOW.</small></span></div><nav className="flex flex-col gap-1 py-6 text-xs">{nav.map(({ id, label, icon: Icon, count }) => <button key={id} onClick={() => onChange(id)} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-left transition ${view === id ? "border border-violet-400/20 bg-gradient-to-r from-violet-500/15 to-transparent text-white" : "border border-transparent text-slate-500 hover:text-slate-300"}`}><Icon size={15} />{label}{count !== undefined && <em className="ml-auto rounded-full bg-white/5 px-2 py-0.5 not-italic">{count}</em>}{view === id && <i className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_#9d87ff]" />}</button>)}</nav><p className="px-2 font-mono text-[8px] tracking-[.15em] text-slate-600">YOUR MOMENTUM</p><div className="mt-2 flex items-center gap-3 rounded-xl border border-amber-300/10 bg-amber-300/[.035] p-3 text-amber-300"><Flame size={17} /><span className="flex flex-col"><strong className="text-[10px] text-amber-100/80">4일 연속 실행 중</strong><small className="text-[8px] text-slate-600">지난주보다 실행률 +14%</small></span></div><div className="flex-1" /><a href="https://app.notion.com/p/386b66e9767781e5a51df29cdf59690e" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.025] p-3 text-[9px] text-slate-400">AI 학습계획서 <ChevronRight size={13} /></a></aside>;
}
function MobileNav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <nav className="my-3 grid grid-cols-3 gap-2 lg:hidden">{[["today", "오늘", LayoutDashboard], ["memos", "메모", Inbox], ["history", "기록", BarChart3]].map(([id, label, Icon]) => { const I = Icon as typeof LayoutDashboard; return <button key={String(id)} onClick={() => onChange(id as View)} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border text-xs ${view === id ? "border-violet-400/30 bg-violet-400/10" : "border-white/10 bg-white/[.02] text-slate-500"}`}><I size={14} />{String(label)}</button>; })}</nav>;
}

function TodayView(props: { phase: Phase; memo: string; setMemo: (value: string) => void; recommendation: Recommendation | null; submitMemo: () => void; setPhase: (value: Phase) => void; seconds: number; timer: string; progress: number; running: boolean; setRunning: (value: boolean) => void; reflection: string; setReflection: (value: string) => void; resetAction: () => void; completeAction: () => void }) {
  const { phase, memo, setMemo, recommendation, submitMemo, setPhase, timer, progress, running, setRunning, reflection, setReflection, resetAction, completeAction } = props;
  return <div className="grid gap-5 py-4 xl:grid-cols-[1.05fr_.95fr] xl:py-6"><section className={`${card} flex min-h-[610px] flex-col justify-center p-6 md:p-10 xl:min-h-[660px] xl:p-14`}>
    {phase === "capture" && <><Label icon={Sparkles}>STEP 01 · CAPTURE</Label><h1 className="my-6 text-[42px] font-bold leading-[1.06] tracking-[-.055em] md:text-[clamp(42px,4.8vw,67px)]">쌓아둔 생각을,<br /><em className="not-italic text-violet-200">오늘의 행동</em>으로.</h1><p className="mb-8 max-w-xl text-[13px] leading-7 text-slate-400">완벽하게 정리하지 않아도 괜찮아요. 머릿속에 걸려 있는 메모를 그대로 적으면 오늘 시작할 한 가지로 줄여드립니다.</p><div className="overflow-hidden rounded-2xl border border-violet-200/20 bg-[#050611]/60"><textarea value={memo} onChange={(event) => setMemo(event.target.value)} maxLength={600} className="min-h-[155px] w-full resize-none bg-transparent p-5 text-[13px] leading-7 outline-none placeholder:text-slate-600" placeholder="예: 팀프로젝트 사용자 인터뷰를 시작해야 하는데 무엇부터 물어볼지 모르겠다." /><div className="flex min-h-14 items-center justify-between border-t border-white/10 px-3 pl-5"><span className="font-mono text-[8px] text-slate-600">{memo.length}/600</span><button className={primary} disabled={memo.trim().length < 3} onClick={submitMemo}><WandSparkles size={15} />오늘의 1개 찾기</button></div></div><div className="mt-4 flex flex-wrap items-center gap-2"><span className="font-mono text-[8px] text-slate-600">QUICK START</span>{SAMPLE_MEMOS.map((sample) => <button key={sample} onClick={() => setMemo(sample)} className="rounded-full border border-white/10 bg-white/[.02] px-3 py-2 text-[8px] text-slate-500 hover:text-slate-300">{sample}</button>)}</div></>}
    {phase === "recommend" && recommendation && <><Label icon={Target}>STEP 02 · ONE ACTION</Label><p className="mt-7 font-mono text-[9px] tracking-widest text-slate-500">오늘의 단 1개</p><h2 className="my-4 text-[clamp(32px,4vw,55px)] font-bold leading-tight tracking-[-.045em]">{recommendation.action}</h2><div className="flex flex-col gap-2 rounded-2xl border border-cyan-300/15 bg-cyan-300/[.045] p-5"><small className="font-mono text-[8px] tracking-widest text-cyan-300">5 MINUTE FIRST STEP</small><strong className="text-sm">{recommendation.step}</strong></div><p className="my-6 text-xs leading-6 text-slate-400">{recommendation.reason}</p><div className="flex flex-wrap gap-3"><button className={primary} onClick={() => { setPhase("run"); setRunning(true); void track("action_started"); }}><Play size={16} />15분 실행 시작</button><button className={ghost} onClick={resetAction}><RotateCcw size={15} />다시 적기</button></div></>}
    {phase === "run" && recommendation && <><Label icon={Clock3}>STEP 03 · 15 MINUTE ACTION</Label><p className="mt-7 font-mono text-[9px] text-slate-500">지금은 이것만 실행합니다</p><h2 className="my-4 text-[clamp(30px,3.5vw,50px)] font-bold tracking-[-.04em]">{recommendation.action}</h2><div className="my-6 rounded-2xl border border-white/10 bg-[#050611]/55 p-6"><div className="flex items-end justify-between"><strong className="font-mono text-5xl tracking-[-.06em]">{timer}</strong><span className="font-mono text-[9px] text-slate-500">{Math.round(progress * 100)}%</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-300 transition-all" style={{ width: `${progress * 100}%` }} /></div><p className="mt-4 text-[11px] text-slate-400">첫 행동 · {recommendation.step}</p></div><div className="flex flex-wrap gap-3"><button className={primary} onClick={() => setRunning(!running)}>{running ? <Pause size={16} /> : <Play size={16} />}{running ? "잠시 멈춤" : "계속하기"}</button><button className={ghost} onClick={() => { setRunning(false); setPhase("reflect"); void track("completed_early"); }}><Check size={15} />완료 처리</button></div></>}
    {phase === "reflect" && <><Label icon={CheckCircle2}>STEP 04 · REFLECT</Label><h2 className="my-5 text-[clamp(32px,4vw,55px)] font-bold leading-tight tracking-[-.045em]">생각 하나가<br /><em className="not-italic text-emerald-200">행동으로 바뀌었어요.</em></h2><p className="mb-6 text-[13px] leading-7 text-slate-400">완벽하게 끝내지 않아도 괜찮습니다. 시작한 사실과 다음 단서를 짧게 남겨주세요.</p><textarea className="mb-5 min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-[#050611]/60 p-5 text-xs outline-none placeholder:text-slate-600" value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="무엇을 시작했고, 다음에는 무엇을 하면 될까요?" /><button className={primary} onClick={completeAction}><Check size={16} />기록하고 성취 확인</button></>}
  </section><AchievementPanel /></div>;
}

function AchievementPanel() {
  return <aside className={`${card} flex min-h-[610px] flex-col p-5 md:p-6 xl:min-h-[660px]`}><div className="flex items-start justify-between"><div><p className="font-mono text-[8px] tracking-[.18em] text-slate-600">WEEKLY GROWTH</p><h2 className="mt-2 text-lg font-semibold">이번 주 성취도</h2></div><span className="flex items-center gap-1 rounded-full border border-emerald-300/15 bg-emerald-300/[.05] px-3 py-2 font-mono text-[8px] text-emerald-300"><TrendingUp size={12} />+18%</span></div><div className="mt-5 grid grid-cols-2 gap-2"><Stat icon={ListChecks} label="실행 시작" value="23" change="+6" /><Stat icon={Clock3} label="집중 시간" value="337m" change="+28%" /><Stat icon={Target} label="완료율" value="82%" change="+14%p" /><Stat icon={Flame} label="연속 실행" value="4일" change="최고 7일" /></div><div className="mt-4 rounded-2xl border border-white/10 bg-[#070812]/55 p-4"><div className="mb-3 flex items-center justify-between"><span><small className="font-mono text-[7px] text-slate-600">MOMENTUM SCORE</small><strong className="mt-1 block text-2xl">86</strong></span><span className="text-right text-[9px] leading-5 text-slate-500">12주 중<br /><b className="text-violet-200">최고 기록</b></span></div><TrendChart values={MONTHLY} /></div><div className="mt-4 rounded-2xl border border-white/10 bg-[#070812]/55 p-4"><div className="mb-4 flex items-center justify-between"><strong className="text-xs">요일별 실행량</strong><small className="font-mono text-[8px] text-slate-600">ACTIONS / DAY</small></div><WeeklyBars /></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-2xl border border-amber-300/10 bg-amber-300/[.035] p-4"><Trophy size={17} className="text-amber-300" /><strong className="mt-3 block text-xs">주간 목표 77%</strong><p className="mt-1 text-[9px] leading-5 text-slate-500">30개 중 23개 행동을 시작했어요.</p><div className="mt-3 h-1.5 rounded-full bg-white/5"><div className="h-full w-[77%] rounded-full bg-gradient-to-r from-amber-300 to-orange-300" /></div></div><div className="rounded-2xl border border-violet-300/10 bg-violet-300/[.035] p-4"><ArrowUpRight size={17} className="text-violet-300" /><strong className="mt-3 block text-xs">다음 마일스톤</strong><p className="mt-1 text-[9px] leading-5 text-slate-500">2회 더 실행하면 `7일 루틴` 배지를 획득합니다.</p></div></div></aside>;
}

function MemoArchive(props: { memos: MemoItem[]; allCount: number; categories: string[]; filter: string; setFilter: (value: string) => void; search: string; setSearch: (value: string) => void; selected: MemoItem | null; setSelected: (id: number) => void; runMemo: (item: MemoItem) => void; quickMemo: string; setQuickMemo: (value: string) => void; addMemo: () => void; toggleStar: (id: number) => void }) {
  const { memos, allCount, categories, filter, setFilter, search, setSearch, selected, setSelected, runMemo, quickMemo, setQuickMemo, addMemo, toggleStar } = props;
  return <div className="py-4 xl:py-6"><div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Label icon={Inbox}>MEMO ARCHIVE</Label><h1 className="mt-3 text-3xl font-bold tracking-[-.04em]">쌓아둔 생각을<br className="sm:hidden" /> 실행 후보로 관리하세요.</h1><p className="mt-3 text-xs text-slate-500">총 {allCount}개의 메모 · 별표, 검색, 필터, 오늘 실행 보내기가 동작합니다.</p></div><div className="flex w-full max-w-lg gap-2"><input value={quickMemo} onChange={(event) => setQuickMemo(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addMemo()} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[.025] px-4 text-xs outline-none placeholder:text-slate-600" placeholder="새 메모 빠르게 추가" /><button className={primary} onClick={addMemo}><Plus size={15} />추가</button></div></div><div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="relative w-full md:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[.025] pl-9 pr-4 text-xs outline-none" placeholder="제목, 내용, 카테고리 검색" /></div><div className="flex gap-2 overflow-x-auto pb-1">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={`shrink-0 rounded-full border px-3 py-2 text-[9px] ${filter === category ? "border-violet-300/30 bg-violet-300/10 text-violet-200" : "border-white/10 text-slate-500"}`}>{category}</button>)}</div></div><div className="grid gap-4 xl:grid-cols-[1fr_380px]"><section className={`${card} overflow-hidden`}><div className="grid grid-cols-[1fr_auto] border-b border-white/10 px-5 py-4 font-mono text-[8px] text-slate-600"><span>MEMO LIST · {memos.length}</span><span>클릭해서 상세보기</span></div><div className="max-h-[650px] divide-y divide-white/[.07] overflow-y-auto">{memos.map((item) => <button key={item.id} onClick={() => { setSelected(item.id); void track("memo_opened", { memoId: item.id }); }} className={`grid w-full grid-cols-[1fr_auto] gap-4 p-5 text-left transition hover:bg-white/[.025] ${selected?.id === item.id ? "bg-violet-400/[.06]" : ""}`}><span><span className="flex flex-wrap items-center gap-2"><strong className="text-sm">{item.title}</strong>{item.starred && <Star size={12} className="fill-amber-300 text-amber-300" />}<Badge>{item.category}</Badge></span><p className="mt-2 line-clamp-2 text-[10px] leading-5 text-slate-500">{item.body}</p><small className="mt-3 block font-mono text-[8px] text-slate-700">{item.created}</small></span><span className="flex flex-col items-end gap-3"><Status value={item.status} /><ChevronRight size={14} className="text-slate-700" /></span></button>)}{memos.length === 0 && <div className="p-14 text-center text-xs text-slate-500">검색 결과가 없습니다.</div>}</div></section><aside className={`${card} min-h-[430px] p-6`}>{selected ? <><div className="flex items-center justify-between"><Status value={selected.status} /><button onClick={() => toggleStar(selected.id)} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10"><Star size={15} className={selected.starred ? "fill-amber-300 text-amber-300" : "text-slate-600"} /></button></div><h2 className="mt-6 text-2xl font-bold tracking-[-.04em]">{selected.title}</h2><p className="mt-4 text-xs leading-7 text-slate-400">{selected.body}</p><div className="my-6 grid grid-cols-2 gap-2"><Info label="카테고리" value={selected.category} /><Info label="우선순위" value={selected.priority} /><Info label="저장 시간" value={selected.created} /><Info label="상태" value={selected.status} /></div><button className={`${primary} w-full`} onClick={() => runMemo(selected)}><Play size={15} />오늘의 실행으로 보내기</button><button className={`${ghost} mt-2 w-full`} onClick={() => toggleStar(selected.id)}><Star size={14} />{selected.starred ? "별표 해제" : "중요 메모로 표시"}</button></> : <div className="grid min-h-[350px] place-content-center text-center"><Archive className="mx-auto text-slate-700" /><p className="mt-4 text-xs text-slate-500">메모를 선택하면 상세 내용이 표시됩니다.</p></div>}</aside></div></div>;
}

function HistoryView({ items, allItems, filter, setFilter, selected, setSelected }: { items: HistoryItem[]; allItems: HistoryItem[]; filter: "전체" | "완료" | "중단"; setFilter: (value: "전체" | "완료" | "중단") => void; selected: HistoryItem | null; setSelected: (id: number | null) => void }) {
  const completed = allItems.filter((item) => item.completed).length;
  const minutes = allItems.reduce((sum, item) => sum + item.duration, 0);
  return <div className="py-4 xl:py-6"><div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><Label icon={BarChart3}>EXECUTION HISTORY</Label><h1 className="mt-3 text-3xl font-bold tracking-[-.04em]">작은 시작이 쌓인<br className="sm:hidden" /> 변화를 확인하세요.</h1></div><div className="flex gap-2">{(["전체", "완료", "중단"] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-full border px-4 py-2 text-[9px] ${filter === value ? "border-violet-300/30 bg-violet-300/10 text-violet-200" : "border-white/10 text-slate-500"}`}>{value}</button>)}</div></div><div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi label="누적 실행" value={`${allItems.length}회`} change="지난주 +6" icon={ListChecks} /><Kpi label="완료율" value={`${Math.round((completed / allItems.length) * 100)}%`} change="+14%p" icon={Target} /><Kpi label="누적 시간" value={`${minutes}분`} change="+28%" icon={Clock3} /><Kpi label="현재 연속" value="4일" change="최고 7일" icon={Flame} /></div><div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]"><section className={`${card} p-5`}><div className="flex items-center justify-between"><div><small className="font-mono text-[8px] text-slate-600">12-WEEK TREND</small><h2 className="mt-1 text-sm font-semibold">실행 성취도 상승 추이</h2></div><span className="flex items-center gap-1 text-xs text-emerald-300"><TrendingUp size={14} />+44점</span></div><div className="mt-6"><TrendChart values={MONTHLY} tall /></div><div className="mt-6 border-t border-white/10 pt-5"><div className="mb-4 flex items-center justify-between"><strong className="text-xs">최근 4주 활동 히트맵</strong><small className="font-mono text-[8px] text-slate-600">LESS → MORE</small></div><div className="grid grid-cols-7 gap-2">{HEAT.map((value, index) => <button key={index} title={`${value}회 실행`} className={`aspect-square rounded-[5px] border border-white/[.04] ${["bg-white/[.025]", "bg-violet-400/15", "bg-violet-400/30", "bg-violet-400/50", "bg-cyan-300/70"][value]}`} />)}</div></div></section><section className={`${card} p-5`}><div className="flex items-center justify-between"><div><small className="font-mono text-[8px] text-slate-600">WEEKLY BREAKDOWN</small><h2 className="mt-1 text-sm font-semibold">요일별 집중 시간</h2></div><CalendarDays size={17} className="text-slate-600" /></div><div className="mt-7"><WeeklyBars showMinutes /></div><div className="mt-7 rounded-2xl border border-emerald-300/10 bg-emerald-300/[.035] p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-300"><Trophy size={18} /></span><span><small className="font-mono text-[8px] text-emerald-300">NEW PERSONAL BEST</small><strong className="mt-1 block text-sm">토요일 73분 집중</strong></span></div><p className="mt-4 text-[10px] leading-5 text-slate-500">지난주 최고 기록보다 18분 늘었습니다. 가장 잘 시작되는 시간은 토요일 오전입니다.</p></div></section></div><div className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]"><section className={`${card} overflow-hidden`}><div className="border-b border-white/10 px-5 py-4 font-mono text-[8px] text-slate-600">RECENT ACTIONS · {items.length}</div><div className="divide-y divide-white/[.07]">{items.map((item) => <button key={item.id} onClick={() => { setSelected(selected?.id === item.id ? null : item.id); void track("history_opened", { historyId: item.id }); }} className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 p-5 text-left transition hover:bg-white/[.025] ${selected?.id === item.id ? "bg-violet-400/[.06]" : ""}`}><span className={`grid h-9 w-9 place-items-center rounded-full ${item.completed ? "bg-emerald-300/10 text-emerald-300" : "bg-amber-300/10 text-amber-300"}`}>{item.completed ? <Check size={15} /> : <Pause size={14} />}</span><span><strong className="text-xs">{item.action}</strong><small className="mt-2 block text-[9px] text-slate-600">{item.date} · {item.duration}분 · {item.category}</small></span><span className="flex items-center gap-2"><b className={`font-mono text-sm ${item.score >= 80 ? "text-emerald-300" : "text-amber-300"}`}>{item.score}</b><ChevronDown size={13} className={`text-slate-600 transition ${selected?.id === item.id ? "rotate-180" : ""}`} /></span></button>)}</div></section><aside className={`${card} min-h-[360px] p-6`}>{selected ? <><div className="flex items-center justify-between"><Badge>{selected.category}</Badge><span className={`font-mono text-xl ${selected.score >= 80 ? "text-emerald-300" : "text-amber-300"}`}>{selected.score}</span></div><h2 className="mt-6 text-xl font-bold leading-8 tracking-[-.03em]">{selected.action}</h2><div className="mt-5 rounded-xl border border-cyan-300/10 bg-cyan-300/[.03] p-4"><small className="font-mono text-[7px] text-cyan-300">FIRST STEP</small><p className="mt-2 text-[10px] leading-5 text-slate-400">{selected.step}</p></div><div className="my-5 grid grid-cols-2 gap-2"><Info label="실행 시간" value={`${selected.duration}분`} /><Info label="완료 상태" value={selected.completed ? "완료" : "중단"} /></div><small className="font-mono text-[8px] text-slate-600">REFLECTION</small><p className="mt-2 text-[10px] leading-6 text-slate-400">{selected.reflection}</p></> : <div className="grid min-h-[300px] place-content-center text-center"><BarChart3 className="mx-auto text-slate-700" /><p className="mt-4 text-xs text-slate-500">실행 기록을 누르면 회고와 점수를 볼 수 있습니다.</p></div>}</aside></div></div>;
}

function TrendChart({ values, tall = false }: { values: number[]; tall?: boolean }) {
  const width = 640, height = tall ? 240 : 120, padding = 12;
  const min = Math.min(...values) - 5, max = Math.max(...values) + 4;
  const points = values.map((value, index) => ({ x: padding + (index * (width - padding * 2)) / (values.length - 1), y: height - padding - ((value - min) / (max - min)) * (height - padding * 2) }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;
  return <svg viewBox={`0 0 ${width} ${height}`} className={`w-full ${tall ? "h-56" : "h-28"}`} role="img" aria-label="성취도 상승 추이 그래프"><defs><linearGradient id={`area-${tall}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity=".38" /><stop offset="100%" stopColor="#67e8f9" stopOpacity="0" /></linearGradient><linearGradient id={`line-${tall}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#67e8f9" /></linearGradient></defs>{[.25, .5, .75].map((ratio) => <line key={ratio} x1="0" x2={width} y1={height * ratio} y2={height * ratio} stroke="rgba(255,255,255,.06)" />)}<path d={area} fill={`url(#area-${tall})`} /><path d={line} fill="none" stroke={`url(#line-${tall})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{points.map((point, index) => index === points.length - 1 || (tall && index % 3 === 0) ? <circle key={index} cx={point.x} cy={point.y} r={index === points.length - 1 ? 6 : 3} fill={index === points.length - 1 ? "#67e8f9" : "#a78bfa"} stroke="#0a0b18" strokeWidth="3" /> : null)}</svg>;
}
function WeeklyBars({ showMinutes = false }: { showMinutes?: boolean }) {
  const max = Math.max(...WEEKLY.map((item) => showMinutes ? item.minutes : item.actions));
  return <div className="flex h-32 items-end gap-2">{WEEKLY.map((item, index) => { const value = showMinutes ? item.minutes : item.actions; return <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="font-mono text-[7px] text-slate-600">{value}{showMinutes ? "m" : ""}</span><div className={`w-full max-w-8 rounded-t-md ${index === 5 ? "bg-gradient-to-t from-amber-400/50 to-amber-200" : "bg-gradient-to-t from-violet-500/40 to-cyan-300/80"}`} style={{ height: `${Math.max(12, (value / max) * 88)}%` }} /><small className="font-mono text-[8px] text-slate-600">{item.label}</small></div>; })}</div>;
}
function Stat({ icon: Icon, label, value, change }: { icon: typeof Clock3; label: string; value: string; change: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.018] p-4"><div className="flex items-center justify-between"><Icon size={14} className="text-violet-300" /><small className="font-mono text-[7px] text-emerald-300">{change}</small></div><strong className="mt-4 block font-mono text-2xl">{value}</strong><span className="text-[8px] text-slate-600">{label}</span></div>; }
function Kpi({ icon: Icon, label, value, change }: { icon: typeof Clock3; label: string; value: string; change: string }) { return <div className={`${card} flex items-center gap-4 p-4`}><span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-300/[.07] text-violet-300"><Icon size={18} /></span><span><small className="font-mono text-[7px] text-slate-600">{label}</small><strong className="mt-1 block text-xl">{value}</strong></span><em className="ml-auto rounded-full bg-emerald-300/[.06] px-2 py-1 font-mono text-[7px] not-italic text-emerald-300">{change}</em></div>; }
function Label({ icon: Icon, children }: { icon: typeof Sparkles; children: React.ReactNode }) { return <div className="flex items-center gap-2 font-mono text-[9px] tracking-[.15em] text-violet-400"><Icon size={15} />{children}</div>; }
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-violet-300/15 bg-violet-300/[.05] px-2 py-1 font-mono text-[7px] text-violet-300">{children}</span>; }
function Status({ value }: { value: MemoItem["status"] }) { const style = value === "완료" ? "border-emerald-300/15 bg-emerald-300/[.05] text-emerald-300" : value === "실행 대기" ? "border-amber-300/15 bg-amber-300/[.05] text-amber-300" : "border-white/10 bg-white/[.02] text-slate-500"; return <span className={`rounded-full border px-2 py-1 font-mono text-[7px] ${style}`}>{value}</span>; }
function Info({ label, value }: { label: string; value: string }) { return <span className="rounded-xl border border-white/10 bg-white/[.02] p-3"><small className="font-mono text-[7px] text-slate-600">{label}</small><strong className="mt-2 block text-[10px]">{value}</strong></span>; }
