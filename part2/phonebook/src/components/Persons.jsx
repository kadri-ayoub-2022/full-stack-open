import { deletePerson } from "../services/phone";

const Persons = ({ personsToShow, setPersons, persons , showNotification }) => {
  const handleDelete = async (id, name) => {

    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }

    try {
      await deletePerson(id);

      setPersons(persons.filter((person) => person.id !== id));
      showNotification(`Deleted ${name}`, "success");
    } catch (error) {
      console.error("Error deleting person:", error);
      alert(`Failed to delete ${name}`);
      showNotification(`Failed to delete ${name}: ${error.response?.data?.error || error.message}`, "error");
    }
  };

  return (
    <div>
      {personsToShow.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>
            Delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
