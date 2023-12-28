import React from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";
import { useData } from "../hooks/useData";
import { useSelector } from "react-redux";

export function HomePage () {
    const authContext = useContext(AuthContext);

    useData();
    const channels = useSelector((store) => store.channels);
    const messages = useSelector((store) => store.messages)
    const renderChannels = () => { 
        return channels.ids.map((id) => 
        { const channel = channels.entities[id];
            return (<div key={id}>{channels.entities[id].name}</div>)});  
    }
    
    const renderMessages = () => {
        return messages.ids.map((id) => {
            const message = messages.entities[id];
                return (<div key={message.id}>{message.body}</div>)
        }
    )}



    if (!authContext.isAuthenticated) {
        return (
            <Navigate to="/login" />
        )
    } else 
    return (
        <div>
            <header>
                <nav className="navbar">
                    <div className="navbarcontainer">
                        <a>DISH Chat</a>
                        <button onClick={authContext.logout}>Выйти</button>
                    </div>
                </nav>
            </header>
            <main>
                <div className="body-container shadow">
                    <section className="channels-container">
                        <div>{channels? renderChannels() : <span>Loading</span>}</div>
                    </section>
                    <section className="messages-container">
                    {/* <div>{messages? renderMessages() : <span>Loading</span>}</div> */}
                        <form>
                            <input/>
                            <button></button>
                        </form>
                    </section>
                </div>
                
                
            </main>
        </div>
    )
};