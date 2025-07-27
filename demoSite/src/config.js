const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Munchies-data");

// Check database connected or not
// connect.then(() => {
//     console.log("Database Connected Successfully");
// })
// .catch(() => {
//     console.log("Database cannot be Connected");
// })
mongoose.connection.once('open', () => {
    console.log("Database Connected Successfully");
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create Schema
// Next iteration will include separate schema for each data source (users, food types, and possibly restaurants)
// For user Schema, include additional fields like email, phone number, etc. as needed for marketing capabilities
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
        // additional fields can be added here as needed
        // unique: true -> usernames should be unique
        // trim: true -> to remove any leading or trailing white spaces
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const Users = new mongoose.model("Users", Loginschema); // Changed collection name to "Users" for clarity
// const small = new Users({name: "small"}); // Create a sample document to test the connection
// async function save() {
//     await small.save(); // Save a sample document to test the connection
// }

// save() dd

module.exports = Users;