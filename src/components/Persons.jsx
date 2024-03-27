


const Persons = ({ filteredPersons, onDeletePerson }) => { 
    return (
      <ul>
        {filteredPersons.map((person) =>
          <li key={person.id}>{person.name} - {person.number}
          <button onClick={() => onDeletePerson(person.id)}>Delete</button>
          </li>)}
      </ul>
    )
  }
  
  export default Persons