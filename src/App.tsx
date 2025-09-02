import React, { useState, useEffect } from "react";
import Login from "../src/components/Login";
import ShoppingList from "../src/components/ShoppingList";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = (username: string, password: string) => {
    if (username === "demo" && password === "demo123") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <>
      {isLoggedIn ? (
        <ShoppingList onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
