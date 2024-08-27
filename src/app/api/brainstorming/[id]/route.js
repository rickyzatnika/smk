import Brainstorming from "@/models/Brainstorming";
import connect from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req = NextRequest, { params: { id } }) {
  await connect();

  // Mendapatkan token dari next-auth
  const token = await getToken({ req });
  const userId = token?._id; // Mendapatkan user ID dari token

  if (!userId) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const sessions = await Brainstorming.findById(id);

    if (!sessions) {
      return new NextResponse(
        JSON.stringify({ message: "Session not found" }),
        { status: 404 }
      );
    }

    // Cek apakah user sudah melihat sesi ini berdasarkan user ID
    if (!sessions.viewedBy.includes(userId)) {
      // Jika belum, tambahkan views dan user ID
      sessions.views += 1;
      sessions.viewedBy.push(userId);
      await sessions.save();
    }

    return new NextResponse(JSON.stringify(sessions), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req = NextRequest, { params: { id } }) {
  await connect();

  try {
    await Brainstorming.findByIdAndDelete(id);
    return new NextResponse(JSON.stringify("deleted Successfully"), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error.message), { status: 500 });
  }
}