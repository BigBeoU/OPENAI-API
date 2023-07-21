import React from "react";

function App() {
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
                  <div id="submit">#</div>
               </div>
               <p className="infor">random test about chat GPT</p>
            </div>
         </section>
      </div>
   );
}

export default App;
