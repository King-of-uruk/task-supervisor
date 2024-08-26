let recognition;
let isRecording = false;

// Check if the browser supports the Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Event handler for when speech recognition results are available
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('transcript').textContent += transcript + ' ';
    };

    // Event handler for when speech recognition ends
    recognition.onend = function() {
        isRecording = false;
        document.getElementById('start-record-btn').disabled = false;
        document.getElementById('stop-record-btn').disabled = true;
    };

    // Handle errors
    recognition.onerror = function(event) {
        console.error(event.error);
        isRecording = false;
        document.getElementById('start-record-btn').disabled = false;
        document.getElementById('stop-record-btn').disabled = true;
    };
} else {
    alert('Sorry, your browser does not support the Web Speech API. Please try this on Google Chrome.');
}

// Start recording function
function startRecording() {
    if (!isRecording) {
        recognition.start();
        isRecording = true;
        document.getElementById('start-record-btn').disabled = true;
        document.getElementById('stop-record-btn').disabled = false;
    }
}

// Stop recording function
function stopRecording() {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
    }
}
