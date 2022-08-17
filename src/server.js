require("./db/connection") 
const cors = require("cors");
const express = require("express")
const userRouter = require("./user/routes");
const app = express();
const port = 5001


app.use(express.json()); 
app.use(cors());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });