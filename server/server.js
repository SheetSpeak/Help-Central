const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const cors = require('cors');
const fsp=fs.promises;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const corsOptions={
    origin:["http://localhost:5173"]
}

app.use(cors(corsOptions))

app.post("/posts/request",(req,res)=>{
    console.log(req.body)
    res.json({accepted:true})
})


app.listen(5000,'0.0.0.0',()=>console.log("listening on 5000"))