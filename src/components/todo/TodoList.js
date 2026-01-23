import React, { useState, useEffect, useRef, useOptimistic, useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteThought, updateThought } from "../../store/todo/TodoSlice";
import "./styles.css";

const TodoList = () => {
  const todos = useSelector((state) => state.todo.todos);
  const loading = useSelector((state) => state.todo.loading);
  const dispatch = useDispatch();
  const [editableTodoId, setEditableTodoId] = useState(null);
  const [deletingTodoId, setDeletingTodoId] = useState(null);
  const [savingTodoId, setSavingTodoId] = useState(null);
  const [isPending, startTransition] = useTransition();
  const contentEditableRefs = useRef({});

  // Use useOptimistic for optimistic updates
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    (state, { type, todoId, text }) => {
      if (type === "update") {
        return state.map(todo =>
          todo.id === todoId ? { ...todo, text } : todo
        );
      }
      if (type === "delete") {
        return state.filter(todo => todo.id !== todoId);
      }
      return state;
    }
  );

  const handleEditClick = (todoId) => {
    setEditableTodoId(todoId);
  };

  const handleSaveClick = async (todoId, newText) => {
    if (!newText.trim()) {
      setEditableTodoId(null);
      return;
    }
    
    const currentTodo = todos.find(t => t.id === todoId);
    if (!currentTodo) return;

    // Optimistically update UI
    updateOptimisticTodos({ type: "update", todoId, text: newText });
    setSavingTodoId(todoId);
    setEditableTodoId(null);
    
    startTransition(async () => {
      try {
        await dispatch(updateThought({ id: todoId, text: newText })).unwrap();
      } catch (err) {
        console.error("Failed to update thought:", err);
        // The optimistic update will be reverted automatically when Redux state updates
      } finally {
        setSavingTodoId(null);
      }
    });
  };

  const handleDeleteClick = (todoId) => {
    setDeletingTodoId(todoId);
  };

  const handleDeleteConfirm = async (todoId) => {
    // Optimistically remove from UI
    updateOptimisticTodos({ type: "delete", todoId });
    setDeletingTodoId(null);
    
    startTransition(async () => {
      try {
        await dispatch(deleteThought(todoId)).unwrap();
      } catch (err) {
        console.error("Failed to delete thought:", err);
        // The optimistic update will be reverted automatically when Redux state updates
      }
    });
  };

  const handleDeleteCancel = () => {
    setDeletingTodoId(null);
  };

  // Update contentEditable when entering edit mode
  useEffect(() => {
    if (editableTodoId && contentEditableRefs.current[editableTodoId]) {
      const element = contentEditableRefs.current[editableTodoId];
      const todo = todos.find(t => t.id === editableTodoId);
      if (todo && element.textContent !== todo.text) {
        element.textContent = todo.text;
      }
    }
  }, [editableTodoId, todos]);

  const isLoading = (todoId) => {
    return savingTodoId === todoId && (loading || isPending);
  };

  return (
    <div className="list___main">
      {optimisticTodos.map((todo) => {
        const isEditing = editableTodoId === todo.id;
        const isDeleting = deletingTodoId === todo.id;
        const isSaving = isLoading(todo.id);

        return (
          <li key={todo.id} className="input__box">
            <div
              ref={(el) => (contentEditableRefs.current[todo.id] = el)}
              className="todo__input__box"
              contentEditable={isEditing && !isDeleting}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                if (isEditing && !isDeleting) {
                  handleSaveClick(todo.id, e.target.textContent);
                }
              }}
            >
              {isDeleting ? "Are you sure you want to delete this thought?" : (!isEditing && todo.text)}
            </div>
            <div className="todo__button__box">
              {isSaving ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : isDeleting ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="svg__icon"
                    onClick={() => handleDeleteConfirm(todo.id)}
                  >
                    <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="svg__icon"
                    onClick={handleDeleteCancel}
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </>
              ) : (
                <>
                  {!isEditing ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="svg__icon"
                        onClick={() => handleEditClick(todo.id)}
                      >
                        <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                      </svg>
                      <svg
                        className="svg__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        onClick={() => handleDeleteClick(todo.id)}
                      >
                        <path d="M20 7V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V7H2V5H22V7H20ZM6 7V20H18V7H6ZM7 2H17V4H7V2ZM11 10H13V17H11V10Z"></path>
                      </svg>
                    </>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="svg__icon"
                      onClick={() => {
                        const text = contentEditableRefs.current[todo.id]?.textContent || "";
                        handleSaveClick(todo.id, text);
                      }}
                    >
                      <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                    </svg>
                  )}
                </>
              )}
            </div>
          </li>
        );
      })}
    </div>
  );
};

export default TodoList;
