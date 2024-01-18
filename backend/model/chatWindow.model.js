import { model } from "mongoose";

import chatWindowSchema from "../schema/chatWindow.shema.js";

const chatWindow = model("chatWindow", chatWindowSchema, "chatWindow");
export default chatWindow;
