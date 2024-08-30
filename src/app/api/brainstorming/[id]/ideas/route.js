import { NextRequest, NextResponse } from "next/server";
import Brainstorming from "@/models/Brainstorming";
import connect from "@/utils/connect";

export async function POST(req = NextRequest, { params }) {
  await connect();
  const { content, author, imageUrl } = await req.json();
  try {
    const brainstorming = await Brainstorming.findById(params.id).exec();
    if (!brainstorming) {
      return new NextResponse(
        JSON.stringify({ message: "Session not found" }),
        { status: 404 }
      );
    }

    const newIdea = {
      content,
      author,
      image: imageUrl || null,
      createdAt: new Date(),
    };

    brainstorming.ideas.push(newIdea);
    await brainstorming.save();
    return new NextResponse(JSON.stringify(newIdea), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
