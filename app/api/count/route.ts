import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const count = await fetch(
      `${process.env.NEXT_PUBLIC_API ?? ""}/count/tuimu`
    ).then((res) => res.json());
    return NextResponse.json({ ...count });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
