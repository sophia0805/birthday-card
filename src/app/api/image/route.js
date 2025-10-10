import { NextResponse } from "next/server";

export async function POST(request) {
  const { imageData } = await request.json();
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  const params = new URLSearchParams();
  params.append('image', base64Data);
  const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBBKEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params
  });

  const imgbbResult = await imgbbResponse.json();
  const mediaUrl = imgbbResult.data.url;
  console.log('Image uploaded to ImgBB:', mediaUrl);
  return NextResponse.json({ mediaUrl });
}