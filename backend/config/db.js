// const mongoose = require("mongoose");

// // const config = require("config");
// // const db = config.get("mongoURI");
// const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-m2y4d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true
//     });
//     console.log("mongoDB Connected");
//   } catch (error) {
//     console.error(e.message);
//     process.exit(1);
//   }
// };
// module.exports = connectDB;
