// import RaceClasses from "@/models/RaceClasses";
// import connect from "@/utils/connect";
// import { NextRequest, NextResponse } from "next/server";

// export async function DELETE(req = NextRequest, { params: { id } }) {
//   await connect();

//   try {
//     await RaceClasses.findByIdAndDelete(id);
//     return new NextResponse(JSON.stringify("deleted Successfully"), {
//       status: 200,
//     });
//   } catch (error) {
//     return new NextResponse(JSON.stringify(error.message), { status: 500 });
//   }
// }
