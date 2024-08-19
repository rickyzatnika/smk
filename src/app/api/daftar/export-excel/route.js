import Murid from "@/models/Murid";
import connect from "@/utils/connect";
import ExcelJS from "exceljs";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

// Export Excel

// export const GET = async (req) => {
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
//       { header: "Alamat", key: "address", width: 30 },
//       { header: "No.Handphone", key: "phone", width: 20 },
//       { header: "Nama Team", key: "team", width: 20 },
//       { header: "No.KIS", key: "kis", width: 20 },
//       { header: "No.Identitas/NIK", key: "nik", width: 20 },
//       { header: "Nomor Start", key: "numberStart", width: 20 },
//       { header: "Biaya Pendaftaran", key: "totalPrice", width: 20 },
//       { header: "Bukti Pembayaran", key: "img", width: 30 },
//     ];

//     for (const rider of riders) {
//       const row = worksheet.addRow({
//         name: rider.name,
//         address: rider.address,
//         phone: rider.phone,
//         team: rider.team,
//         kis: rider.kis,
//         nik: rider.nik,
//         numberStart: rider.numberStart,
//         totalPrice: rider.totalPrice,
//       });

//       if (rider.img) {
//         try {
//           const imageResponse = await fetch(rider.img);
//           const imageBuffer = await imageResponse.arrayBuffer();
//           const imageId = workbook.addImage({
//             buffer: Buffer.from(imageBuffer),
//             extension: "jpeg", // Gunakan 'png' jika gambar PNG
//           });

//           worksheet.addImage(imageId, {
//             tl: { col: 8, row: row.number - 1 }, // Posisi gambar
//             ext: { width: 30, height: 20 }, // Sesuaikan ukuran gambar
//           });
//         } catch (error) {
//           worksheet.getCell(row.number, 8).value = "Bayar di lokasi";
//         }
//       } else {
//         worksheet.getCell(row.number, 8).value = "Bayar di lokasi";
//       }
//     }

//     const excelBuffer = await workbook.xlsx.writeBuffer();
//     return new NextResponse(excelBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type":
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": "attachment; filename=riders.xlsx",
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };

export const GET = async (req = NextRequest) => {
  await connect();
  try {
    const murids = await Murid.find({}).lean();
    murids.sort((a, b) => a.name.localeCompare(b.name));

    if (!murids.length) {
      return new NextResponse("No riders found", { status: 404 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Murid");

    worksheet.columns = [
      { header: "Nama", key: "name", width: 30 },
      { header: "Alamat", key: "address", width: 30 },
      { header: "No.Handphone", key: "phone", width: 20 },
      { header: "Tempat Tanggal Lahir", key: "ttl", width: 20 },
      { header: "Sekolah Asal", key: "school", width: 20 },
      { header: "Nama Orang Tua", key: "parentName", width: 20 },
      { header: "Pekerjaan Orang Tua", key: "parentJob", width: 20 },
      { header: "Foto", key: "img", width: 20 },
    ];

    worksheet.addRow({
      name: murids.name,
      address: murids.address,
      ttl: murids.ttl,
      phone: murids.phone,
      school: murids.school,
      parentName: murids.parentName,
      parentJob: murids.parentJob,
    });

    if (murids.img) {
      try {
        const imageResponse = await fetch(murids.img);
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageId = workbook.addImage({
          buffer: Buffer.from(imageBuffer),
          extension: "jpeg",
        });

        worksheet.addImage(imageId, {
          tl: { col: 8, row: row.number - 1 },
          ext: { width: 30, height: 20 },
        });
      } catch (error) {
        worksheet.getCell(row.number, 9).value = "Bayar di lokasi";
      }
    }

    const excelBuffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=riders.xlsx",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
