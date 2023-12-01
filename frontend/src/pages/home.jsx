import React from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate } from "react-router-dom";

export default function HomePages () {
    const authContext = useContext(AuthContext);

    if (!authContext.isAuthenticated) {
        return (
            <Navigate to="/login" />
        )
    } else 
    return (
        <div>
            <h1> home </h1>
            <button onClick={authContext.logout}>Выйти</button>
        </div>
    )
};