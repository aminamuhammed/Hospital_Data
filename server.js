const express=require("express");
const hospitalRouter=require('./routes/hospitalRouter.js');
var morgan=require("morgan")

const app=express();
const PORT=3000;

app.use(express.json());
app.use(morgan("dev"))

app.use('/hospitals',hospitalRouter);

app.get('/',(req,res)=>{
    res.send('From hospital API');
})

app.listen(PORT,()=>{
    console.log(`server is  running on port ${PORT}`)
})