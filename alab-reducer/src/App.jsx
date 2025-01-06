// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
import React, { useReducer, useState } from "react";
import "./App.css";

// Initial State - Starting with an empty list of todos.
const initialState = [];

// Reducer Function - Handles all the actions we need for managing todos.
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      // Adding a new todo to the top of the list.
      return [
        {
          id: Date.now(),
          text: action.text,
          complete: false,
          isEditing: false,
        },
        ...state,
      ];
    case "TOGGLE_COMPLETE":
      // Toggle whether a todo is complete.
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, complete: !todo.complete } : todo
      );
    case "DELETE_TODO":
      // Remove a todo if it's complete. Keeps it otherwise.
      return state.filter((todo) => todo.id !== action.id);
    case "EDIT_TODO":
      // Switch the todo into editing mode.
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, isEditing: true } : todo
      );
    case "SAVE_TODO":
      // Save changes made to the todo and exit editing mode.
      return state.map((todo) =>
        todo.id === action.id
          ? { ...todo, text: action.text, isEditing: false }
          : todo
      );
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [newTodo, setNewTodo] = useState(""); // Local state just for the input field.

  // Handle adding a new todo - only if the input isn't empty.
  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      dispatch({ type: "ADD_TODO", text: newTodo });
      setNewTodo(""); // Clear input field after adding.
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      {/* Input for adding new todos */}
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)} // Update input value as user types.
          placeholder="Add a new todo..."
        />
        <button onClick={handleAddTodo}>Add</button>{" "}
        {/* Add button triggers the add action. */}
      </div>

      {/* List of todos */}
      <ul>
        {state.map((todo) => (
          <li key={todo.id} className={todo.complete ? "completed" : ""}>
            {todo.isEditing ? (
              // Show input field and save button if in editing mode.
              <>
                <input
                  type="text"
                  defaultValue={todo.text}
                  onChange={(e) => (todo.text = e.target.value)}
                />
                <button
                  onClick={() =>
                    dispatch({
                      type: "SAVE_TODO",
                      id: todo.id,
                      text: todo.text,
                    })
                  }
                >
                  Save
                </button>
              </>
            ) : (
              // Normal display mode with checkbox, edit, and delete buttons.
              <>
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={() =>
                    dispatch({ type: "TOGGLE_COMPLETE", id: todo.id })
                  }
                />
                <span>{todo.text}</span>
                <button
                  onClick={() => dispatch({ type: "EDIT_TODO", id: todo.id })}
                  disabled={todo.complete} // Disable edit button if complete.
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch({ type: "DELETE_TODO", id: todo.id })}
                  disabled={!todo.complete} // Disable delete button unless complete.
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
