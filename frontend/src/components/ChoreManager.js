import React, { useState, useEffect } from 'react';

function ChoreManager() {
  const [chore, setChore] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [chores, setChores] = useState([]);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState('');

  const handleAddChore = (e) => {
    e.preventDefault();
    if (chore.trim() === '' || dueDate === '') {
      setMessage('Please enter both a chore and due date.');
      return;
    }
    const newChore = {
      id: Date.now(),
      title: chore,
      dueDate: new Date(dueDate), // Convert to Date object
      completed: false,
      notified: false
    };
    setChores([...chores, newChore]);
    setChore('');
    setDueDate('');
    setMessage('');
  };

  const handleToggleChore = (id) => {
    setChores(
      chores.map((c) =>
        c.id === id ? { ...c, completed: !c.completed } : c
      )
    );
  };

  // Check for chores that are due soon and simulate a notification
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      chores.forEach((c) => {
        // Notify if due date is within the next minute and hasn't been notified yet
        if (!c.completed && !c.notified && (c.dueDate - now) < 60000 && (c.dueDate - now) > 0) {
          setNotification(`Reminder: "${c.title}" is due soon!`);
          // Mark the chore as notified to avoid repeated notifications
          setChores((prevChores) =>
            prevChores.map((chore) =>
              chore.id === c.id ? { ...chore, notified: true } : chore
            )
          );
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [chores]);

  return (
    <div>
      <h3>Chore Manager</h3>
      <form onSubmit={handleAddChore}>
        <input
          type="text"
          placeholder="Enter a new chore"
          value={chore}
          onChange={(e) => setChore(e.target.value)}
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Chore</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {notification && <p style={{ color: 'blue' }}>{notification}</p>}
      <h4>Current Chores</h4>
      <ul>
        {chores.map((c) => (
          <li key={c.id} style={{ textDecoration: c.completed ? 'line-through' : 'none' }}>
            {c.title} - Due: {c.dueDate.toLocaleString()}
            <button onClick={() => handleToggleChore(c.id)}>
              {c.completed ? 'Undo' : 'Complete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChoreManager;
