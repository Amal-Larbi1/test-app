import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css';

const API_URL = "http://localhost:3000";

export default function TodoList({ onLogout }) {
  const [items, setItems] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched items:", res.data);
      setItems(res.data);
    } catch (err) {
      console.error("Erreur de chargement des tâches:", err);
      alert("Erreur de chargement des tâches");
    }
  };

  const addItem = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(
        `${API_URL}/items`,
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask("");
      fetchItems();
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      alert("Erreur lors de l'ajout");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(
        `${API_URL}/items/${id}`,
        { title: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditText("");
      fetchItems();
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      alert("Erreur lors de la modification");
    }
  };

  const styles = {
    container: {
      maxWidth: 600,
      margin: "2rem auto",
      padding: "1rem",
      border: "1px solid #ccc",
      borderRadius: 8,
    },
    input: {
      width: "70%",
      padding: "0.5rem",
      marginRight: "0.5rem",
    },
    button: {
      padding: "0.5rem 1rem",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Ma ToDo List</h2>
      <button
        data-cy="logout"
        onClick={() => {
          localStorage.removeItem("token");
          onLogout();
        }}
        style={{ ...styles.button, marginBottom: "1rem" }}
      >
        Déconnexion
      </button>

      <div style={{ marginBottom: "1rem" }}>
        <input
          name="newTask"
          data-cy="new-task-input"
          type="text"
          placeholder="Nouvelle tâche"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={styles.input}
        />
        <button
          className="add"
          data-cy="add-task"
          onClick={addItem}
          style={styles.button}
        >
          Ajouter
        </button>
      </div>

      {items.length === 0 && <p data-cy="no-tasks">Aucune tâche disponible.</p>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            data-cy={`task-${item.id}`}
            style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}
          >
            {editId === item.id ? (
              <>
                <input
                  name="editTask"
                  data-cy="edit-task-input"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flexGrow: 1, padding: "0.4rem", marginRight: "0.5rem" }}
                />
                <button
                  className="save"
                  data-cy="save-task"
                  onClick={() => saveEdit(item.id)}
                  style={{ marginRight: "0.3rem" }}
                >
                  Sauvegarder
                </button>
                <button
                  data-cy="cancel-edit"
                  onClick={() => setEditId(null)}
                >
                  Annuler
                </button>
              </>
            ) : (
              <>
                <span
                  className="todo-item"
                  data-cy="task-title"
                  style={{ flexGrow: 1 }}
                >
                  {item.title}
                </span>
                <button
                  className="edit"
                  data-cy="edit-task"
                  onClick={() => {
                    setEditId(item.id);
                    setEditText(item.title);
                  }}
                  style={{ marginRight: "0.3rem" }}
                >
                  Modifier
                </button>
                <button
                  className="delete"
                  data-cy="delete-task"
                  onClick={() => deleteItem(item.id)}
                >
                  Supprimer
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
