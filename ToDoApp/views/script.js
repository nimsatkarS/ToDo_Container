const form = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const heading = document.getElementById('heading').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  const todo = { heading, description, date, time };
  console.log("📤 Sending Todo:", todo);

  try {
    const response = await fetch('http://localhost:5000/api/todo/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });

    const data = await response.json();
    console.log("✅ Server Response:", data);

    form.reset();
    loadTodos();
  } catch (error) {
    console.error("❌ Error adding todo:", error);
  }
});

async function loadTodos() {
  try {
    const res = await fetch('http://localhost:5000/api/todo/all');
    const todos = await res.json();
    console.log("📥 Fetched Todos:", todos);

    todoList.innerHTML = '';
    todos.forEach(todo => {
      const div = document.createElement('div');
      div.className = 'todo';
      div.innerHTML = `<strong>${todo.heading}</strong><br>${todo.description}<br>${todo.date} ${todo.time}`;
      todoList.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Error fetching todos:", err);
  }
}

loadTodos();
