import compression from "compression";
import cors from "cors";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import dotenv from "dotenv/config";

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

const apiUrl = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;

app.get("/completion", async (req, res) => {
   const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "What is the capital of France?" },
      { role: "assistant", content: "The capital of France is Paris." },
   ];

   try {
      const response = await axios.post(
         apiUrl,
         {
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 100,
            temperature: 0.7,
            n: 1,
         },
         {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${apiKey}`,
            },
         },
      );

      const completion = response.data.choices[0];
      console.log(completion);
      res.status(200).json({ response: completion });
   } catch (error) {
      console.error("Error:", error.response.data);
      res.status(500).json({
         error: "An error occurred while processing the request.",
      });
   }
});

app.post("/completion", async (req, res) => {
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

      res.send(response.data);
   } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
         error: "An error occurred while processing the request.",
      });
   }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("app listen to port", port));
