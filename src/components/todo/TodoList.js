import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTodo, updateTodo } from "../../store/todo/TodoSlice";
import "./styles.css";

const TodoList = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [editableTodoId, setEditableTodoId] = useState(null);

  const handleEditClick = (todoId) => {
    setEditableTodoId(todoId);
  };

  const handleSaveClick = (todoId, newText) => {
    dispatch(updateTodo({ id: todoId, text: newText }));
    setEditableTodoId(null);
  };

  return (
    <div className="list___main">
      {todos.map((todo) => (
        <li key={todo.id} className="input__box">
          <div
            className="todo__input__box"
            contentEditable={editableTodoId === todo.id}
            onBlur={(e) => handleSaveClick(todo.id, e.target.textContent)}
            dangerouslySetInnerHTML={{ __html: todo.text }}
          />
          <div className="todo__button__box">
            {editableTodoId !== todo.id ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="svg__icon"
                onClick={() => handleEditClick(todo.id)}
              >
                <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="svg__icon"
                onClick={() => handleSaveClick(todo.id, todo.text)}
              >
                <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
              </svg>
            )}
            <svg
              className="svg__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              onClick={() => dispatch(deleteTodo(todo.id))}
            >
              <path d="M20 7V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V7H2V5H22V7H20ZM6 7V20H18V7H6ZM7 2H17V4H7V2ZM11 10H13V17H11V10Z"></path>
            </svg>
          </div>
        </li>
      ))}
    </div>
  );
};

export default TodoList;
