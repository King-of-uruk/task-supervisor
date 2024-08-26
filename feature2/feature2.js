let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const transcriptElement = document.querySelector('.transcript-container .transcript.recording');
        transcriptElement.textContent += transcript + ' ';
    };

    recognition.onend = function() {
        isRecording = false;
        document.querySelector('.start-record-btn.recording').disabled = false;
        document.querySelector('.stop-record-btn.recording').disabled = true;
        document.querySelector('.start-record-btn.recording').classList.remove('recording');
        document.querySelector('.stop-record-btn.recording').classList.remove('recording');
        document.querySelector('.transcript-container .transcript.recording').classList.remove('recording');
    };

    recognition.onerror = function(event) {
        console.error(event.error);
        isRecording = false;
        document.querySelector('.start-record-btn.recording').disabled = false;
        document.querySelector('.stop-record-btn.recording').disabled = true;
        document.querySelector('.start-record-btn.recording').classList.remove('recording');
        document.querySelector('.stop-record-btn.recording').classList.remove('recording');
        document.querySelector('.transcript-container .transcript.recording').classList.remove('recording');
    };
} else {
    alert('Sorry, your browser does not support the Web Speech API. Please try this on Google Chrome.');
}

function startRecording(button) {
    if (!isRecording) {
        recognition.start();
        isRecording = true;
        button.classList.add('recording');
        button.disabled = true;
        const stopButton = button.nextElementSibling;
        stopButton.classList.add('recording');
        stopButton.disabled = false;
        const transcriptElement = button.closest('.voice-note').querySelector('.transcript');
        transcriptElement.classList.add('recording');
    }
}

function stopRecording(button) {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
    }
}

document.getElementById('createBoard').addEventListener('click', function () {
    createBoard();
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('createList')) {
        const listTemplate = document.getElementById('listTemplate').content.cloneNode(true);
        event.target.closest('.board').querySelector('.lists').appendChild(listTemplate);
    } else if (event.target.classList.contains('createCard')) {
        const cardTemplate = document.getElementById('cardTemplate').content.cloneNode(true);
        event.target.closest('.list').querySelector('.cards').appendChild(cardTemplate);
        addDragAndDrop();
    }
});

function addDragAndDrop() {
    const cards = document.querySelectorAll('.card');
    const lists = document.querySelectorAll('.cards');

    cards.forEach(card => {
        card.addEventListener('dragstart', function () {
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', function () {
            card.classList.remove('dragging');
        });
    });

    lists.forEach(list => {
        list.addEventListener('dragover', function (event) {
            event.preventDefault();
            const draggingCard = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(list, event.clientY);
            if (afterElement == null) {
                list.appendChild(draggingCard);
            } else {
                list.insertBefore(draggingCard, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Automatically create 4 boards on page load
window.onload = function() {
    for (let i = 0; i < 4; i++) {
        createBoard();
    }
};

function createBoard() {
    const boardTemplate = document.getElementById('boardTemplate').content.cloneNode(true);
    document.getElementById('boards').appendChild(boardTemplate);
}
function addCard(title, description, deadline) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ title, description, completed: false, deadline, subtasks: [] });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}