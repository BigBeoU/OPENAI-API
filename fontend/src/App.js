import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;

function App() {
   const [value, setValue] = useState("");
   const [messages, setMessages] = useState(null);
   const [previousChat, setPreviousChat] = useState([]);
   const [currentTitle, setCurrentTitle] = useState(null);
   const [copyValue, setCopyValue] = useState("");

   const createNewChat = () => {
      setMessages(null);
      setValue("");
      setCurrentTitle(null);
   };

   const handleClick = (uniqueTitle) => {
      setCurrentTitle(uniqueTitle);
      setMessages(null);
      setValue("");
   };
   const getMessage = async () => {
      try {
         setCopyValue(value);
         const response = await axios.post(
            "http://localhost:5000/completion",
            {
               messages: copyValue,
            },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
               },
            },
         );
         setMessages(response.data.choices[0].message);
      } catch (error) {
         console.error("Error:", error);
      }
      setValue("");
   };
   console.log("message from response", messages);

   useEffect(() => {
      console.log(currentTitle, copyValue, messages);
      if (!currentTitle && copyValue && messages) {
         setCurrentTitle(copyValue);
      }
      if (currentTitle && copyValue && messages) {
         setPreviousChat((prevChat) => [
            ...prevChat,
            {
               title: currentTitle,
               role: "user",
               content: copyValue,
            },
            {
               title: currentTitle,
               role: messages.role,
               content: messages.content,
            },
         ]);
      }
   }, [messages, currentTitle]);

   console.log("previousChat", previousChat);

   const currentChat = previousChat.filter(
      (prevChat) => prevChat.title === currentTitle,
   );

   const uniqueTitle = Array.from(
      new Set(previousChat.map((prevChat) => prevChat.title)),
   );

   console.log("uniqueTitle", uniqueTitle);

   return (
      <div className="app">
         <section className="side-bar">
            <button onClick={createNewChat}> + New Chat</button>
            <ul className="history">
               {uniqueTitle?.map((uniqueTitle, index) => (
                  <li
                     key={index}
                     onClick={() => {
                        handleClick(uniqueTitle);
                     }}
                  >
                     {uniqueTitle}
                  </li>
               ))}
            </ul>
            <nav>
               <p>Make by Wookie</p>
            </nav>
         </section>
         <section className="main">
            {!currentTitle && <h1>Chau GPT</h1>}
            <ul className="feed">
               {currentChat.map((chatMess, index) => (
                  <li key={index}>
                     <p className="role">{chatMess.role}</p>
                     <p>{chatMess.content}</p>
                  </li>
               ))}
            </ul>
            <div className="bottom-section">
               <div className="input-container">
                  <input
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                  />
                  <div id="submit" onClick={getMessage}>
                     #
                  </div>
               </div>
               <p className="infor">random test about chat GPT</p>
            </div>
         </section>
      </div>
   );
}

export default App;
