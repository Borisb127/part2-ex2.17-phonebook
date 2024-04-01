import { useState, useEffect } from 'react';

// Import components and services
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification'
import personsService from './services/persons.js';

const App = () => {
  // State declarations
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [addedMessage, setaddedMessage] = useState(null);



  // Fetching initial data
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons));
  }, []);
  
  // Event handlers
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleNameFilterChange = (event) => setNameFilter(event.target.value);
  
  const addName = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    };
    
    // Validation logic
    const namePattern = /^[A-Za-z ]+$/; //Check if expression matches only letters (both uppercase and lowercase and (Space})
    const numberPattern = /^[0-9-]+$/;  // Check if the number input contains only digits (optionally dashes), from start (^) to end ($), with one or more characters (+)
    if (!namePattern.test(newName))
      return alert('Name can contain only letters.');
    if (!numberPattern.test(newNumber))
      return alert('Number can contain only digits and dashes.');
    
    // Check for existing name and update or create accordingly
    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);
      if (confirmUpdate)
        updatePerson(existingPerson.id, newNumber);
    } else {
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setaddedMessage(`Added '${personObject.name}'`);
          setTimeout(() => { setaddedMessage(null) }, 5000);
        });
    }
  };


  // Deleting logic
  const onDeletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`);

    if (confirmDelete) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          alert('This person was already deleted from the server');
        });
    }
  };

  const updatePerson = (id, newNumber) => {
    const personToUpdate = persons.find(p => p.id === id);
    const updatedPerson = { ...personToUpdate, number: newNumber };

    personsService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== id ? p : returnedPerson));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        console.error('Error updating person:', error);
        alert(`Error updating person`);
     });
  };


  // Filtered persons for display
  const filteredPersons = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase())
  );

  // Component render
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addedMessage} />
      <Filter value={nameFilter} onChange={handleNameFilterChange} />
      
      <h2>Add a new</h2>
      <PersonForm 
        addName={addName} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
      />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} onDeletePerson={onDeletePerson} />
    </div>
  );
};

export default App;