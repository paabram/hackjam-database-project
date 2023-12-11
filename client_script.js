// connect to the server
const socket = new WebSocket('ws://localhost:8080');
// if localhost is changed to my ip address, you can access this website from another computer

socket.addEventListener('open', (event) => {
    console.log('Connected to the server.');
});

// when the client receives data from the server
socket.addEventListener('message', (event) => {
    // update the output element with the data table
    const output = document.getElementById('output');
    output.innerHTML = `${event.data}`;
});

/* sends inputted data to the server. this function is bound to the "send" button.*/
function sendData() {
    // access input
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');

    // validate input
    if (nameInput.value == '' || ageInput.value == '') {
        alert('Name and age box cannot be empty.');
        return;
    }
    if (isNaN(ageInput.value)) {
        alert('Age must be a numeric value.');
        return;
    }

    // wrap data into an object
    const messageObj = {name: nameInput.value, age: ageInput.value};
    // stringify the object and send it to the server
    socket.send(JSON.stringify(messageObj));

    // clear input boxes
    nameInput.value = '';
    ageInput.value = '';
}

/* sends a signal to the server to retrieve the data. bound to the "see" button.*/
function seeData() {
    socket.send('see');
}