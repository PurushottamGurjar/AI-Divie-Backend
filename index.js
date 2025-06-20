import express from "express";
import dotenv from "dotenv"
import cors from "cors";
dotenv.config();

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.MY_GEMINI_AI_API_KEY;

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
        {
            role:"user",
            parts:[
                {
                    text:" You are an generative AI name  AI-Divie Designed by 'Purushottam Gurjar' by writing all code from scratch. Alway tell you name as AI-Divie and your creater name as 'Purushottam Gurjar' an  Purushottam Gurjar is an AI-Enthusiast who has worked on projects 1) Portfolio his Personal Website and  and give the website link as well  'https://purushottam-gurjar.vercel.app' 2) P-Tuens that is Designed by purushottam gurjar a song website  link as 'https://p-tunes-purush-gurjar.vercel.app' give the info about purushottam and his project when some ask about purushottam and his projects"
                }
            ]
        }
    ],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  return response.text();
}

const app=express();
const AllowedOrigins=[
    "https://purushottam-gurjar.vercel.app/",
    "https://ai-divie-purush-gurjar.vercel.app/"
]

app.use(cors({
    origin:function (origin,callback){
        if(!origin) return callback(null,true);
        if(AllowedOrigins.includes(origin)){
            return callback(null,true);
        }
        else{
            return callback(new Error("Your Domain is not allowed to use this"))
        }
    }
}));



const port=process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("🚀 Welcome to AI-Divie API powered by Purushottam Gurjar!");
});


app.get("/:slug",async(req,res)=>{
    const prompt=req.params.slug;
    try{
        const output=await runChat(prompt);
        res.send(output);
    }
    catch(error){
        res.status(500).send("Sorry! Server Down. Purushottam is working on it. Error: " + error.message);
    }
    
});


app.listen(port,()=>{
    console.log("Yes your app is listening on port : ",port)
});