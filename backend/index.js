//imports express, cors, mongodb as mongoose
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { reset } = require("nodemon");
const dotenv = require("dotenv").config();
const Stripe = require("stripe");

//express api
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
//mongodb connection
console.log(process.env.MONGODB_URL);
//mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to Database successfully"))
  .catch((error) => console.log("error in connection to Database"));

//Schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
      quantity: Number,
    },
  ],
  wishlist: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
    },
  ],
  myorders: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
      quantity: Number,
    },
  ]
});

//model
const userModel = mongoose.model("user", userSchema);


//fetch javascript api
app.get("/", (req, res) => {
  res.send("Server is running");
});
// signup api
app.post("/signup", async (req, res) => {
  console.log(req.body);
  //check if email is already in database or new email
  const { email } = req.body;

  const result = await userModel.findOne({ email: email }).exec();
  console.log(result);
  if (result) {
    res.send({ message: "Email already registered", alert: false });
  } else {
    const data = userModel(req.body);
    const save = await data.save();
    res.send({ message: "Signed up successfully", alert: true });
  }
});

//login api
app.post("/login", async (req, res) => {
  const { email } = req.body;
  const result = await userModel.findOne({ email: email }).exec();
  if (result) {
    const dataSend = {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      image: result.image,
    };
    console.log(dataSend);
    res.send({ message: "login is successful", alert: true, data: dataSend });
  } else {
    res.send({
      message: "Email is not registered/Please signup",
      alert: false,
    });
  }
});

//new product section
const schemaProduct = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});

const productModel = mongoose.model("product", schemaProduct);

//save product in database
app.post("/uploadProduct", async(req, res) => {
  //console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()

  res.send({ message: "Upload successfully" });
});

//products api
app.get("/product", async(req, res) => {
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})

app.get("/users", async(req, res) => {
  const data = await userModel.find({})
  res.send(JSON.stringify(data))
})

app.get('/admin/orders', async (req, res) => {
  try {
    // Fetch all users with their order details
    const usersWithOrders = await userModel.find({}, 'firstName lastName myorders')
      .populate({
        path: 'myorders.productId',
        model: 'product',
        select: 'name price image', // Include 'image' in the select option
      })
      .exec();

    // Format the response as needed
    const ordersData = usersWithOrders.map(user => ({
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      orders: user.myorders.map(order => ({
        productName: order.productId.name,
        quantity: order.quantity,
        price: order.productId.price,
        image: order.productId.image, // Include the image property
      })),
    }));

    // Send the formatted response to the admin dashboard
    res.json({ success: true, ordersData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/admin/orders/sum', async (req, res) => {
  try {
    const allUsers = await userModel.find();
    // Calculate the sum of orders
    const totalOrders = allUsers.reduce((acc, user) => {
      return acc + (user.myorders ? user.myorders.length : 0);
    }, 0);

    res.json({ totalOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/addToCart", async (req, res) => {

  const { userId, productId, quantity } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found", alert: false });
    }

    // Check if the product is already in the cart
    const existingCartItem = user.cart.find(item => item.productId.equals(productId));

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.send({ message: "Product added to cart successfully", alert: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});

app.post("/removeFromCart", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    const index = user.cart.findIndex(item => item.productId.equals(productId));

    if (index === -1) {
      return res.status(404).json({ message: "Product not found in cart", alert: false });
    }

    user.cart.splice(index, 1);

    await user.save();

    res.json({ message: "Product removed from cart successfully", alert: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});


app.post("/wishlist", async (req, res) => {
  const { userId, productId} = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found", alert: false });
    }

    const existingCartItem = user.wishlist.find(item => item.productId.equals(productId));

    if (existingCartItem) {
       res.send("already in whishList")
    } else {
      user.wishlist.push({ productId });
    }

    await user.save();

    res.send({ message: "Product added to whishList successfully", alert: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});

app.get("/getCart", async (req, res) => {
  const userId = req.query.userId;  // Assuming the query parameter is named "id"

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", alert: false });
    }

    const user = await userModel.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    const cartItems = user.cart.map((cartItem) => ({
      product: cartItem.productId,
      quantity: cartItem.quantity,
    }));

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});

app.get('/get-wishlist', async (req, res) => {
  const userId = req.query.userId;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", alert: false });
    }

    const user = await userModel.findById(userId).populate("wishlist.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    const cartItems = user.wishlist.map((Item) => ({
      product: Item.productId,
    }));
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});

app.post("/increaseQuantity", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }


    const cartItem = user.cart.find(item => item.productId.equals(productId));
    console.log(cartItem)

    if (cartItem) {

      cartItem.quantity += 1;

      await user.save();

      res.send({ message: "Quantity increased successfully", alert: true, updatedUser: user });
    } else {
      return res.status(404).json({ message: "Product not found in cart", alert: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});

app.post("/decreaseQuantity", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }


    const cartItem = user.cart.find(item => item.productId.equals(productId));
    console.log(cartItem)

    if (cartItem) {
      if(cartItem.quantity> 1)
        cartItem.quantity -= 1;

      await user.save();

      res.send({ message: "Quantity increased successfully", alert: true, updatedUser: user });
    } else {
      return res.status(404).json({ message: "Product not found in cart", alert: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});

app.post('/add-to-myorders', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', alert: false });
    }

    // Add cart items to myorders
    user.myorders.push(...user.cart);

    // Clear the cart
    user.cart = [];

    // Save the changes
    await user.save();

    res.status(200).json({ message: 'Products added to myorders successfully', alert: true });
  } catch (error) {
    console.error('Error adding products to myorders:', error);
    res.status(500).json({ message: 'Internal Server Error', alert: false });
  }
});

app.post("/getOrders", async (req, res) => {
  const {userId} = req.body;
  console.log(userId)
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", alert: false });
    }

    const user = await userModel.findById(userId).populate("myorders.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found", alert: false });
    }

    const cartItems = user.myorders.map((cartItem) => ({
      product: cartItem.productId,
    }));

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", alert: false });
  }
});

// app.post('/place-order', async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found', alert: false });
//     }

//     // Check if the user has items in the cart
//     if (user.cart.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty', alert: false });
//     }

//     // Create a new order
//     const order = new orderModel({
//       userId: user._id,
//       items: user.cart.map(item => ({
//         productId: item.productId,
//         quantity: item.quantity,
//       })),
//       total: calculateTotal(user.cart),
//       date: new Date(),
//     });

//     // Save the order
//     await order.save();

//     // Clear the user's cart
//     user.cart = [];
//     await user.save();

//     res.status(200).json({ message: 'Order placed successfully', alert: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error', alert: false });
//   }
// });

// app.get('/get-orders', async (req, res) => {
//   const { userId } = req.query;

//   try {
//     const orders = await orderModel
//       .find({ userId })
//       .populate({
//         path: 'items.productId',
//         model: productModel,
//         select: 'name category image price description',
//       });

//     res.status(200).json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ message: 'Internal Server Error', alert: false });
//   }
// });



//payment-gateway api
//console.log((process.env.STRIPE_SECRET_KEY))
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
app.post("/payment", async(req,res)=>{
  //console.log(req.body)
  try {
  const params = {
    submit_type : 'pay',
    mode : "payment",
    payment_method_types : ['card'],
    billing_address_collection: "auto",
    shipping_options : [{shipping_rate : "shr_1NVApEHeneEHcTX4Nx9tRyDU"}],

    line_items : req.body.map((item)=>{
    return{
        price_data : {
        currency : "usd",
        product_data : {
        name : item.name,
        },
        unit_amount : item.price * 100,
      },
      adjustable_quantity : {
        enabled : true,
        minimum : 1,
      },
      quantity : item.qty
    }
  }),
  success_url : `${process.env.FRONTEND_URL}/success`,
  cancel_url : `${process.env.FRONTEND_URL}/cancel`,
  }
  const session = await stripe.checkout.sessions.create(params)
  res.status(200).json(session.id)
  }
  catch (error) {
    res.status(error.statusCode || 500).json(error.message)
  }
})


app.listen(PORT, () => console.log("Server is running at port : " + PORT));
