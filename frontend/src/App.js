import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;

function App() {
   const [value, setValue] = useState("");
   const [messages, setMessages] = useState(null);
   const [previousChat, setPreviousChat] = useState([]);
   const [currentTitle, setCurrentTitle] = useState(null);
   const [storedValue, setStoredValue] = useState([]);
   const [storedResData, setStoredResData] = useState([]);
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
         if (!value) return;
         getMessage();
      }
   };

   console.log("message from response", messages);

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
         setStoredValue(value);
         setValue("");
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      // Fetch the data from the server when the component mounts
      const fetchData = async () => {
         try {
            const response = await axios.get("http://localhost:5000/chats");
            setStoredResData(response.data);
            console.log("response.data", response.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };
      fetchData();
   }, []);

   useEffect(() => {
      // This code will run every time storedValue is updated
      console.log("storedValue has changed:", storedResData[0]);
      if (!storedResData.length) return;
      setMessages(storedResData[0].answer);
      setStoredValue(storedResData[0].message);
      setCurrentTitle(storedValue);

      // if (!currentTitle && messages && storedValue) {
      //    setCurrentTitle(storedValue);
      // }
      if (currentTitle && storedResData[0].message && storedResData[0].answer) {
         //check array is not change return
         setPreviousChat((prevChat) => [
            ...prevChat,
            {
               title: currentTitle,
               role: "User",
               content: storedValue,
            },
            {
               title: currentTitle,
               role: "Assistant",
               content: messages,
            },
         ]);
      }
   }, [currentTitle, storedValue, messages]);

   // useEffect(() => {
   //    if (!currentTitle && storedValue && messages) {
   //       setCurrentTitle(storedValue);
   //    }
   //    if (currentTitle && storedValue && messages) {
   //       //check array is not change return
   //       setPreviousChat((prevChat) => [
   //          ...prevChat,
   //          {
   //             title: currentTitle,
   //             role: "user",
   //             content: storedValue,
   //          },
   //          {
   //             title: currentTitle,
   //             role: messages.role,
   //             content: messages.content,
   //          },
   //       ]);
   //    }
   // }, [currentTitle, storedValue, messages]);

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
