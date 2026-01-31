import { useState, useEffect } from "react";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import { getAllPersons, addPerson, updatePerson } from "./services/phone.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: null, type: null });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPersons();
        setPersons(response);
      } catch (error) {
        console.error("Error fetching persons:", error);
        showNotification("Failed to load contacts", "error");
      }
    };

    fetchData();
  }, []);

  

  const handlePutName = async (event) => {
    event.preventDefault();
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      );

      if (confirmUpdate) {
        try {
          const updatedPerson = { ...existingPerson, number: newNumber };
          const response = await updatePerson(existingPerson.id, updatedPerson);
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : response,
            ),
          );
          setNewName("");
          setNewNumber("");
          showNotification(`Updated ${newName}'s number`, "success");
        } catch (error) {
          console.error("Error updating person:", error);
          showNotification(
            `Failed to update ${newName}: ${error.response?.data?.error || error.message}`,
            "error",
          );
        }
      }
      return;
    } 
  }

  const handleAddName = async (event) => {
    event.preventDefault();

    
    if (newNumber === "" || newName === "") {
      showNotification("Please fill in both name and number", "error");
      return;
    }

    
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (existingPerson) {
      handlePutName(event);
      return;
    }

    try {
      
      const nameObject = {
        name: newName,
        number: newNumber,
      };

      
      const response = await addPerson(nameObject);

      
      setPersons(persons.concat(response));
      setNewName("");
      setNewNumber("");
      showNotification(`Added ${newName}`, "success");
    } catch (error) {
      console.error("Error adding person:", error);
      showNotification(
        `Failed to add ${newName}: ${error.response?.data?.error || error.message}`,
        "error",
      );
    }
  };

  const handleNameChange = (event) => {
    setNewName(event?.target?.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event?.target?.value);
  };

  const personsToShow = persons.filter((person) =>
    person?.name?.toLowerCase()?.includes(filter?.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addName={handleAddName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        setPersons={setPersons}
        persons={persons}
        showNotification={showNotification}
      />
    </div>
  );
};

export default App;
