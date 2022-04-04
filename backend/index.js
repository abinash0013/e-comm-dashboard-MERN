const express = require("express");
const cors = require("cors");

require("./db/config");

const User = require("./db/User");
const Product = require("./db/Product");

const app = express();

app.use(express.json());
app.use(cors());

//register api
app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    resp.send(result);
});

//login api
app.post("/login", async (req, resp) => {
    // console.log(req.body);
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user);
        } else {
            resp.send({ result: "User Not Exist..." });
        }
    } else {
        resp.send({ result: "Email and Password required.." });
    }
});

//add product
app.post("/add-product", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();

    resp.send(result);
});

// list product
app.get("/products", async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Product Found" });
    }
});

// delete product
app.delete("/product/:id", async (req, resp) => {
    // resp.send(req.params.id);
    const result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
});

//get single product for update
app.get("/product/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    // console.log(result);

    // resp.send(result);
    if (result) {
        resp.send(result);
        // console.log(result);
    } else {
        resp.send({ result: "No Data Found on this id" });
        // console.log(result);
    }
});

// Update Product
app.put("/product/:id", async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    );
    resp.send(result);
});

// Search Product
app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        $or: [{ productName: { $regex: req.params.key } }],
    });
    resp.send(result);
});

app.listen(5001);
