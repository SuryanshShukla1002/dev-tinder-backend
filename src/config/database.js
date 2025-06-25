const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://Suryansh_shukla:devTinderSurya1234@cluster0.ac02uxn.mongodb.net/"
    );
};

module.exports = connectDB