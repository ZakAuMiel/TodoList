import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("📌 Mes To-Do Lists");
  const [lists, setLists] = useState([
    { id: "1", title: "Travail", tasks: [] },
    { id: "2", title: "Courses", tasks: [] },
    { id: "3", title: "Sport", tasks: [] },
  ]);
  const [newListTitle, setNewListTitle] = useState("");

  // Ajouter une liste
  const addList = () => {
    if (newListTitle.trim() === "") return;
    setLists([...lists, { id: Date.now().toString(), title: newListTitle, tasks: [] }]);
    setNewListTitle("");
  };

  // Supprimer une liste
  const removeList = (id: string) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  // Mettre à jour les tâches d'une liste
  const updateListTasks = (id: string, updatedTasks: any) => {
    setLists(lists.map((list) => (list.id === id ? { ...list, tasks: updatedTasks } : list)));
  };

  // Bouton de suppression (swipe)
  const renderRightActions = (id: string) => (
    <RectButton style={styles.deleteButton} onPress={() => removeList(id)}>
      <View style={styles.deleteContainer}>
        <Icon name="trash-outline" size={28} color="red" />
      </View>
    </RectButton>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Titre principal"
        placeholderTextColor="#888"
      />

      {/* Liste des blocs avec swipe */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.card}>
              <Text
                style={styles.cardText}
                onPress={() => navigation.navigate("Todo", { list: item, updateListTasks })}
              >
                {item.title}
              </Text>
            </View>
          </Swipeable>
        )}
      />

      {/* Ajouter un bloc */}
      <View style={styles.addListContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouvelle liste..."
          placeholderTextColor="#888"
          value={newListTitle}
          onChangeText={setNewListTitle}
          onSubmitEditing={addList}
        />
        <Icon name="add-circle-outline" size={32} color="white" onPress={addList} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  titleInput: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    padding: 5,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    color: "white",
    fontSize: 18,
  },
  addListContainer: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  input: { flex: 1, backgroundColor: "#1E1E1E", color: "white", padding: 10, borderRadius: 8, marginRight: 10 },
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
