const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyhry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("Diana_Resturant");
    const Products = database.collection("Products");
    const Orders = database.collection("Orders");
    const usersCollection = database.collection("users");

    // creating add product service
    app.post("/add-product", async (req, res) => {
      const add = req.body;
      const product = await Products.insertOne(add);
      console.log("getting a product", product);
      res.json(product);
      console.log(product);
    });
    app.get("/home-product", async (req, res) => {
      const cursor = Products.find({});
      const getHomeProduct = await cursor.toArray();
      res.send(getHomeProduct);
      console.log(getHomeProduct);
    });
    app.get("/place-order/:serviceId", async (req, res) => {
      const productId = req.params.serviceId;
      const query = { _id: ObjectId(productId) };
      const getProduct = await totalProducts.findOne(query);
      console.log("getting product", getProduct);
      res.send(getProduct);
    });
    app.post("/confirmOrder", async (req, res) => {
      const order = req.body;
      const confirmOrder = await Orders.insertOne(order);
      res.json(confirmOrder);
    });
    // delete product from manage products
    app.delete("/home-product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Products.deleteOne(query);

      console.log("deleting product", result);
      res.json(result);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Project Server Is Running");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
