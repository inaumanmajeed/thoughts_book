import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../../store/todo/TodoSlice";
import "./styles.css";

const AddTodo = () => {
  const [input, setInput] = React.useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const addTodoHandler = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a valid todo.");
      return;
    }
    dispatch(addTodo(input));
    setInput("");
    setError("");
  };
  const handleChange = (e) => {
    setInput(e.target.value);
    setError("");
  };

  return (
    <div className="input___main">
      <h2>Customize your Thoughts</h2>
      <form onSubmit={addTodoHandler} className="todo__add__main input__box">
        <input
          className={`todo__input__box ${error ? "error" : ""}`}
          type="text"
          placeholder="Lemme listen your thoughts"
          onChange={(e) => {
            handleChange(e);
            setInput(e.target.value);
          }}
          value={input}
        />
        <span className="todo__button__box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="svg__icon"
            onClick={addTodoHandler}
          >
            <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
          </svg>
        </span>
      </form>
    </div>
  );
};

export default AddTodo;
