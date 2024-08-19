import Murid from "@/models/Murid";
import connect from "@/utils/connect";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req = NextRequest) => {
  await connect();
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    let riders;

    if (query) {
      const searchRegex = new RegExp(query, "i"); // Case-insensitive search
      riders = await Murid.find({
        $or: [{ name: searchRegex }, { kis: searchRegex }],
      });
    } else {
      riders = await Murid.find({});
    }

    return new NextResponse(JSON.stringify({ riders, success: true }), {
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

export const POST = async (req = NextRequest) => {
  await connect();

  const {
    name,
    address,
    ttl,
    phone,
    school,
    parentName,
    parentJob,
    img,
    recaptchaToken,
  } = await req.json();

  try {
    // if (!recaptchaToken) {
    //   return new NextResponse(
    //     JSON.stringify({ message: "Invalid reCAPTCHA" }),
    //     { status: 400 }
    //   );
    // }

    const newMurid = new Murid({
      name,
      address,
      ttl,
      phone,
      school,
      parentName,
      parentJob,
      img,
    });
    const savedMurid = await newMurid.save();

    // Return the ID of the new rider
    return new NextResponse(
      JSON.stringify({ success: true, muridId: savedMurid._id }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error.message);
    return new NextResponse(
      JSON.stringify({ message: "Mohon maaf, ada kesalahan pada server" }),
      { status: 500 }
    );
  }
};

// FOR PAGINATION
// const url = new URL(req.url);
// const query = url.searchParams.get("q")?.trim();
// const page = parseInt(url.searchParams.get("page")) || 1;
// const limit = parseInt(url.searchParams.get("limit")) || 10;
// const skip = (page - 1) * limit;

// let riders;
// let totalItems;

// if (query) {
//   const searchRegex = new RegExp(query, "i");
//   riders = await Riders.find({
//     $or: [{ name: searchRegex }, { kis: searchRegex }],
//   })
//     .sort({ name: 1 }) // Mengurutkan berdasarkan nama secara ascending
//     .skip(skip)
//     .limit(limit);
//   totalItems = await Riders.countDocuments({
//     $or: [{ name: searchRegex }, { kis: searchRegex }],
//   });
// } else {
//   riders = await Riders.find({})
//     .sort({ name: 1 }) // Mengurutkan berdasarkan nama secara ascending
//     .skip(skip)
//     .limit(limit);
//   totalItems = await Riders.countDocuments({});
// }
