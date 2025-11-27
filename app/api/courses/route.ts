import { sampleCourses } from "@/lib/sampleCourses";
import { NextResponse } from "next/server";

export async function GET() {
  // 실제 서비스에서는 여기서 고용24 OPEN-API를 호출하고 변환한 결과를 반환하세요.
  return NextResponse.json(sampleCourses);
}
