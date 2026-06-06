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
    const locStr = `${req.body.location.at(0)} ${req.body.location.at(1)}`
    fs.writeFile(path.join(__dirname,"Requests",req.body.need,locStr.concat(".txt")),JSON.stringify(req.body),'utf8',(err)=>console.log(err))
    res.json({accepted:true})
})

app.post("/posts/SOS",(req,res)=>{
    const location = req.body

    fs.writeFile(path.join(__dirname,"SOS",location),location,'utf8')
    res.json({accepted:true})
})

const tempAsyncFunc = async (file,e)=>{
    const fileData = await fsp.readFile(path.join(file,e),'utf8',(err)=>console.error(err))
    return fileData
}

const read = (file,loc,res)=>{
    fs.readdir(file,(err,e)=>{
        if (err) throw err
        else{
            let final =[]
            e.forEach(a => {
                const place = path.basename(path.join(file,a),".txt").split(" ")
                if((parseFloat(place.at(0))-loc.at(0)+parseFloat(place.at(1)-loc.at(1)))<=3){
                    fs.readFile(path.join(file,a),'utf8',(err,data)=>{
                        if (err) throw err
                        else{
                            final.push(data)
                            console.log(final)

                        }
                    })
            res.json({req:final})
                }
            })
        }
        
    })
}

app.post("/posts/provide",(req,res)=>{
    // const sos = read(path.join(__dirname,'SOS'),req.body.loc)
    // console.log(sos)
    read(path.join(__dirname,'Requests',req.body.p),req.body.loc,res)
})


app.listen(5000,'0.0.0.0',()=>console.log("listening on 5000"))