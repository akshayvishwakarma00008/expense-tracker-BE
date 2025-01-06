const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[-]DB connect sucessfully`);
  } catch (error) {
    console.log(`Error[-] ${error.message}`);
  }
};

module.exports = dbConnect;
