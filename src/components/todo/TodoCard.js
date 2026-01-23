import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../../store/auth/AuthSlice";
import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import "./styles.css";

const TodoCard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <div className="main__container">
      <div className="squares">
        <div className="square" style={{ "--i": 0 }}></div>
        <div className="square" style={{ "--i": 1 }}></div>
        <div className="square" style={{ "--i": 2 }}></div>
        <div className="square" style={{ "--i": 3 }}></div>
        <div className="square" style={{ "--i": 4 }}></div>
        <div className="square" style={{ "--i": 5 }}></div>
        </div>
        <div className="container__content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0 }}>Welcome, {user?.username ? user?.username.charAt(0).toUpperCase() + user?.username.slice(1) : "User"}!</h2>
            <button 
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "5px",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
                position: "absolute",
                right: "10px",
                top: "10px"
              }}
            >
              Logout
            </button>
          </div>
          <AddTodo />
          <h2>Memories</h2>
          <TodoList />
        </div>
      </div>
    </>
  );
};

export default TodoCard;
