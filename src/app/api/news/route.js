import News from "@/models/News";
import connect from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req = NextRequest) => {
  await connect();
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q")?.trim(); // Trim to avoid unnecessary spaces
    let news;

    if (query) {
      const searchRegex = new RegExp(query, "i"); // Case-insensitive search
      news = await News.find({
        $or: [{ category: searchRegex }, { title: searchRegex }],
      }).limit(100);
    } else {
      news = await News.find({}).limit(100); // Limit the results
    }

    return new NextResponse(JSON.stringify({ news, success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching events:", error); // Log more detailed error
    return new NextResponse(
      JSON.stringify({ message: "Internal server error", success: false }),
      {
        status: 500,
      }
    );
  }
};

export const POST = async (req = NextRequest) => {
  await connect();
  const { title, desc, content, imageUrl, category, slug } = await req.json();

  try {
    const newNews = new News({
      title,
      desc,
      content,
      imageUrl,
      category,
      slug,
    });
    await newNews.save();
    return NextResponse.json(
      { message: "News created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving news:", error);
    return NextResponse.json(
      { error: "Failed to save news." },
      { status: 500 }
    );
  }
};
