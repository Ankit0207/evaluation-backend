const express = require("express");
const { connection } = require("./db");
const { userRoute } = require("./routes/userRoute");
const { postRoute } = require("./routes/postRoute");
const app = express();

app.use(express.json());


app.use("/user",userRoute);
app.use("/posts",postRoute);


app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log(`server is running at port ${process.env.PORT}`);
    } catch (err) {
        console.log(err);
    }
})
