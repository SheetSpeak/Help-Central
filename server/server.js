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
    const location = req.body.loc

    fs.writeFile(path.join(__dirname,"Requests/SOS",`${location}.txt`),location,'utf8',(err)=>console.error(err))
    res.json({accepted:true})
})

const tempAsyncFunc = async (file,e)=>{
    const fileData = await fsp.readFile(path.join(file,e),'utf8',(err)=>console.error(err))
    return fileData
}

const read = async (file,loc,res)=>{
    const final ={data:[]}
    try {
        const dirNames = await fsp.readdir(file);

        if (dirNames.length > 0) {
            
            for (const fileName of dirNames) {
                const place = path.basename(fileName, ".txt").split(" ");
                
                const fileLat = parseFloat(place[0])
                const fileLng = parseFloat(place[1])
                const targetLat = parseFloat(loc[0])
                const targetLng = parseFloat(loc[1])

                const distance = Math.sqrt(Math.pow(fileLat - targetLat, 2) + Math.pow(fileLng - targetLng, 2))

                if (distance <= 0.1) {
                    const fileContent = await fsp.readFile(path.join(file, fileName), 'utf8')
                    final.data.push(fileContent);
                }
            }

            res.json(final)

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


app.listen(5000,'0.0.0.0',()=>console.log("listening on 5000"))