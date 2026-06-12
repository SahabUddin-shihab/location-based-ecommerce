const mongoose= require("mongoose");


const connectDB= async()=>{
    try {
        const conn= await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Database is connected to ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
}

module.exports= connectDB; 