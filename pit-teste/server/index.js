const PORT = 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const uri = process.env.URI;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello to my app");
});

// DELETE USER
app.delete("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const pets = database.collection("pet")

    const query = { user_id: userId };
    const petQuery = { owner_id: userId }
    const result = await users.deleteOne(query);
    const resultPets = await pets.deleteMany({ owner_id: userId })

    if (result.deletedCount === 1 && resultPets) {
      res.status(200).json({ message: "Usuário excluído com sucesso." });
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } finally {
    await client.close();
  }
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
    const verificationCode = crypto.randomBytes(4).toString("hex");

    if (existingUser) {
      return res.status(409).send("Usuário já cadastrado! Faça login!");
    }

    if (!regx.test(email)) {
      return res
        .status(409)
        .send("Email Inválido! O único domínio compatível é Gmail!");
    }

    // Verificação de segurança da senha
    if (password.length < 6) {
      return res
        .status(400)
        .send("Senha fraca! A senha deve ter no mínimo 6 caracteres.");
    }

    if (password === email) {
      return res
        .status(400)
        .send("Senha inválida! A senha não pode ser igual ao email.");
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&;-_.])[a-zA-Z\d@$!%*#?&;-_.]+$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send(
          "Senha fraca demais! A senha deve conter pelo menos um número, uma letra e um caractere especial."
        );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pitpetmatch@gmail.com",
        pass: "pcnxlfabwlqssefq",
      },
    });

    const mailOptions = {
      from: "pitpetmatch@gmail.com",
      to: email,
      subject: "Verificação de Email PetMatch",
      text: `Seu código de verificação é ${verificationCode}`,
    };

    transporter.sendMail(mailOptions);

    const sanitizedEmail = email.toLowerCase();
    const data = {
      user_id: generateUserID,
      email: sanitizedEmail,
      hash_passwd: hashedPassword,
      verificationCode: verificationCode,
      isVerified: false,
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

    let user = await users.findOne({ email });

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
      res.status(201).json({
        token,
        userId: user.user_id,
        userName: user.user_name,
        isVerified: user.isVerified,
      });
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

    res.send(foundUsers);
  } finally {
    await client.close();
  }
});

// GET USERS
app.get("/gendered-users", async (req, res) => {
  const client = new MongoClient(uri);
  const gender = req.query.gender;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const query = { gender_identity: { $eq: gender } };
    const foundUsers = await users.find(query).toArray();
    res.json(foundUsers);
  } finally {
    await client.close();
  }
});

// FINISH USER CREATE ACCOUNT
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;
  const userName = formData.user_name;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const existingUser = await users.findOne({ user_name: userName });
    console.log(existingUser)

    if (existingUser) {
      return res.status(409).send("Este nome de usuário já está em uso!");
    }

    const query = { user_id: formData.user_id };
    const updateDocument = {
      $set: {
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        gender_identity: formData.gender_identity,
        matches: formData.matches,
        user_name: formData.user_name,
        address: formData.address,
        gender_interest: formData.gender_identity == "woman" ? "man" : "woman",
      },
    };
    const insertedUser = await users.updateOne(query, updateDocument);
    res.send(insertedUser);
  } finally {
    await client.close();
  }
});

//VERIFICATION
app.post("/verification", async (req, res) => {
  /* const userVerificationCode = req.body.verificationCode;
  const userId = req.cookies.userId; // Altere para o nome correto do cookie armazenado no navegador */
  const { userId, verificationCode } = req.body;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const user = await users.findOne(query);

    if (user && verificationCode === user.verificationCode) {
      // Atualize a propriedade isVerified para true no banco de dados
      await users.updateOne(query, { $set: { isVerified: true } });
      res.status(200).json({ message: "Código de verificação correto!" });
    } else {
      res.status(400).json({ message: "Código de verificação incorreto!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao verificar o código de verificação." });
  } finally {
    client.close();
  }
});

//UPDATE USER
app.put("/update-user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    const user = await users.findOne(query);

    const updateDocument = {
      $set: {
        full_name: formData?.full_name
          ? formData.full_name
          : user.full_name,
        birth_date: formData?.birth_date ? formData.bith_date : user.birth_date,
        url: formData?.url ? formData.url : user.url,
        address: formData?.address ? formData.address : user.address,
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
    const user = await users.findOne(query);

    if (user.matches.some((match) => match.user_id === matchedUserId)) {
      res.send("O matchedUserId já existe no array matches.");
    } else {
      const updateQuery = {
        user_id: userId,
        matches: { $ne: { user_id: matchedUserId } },
      };
      const updateDocument = {
        $push: { matches: { user_id: matchedUserId } },
      };

      const result = await users.updateOne(updateQuery, updateDocument);
      if (result.modifiedCount === 1) {
        res.send("Usuário atualizado com sucesso.");
      } else {
        res.send("Falha ao atualizar o usuário.");
      }
    }
  } finally {
    await client.close();
  }
});

//Função que gera senha aleatória
function gerarSenha() {
  const caracteresEspeciais = "!@#$%^&*()_+-=";
  const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
  const letrasMaiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";

  let senha = "";

  // Adicionar um caracter especial
  senha +=
    caracteresEspeciais[Math.floor(Math.random() * caracteresEspeciais.length)];

  // Adicionar uma letra maiúscula
  senha +=
    letrasMaiusculas[Math.floor(Math.random() * letrasMaiusculas.length)];

  // Adicionar um número
  senha += numeros[Math.floor(Math.random() * numeros.length)];

  // Adicionar uma letra minúscula
  senha +=
    letrasMinusculas[Math.floor(Math.random() * letrasMinusculas.length)];

  // Gerar o restante da senha
  const caracteresRestantes =
    caracteresEspeciais + letrasMinusculas + letrasMaiusculas + numeros;
  while (senha.length < 6) {
    senha +=
      caracteresRestantes[
      Math.floor(Math.random() * caracteresRestantes.length)
      ];
  }

  // Embaralhar a senha para torná-la mais aleatória
  senha = shuffleString(senha);

  return senha;
}

// Função para embaralhar uma string
function shuffleString(string) {
  const array = string.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

// FORGOT PASSWORD
app.post("/forgot-password", async (req, res) => {
  const client = new MongoClient(uri);
  const { email } = req.body;
  const newPassword = gerarSenha();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const regx =
    /^([ a-z\d][a-z\d_\-.]+[a-z\d]){1,10}@(gmail)\.[a-z]{2,10}(\.[a-z]{2,20})?$/gm;

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

    let user = await users.findOne({ email });

    if (!checkUsername()) {
      user = await users.findOne({ user_name });
    }

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pitpetmatch@gmail.com",
        pass: "pcnxlfabwlqssefq",
      },
    });

    const mailOptions = {
      from: "phenrigoncalves@gmail.com",
      to: email,
      subject: "Redefinição de senha PetMatch",
      text: `Sua nova senha é: ${newPassword}`,
    };

    transporter.sendMail(mailOptions);

    const userId = user.user_id;
    const query = { user_id: userId };

    await users.updateOne(query, { $set: { hash_passwd: hashedPassword } });

    res
      .status(200)
      .json({ message: "E-mail de redefinição de senha enviado!" });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

// GET MESSAGES
app.get("/messages", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, correspondingUserId } = req.query;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");
    const query = {
      from_userId: userId,
      to_userId: correspondingUserId,
    };
    const foundMessages = await messages.find(query).toArray();
    res.send(foundMessages);
  } finally {
    await client.close();
  }
});

// ADD MESSAGE
app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } finally {
    await client.close();
  }
});

// ADD PET
app.put("/addpet", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;
  const generatePetID = uuidv4();

  try {
    await client.connect();
    const database = client.db("app-data");
    const pet = database.collection("pet");

    const insertDocument = {
      id: generatePetID,
      owner_id: formData.owner_id,
      name: formData.name,
      age: formData.age,
      gender_identity: formData.gender,
      breed: formData.breed,
      url: formData.url,
      gender_interest: formData.gender == "male" ? "female" : "male",
    };
    const insertedUser = await pet.insertOne(insertDocument);
    res.send(insertedUser);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log("Server running on PORT" + PORT));
