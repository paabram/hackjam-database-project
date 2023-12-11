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

function sendData() {
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    if (nameInput.value == '' || ageInput.value == '') {
        alert('Name and age box cannot be empty.');
        return;
    } else if (isNaN(ageInput.value)) {
        alert('Age must be a numeric value.');
        
        return;
    }
    // send inputted data to the server script
    const messageObj = {name: nameInput.value, age: ageInput.value};
    socket.send(JSON.stringify(messageObj));
    nameInput.value = '';
    ageInput.value = '';
}

function seeData() {
    socket.send('see');
}