import compression from "compression";
import cors from "cors";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import chatWindow from "./model/chatWindow.model.js";

import { model } from "mongoose";

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

const apiUrl = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;

app.post("/completion", async (req, res) => {
   if (!req.body.messages) {
      console.log("no message");
      return res.status(400).send("No request body found.");
   }
   try {
      const response = await axios.post(
         apiUrl,
         {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.messages }],
            max_tokens: 200,
         },
         {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
         },
      );

      let chat = new chatWindow({
         title: "",
         user: "User",
         message: req.body.messages,
         assistant: "Assistant",
         answer: response.data.choices[0].message.content,
      });

      chat.set("autoIndex", false);

      chat = await chat.save();

      res.send(response.data);
   } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
         error: "An error occurred while processing the request.",
      });
   }
});

app.get("/chats", async (req, res) => {
   const chats = await chatWindow.find();

   res.send(chats);
});

const port = process.env.PORT || 5000;
mongoose
   .connect("mongodb://127.0.0.1:27017/chatGPT", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      app.listen(port, () => console.log("app listen to port", port));
      console.log("connected to mongoDB");
   })
   .catch((err) => console.log("Can not connect mongoose", err));
