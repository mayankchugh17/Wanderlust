const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://mayankchugh2003:jBhshw79BTnrfsVr@cluster0-shard-00-00.xbqtc.mongodb.net:27017,cluster0-shard-00-01.xbqtc.mongodb.net:27017,cluster0-shard-00-02.xbqtc.mongodb.net:27017/wanderlust?replicaSet=atlas-p149xl-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Main() is used for established the database

async function main() {
        await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});

// First old data is being cleaned

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"67bf016150172f8af6efa4d8"}));
    await Listing.insertMany(initData.data).then(()=>{
        console.log("Data has been inserted.");
    });
};

initDB();