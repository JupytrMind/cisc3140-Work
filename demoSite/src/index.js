const express = require("express");
const path = require("path");
const Users = require("./config");
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.set('views', path.join(__dirname, '..', 'views'));  // Points to the views directory for webpage to show

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }


    // Check if the username already exists in the database
    const existingUser = await Users.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        console.log(data); // Log the data to see what is being saved
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const savedUser = await new Users(data).save(); // <--- ADDED/CHANGED THIS LINE
        console.log(savedUser); // Log the saved document
        res.status(201).send('Registration successful!'); // Added a success response
    }

});

// Login user 
app.post("/login", async (req, res) => {
    console.log('Login route hit!');
    res.send("Login successful!"); 
    // When dashboard page is completed, -> res.redirect("/dashboard");
    // try {
    //     const check = await Users.findOne({ name: req.body.username });
    //     if (!check) {
    //         console.log("User name cannot found");
    //         res.send("User name cannot found")
    //     }
    //     // Compare the hashed password from the database with the plaintext password
    //     const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    //     if (!isPasswordMatch) {
    //         console.log("wrong Password");
    //         res.send("wrong Password");
    //     }
    //     else {
    //         console.log("Login successful");
    //         res.render("home");
    //     }
    // }
    // catch {
    //     console.log("wrong Details");
    //     res.send("wrong Details");
    // }
});


// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});