import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen() {
  const navigation = useNavigation();
  
  // 🔹 State pour le titre principal de l'application
  const [title, setTitle] = useState("📌 To-Do Lists");

  // 🔹 State contenant la liste des catégories de tâches
  const [lists, setLists] = useState([
    { id: "1", title: "Travail", tasks: [] },
    { id: "2", title: "Courses", tasks: [] },
    { id: "3", title: "Sport", tasks: [] },
  ]);

  // 🔹 State pour stocker le titre d'une nouvelle liste
  const [newListTitle, setNewListTitle] = useState("");

  /**
   * 🔥 Fonction pour ajouter une nouvelle liste
   */
  const addList = () => {
    if (newListTitle.trim() === "") return;
    setLists([...lists, { id: Date.now().toString(), title: newListTitle, tasks: [] }]);
    setNewListTitle(""); // Réinitialiser le champ après l'ajout
  };

  /**
   * 🗑️ Fonction pour supprimer une liste
   */
  const removeList = (id: string) => {
    setLists(lists.filter((list) => list.id !== id));
  };

  /**
   * 📝 Fonction pour mettre à jour les tâches et le titre d'une liste
   */
  const updateListTasks = (id: string, updatedTasks: any, updatedTitle: string) => {
    setLists(lists.map((list) =>
      list.id === id
        ? { ...list, tasks: updatedTasks, title: updatedTitle }
        : list
    ));
  };

  /**
   * 🔥 Fonction pour afficher le bouton de suppression au swipe
   */
  const renderRightActions = (id: string) => (
    <RectButton style={styles.deleteButton} onPress={() => removeList(id)}>
      <View style={styles.deleteContainer}>
        <Icon name="trash-outline" size={28} color="red" />
      </View>
    </RectButton>
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Input pour modifier le titre principal */}
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Titre principal"
        placeholderTextColor="#888"
      />

      {/* 🔹 Liste des blocs (catégories de tâches) avec swipe */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Todo", { list: item, updateListTasks })}
            >
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      {/* 🔹 Barre d'ajout de nouvelle liste */}
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

// 📌 Styles
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

  addListContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
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
