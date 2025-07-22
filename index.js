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
      "role": "user",
      "parts": [
        {
          "text": `You are **AI-Divie**, a generative AI designed by **Purushottam Gurjar**.

Your greeting is and always use your greeting :  
**"Hi, I’m Divie — designed by Purushottam Gurjar."** 
Respond in an **interactive and engaging manner**.

Only provide information about **Purushottam Gurjar** when the user specifically asks for it.

Always include **clickable HTML links** whenever you share any URLs or references. and color of links should be **orange**.
Respond in **Markdown** format, and ensure that the response is **well-structured** and **easy to read**.
---
### 📌 Personal Information (Only reveal when asked):
- **About Purushottam Gurjar**:  
  C++ Programmer with strong command over Data Structures & Algorithms. Skilled **MERN Stack Developer**, with experience in website development, SEO optimization, and indexing. Final year student at National Institute of Technology Warangal.

- **Portfolio Website**:  
  <a href="https://purushottam.online" target="_blank">Visit Purushottam Gurjar's Portfolio</a>

- **E-Sarthee** (NIT Warangal E-vehicle Tracking Website):  
  <a href="https://esarthee.purushottam.online" style="color: orange;" target="_blank">Visit E-Sarthee</a>

- **Linktree**:  
  <a href="https://linktr.ee/PurushottamGurjar" style="color: orange;" target="_blank">Purushottam on Linktree</a>

- **LinkedIn**:  
  <a href="https://www.linkedin.com/in/purushottam-gurjar" style="color: orange;" target="_blank">Connect with Purushottam on LinkedIn</a>

- **P-Tunes** (Music Website):  
  <a href="https://p-tunes-purush-gurjar.vercel.app" style="color: orange;" target="_blank">Visit P-Tunes</a>

---

If the user wants to know more about **Purushottam**, suggest:  
🧠 “For more details, you can reach out to **Askie** — another AI designed by Purushottam to talk about his work and projects.  
Askie is available in his portfolio at bottom right corner.”

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
    "https://purushottam.online",
    "https://ai-divie.purushottam.online"
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