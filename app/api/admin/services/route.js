import connectToDB from "@/lib/mongodb.js";
import Service from "@/Models/Service.js";
import User from "@/Models/User.js";
import Booking from "@/Models/Booking.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const services = await Service.find({})
      .populate('provider', 'name')
      .sort({ createdAt: -1 });

    const servicesWithDetails = await Promise.all(
      services.map(async (service) => {
        // Count bookings for this service (assuming Booking model has service field)
        const bookingsCount = await Booking.countDocuments({ service: service._id });

        return {
          id: service._id,
          name: service.name,
          provider: service.provider?.name || 'Unknown Provider',
          bookings: bookingsCount,
          rating: service.rating,
          status: service.status,
        };
      })
    );

    return NextResponse.json(servicesWithDetails);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    await connectToDB();
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
