const { config } = require('dotenv');
config({ path: '.env.local' });
const { hash } = require('bcryptjs');
const { connect, disconnect } = require('mongoose');
const { default: User } = require('./Models/User');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

async function seedAdmin() {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'shailendrasahani273209@gmail.com';
    const adminPassword = '5H4!13ndr454h4n!';
    const adminName = 'Shailendra Sahani';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await hash(adminPassword, 10);

    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
