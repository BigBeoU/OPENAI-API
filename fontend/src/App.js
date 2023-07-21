import React from "react";
import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;

function App() {
   const getMessage = async () => {
      try {
         const response = await axios.post(
            "http://localhost:5000/completion",
            {
               messages: "hello, how are you?",
            },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
               },
            },
         );
         console.log(response.data);
      } catch (error) {
         console.error("Error:", error);
      }
   };
   return (
      <div className="app">
         <section className="side-bar">
            <button> + New Chat</button>
            <ul className="history">
               <li>This is a conversation</li>
            </ul>
            <nav>
               <p>Make by Wookie</p>
            </nav>
         </section>
         <section className="main">
            <h1>Chau GPT</h1>
            <ul className="feed"></ul>
            <div className="bottom-section">
               <div className="input-container">
                  <input />
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
