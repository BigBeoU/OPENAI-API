import { Schema } from "mongoose";

const chatWindowSchema = new Schema(
   {
      title: {
         type: String,
         required: true,
      },
      user: {
         type: String,
         required: true,
      },
      message: {
         type: String,
         required: true,
         unique: true,
      },
      assistant: {
         type: String,
         required: true,
      },
      answer: {
         type: String,
         required: true,
         unique: true,
      },
   },
   { timestamps: true },
);

chatWindowSchema.set("autoIndex", false);

export default chatWindowSchema;
