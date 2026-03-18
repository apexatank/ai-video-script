import { NextResponse } from "next/server";

// Mock database for history
let historyData: any[] = [];

export async function GET() {
  try {
    return NextResponse.json(historyData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = {
      ...body,
      id: body.id || crypto.randomUUID(),
      date: body.date || new Date().toISOString(),
    };
    historyData = [newItem, ...historyData];
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save to history" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, isBookmarked } = await request.json();
    historyData = historyData.map(item => 
      item.id === id ? { ...item, isBookmarked } : item
    );
    const updated = historyData.find(item => item.id === id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update history" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (id) {
      historyData = historyData.filter(item => item.id !== id);
    } else {
      historyData = [];
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete from history" }, { status: 500 });
  }
}
