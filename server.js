const mysql = require('mysql');

// connect to the database hosted on my laptop
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hackJam2023",
    database: 'test'
  });

/* the update function inserts the user's name and age into the table, then
 calls back with the new table of names sorted alphabetically for display*/
function update(name, age, callback) {
    // capitalize the name, for consistency
    name = name.charAt(0).toUpperCase() + name.slice(1);
    // insert info
    db.query(`INSERT INTO people (name, age) VALUES ('${name}', ${age})`, (err, result) => {
      if (err) {
        console.log('An error occurred');
        callback(err, null);
      }
    });
    // retrieve updated table
    retrieve(callback);
}

/* the retrieve function gets the table of names sorted alphabetically; it 
is used on its own with the "see" button and as part of the update function*/
function retrieve(callback) {
  db.query("SELECT * FROM people ORDER BY name;", (err, result) => {
    if (err) {
        console.log('Error');
        callback(err, null);
    } else {
        // runt the process function on the result
         let str = process(result);
        // callback with the result
        callback(null, str);
    }
  });
}

/* used within the retrieve function to make the results presentable */
function process(result) {
  let str = ``;
  
  // data will be shown as a table element
  str += `<table><tr><th>Name</th><th>Age</th></tr>`
  // iterate each row and add it
  for (const i of result) {
      str += `<tr><td>${i.name}</td><td>${i.age}</td></tr>`;
  }
  str += `</table>`;

  return str;
}

// initialize websocket server
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

// handle client connections
server.on('connection', (socket) => {
  console.log('A client connected.');

  // process messages from the client
  socket.on('message', (messageJSON) => {
    // if they clicked the "see" button
    if (messageJSON == 'see') {
      // run the retrieve function directly
      retrieve((err, result) => {
        // handle any errors
        if (err) {
          console.error("Error:", err);
        // send the data back to the client
        } else {
          socket.send(result);
        }
      });
      return;
    }

    // if they submitted info
    // parse the data
    const messageObj = JSON.parse(messageJSON);
    console.log(`Received ${messageObj.name}, age ${messageObj.age}`);
    
    // run the update function with their data
    update(messageObj.name, messageObj.age, (err, result) => {
      // handle any errors
      if (err) {
        console.error("Error:", err);
      // send the results back to the client
      } else {
        socket.send(result);
      }
      });
  });

  // handle disconnections
  socket.on('close', () => {
    console.log('A client disconnected.');
  });
});