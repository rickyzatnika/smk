// import RaceClasses from "@/models/RaceClasses";
// import connect from "@/utils/connect";
// import { NextRequest, NextResponse } from "next/server";

// export const GET = async (req = NextRequest) => {
//   await connect();
//   try {
//     const raceClass = await RaceClasses.find({});

//     return new NextResponse(JSON.stringify(raceClass), { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse(
//       JSON.stringify({ message: "internal server error" }),
//       {
//         status: 500,
//       }
//     );
//   }
// };

// export const POST = async (req = NextRequest) => {
//   await connect();

//   const { title, classes } = await req.json();

//   try {
//     // Validasi input
//     if (!title || !Array.isArray(classes)) {
//       return new NextResponse(JSON.stringify({ message: "Invalid Data" }), {
//         status: 400,
//       });
//     }

//     const newRaceClass = new RaceClasses({
//       title,
//       classes,
//     });
//     await newRaceClass.save();
//     return new NextResponse(
//       JSON.stringify({ message: "Kelas berhasil ditambahkan" }),
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     console.log(error.message);
//     return new NextResponse(
//       JSON.stringify({ message: "Maaf ada kesalahan pada server." }),
//       {
//         status: 500,
//       }
//     );
//   }
// };
