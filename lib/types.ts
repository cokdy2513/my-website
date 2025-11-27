export type Course = {
  id: string;
  title: string;
  addr: string;
  lat: number;
  lng: number;
  start: string;
  end: string;
  cost: string;
  seats: number;
  status: "모집중" | "접수중" | "마감임박" | "마감";
  mode: "필기" | "실기";
};
