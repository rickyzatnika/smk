// import Riders from "@/models/Riders";
// import connect from "@/utils/connect";
// import { NextRequest, NextResponse } from "next/server";
// import QRCode from "qrcode";

// export const GET = async (req = NextRequest) => {
//   await connect();
//   const { searchParams } = new URL(req.url);
//   const riderId = searchParams.get("id");

//   if (!riderId) {
//     return new NextResponse(
//       JSON.stringify({ success: false, message: "ID diperlukan" }),
//       { status: 400 }
//     );
//   }

//   try {
//     const rider = await Riders.findById(riderId).lean();

//     if (!rider) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: "Rider tidak ditemukan" }),
//         { status: 404 }
//       );
//     }

//     const qrData = {
//       name: rider.name,
//       numberStart: rider.numberStart,
//       // raceClass: rider.raceClass.map((cls) => cls.name).join(", "),
//       // queueNumber: rider.queueNumber,
//       date: rider.createdAt.toISOString(),
//     };

//     const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

//     return new NextResponse(JSON.stringify({ success: true, qrCode }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error generating QR code:", error);
//     return new NextResponse(
//       JSON.stringify({ success: false, message: "Internal server error" }),
//       { status: 500 }
//     );
//   }
// };
