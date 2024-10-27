const mongoose= require ('mongoose');
const express= require('express');
const dotenv= require ('dotenv');
dotenv.config({path: './config.env'});
const usersRouter= require("./routes/user-router");
const poisRouter= require ("./routes/poi-router");



const app=express();
const PORT= process.env.PORT;
const db_uri=process.env.DB_URI;

app.use(express.json());
app.use("/users",usersRouter);
app.use("/pois",poisRouter);


mongoose.connect(db_uri)
.then(
    ()=>app.listen(PORT, () =>
    console.log(`Connected to server on http://localhost:${PORT}`)
    )
)
.catch((err)=> console.log(err))






//poiSave()

//userSave()