import { NextResponse } from 'next/server';
import {connectDB}  from '@/lib/mongodb';
import Land from '@/Models/Land';
import ContactRequest from '@/Models/ContactRequest';


export async function POST(req, context) {
const { params } = context;
const { id: landId } = await params;
await connectDB();


try {
const body = await req.json();
const userId = req.headers.get('x-user-id');
if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });


const land = await Land.findById(landId);
if (!land) return NextResponse.json({ error: 'Land not found' }, { status: 404 });


// Prevent sending request to own land
if (land.owner.toString() === userId) return NextResponse.json({ error: 'Cannot contact own land' }, { status: 400 });


// create contact request
const reqDoc = new ContactRequest({ land: landId, fromUser: userId, toOwner: land.owner, message: body.message || '' });
await reqDoc.save();


// in production: notify owner by email/push


return NextResponse.json(reqDoc);
} catch (err) {
console.error(err);
return NextResponse.json({ error: err.message }, { status: 500 });
}
}