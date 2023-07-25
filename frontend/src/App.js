import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;

function App() {
   const [value, setValue] = useState("");
   const [messages, setMessages] = useState(null);
   const [previousChat, setPreviousChat] = useState([]);
   const [currentTitle, setCurrentTitle] = useState(null);
   const [storedValue, setStoredValue] = useState("");

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
   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         setStoredValue(value); // Store the input value
         getMessage();
         setValue("");
      }
   };
   const getMessage = async () => {
      try {
         const response = await axios.post(
            "http://localhost:5000/completion",
            {
               messages: value,
            },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
               },
            },
         );
         setMessages(response.data.choices[0].message);
         setValue("");
      } catch (error) {
         console.error("Error:", error);
      }
   };
   console.log("message from response", messages);

   useEffect(() => {
      console.log(currentTitle, storedValue, messages);
      if (!currentTitle && storedValue && messages) {
         setCurrentTitle(storedValue);
      }
      if (currentTitle && storedValue && messages) {
         setPreviousChat((prevChat) => [
            ...prevChat,
            {
               title: currentTitle,
               role: "user",
               content: storedValue,
            },
            {
               title: currentTitle,
               role: messages.role,
               content: messages.content,
            },
         ]);
      }
   }, [messages, currentTitle, storedValue]);

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
                     onKeyDown={(e) => {
                        handleKeyDown(e);
                     }}
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
