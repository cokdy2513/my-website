export function Header() {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4">
      <div>
        <p className="text-accent text-xs font-semibold">고용24 OPEN-API 활용</p>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          정보처리기사 필기·실기 오프라인 과정 모니터링
        </h1>
        <p className="text-muted text-sm sm:text-base">
          제목에 “정보처리/정보처리기사”가 포함된 서울·경기·인천 오프라인/집체 과정만 필터링해
          거리순으로 보여줍니다.
        </p>
      </div>
      <div className="pill">오프라인(M1001) · 수도권(11/28/41)</div>
    </header>
  );
}
