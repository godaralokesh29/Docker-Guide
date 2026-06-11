import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.listen(3000)

app.get("/",async (_req,res)=>{
    const data=await prisma.user.findMany();
    console.log(data)
    
    
    res.send({
        message:"hello guys"
    })
})

app.post("/users",async (_req,res)=>{
    await prisma.user.create({
       data:{
        id:Math.random().toString(),
        name:Math.random().toString()

       }
        
    })
    res.json({
        message:"user done"
    })
    
})
