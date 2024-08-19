import Users from "@/models/Users";
import connect from "@/utils/connect";
import { hash, genSalt } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req = NextRequest) => {
  await connect();

  try {
    const users = await Users.find({});

    if (!users) {
      return new NextResponse({ message: "users not found" }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "internal server error" }),
      { status: 500 }
    );
  }
};

export const POST = async (req = NextRequest) => {
  await connect();

  const { name, phone, password, role } = await req.json();
  if (!name || !phone || !password) {
    return new NextResponse(JSON.stringify({ message: "Field Required!" }), {
      status: 400,
    });
  }

  const userExist = await Users.findOne({ name });
  if (userExist) {
    return new NextResponse(
      JSON.stringify({ message: "Username sudah terdaftar." }),
      { status: 409 }
    );
  }

  try {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const newUser = new Users({
      name,
      phone,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User berhasil ditambahkan" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error.message);
    return new NextResponse(
      JSON.stringify({ message: "User berhasil ditambahkan" }),
      {
        status: 500,
      }
    );
  }
};

// CONTOH KODE SALAH
// export const POST = async (req = NextRequest) => {
//   await connect();

//   try {
//     const user = await req.json();

//     const existingUser = await Users.findOne({ name: user.name });

//     if (existingUser) {
//       return new NextResponse("User already exists", { status: 409 });
//     }

//     const newUser = new Users({
//       name: user.name,
//       phone: user.phone,
//       password: user.password,
//       role: user.role,
//     });

//     await newUser.save();

//     return new NextResponse(JSON.stringify(newUser), { status: 200 });
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({ message: "internal server error" }),
//       { status: 500 }
//     );
//   }
// };
