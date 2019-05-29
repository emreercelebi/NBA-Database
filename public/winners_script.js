var url = 'http://localhost:3742/winners';
document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rows] of response.rows.entries()) {
    let accId = rows["AccId"];
    let playerId = rows["PlayerId"];
    let tr = document.createElement("tr");
    document.getElementsByTagName("tbody")[0].appendChild(tr);
    for (let prop in rows) {
      if (rows.hasOwnProperty(prop)) {
        if (prop !== "AccId" && prop !== "PlayerId") {
          let td = document.createElement("td");
          td.innerText = `${rows[prop]}`;
          document.getElementsByTagName("tr")[i+1].appendChild(td);
        }
      }
    }
  }
}

function buildInputList(rows, inputList) {
  for (const [i, row] of rows.entries()) {
    let id = row["id"];
    let op = document.createElement("option");
    op.innerText = `${row["Name"]}`;
    op.value = id;
    inputList.appendChild(op);
  }
}

function initialize() {
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.setRequestHeader('Accept', 'application/json');
  req.addEventListener('load', function () {
    if (req.status >= 200 && req.status < 400) {
      var tbody = document.getElementsByTagName("tbody")[0];
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      var response = JSON.parse(req.responseText);
      buildTable(response);
      buildInputList(response.rowsA, document.getElementById("accolade"));
      buildInputList(response.rowsP, document.getElementById("player"));
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindButtons() {
  document.getElementById("addWin").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var payload = {};

    payload.accolade = document.getElementById("accolade").value;
    payload.player = document.getElementById("player").value;

    if (payload.accolade != "Accolade..." && payload.player != "Player..."){
      req.open("POST", url, true);
      req.setRequestHeader("Content-type", "application/json");
      req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
          var tbody = document.getElementsByTagName("tbody")[0];
          while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
          document.getElementById("accolade").value = "Accolade...";
          document.getElementById("player").value = "Player...";
          var response = JSON.parse(req.responseText);
          buildTable(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send(JSON.stringify(payload));
      event.preventDefault();
    }
    else {
      alert("Please select an input for both fields.");
      event.preventDefault();
    }
  });
}