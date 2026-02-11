const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const cleanupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Drop the users collection to start fresh
    await mongoose.connection.db.dropCollection('users').catch(() => {
      console.log('Users collection does not exist, skipping...');
    });

    console.log('✓ Users collection dropped successfully');
    console.log('✓ You can now register new users with email field');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

cleanupDatabase();
