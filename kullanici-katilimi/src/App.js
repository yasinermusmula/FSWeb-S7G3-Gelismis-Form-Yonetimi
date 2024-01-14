import { useState } from "react";
import "./App.css";
import Form from "./Form";

function App() {
  const [users, setUsers] = useState([]);

  const addUsers = (user) => {
    setUsers([...users, user]);
  };

  
  return (
    <div className="App">
      {users.map((user, index) => {
        return (
          <div key={index}>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
        );
      })}
      <Form addUsers={addUsers} />
    </div>
  );
}

export default App;
