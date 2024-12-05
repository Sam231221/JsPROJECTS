document.addEventListener("DOMContentLoaded", () => {
  //element selection
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div>
                    <button class="complete-btn">${
                      task.completed ? "Undo" : "Complete"
                    }</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

      const completeBtn = li.querySelector(".complete-btn");
      const editBtn = li.querySelector(".edit-btn");
      const deleteBtn = li.querySelector(".delete-btn");

      completeBtn.addEventListener("click", () => toggleComplete(index));
      editBtn.addEventListener("click", () => editTask(index));
      deleteBtn.addEventListener("click", () => deleteTask(index));

      taskList.appendChild(li);
    });
  }

  function addTask(text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
  }

  function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null) {
      tasks[index].text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      addTask(text);
      taskInput.value = "";
    }
  });

  renderTasks();
});
