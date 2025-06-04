const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9iiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");

    const usersCollection = client.db("9amshop").collection("users");
    const shopsCollection = client.db("9amshop").collection("shops");

    //Authentication related API's
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "168h",
      });
      res.send({ token });
    });

    const verifyJWT = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).send({ message: "Unauthorized" });

      const token = authHeader.split(" ")[1];
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) return res.status(403).send({ message: "Forbidden" });

        req.decoded = decoded;
        next();
      });
    };

    // Signup API

    app.post("/signup", async (req, res) => {
      const { username, email, password, shopNames } = req.body;

      if (
        !username ||
        !email ||
        !Array.isArray(shopNames) ||
        shopNames.length < 3
      ) {
        return res.status(400).json({ message: "Invalid request data." });
      }

      const normalizedNames = shopNames.map((name) =>
        name.trim().toLowerCase()
      );

      // Checks for shops
      const existingShops = await shopsCollection
        .find({
          name: { $in: normalizedNames },
        })
        .toArray();

      if (existingShops.length > 0) {
        const takenNames = existingShops.map((shop) => shop.name);
        return res.status(409).json({
          message: `These shop names are already taken: ${takenNames.join(
            ", "
          )}`,
        });
      }

      // Inserting user
      const newUser = {
        username,
        email,
        shopNames,
        createdAt: new Date(),
      };
      const userResult = await usersCollection.insertOne(newUser);

      // Inserts shop names globally
      const shopDocs = shopNames.map((name) => ({
        name: name.trim().toLowerCase(),
        ownerId: userResult.insertedId,
        createdAt: new Date(),
      }));

      await shopsCollection.insertMany(shopDocs);

      res.status(201).json({ message: "Signup successful!" });
    });

    //========
    app.get("/user-shops", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).json({ message: "Email required" });

      try {
        const user = await usersCollection.findOne({ email });
        res.json({ shops: user?.shopNames || [] });
      } catch (error) {
        console.error("Error fetching user shops:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // =========================
  } finally {
    // Leave the client open while the server runs
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("9am is waiting");
});

app.listen(port, () => {
  console.log(`🚀 9am server is running on port ${port}`);
});
