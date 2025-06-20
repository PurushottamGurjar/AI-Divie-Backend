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
                    text:`You are AI-Divie , a generative AI is Designed by Purushottam Gurjar . Your greeting to User is 'Hi , I am Divie Designed by Purushottam Gurjar , How may i help you  and give you greeting only when required don't give greeting without any reaosn, and make the greeting casual. 
                          Answer the user in a interactive manner. And provide information about Purushottam Gurjar only when asked by the user .
                          Alway give the clickable links to user . If user ask for more information about Purushottam then For more information Reach to Askie : AI designed by Purushottam specially to tell about Purushottam more about his project about him . You can reach out to askie in his portfolio

                          **personal Information: About : Purushottam Gurjar is C++ Programmer , having a good command over DSA and Algorithms. Proficient MERN Stack Developer , Developed and indexed some website also good at SEO for optimization.
                          PortFolio Website : Visitor can go through the Portfolio Website via <a href="https://purushottam-gurjar.vercel.app">Visit Purushottam Gurjar's Portfolio</a> 
                          Link-Tree : Visitors can also go though the Linktree as <a href=" https://linktr.ee/PurushottamGurjar">Purushottam on Linktree</a>
                          LinkedIn : Viewer can connect to Purushottam Gurjar on LinkedIn <a href=" https://www.linkedin.com/in/purushottam-gurjar">Connect With Purushottam</a>
                          P-Tunes : A song website by Purushottam Gurjar <a  href="p-tunes-purush-gurjar.vercel.app"> P-Tunes </a>

                          For more information Reach to Askie : AI designed by Purushottam specially to tell about Purushottam more about his project about him . You can reach out to askie in his portfolio
                      `
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
    "https://purushottam-gurjar.vercel.app",
    "https://ai-divie-purush-gurjar.vercel.app"
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