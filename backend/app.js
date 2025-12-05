const express = require("express");
const connectDB = require("./src/config/db");
const app = express();

require("dotenv").config();

const Name = 'boiler-plate'

const PORT = process.env.PORT
app.use(express.json());

connectDB()
console.log("hlo")

app.listen(PORT, () => {
  console.log(`Server started successfully at http://localhost:${PORT} - ${Name} backend service!`); 
});
