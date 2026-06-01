const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');


    const studentPassword = await bcrypt.hash('student123', 10);
    const adminPassword = await bcrypt.hash('inspirante2026', 10);


    const admin = await User.create({
      username: 'admin',
      password: adminPassword,
      name: 'Admin',
      role: 'admin'
    });


    await User.create([
      { username: 'asha.rao',      password: studentPassword, name: 'Asha Rao',      role: 'student' },
      { username: 'ravi.shetty',   password: studentPassword, name: 'Ravi Shetty',   role: 'student' },
      { username: 'meera.nair',    password: studentPassword, name: 'Meera Nair',    role: 'student' },
      { username: 'kiran.bhat',    password: studentPassword, name: 'Kiran Bhat',    role: 'student' },
      { username: 'divya.kamath',  password: studentPassword, name: 'Divya Kamath',  role: 'student' },
      { username: 'suresh.pai',    password: studentPassword, name: 'Suresh Pai',    role: 'student' },
      { username: 'ananya.hegde',  password: studentPassword, name: 'Ananya Hegde',  role: 'student' },
      { username: 'rohan.shenoy',  password: studentPassword, name: 'Rohan Shenoy',  role: 'student' },
      { username: 'nisha.prabhu',  password: studentPassword, name: 'Nisha Prabhu',  role: 'student' },
      { username: 'tejas.mallya',  password: studentPassword, name: 'Tejas Mallya',  role: 'student' },
      { username: 'priya.bangera', password: studentPassword, name: 'Priya Bangera', role: 'student' },
    ]);


    await Event.create([
      { name: 'Tech Symposium 2026',    date: new Date('2026-07-10'), venue: 'Main Auditorium',    capacity: 120, createdBy: admin._id },
      { name: 'Hackathon',              date: new Date('2026-07-15'), venue: 'Lab Block C',         capacity: 40,  createdBy: admin._id },
      { name: 'Cultural Fest',          date: new Date('2026-07-20'), venue: 'Open Amphitheatre',   capacity: 300, createdBy: admin._id },
      { name: 'Workshop: React Basics', date: new Date('2026-07-22'), venue: 'Seminar Hall 2',      capacity: 30,  createdBy: admin._id },
      { name: 'Placement Prep Talk',    date: new Date('2026-07-25'), venue: 'Main Auditorium',     capacity: 200, createdBy: admin._id },
    ]);

    console.log('Database seeded successfully');
    process.exit(0);

  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();