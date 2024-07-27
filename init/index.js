const mongoos = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoos.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const chat = await Listing.insertMany(initData.data);
  console.log("data was initialized");
  console.log(chat);
};

initDB();