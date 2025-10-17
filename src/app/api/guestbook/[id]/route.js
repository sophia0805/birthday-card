import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const client = await clientPromise;
        const db = client.db("birthday-cards");
        const collection = db.collection("guestbooks");
        let guestbook = await collection.findOne({ _id: id });
        if (!guestbook) {
            const newGuestbook = {
                _id: id,
                entries: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await collection.insertOne(newGuestbook);
            guestbook = newGuestbook;
        }
        return NextResponse.json({ entries: guestbook.entries });
    } catch (error) {
        console.error("GET /api/guestbook/[id] failed:", error);
        return NextResponse.json({ error: "Failed to load guestbook" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { id } = params;
        const newEntry = await request.json();
        const client = await clientPromise;
        const db = client.db("birthday-cards");
        const collection = db.collection("guestbooks");
        const existingGuestbook = await collection.findOne({ _id: id });
        if (existingGuestbook) {
            const updateData = {
                $push: {
                  entries: newEntry
                },
                $set: {
                     updatedAt: new Date().toISOString()
                }
            };
            await collection.updateOne({ _id: id }, updateData);
        } else {
            const newGuestbook = {
                _id: id,
                entries: [newEntry],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await collection.insertOne(newGuestbook);
        }
        const updatedGuestbook = await collection.findOne({ _id: id });
        return NextResponse.json({ entries: updatedGuestbook.entries });
    } catch (error) {
        console.error("POST /api/guestbook/[id] failed:", error);
        return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
    }
}