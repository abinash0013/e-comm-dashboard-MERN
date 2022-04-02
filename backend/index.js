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
    let product = await Product.find();
    if (product.length > 0) {
        resp.send(product);
    } else {
        resp.send({ result: "No Product Found" });
    }
});

app.listen(5001);
