import Murid from "@/models/Murid";
import connect from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, { params: { id } }) {
  await connect();

  try {
    const murid = await Murid.findById(id);

    return new NextResponse(JSON.stringify(murid), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error.message), { status: 500 });
  }
}

// Edit
// export async function PUT(req = NextRequest, { params: { id } }) {
//   await connect();
//   const body = await req.json();

//   try {
//     // Misalnya, jika hanya ingin mengupdate status pembayaran
//     if (body.hasOwnProperty("isPayment")) {
//       const updateRider = await Riders.findByIdAndUpdate(
//         id,
//         { $set: { isPayment: body.isPayment } },
//         { new: true }
//       );
//       return new NextResponse(JSON.stringify(updateRider), { status: 200 });
//     }

//     // Jika ingin mengupdate nomor start dan raceClass
//     const { numberStart, raceClass } = body;

//     // Cek apakah nomor start sudah digunakan oleh pembalap lain
//     const existingRider = await Riders.findOne({
//       numberStart,
//       _id: { $ne: id },
//     });

//     if (existingRider) {
//       return new NextResponse(
//         JSON.stringify({
//           message: "Nomor start sudah digunakan oleh pembalap lain",
//         }),
//         { status: 400 }
//       );
//     }

//     // Hitung totalPrice jika raceClass tidak kosong
//     const totalPrice =
//       raceClass && raceClass.length > 0
//         ? raceClass.reduce((total, item) => total + item.price, 0)
//         : 0;

//     const updateRider = await Riders.findByIdAndUpdate(
//       id,
//       { $set: { ...body, totalPrice } },
//       { new: true }
//     );

//     return new NextResponse(JSON.stringify(updateRider), { status: 200 });
//   } catch (error) {
//     console.error("Error during PUT request:", error);
//     return new NextResponse(
//       JSON.stringify({ message: "Mohon maaf ada kesalahan pada server!" }),
//       { status: 500 }
//     );
//   }
// }

export async function PUT(req = NextRequest, { params: { id } }) {
  await connect();
  const body = await req.json();

  try {
    // Hitung totalPrice jika raceClass tidak kosong

    const updateRider = await Murid.findByIdAndUpdate(
      id,
      { $set: { ...body } },
      { new: true }
    );

    return new NextResponse(JSON.stringify(updateRider), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Mohon maaf ada kesalahan server!" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req = NextRequest, { params: { id } }) {
  await connect();

  try {
    await Murid.findByIdAndDelete(id);
    return new NextResponse(JSON.stringify("deleted Successfully"), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error.message), { status: 500 });
  }
}
