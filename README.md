# 정보처리 오프라인 훈련 PRD 웹앱 (Next.js)

## 특징
- Next.js 14 + React 18 + TailwindCSS
- Leaflet 맵: 기준 위치(지도 클릭) · 과정별 마커/툴팁 · 거리 계산
- 필기/실기 토글 필터, 로컬스토리지에 기준 좌표 저장
- 미니맵 썸네일이 있는 카드 리스트, 지도 선택 연동
- API: `/api/courses` 샘플 반환 (고용24 OPEN-API 호출로 교체)

## 실행
```bash
cd prd-app
npm install
npm run dev    # http://localhost:3000
```

## 배포 (GitHub Pages / Vercel)
- 정적 export가 아니라 Node 런타임이 필요한 Next.js 앱입니다. Vercel/Render/Cloudflare Pages(Functions) 등을 추천합니다.
- Vercel: 리포지토리 연결 후 빌드 커맨드 `npm run build`, output 자동 인식.

## 실제 데이터 연동 힌트
`app/api/courses/route.ts`에서 고용24 OPEN-API를 호출해 `Course` 타입 배열로 변환해 반환하세요.

```ts
// 예시 개요 (추가 인증키 필요)
export async function GET() {
  const res = await fetch(HRD_URL_WITH_QUERY, { cache: "no-store" });
  const raw = await res.json();
  const mapped: Course[] = raw.HRDNet.srchList.scn_list.map(mapper);
  return NextResponse.json(mapped);
}
```

## 타입
`Course` 필드:
- id, title, addr, lat, lng, start, end, cost, seats, status(`모집중|접수중|마감임박|마감`), mode(`필기|실기`)

## 라이선스
개인/팀 내부 PRD 용도로 자유롭게 수정하세요.
