import { NextResponse } from "next/server";
import Brainstorming from "@/models/Brainstorming";
import connect from "@/utils/connect";

// export async function POST(req, { params }) {
//   await connect();
//   const data = await req.json();
//   try {
//     const brainstorming = await Brainstorming.findOne({
//       _id: params.id,
//       "ideas._id": params.ideaId,
//     }).exec();
//     if (!brainstorming) {
//       return new NextResponse(
//         JSON.stringify({ message: "Idea or session not found" }),
//         { status: 404 }
//       );
//     }

//     const idea = brainstorming.ideas.id(params.ideaId);
//     idea.comments.push(data);
//     await brainstorming.save();

//     return new NextResponse(JSON.stringify(idea), { status: 200 });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ message: error.message }), {
//       status: 500,
//     });
//   }
// }

export async function POST(req, { params }) {
  await connect();

  // Ambil content, author, dan imageUrl dari body request
  const { content, author, imageUrl } = await req.json();

  try {
    // Cari sesi brainstorming dan idea berdasarkan ID
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

    // Dapatkan idea dari brainstorming session
    const idea = brainstorming.ideas.id(params.ideaId);

    // Buat objek komentar baru dengan content, author, dan imageUrl
    const newComment = {
      content,
      author,
      image: imageUrl || null, // Tambahkan URL gambar jika ada
      createdAt: new Date(),
    };

    // Tambahkan komentar baru ke dalam idea
    idea.comments.push(newComment);

    // Simpan perubahan pada brainstorming session
    await brainstorming.save();

    // Kembalikan response dengan status 200 dan komentar baru
    return new NextResponse(JSON.stringify(newComment), { status: 200 });
  } catch (error) {
    // Tangani error dan kembalikan response dengan status 500
    return new NextResponse(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
