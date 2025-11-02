import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TaskManager from "./pages/TaskManager";

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<TaskManager />} />
      <Route path="/" element={<Navigate to="/register" />} />
    </Routes>
  );
};

export default App;
