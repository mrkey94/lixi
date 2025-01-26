import dbConnect from "@/lib/mongo-connect";
import lixi from "@/model/lixi.model";
import { NextResponse } from "next/server";
export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    await dbConnect();
    const { amount } = body;
    if (!amount) {
      return NextResponse.json({ message: "Amount is required" });
    }

    if (!Array.isArray(amount) || amount.length !== 2) {
      return NextResponse.json({ message: "Amount must be an array" });
    }

    if (amount[0] < 10 || amount[1] > 500) {
      return NextResponse.json({
        message: "Amount range must be between 10 and 500",
      });
    }
    const created = await lixi.create({
      from: amount[0],
      to: amount[1],
    });
    const saved = await created.save();
    if (!saved?._id) {
      return NextResponse.json({ message: "Error creating room" });
    }

    return NextResponse.json({ id: saved._id });
  } catch {
    return NextResponse.json({ message: "Error" });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    await dbConnect();
    const lixis = await lixi.findById(id);

    return NextResponse.json({
      from: lixis.from * 1000,
      to: lixis.to * 1000,
    });
  } catch {
    return NextResponse.json({ message: "Error" });
  }
}
