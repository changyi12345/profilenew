const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_db');
        console.log('MongoDB Connected');

        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('password123', 10);
        await Admin.create({
            username: 'admin',
            password: hashedPassword
        });

        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
