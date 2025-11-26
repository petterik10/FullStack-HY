import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import FormPerson from "./components/FormPerson";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import personService from "./services/persons";

const Header = ({ text }) => <h2> {text}</h2>;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const onSetNewName = (event) => {
    setNewName(event.target.value);
  };

  const onSetNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const onDeleteNumber = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}`)) {
      personService
        .remove(id)
        .then((response) => {
          setPersons(persons.filter((person) => person.id !== id));
          showMessage(`Deleted ${person.name}`, "success");
        })
        .catch((error) => {
          showMessage(
            `Information of person ${person.name} has already been removed from the server`,
            "error"
          );
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const showMessage = (message, messageType) => {
    setMessage(message);
    setMessageType(messageType);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const isPersonInAvailable = persons.some(
      (person) => person.name === newName
    );

    const person = persons.find((person) => person.name === newName);

    if (isPersonInAvailable) {
      if (
        window.confirm(
          `${person.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changePerson = { ...person, number: newNumber };
        personService
          .update(changePerson.id, changePerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== changePerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            showMessage(
              `Changed number for person ${returnedPerson.name}`,
              "success"
            );
            setNewNumber("");
          })
          .catch((error) => {
            showMessage(
              `Information of person ${person.name} has already been removed from the server`,
              "error"
            );
            setPersons(persons.filter((p) => p.id !== person.id));
            setNewName("");
            setNewNumber("");
          });
      }
    } else {
      const newObject = { name: newName, number: newNumber };
      personService.create(newObject).then((response) => {
        setPersons(persons.concat(response));
        showMessage(`Added ${newObject.name}`, "success");
        setNewName("");
        setNewNumber("");
      });
    }
  };

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  return (
    <div>
      <Header text="Phoenebook" />
      <Notification message={message} messageType={messageType} />
      <Filter
        filter={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <Header text="add a new" />
      <FormPerson
        handleChangeName={onSetNewName}
        handleChangeNumber={onSetNewNumber}
        newName={newName}
        newNumber={newNumber}
        onSubmit={onSubmit}
      />
      <Header text="Numbers" />
      <Persons persons={personsToShow} onDeleteNumber={onDeleteNumber} />
    </div>
  );
};

export default App;
