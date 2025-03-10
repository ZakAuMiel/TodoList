import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

export default function TodoScreen({ route } : { route: any }) {
  const { list, updateListTasks } = route.params;
  const [tasks, setTasks] = useState(list.tasks);
  const [title, setTitle] = useState(list.title); // 🔥 Ajout du state pour le titre
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  // Sauvegarde automatique des tâches lorsqu'elles changent
  useEffect(() => {
    updateListTasks(list.id, tasks, title);
  }, [tasks]);

  // Ajouter une tâche
  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask("");
  };

  // Supprimer une tâche
  const removeTask = (id: any) => {
    setTasks(tasks.filter((task: { id: any; }) => task.id !== id));
  };

  // Cocher/Décocher une tâche
  const toggleTask = (id: any) => {
    setTasks(
      tasks.map((task: { id: any; completed: any; }) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Activer l'édition d'une tâche
  const startEditing = (id: React.SetStateAction<null>, text: React.SetStateAction<string>) => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  // Valider l'édition d'une tâche
  const confirmEdit = () => {
    setTasks(
      tasks.map((task: { id: null; }) =>
        task.id === editingTaskId ? { ...task, text: editedTaskText } : task
      )
    );
    setEditingTaskId(null);
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Input pour modifier le titre de la liste */}
      <TextInput
        style={styles.title}
        value={title}
        onChangeText={setTitle}
        onBlur={() => updateListTasks(list.id, tasks, title)} // Sauvegarde quand on quitte le champ
        placeholder="Renommer la liste"
        placeholderTextColor="#888"
      />

      <FlatList
        data={tasks}
        contentContainerStyle={{ paddingTop: 5 }}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => (
            <RectButton style={styles.deleteButton} onPress={() => removeTask(item.id)}>
              <View style={styles.deleteContainer}>
                <Icon name="trash-outline" size={28} color="red" />
              </View>
            </RectButton>
          )}>
            
            <TouchableOpacity 
              style={styles.task} 
              onPress={() => toggleTask(item.id)} 
              onLongPress={() => startEditing(item.id, item.text)}
            >
              <Icon name={item.completed ? "checkbox-outline" : "square-outline"} size={24} color="white" />
              {editingTaskId === item.id ? (
                <TextInput
                  style={styles.taskTextInput}
                  value={editedTaskText}
                  onChangeText={setEditedTaskText}
                  onSubmitEditing={confirmEdit}
                  autoFocus
                />
              ) : (
                <Text style={[styles.taskText, item.completed && styles.completedText]}>
                  {item.text}
                </Text>
              )}
            </TouchableOpacity>
          </Swipeable>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* 🔥 Barre d'ajout de tâche avec bouton "+" */}
      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouvelle tâche..."
          placeholderTextColor="#888"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Icon name="add-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 📌 Ajout des styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    color: "white",
    fontSize: 16,
    flexShrink: 1,
    overflow: "hidden",
    maxWidth: "80%",
    paddingLeft: 10,
  },
  taskTextInput: {
    color: "white",
    fontSize: 16,
    backgroundColor: "#2C2C2C",
    borderRadius: 5,
    padding: 5,
    flex: 1,
  },
  completedText: { textDecorationLine: "line-through", color: "#888" },
  input: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    color: "white",
    padding: 10,
    borderRadius: 8,
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  addButton: {
    marginLeft: 10,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 10,
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 80,
  },
});

