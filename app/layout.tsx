import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Action Switch — 생각을 행동으로",
  description: "쌓인 메모에서 오늘 실행할 단 하나의 작은 행동을 찾는 AI 실행 보조 서비스 데모",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
