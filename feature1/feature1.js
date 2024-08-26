document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const addSubtaskButton = document.getElementById('addSubtask');
    const subtaskContainer = document.getElementById('subtaskContainer');
    const progressBar = document.querySelector('.progress-bar span');
    const progressText = document.getElementById('progressText');
    
    // Summary elements
    const totalTasksEl = document.getElementById('totalTasks');
    const totalSubtasksEl = document.getElementById('totalSubtasks');
    const upcomingDeadlineEl = document.getElementById('upcomingDeadline');
    
    // Prioritized Task elements
    const prioritizedTaskList = document.getElementById('prioritizedTaskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        tasks.forEach((task, index) => {
            const hoursLeft = calculateHoursLeft(new Date(task.deadline));
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <div>
                    <input type="checkbox" class="completeTask" ${task.completed ? 'checked' : ''} data-index="${index}">
                    <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};">
                        ${task.title} - ${task.description}
                    </span>
                    <div class="task-deadline">
                        Deadline: ${new Date(task.deadline).toLocaleString()} 
                        (${hoursLeft} hours left)
                    </div>
                    <div class="task-priority">Priority: ${task.priority}</div>
                    <button class="deleteTask" data-index="${index}">Delete</button>
                </div>
                <ul class="subtaskList">
                    ${task.subtasks.map((subtask, subIndex) => `
                        <li class="subtaskItem">
                            <input type="checkbox" class="completeSubtask" ${subtask.completed ? 'checked' : ''} data-task-index="${index}" data-subtask-index="${subIndex}">
                            ${subtask.title}
                        </li>
                    `).join('')}
                </ul>
            `;
            taskList.appendChild(taskItem);
        });
        updateSummary();
        updatePrioritizedTasks();
        updateProgress();
    }

    function updateSummary() {
        const totalTasks = tasks.length;
        const totalSubtasks = tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
        const upcomingDeadline = tasks.length ? tasks[0].deadline : 'None';

        totalTasksEl.textContent = totalTasks;
        totalSubtasksEl.textContent = totalSubtasks;
        upcomingDeadlineEl.textContent = upcomingDeadline !== 'None' ? new Date(upcomingDeadline).toLocaleString() : 'None';
    }

    function updatePrioritizedTasks() {
        prioritizedTaskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <p class="task-deadline">Deadline: ${new Date(task.deadline).toLocaleString()}</p>
                </div>
            `;
            prioritizedTaskList.appendChild(taskItem);
        });
    }

    function updateProgress() {
        const totalTasks = tasks.length;
        const totalSubtasks = tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
        const completedTasks = tasks.filter(task => task.completed).length;
        const completedSubtasks = tasks.reduce((acc, task) => acc + task.subtasks.filter(subtask => subtask.completed).length, 0);

        const totalProgress = totalTasks + totalSubtasks;
        const completedProgress = completedTasks + completedSubtasks;
        const progress = totalProgress === 0 ? 0 : (completedProgress / totalProgress) * 100;

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }

    function addTask(title, description, deadline, subtasks) {
        const priority = calculatePriority(new Date(deadline));
        tasks.push({ title, description, completed: false, priority, deadline, subtasks });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function calculatePriority(deadline) {
        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 1) return 'High';
        if (daysLeft <= 3) return 'Medium';
        return 'Low';
    }

    function calculateHoursLeft(deadline) {
        const now = new Date();
        const hoursLeft = Math.ceil((deadline - now) / (1000 * 60 * 60));
        return hoursLeft > 0 ? hoursLeft : 0;
    }

    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        tasks[index].subtasks.forEach(subtask => subtask.completed = tasks[index].completed);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function toggleSubtaskCompletion(taskIndex, subtaskIndex) {
        tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
        tasks[taskIndex].completed = tasks[taskIndex].subtasks.every(subtask => subtask.completed);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;
        const subtasks = Array.from(document.getElementsByClassName('subtaskInput')).map(input => ({
            title: input.value,
            completed: false
        }));
        addTask(title, description, deadline, subtasks);
        taskForm.reset();
        subtaskContainer.innerHTML = '<input type="text" class="subtaskInput" placeholder="Subtask 1">';
    });

    addSubtaskButton.addEventListener('click', () => {
        const subtaskCount = subtaskContainer.getElementsByClassName('subtaskInput').length;
        const newSubtask = document.createElement('input');
        newSubtask.type = 'text';
        newSubtask.className = 'subtaskInput';
        newSubtask.placeholder = `Subtask ${subtaskCount + 1}`;
        subtaskContainer.appendChild(newSubtask);
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('completeTask')) {
            const index = e.target.dataset.index;
            toggleTaskCompletion(index);
        }
        if (e.target.classList.contains('completeSubtask')) {
            const taskIndex = e.target.dataset.taskIndex;
            const subtaskIndex = e.target.dataset.subtaskIndex;
            toggleSubtaskCompletion(taskIndex, subtaskIndex);
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('deleteTask')) {
            const index = e.target.dataset.index;
            deleteTask(index);
        }
    });

    renderTasks();
});
function saveTask(title, description, deadline, subtasks) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ title, description, completed: false, deadline, subtasks });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

