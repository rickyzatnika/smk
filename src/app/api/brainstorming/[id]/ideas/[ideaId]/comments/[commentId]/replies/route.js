import { NextResponse } from "next/server";
import Brainstorming from "@/models/Brainstorming";
import connect from "@/utils/connect";

export async function POST(req, { params }) {
  await connect();

  const { content, author, imageUrl } = await req.json();

  // console.log("Received params:", params);
  // console.log("Request Body:", { content, author });

  try {
    const brainstorming = await Brainstorming.findOne({
      _id: params.id,
      "ideas._id": params.ideaId,
    }).exec();

    if (!brainstorming) {
      return new NextResponse(
        JSON.stringify({ message: "Idea or session not found" }),
        { status: 404 }
      );
    }

    const idea = brainstorming.ideas.id(params.ideaId);
    const comment = idea.comments.id(params.commentId);

    if (!idea) {
      return new NextResponse(JSON.stringify({ message: "Idea not found" }), {
        status: 404,
      });
    }

    if (!comment) {
      return new NextResponse(
        JSON.stringify({ message: "Comment not found" }),
        { status: 404 }
      );
    }

    const newReply = {
      content,
      author,
      image: imageUrl,
      createdAt: new Date(),
    };

    comment.replies.push(newReply);
    await brainstorming.save();

    return new NextResponse(JSON.stringify(comment), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
