import News from "@/models/News";
import connect from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req = NextRequest, { params }) {
  await connect();
  const { slug } = params;

  try {
    const news = await News.findOne({ slug });

    if (!news) {
      return new NextResponse(JSON.stringify({ message: "News not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(news), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
