import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ContactRequest from '@/Models/ContactRequest';


export async function POST(req, context) {
const { params } = context;
const { id: contactId } = await params;
await connectDB();
try {
const userId = req.headers.get('x-user-id');
if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });


const contact = await ContactRequest.findById(contactId);
if (!contact) return NextResponse.json({ error: 'Request not found' }, { status: 404 });


if (contact.toOwner.toString() !== userId) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });


contact.status = 'rejected';
await contact.save();


return NextResponse.json(contact);
} catch (err) {
console.error(err);
return NextResponse.json({ error: err.message }, { status: 500 });
}
}