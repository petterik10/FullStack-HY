const Persons = ({ persons, onDeleteNumber }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number} <button onClick={() => onDeleteNumber(person.id)}>delete</button>
        </p>
      ))} 
    </div>
  );
};

export default Persons;
