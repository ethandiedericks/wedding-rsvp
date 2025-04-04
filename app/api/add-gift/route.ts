import { supabaseServer } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const image = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Gift name is required" }, { status: 400 });
    }


    let imageUrl: string | null = null;
    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabaseServer()
        .storage
        .from("gift-images")
        .upload(fileName, image);

      if (uploadError) {
        return NextResponse.json({ error: "Failed to upload image: " + uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabaseServer()
        .storage
        .from("gift-images")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabaseServer()
      .from("gifts")
      .insert({
        name,
        available: true,
        image_url: imageUrl,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Gift added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in add-gift API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}