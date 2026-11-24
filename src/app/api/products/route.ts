import { NextResponse } from "next/server";

export function GET() {
  const userName = "abdallah";
  return NextResponse.json({
    message: "success",
    data: {
      userName,
    },
  });
}
