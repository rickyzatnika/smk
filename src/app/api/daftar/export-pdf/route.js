// import Riders from "@/models/Riders";
// import connect from "@/utils/connect";
// import { NextRequest, NextResponse } from "next/server";
// import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
// import fetch from "node-fetch";
// import { formatCurrency } from "@/utils/formatCurrency";

// // Export PDF
// // export const GET = async (req) => {
// //   await connect();
// //   try {
// //     const riders = await Riders.find({});
// //     if (!riders.length) {
// //       return new NextResponse("No riders found", { status: 404 });
// //     }

// //     const pdfDoc = await PDFDocument.create();
// //     const pageWidth = 600;
// //     const pageHeight = 800;
// //     const margin = 50;
// //     const fontSize = 12;
// //     const lineHeight = 20;
// //     const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);

// //     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
// //     let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
// //     let yPosition = pageHeight - margin;

// //     const addTextToPage = (text, indent = 0) => {
// //       if (yPosition - lineHeight < margin) {
// //         currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
// //         yPosition = pageHeight - margin;
// //       }
// //       currentPage.drawText(text, {
// //         x: margin + indent,
// //         y: yPosition,
// //         size: fontSize,
// //         font,
// //         color: rgb(0, 0, 0),
// //       });
// //       yPosition -= lineHeight;
// //     };

// //     addTextToPage("Riders List:", 0);
// //     yPosition -= lineHeight;

// //     riders.forEach((rider, index) => {
// //       addTextToPage(`${index + 1}. Nama Lengkap: ${rider.name}`, 0);
// //       addTextToPage(`Alamat: ${rider.address}`, 0);
// //       addTextToPage(`No. Handphone: ${rider.phone}`, 0);
// //       addTextToPage(`Nama Team: ${rider.team}`, 0);
// //       addTextToPage(`No.KIS: ${rider.kis}`, 0);
// //       addTextToPage(`No.Identitas/NIK: ${rider.nik}`, 0);
// //       addTextToPage(`Nomor Start: ${rider.numberStart}`, 0);
// //       addImageToPage(`Nomor Start: ${rider.numberStart}`, 0);
// //       addTextToPage(`Total Biaya Pendaftaran: ${rider.totalPrice}`, 0);

// //       if (rider.raceClass && rider.raceClass.length > 0) {
// //         rider.raceClass.forEach((cls) => {
// //           addTextToPage(`Kelas yang diikuti: ${cls.name}`, 20);
// //         });
// //       }
// //       addTextToPage("", 0); // Extra space between riders
// //     });

// //     const pdfBytes = await pdfDoc.save();
// //     return new NextResponse(pdfBytes, {
// //       status: 200,
// //       headers: {
// //         "Content-Type": "application/pdf",
// //         "Content-Disposition": "attachment; filename=riders.pdf",
// //       },
// //     });
// //   } catch (error) {
// //     console.log(error);
// //     return new NextResponse("Internal Server Error", { status: 500 });
// //   }
// // };

// export const GET = async (req = NextRequest) => {
//   await connect();
//   try {
//     const riders = await Riders.find({}).lean();
//     riders.sort((a, b) => a.name.localeCompare(b.name));

//     if (!riders.length) {
//       return new NextResponse("No riders found", { status: 404 });
//     }

//     const pdfDoc = await PDFDocument.create();
//     const pageWidth = 600;
//     const pageHeight = 800;
//     const margin = 50;
//     const fontSize = 12;
//     const lineHeight = 20;
//     const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);

//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
//     let yPosition = pageHeight - margin;

//     const addTextToPage = (text, indent = 0) => {
//       if (yPosition - lineHeight < margin) {
//         currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
//         yPosition = pageHeight - margin;
//       }
//       currentPage.drawText(text, {
//         x: margin + indent,
//         y: yPosition,
//         size: fontSize,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       yPosition -= lineHeight;
//     };

//     const addImageToPage = async (imageUrl) => {
//       let image;

//       try {
//         const imageResponse = await fetch(imageUrl);
//         const imageBuffer = await imageResponse.arrayBuffer();
//         image = await pdfDoc.embedJpg(imageBuffer); // Gunakan embedPng jika gambar PNG
//       } catch (error) {
//         // Jika terjadi kesalahan saat fetch gambar, gunakan teks sebagai gantinya
//         image = null;
//       }

//       if (!image) {
//         {
//           const text = "Bayar dilokasi";
//           currentPage.drawText(text, {
//             x: margin,
//             y: yPosition - 20,
//             size: 12,
//           });

//           yPosition -= 20 + margin;
//         }
//       }

//       if (image) {
//         const { width, height } = image.scale(0.006); // Ubah skala sesuai kebutuhan

//         if (yPosition - height < margin) {
//           currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
//           yPosition = pageHeight - margin;
//         }

//         currentPage.drawImage(image, {
//           x: margin,
//           y: yPosition - height,
//           width,
//           height,
//         });

//         yPosition -= height + margin;
//       }
//     };

//     addTextToPage("Riders List:", 0);
//     yPosition -= lineHeight;

//     for (const [index, rider] of riders.entries()) {
//       addTextToPage(`${index + 1}. Nama: ${rider.name}`, 0);
//       addTextToPage(`Alamat: ${rider.address}`, 0);
//       addTextToPage(`No.Handphone: ${rider.phone}`, 0);
//       addTextToPage(`Nama Team: ${rider.team}`, 0);
//       addTextToPage(`No.KIS: ${rider.kis}`, 0);
//       addTextToPage(`No.Identitas/NIK: ${rider.nik}`, 0);
//       addTextToPage(`Nomor Start: ${rider.numberStart}`, 0);
//       addTextToPage(`Biaya Pendaftaran: ${rider.totalPrice}`, 0);

//       if (rider.img) {
//         await addImageToPage(rider.img);
//       }

//       if (rider.raceClass && rider.raceClass.length > 0) {
//         rider.raceClass.forEach((cls) => {
//           addTextToPage(`Kelas: ${cls.name}`, 5);
//           addTextToPage(`Harga: ${formatCurrency(cls.price)}`, 5);
//         });
//       }
//       addTextToPage("", 0); // Extra space between riders
//     }

//     const pdfBytes = await pdfDoc.save();
//     return new NextResponse(pdfBytes, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": "attachment; filename=riders.pdf",
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
