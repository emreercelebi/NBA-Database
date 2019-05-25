document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rows] of response.rows.entries()) {
    let gameId = rows["GameId"];
    let playerId = rows["PlayerId"];
    let tr = document.createElement("tr");
    document.getElementsByTagName("tbody")[0].appendChild(tr);
    for (let prop in rows) {
      if (rows.hasOwnProperty(prop)) {
        if (prop !== "GameId" && prop !== "PlayerId") {
          let td = document.createElement("td");
          td.innerText = `${rows[prop]}`;
          document.getElementsByTagName("tr")[i+1].appendChild(td);
        }
      }
    }
    let updateTd = document.createElement("td");
    let updateButton = document.createElement("button");
    updateButton.innerHTML = "Update";
    updateButton.id = "update" + gameId + "," + playerId;
    updateTd.appendChild(updateButton);

    let deleteTd = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.id = "delete" + gameId + "," + playerId;
    deleteTd.appendChild(deleteButton);

    document.getElementsByTagName("tr")[i + 1].appendChild(updateTd);
    document.getElementsByTagName("tr")[i + 1].appendChild(deleteTd);
  } 
}

function buildGameInputList(response) {
  for (const [i, row] of response.rowsG.entries()) {
    console.log(row);
    let id = row["id"];
    let op = document.createElement("option");
    op.innerText = `${row["Game"]}`;
    op.value = id;
    document.getElementById("game").appendChild(op);
  }
}

function buildPlayerInputList(response) {
  for (const [i, row] of response.rowsP.entries()) {
    let id = row["id"];
    let op = document.createElement("option");
    op.innerText = `${row["Name"]}`;
    op.value = id;
    document.getElementById("player").appendChild(op);
  }
}


function initialize() {
  var req = new XMLHttpRequest();
  var url = 'http://localhost:3742/appearances';
  req.open('GET', url, true);
  req.setRequestHeader('Accept', 'application/json');
  req.addEventListener('load', function () {
    if (req.status >= 200 && req.status < 400) {
      var tbody = document.getElementsByTagName("tbody")[0];
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      var response = JSON.parse(req.responseText);
      console.log(response);

      buildTable(response);

      buildGameInputList(response);
      buildPlayerInputList(response);

    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindButtons() {
  document.getElementById("addApp").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var url = "http://localhost:3742/appearances";
    var payload = {};

    payload.game = document.getElementById("game").value;
    payload.player = document.getElementById("player").value;
    payload.points = document.getElementById("ptsScored").value;

    console.log(payload.game);
    console.log(payload.player);
    console.log(payload.points);

    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener("load", function() {
      if (req.status >= 200 && req.status < 400) {
        var tbody = document.getElementsByTagName("tbody")[0];
        while (tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
        document.getElementById("game").value = "Game...";
        document.getElementById("player").value = "Player...";
        document.getElementById("ptsScored").value = "";
        
        var response = JSON.parse(req.responseText);
        buildTable(response);
        buildGameInputList(response);
        buildPlayerInputList(response);

      } else {
        console.log("Error in network request: " + req.statusText);
      }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();
    
    
  });
}