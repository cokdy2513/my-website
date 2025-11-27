import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "정보처리 오프라인 훈련 알림",
  description: "서울·경기·인천 정보처리기사 필기/실기 오프라인 과정 모니터링",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
