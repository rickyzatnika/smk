import Brainstorming from "@/models/Brainstorming";
import connect from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req = NextRequest) => {
  await connect();
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    let sessions;

    if (query) {
      const searchRegex = new RegExp(query, "i"); // Case-insensitive search
      sessions = await Brainstorming.find({
        $or: [{ title: searchRegex }, { creator: searchRegex }],
      });
    } else {
      sessions = await Brainstorming.find({});
    }

    return new NextResponse(JSON.stringify({ sessions, success: true }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "internal server error" }),
      {
        status: 500,
      }
    );
  }
};

export async function POST(req = NextRequest) {
  try {
    await connect();
    const data = await req.json();

    const newSession = new Brainstorming({
      title: data.title,
      description: data.description,
      creator: data.creator,
    });

    await newSession.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Sesi brainstorming berhasil dibuat",
        session: newSession,
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Gagal membuat sesi", error: error.message }),
      {
        status: 500,
      }
    );
  }
}
