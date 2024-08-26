document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Hardcoded credentials for demonstration purposes
    const correctUsername = 'admin';
    const correctPassword = 'password123';

    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the entered username and password match the hardcoded credentials
    if (username === correctUsername && password === correctPassword) {
        // If credentials are correct, redirect to the task management page
        window.location.href = '../user/user.html';
    } else {
        // If credentials are incorrect, show an error message
        alert('Incorrect username or password. Please try again.');
    }
});
