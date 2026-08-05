const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

// DATABASE CONNECTION

mongoose.connect("mongodb://127.0.0.1:27017/library")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("ERROR:", err));

// REGISTER

app.post("/api/auth/register", async (req, res) => {

    try {

        const db = mongoose.connection;

        const userData = {

    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    role: req.body.role,

    registeredDate: new Date()

};
        await db.collection("users").insertOne(userData);

        res.json({
            success: true
        });

    } catch (err) {

        console.log("REGISTER ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// LOGIN

app.post("/api/auth/login", async (req, res) => {

    try {

        const { email, password, role } = req.body;

        const db = mongoose.connection;

        const user = await db.collection("users").findOne({

            email,
            password,
            role

        });

        if(user){

            res.json({
                success: true,
                role: user.role
            });

        } else {

            res.status(401).json({
                message: "Invalid credentials"
            });

        }

    } catch (err) {

        console.log("LOGIN ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

})
// FETCH USERS

app.get("/api/users", async (req, res) => {

    try {

        const db = mongoose.connection;

        const users = await db.collection("users").find().toArray();

        res.json(users);

    } catch (err) {

        console.log("USERS ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// DELETE USER

app.delete("/api/users/:id", async (req, res) => {

    try {

        const db = mongoose.connection;

        await db.collection("users").deleteOne({

            _id: new ObjectId(req.params.id)

        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log("DELETE USER ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// ADD BOOK

app.post("/api/books/add", async (req, res) => {

    try {

        const db = mongoose.connection;

        const bookData = {

    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    copies: Number(req.body.copies),
    image: req.body.image,
    description: req.body.description,

    addedDate: new Date()

};
        await db.collection("books").insertOne(bookData);

        res.json({
            success: true
        });

    } catch (err) {

        console.log("ADD BOOK ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// FETCH ALL BOOKS

app.get("/api/books", async (req, res) => {

    try {

        const db = mongoose.connection;

        const books = await db.collection("books").find().toArray();

        res.json(books);

    } catch (err) {

        console.log("FETCH BOOKS ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// FETCH SINGLE BOOK

app.get("/api/books/:id", async (req, res) => {

    try {

        const db = mongoose.connection;

        const book = await db.collection("books").findOne({

            _id: new ObjectId(req.params.id)

        });

        res.json(book);

    } catch (err) {

        console.log("SINGLE BOOK ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// DELETE BOOK

app.delete("/api/books/:id", async (req, res) => {

    try {

        const db = mongoose.connection;

        await db.collection("books").deleteOne({

            _id: new ObjectId(req.params.id)

        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log("DELETE BOOK ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// RESERVE BOOK

app.post("/api/reserve", async (req, res) => {

    try {

        const db = mongoose.connection;

        const bookId = req.body.bookId;

        const book = await db.collection("books").findOne({

            _id: new ObjectId(bookId)

        });

        if(!book){

            return res.status(404).json({
                message: "Book Not Found"
            });

        }

        if(Number(book.copies) <= 0){

            return res.status(400).json({
                message: "No Copies Available"
            });

        }

        const reservation = {

            email: req.body.email,
            bookId: bookId,
            title: book.title,

            reservedDate: new Date(),

            expiryDate: new Date(
                Date.now() + 10 * 24 * 60 * 60 * 1000
            )

        };

        await db.collection("reservations").insertOne(reservation);

        await db.collection("books").updateOne(

            { _id: new ObjectId(bookId) },

            {
                $set: {
                    copies: Number(book.copies) - 1
                }
            }

        );

        res.json({
            success: true
        });

    } catch (err) {

        console.log("RESERVE ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// PROFILE

app.get("/api/profile/:email", async (req, res) => {

    try {

        const db = mongoose.connection;

        const user = await db.collection("users").findOne({

            email: req.params.email

        });

        const reservations = await db.collection("reservations")
        .find({

            email: req.params.email

        })
        .toArray();
        const issues = await db.collection("issues")
.find({
    email: req.params.email
})
.toArray();

        res.json({
            user,
            reservations,
            issues
        });

    } catch (err) {

        console.log("PROFILE ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// CANCEL RESERVATION

app.delete("/api/reservation/:id", async (req, res) => {

    try {

        const db = mongoose.connection;

        const reservation = await db.collection("reservations").findOne({

            _id: new ObjectId(req.params.id)

        });

        if(!reservation){

            return res.status(404).json({
                message: "Reservation Not Found"
            });

        }

        const book = await db.collection("books").findOne({

            _id: new ObjectId(reservation.bookId)

        });

        await db.collection("books").updateOne(

            { _id: new ObjectId(reservation.bookId) },

            {
                $set: {
                    copies: Number(book.copies) + 1
                }
            }

        );

        await db.collection("reservations").deleteOne({

            _id: new ObjectId(req.params.id)

        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log("CANCEL ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// AUTO EXPIRY CHECK

app.get("/api/check-expiry", async (req, res) => {

    try {

        const db = mongoose.connection;

        const expiredReservations = await db.collection("reservations")
        .find({

            expiryDate: { $lt: new Date() }

        })
        .toArray();

        for(const reservation of expiredReservations){

            const book = await db.collection("books").findOne({

                _id: new ObjectId(reservation.bookId)

            });

            if(book){

                await db.collection("books").updateOne(

                    { _id: new ObjectId(reservation.bookId) },

                    {
                        $set: {
                            copies: Number(book.copies) + 1
                        }
                    }

                );

            }

        }

        await db.collection("reservations").deleteMany({

            expiryDate: { $lt: new Date() }

        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log("EXPIRY ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// EDIT BOOK

app.put("/api/books/:id", async (req, res) => {

    try {

        const db = mongoose.connection;

        await db.collection("books").updateOne(

            {
                _id: new ObjectId(req.params.id)
            },

            {
                $set: {

                    title: req.body.title,
                    author: req.body.author,
                    genre: req.body.genre,
                    copies: Number(req.body.copies)

                }
            }

        );

        res.json({
            success: true
        });

    } catch (err) {

        console.log("EDIT BOOK ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
app.put("/api/users/:id", async (req, res) => {

    try {

        const db = mongoose.connection;

        await db.collection("users").updateOne(

            {
                _id: new ObjectId(req.params.id)
            },

            {
                $set: {

                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    role: req.body.role

                }
            }

        );

        res.json({
            success: true
        });

    } catch (err) {

        console.log("EDIT USER ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// RESERVATIONS API

app.get("/api/reservations", async (req, res) => {

    try {

        const db = mongoose.connection;

        const reservations = await db
        .collection("reservations")
        .find()
        .toArray();

        res.json(reservations);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});



// ISSUES API

app.get("/api/issues", async (req, res) => {

    try {

        const db = mongoose.connection;

        const issues = await db
        .collection("issues")
        .find()
        .toArray();

        res.json(issues);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
app.post("/api/issue-book", async (req, res) => {

    try {

        const db = mongoose.connection;

        const reservation = await db.collection("reservations")
        .findOne({
            _id: new ObjectId(req.body.reservationId)
        });

        if(!reservation){

            return res.status(404).json({
                message: "Reservation Not Found"
            });

        }

        const issueData = {

            email: reservation.email,

            title: reservation.title,

            issueDate: new Date(),

            returnDate: new Date(
                Date.now() + 15 * 24 * 60 * 60 * 1000
            ),

            status: "Issued"

        };

        await db.collection("issues")
        .insertOne(issueData);

        await db.collection("reservations")
        .deleteOne({
            _id: reservation._id
        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log("ISSUE ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
app.post("/api/return-book", async (req, res) => {

    try {

        const db = mongoose.connection;

        const issue = await db.collection("issues")
        .findOne({
            _id: new ObjectId(req.body.issueId)
        });

        if(!issue){

            return res.status(404).json({
                message: "Issue Not Found"
            });

        }

        const book = await db.collection("books")
        .findOne({
            title: issue.title
        });

        if(book){

            await db.collection("books")
            .updateOne(

                { _id: book._id },

                {
                    $set: {
                        copies: Number(book.copies) + 1
                    }
                }

            );

        }

        await db.collection("issues")
        .deleteOne({
            _id: issue._id
        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log("RETURN ERROR:", err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
app.listen(3000, () => {

    console.log("Server running on port 3000");

});