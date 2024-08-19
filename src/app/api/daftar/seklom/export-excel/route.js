// import Riders from "@/models/Riders";
// import connect from "@/utils/connect";
// import ExcelJS from "exceljs";
// import { NextRequest, NextResponse } from "next/server";

// export const GET = async (req = NextRequest) => {
//   await connect();
//   try {
//     const riders = await Riders.find({}).lean(); // Ambil data riders dan konversi ke objek JavaScript biasa
//     riders.sort((a, b) => a.name.localeCompare(b.name)); // Urutkan berdasarkan nama

//     if (!riders.length) {
//       return new NextResponse("No riders found", { status: 404 });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Riders");

//     worksheet.columns = [
//       { header: "Nama", key: "name", width: 30 },
//       { header: "Nama Team", key: "team", width: 20 },
//       { header: "Nomor Start", key: "numberStart", width: 20 },
//       { header: "Kelas Yang Diikuti", key: "raceClass", width: 30 }, // Kolom untuk raceClass
//     ];

//     for (const rider of riders) {
//       const raceClassString = rider.raceClass
//         ? rider.raceClass.map((cls) => `${cls.name}`).join(" - ")
//         : "Tidak ada kelas";

//       worksheet.addRow({
//         name: rider.name,
//         team: rider.team,
//         numberStart: rider.numberStart,
//         raceClass: raceClassString, // Tambahkan raceClass ke baris
//       });
//     }

//     const excelBuffer = await workbook.xlsx.writeBuffer();
//     return new NextResponse(excelBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type":
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": "attachment; filename=daftar-riders.xlsx",
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
