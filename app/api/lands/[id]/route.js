import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Land from '@/Models/Land';


export async function GET(req, context) {
const { params } = context;
const { id } = await params;
await connectDB();
try {
const land = await Land.findById(id).lean();
if (!land) return NextResponse.json({ error: 'Land not found' }, { status: 404 });
return NextResponse.json(land);
} catch (err) {
console.error(err);
return NextResponse.json({ error: err.message }, { status: 500 });
}
}