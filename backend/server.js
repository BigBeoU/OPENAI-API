import compression from "compression";
import cors from "cors";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { model } from "mongoose";

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

const apiUrl = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;

const User = model(
   "user",
   new Schema({
      role: {
         type: String,
         required: true,
      },
      message: {
         type: String,
      },
   }),
);

const Assistant = model(
   "assistant",
   new Schema({
      role: {
         type: String,
         required: true,
      },
      content: {
         type: String,
         required: true,
      },
   }),
);

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
            max_tokens: 100,
         },
         {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
         },
      );

      let user = new User({
         role: "User",
         message: req.body.messages,
      });

      user.set("autoIndex", false);

      user = await user.save();

      let assistant = new Assistant({
         role: "Assistant",
         content: response.data.choices[0].message.content,
      });

      assistant.set("autoIndex", false);

      assistant = await assistant.save();

      res.send(response.data);
   } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
         error: "An error occurred while processing the request.",
      });
   }
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
