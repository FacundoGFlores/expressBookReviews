const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const authHeader = req.header("Authorization"); // or req.get("Authorization")

  if (!authHeader) {
    return res.status(401).send("Access Denied: No Token Provided!");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : authHeader;

  try {
    const verified = jwt.verify(token, "fingerprint_customer");
    req.user = verified; // contains whatever you put in the JWT payload
    return next();
  } catch {
    return res.status(401).send("Invalid Token");
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
