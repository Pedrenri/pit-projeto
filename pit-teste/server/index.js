const PORT = 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')

const uri =
  "mongodb+srv://phenrigoncalves:Pperafa19@pit.kibo8j6.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json("Hello to my app");
});

app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  const generateUserID = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const existingUser = await users.findOne({email})

    if (existingUser) {
        return res.status(409).send('User already exists. Please LOGIN.')
    }

    const sanitizedEmail = email.toLowerCase()
    const data = {
        user_id: generateUserID,
        email: sanitizedEmail,
        hash_passwd: hashedPassword
    }

    const insertedUser = await users.insertOne(data)

    const token = jwt.sign(insertedUser, sanitizedEmail, {
        expiresIn: 60 * 24,
    })

    res.status(201).json({token, userId: generateUserID, email: sanitizedEmail})
  }
  catch (err) {
    console.log(err)
  }
});

app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const returnedUsers = await users.find().toArray();
    res.send(returnedUsers);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log("Server running on PORT" + PORT));
