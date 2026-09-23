import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose.connect(`${process.env.MONGO_URL}/ekart`);
            console.log('✅ Connected to MongoDB successfully');
            return;
        } catch (error) {
            console.error(`❌ DB connection attempt ${attempt}/${retries} failed:`, error.message);
            if (attempt < retries) {
                console.log(`⏳ Retrying in ${delay / 1000}s...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error("🚨 Could not connect to MongoDB after all retries. Server will continue without DB.");
                // Do NOT exit — let the server run so we can debug
            }
        }
    }
}

export default connectDB;