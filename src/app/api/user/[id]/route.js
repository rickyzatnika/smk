import Users from "@/models/Users";
import connect from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, { params: { id } }) {
  await connect();

  try {
    const rider = await Users.findById(id);

    return new NextResponse(JSON.stringify(rider), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error.message), { status: 500 });
  }
}

export async function PUT(req = NextRequest, { params: { id } }) {
  await connect();
  const body = await req.json();

  try {
    // Cek apakah nama sudah ada pada database
    const existingUser = await Users.findOne({
      name: name,
      _id: { $ne: id },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Nama sudah terdaftar",
        }),
        { status: 400 }
      );
    }

    const updateUser = await Users.findByIdAndUpdate(
      id,
      { $set: { ...body } },
      { new: true }
    );

    return new NextResponse(JSON.stringify(updateUser), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error.message), { status: 500 });
  }
}

export async function DELETE(req = NextRequest, { params: { id } }) {
  await connect();

  try {
    await Users.findByIdAndDelete(id);
    return new NextResponse(JSON.stringify("deleted Successfully"), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error.message), { status: 500 });
  }
}
