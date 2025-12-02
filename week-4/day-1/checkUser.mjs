// checkUser.mjs
import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/test";
await mongoose.connect(MONGO_URI);

const user = await mongoose.connection.db.collection("users")
  .findOne({ _id: new mongoose.Types.ObjectId("68e969ae732b1d4cbda61950") });

console.log(user);
await mongoose.disconnect();
