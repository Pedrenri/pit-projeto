const PORT = 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const crypto = require('crypto')

const uri =
  "mongodb+srv://phenrigoncalves:Pperafa19@pit.kibo8j6.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello to my app");
});

// SIGNUP
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  const generateUserID = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const regx =
    /^([ a-z\d][a-z\d_\-.]+[a-z\d]){1,10}@(gmail)\.[a-z]{2,10}(\.[a-z]{2,20})?$/gm;


  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const existingUser = await users.findOne({ email });
    const verificationCode = crypto.randomBytes(4).toString('hex')

    if (existingUser) {
      return res.status(409).send("Usuário já cadastrado! Faça login!");
    }

    if(!regx.test(email)) {
      return res.status(409).send("Email Inválido! O único domínio compatível é Gmail!");
    }

    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user:"pitpetmatch@gmail.com",
        pass:"pcnxlfabwlqssefq"
      }
    })

    const mailOptions = {
      from: 'phenrigoncalves@gmail.com',
      to: email,
      subject: "Verificação de Email PetMatch",
      text: `Seu código de verificação é ${verificationCode}`
    }

    await transporter.sendMail(mailOptions)

    const sanitizedEmail = email.toLowerCase();
    const data = {
      user_id: generateUserID,
      email: sanitizedEmail,
      hash_passwd: hashedPassword,
      verificationCode: verificationCode
    };

    const insertedUser = await users.insertOne(data);

    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: 60 * 24,
    });

    res.status(201).json({ token, userId: generateUserID, verificationCode });
  } catch (err) {
    console.log(err);
  }
});

//LOGIN
app.post("/login", async (req, res) => {
  const regx =
    /^([ a-z\d][a-z\d_\-.]+[a-z\d]){1,10}@(gmail)\.[a-z]{2,10}(\.[a-z]{2,20})?$/gm;

  const client = new MongoClient(uri);
  const { email, password } = req.body;
  const user_name = email;
  const testEmail = regx.test(email);

  const checkUsername = () => {
    if (testEmail) {
      return true;
    } else return false;
  };

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    let user = await users.findOne({ email })

    if (!checkUsername()) {
      user = await users.findOne({ user_name });
    }

    if (!user) {
      res
        .status(401)
        .send("Usuário não encontrado! Verifique o email ou nome de usuário!");
    }

    const correctPword = await bcrypt.compare(password, user?.hash_passwd);

    if (user && correctPword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).json({ token, userId: user.user_id, userName: user.user_name });
    } else res.status(400).send("Senha inválida");

  } catch (err) {
    console.log(err);
  }
});

// GET ONE USER
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const user = await users.findOne(query);
    res.send(user);
  } finally {
    await client.close();
  }
});

//Users(mapping matches or something like that I don't really get it)
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);
  console.log(userIds);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const pipeLine = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ];

    const foundUsers = await users.aggregate(pipeLine).toArray();
    console.log(foundUsers);
    res.send(foundUsers);
  } finally {
    await client.close();
  }
});

// GET USERS
app.get("/gendered-users", async (req, res) => {
  const client = new MongoClient(uri);
  const gender = req.query.gender;
  const genderQuery = gender == "woman" ? "man" : "woman";

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const query = { gender_identity: genderQuery };
    const foundUsers = await users.find(query).toArray();

    res.send(foundUsers);
  } finally {
    await client.close();
  }
});

// UPDATE USER
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        url: formData.url,
        matches: formData.matches,
        user_name: formData.user_name,
        address: formData.address,
      },
    };
    const insertedUser = await users.updateOne(query, updateDocument);
    res.send(insertedUser);
  } finally {
    await client.close();
  }
});

// MATCHES
app.put("/addmatch", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const updateDocument = {
      $push: { matches: { user_id: matchedUserId } },
    };

    const user = await users.updateOne(query, updateDocument);
    res.send(user);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log("Server running on PORT" + PORT));
