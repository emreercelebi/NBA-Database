document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rowsP] of response.rowsP.entries()) {
    let id = rowsP[0];
    let tr = document.createElement("tr");
    document.getElementsByTagName("tbody")[0].appendChild(tr);
    for (let prop in rowsP) {
      if (rowsP.hasOwnProperty(prop)) {
        if (prop !== "id") {
          let td = document.createElement("td");
          if (rowsP[prop] == null) {
            td.innerText = "None";
          } else {
            td.innerText = `${rowsP[prop]}`;
          }
          document.getElementsByTagName("tr")[i+1].appendChild(td);
        }
      }
    }
  }
}

function buildTeams(response) {
  for (const [i, rowsT] of response.rowsT.entries()) {
    let id = rowsT["id"];
    let op = document.createElement("option");
    op.innerText = `${rowsT["Team"]}`;
    op.value = id;
    document.getElementById("team").appendChild(op);
  }
}

function initialize() {
  var req = new XMLHttpRequest();
  var url = 'http://flip2.engr.oregonstate.edu:3742/players';
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
      buildTeams(response);
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindButtons() {
  document.getElementById("addPlayer").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var url = "http://flip2.engr.oregonstate.edu:3742/players";
    var payload = {};
    payload.firstName = document.getElementById("firstName").value;
    payload.lastName = document.getElementById("lastName").value;
    payload.position = document.getElementById("position").value;
    payload.team = document.getElementById("team").value;
    if (payload.team == "Team...") {
      payload.team = null;
    }
    if (payload.firstName != "" && payload.lastName != "" && position != "") {
      req.open("POST", url, true);
      req.setRequestHeader("Content-Type", "application/json");
      req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
          var tbody = document.getElementsByTagName("tbody")[0];
          while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
          document.getElementById("firstName").value = "";
          document.getElementById("lastName").value = "";
          document.getElementById("position").value = "";
          document.getElementById("team").value = "";
          var response = JSON.parse(req.responseText);
          buildTable(response);
          buildTeams(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send(JSON.stringify(payload)); 
      event.preventDefault();
    } else {
      alert("Please enter the required fields");
      event.preventDefault();
    }
  });
}