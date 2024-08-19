// import connect from "@/utils/connect";
// import Riders from "@/models/Riders";
// import { NextRequest, NextResponse } from "next/server";

// export const GET = async (req = NextRequest) => {
//   await connect();

//   try {
//     const riders = await Riders.find({});
//     const takenNumbers = riders.map((rider) => rider?.numberStart);
//     return new NextResponse(JSON.stringify(takenNumbers), { status: 200 });
//   } catch (error) {
//     console.log(error.message);
//     return new NextResponse(JSON.stringify({ message: error.message }), {
//       status: 500,
//     });
//   }
// };
