import connectToDB from "@/lib/mongodb.js";
import Booking from "@/Models/Booking.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectToDB();
    const bookings = await Booking.find({}).sort({ date: -1 });
    return res.status(200).json(bookings);
  }
  res.status(405).end("Method Not Allowed");
}
