const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const cors = require('cors');
const fsp=fs.promises;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const corsOptions={
    origin:["http://localhost:5173","http://localhost:5173/#helping"]
}

app.use(cors(corsOptions))

app.post("/posts/request",(req,res)=>{
    const locStr = `${req.body.location.at(0)} ${req.body.location.at(1)}`
    fs.writeFile(path.join(__dirname,"Requests",req.body.need,locStr.concat(".txt")),JSON.stringify(req.body),'utf8',(err)=>console.log(err))
    res.json({accepted:true})
})

app.post("/posts/SOS",(req,res)=>{
    const location = req.body.loc

    fs.writeFile(path.join(__dirname,"Requests/SOS",`${location}.txt`),location,'utf8',(err)=>console.error(err))
    res.json({accepted:true})
})


const read = async (file,loc,res)=>{
    const final =[]
    const SOSfinal=[]
    try {
        const needFiles = await fsp.readdir(file);
        const SOSFiles=await fsp.readdir(path.join(__dirname,"Requests/SOS"))

        if (needFiles.length > 0||SOSFiles.length>0) {
            
            for (const fileName of SOSFiles) {
                const place = path.basename(fileName, ".txt").split(" ");
                
                const fileLat = parseFloat(place[0])
                const fileLng = parseFloat(place[1])
                const targetLat = parseFloat(loc[0])
                const targetLng = parseFloat(loc[1])

                const distance = Math.sqrt(Math.pow(fileLat - targetLat, 2) + Math.pow(fileLng - targetLng, 2))

                if (distance <= 0.1) {
                    const fileContent = await fsp.readFile(path.join(__dirname,"Requests/SOS", fileName), 'utf8')
                    SOSfinal.push(fileContent);
                }
                
            }
            for (const fileName of needFiles) {
                const place = path.basename(fileName, ".txt").split(" ");
                
                const fileLat = parseFloat(place[0])
                const fileLng = parseFloat(place[1])
                const targetLat = parseFloat(loc[0])
                const targetLng = parseFloat(loc[1])

                const distance = Math.sqrt(Math.pow(fileLat - targetLat, 2) + Math.pow(fileLng - targetLng, 2))

                if (distance <= 0.1) {
                    const fileContent = await fsp.readFile(path.join(file, fileName), 'utf8')
                    final.push(fileContent);
                }
            }

            const send = {data:final,SOSdata:SOSfinal}

            res.json(send)

        } else {
            res.json({ req: null })
        }

    } catch (error) {
        console.error(error)
        res.json({ error: "Internal server error reading location data" })
    }
    
}

app.post("/posts/provide",(req,res)=>{
    read(path.join(__dirname,'Requests',req.body.p),req.body.loc,res)
})


const asyncRead = async (req,res)=>{
    const readFile = await fsp.readFile(path.join(__dirname,"Requests",req.body.need,`${req.body.file}.txt`),"utf-8")
    if(JSON.parse(readFile).status=="a"){
        const newData={...JSON.parse(readFile),status:"m"}
        fs.writeFile(path.join(__dirname,"Requests",req.body.need,`${req.body.file}.txt`),JSON.stringify(newData),"utf8",(err)=>console.error(err))
    }else{
        fs.unlink(path.join(__dirname,"Requests",req.body.need,`${req.body.file}.txt`),(err)=>console.log(err))
    }
    res.json({heh:"heh"})

}

app.post("/posts/delete",(req,res)=>{
    asyncRead(req,res)
})

app.listen(5000,'0.0.0.0',()=>console.log("listening on 5000"))