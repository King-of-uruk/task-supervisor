document.addEventListener('DOMContentLoaded', () => {
    function updateStatistics() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const remainingTasks = totalTasks - completedTasks;
        
        const totalSubtasks = tasks.reduce((acc, task) => acc + (task.subtasks ? task.subtasks.length : 0), 0);
        const completedSubtasks = tasks.reduce((acc, task) => acc + (task.subtasks ? task.subtasks.filter(subtask => subtask.completed).length : 0), 0);
        const remainingSubtasks = totalSubtasks - completedSubtasks;

        const deadlines = tasks.map(task => task.deadline).filter(deadline => deadline);
        const upcomingDeadline = deadlines.length ? new Date(Math.min(...deadlines.map(date => new Date(date)))).toLocaleDateString() : 'None';

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('noteCount').textContent = 0; // Update as necessary
        document.getElementById('boardCount').textContent = 0; // Update as necessary
        document.getElementById('upcomingDeadline').textContent = upcomingDeadline;
    }

    // Call the update function when the page loads
    updateStatistics();
});
