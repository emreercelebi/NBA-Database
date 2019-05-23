document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rows] of response.rowsG.entries()) {
    let id = rows["id"];
    let tr = document.createElement("tr");
    document.getElementsByTagName("tbody")[0].appendChild(tr);
    for (let prop in rows) {
      if (rows.hasOwnProperty(prop)) {
        if (prop !== "id") {
          let td = document.createElement("td");
          td.innerText = `${rows[prop]}`;
          document.getElementsByTagName("tr")[i+1].appendChild(td);
        }
      }
    }
    let updateTd = document.createElement("td");
    let updateButton = document.createElement("button");
    updateButton.innerHTML = "Update";
    updateButton.id = "update" + id;
    updateTd.appendChild(updateButton);

    let deleteTd = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.id = "delete" + id;
    deleteTd.appendChild(deleteButton);

    document.getElementsByTagName("tr")[i + 1].appendChild(updateTd);
    document.getElementsByTagName("tr")[i + 1].appendChild(deleteTd);
  }

 
}

function buildTeams(response, teamId) {
  for (const [i, rowsT] of response.rowsT.entries()) {
    let id = rowsT["id"];
    let op = document.createElement("option");
    op.innerText = `${rowsT["Team"]}`;
    op.value = id;
    document.getElementById(teamId).appendChild(op);
  }
}

function initialize() {
  var req = new XMLHttpRequest();
  var url = 'http://localhost:3742/games';
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

      buildTeams(response, "homeTeam");
      buildTeams(response, "awayTeam");

    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindButtons() {
  document.getElementById("addGame").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var url = "http://localhost:3742/games";
    var payload = {};

    payload.date = document.getElementById("date").value;
    payload.homeTeam = document.getElementById("homeTeam").value;
    payload.homeScore = document.getElementById("homeScore").value;

    payload.awayTeam = document.getElementById("awayTeam").value;
    payload.awayScore = document.getElementById("awayScore").value;

    if (payload.homeTeam != payload.awayTeam) {
      req.open("POST", url, true);
      req.setRequestHeader("Content-type", "application/json");
      req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
          var tbody = document.getElementsByTagName("tbody")[0];
          while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
          document.getElementById("date").value = "";
          document.getElementById("homeTeam").value = "";
          document.getElementById("homeScore").value = "";
          document.getElementById("awayTeam").value = "";
          document.getElementById("awayScore").value = "";
          
          var response = JSON.parse(req.responseText);
          buildTable(response);
          buildTeams(response, "homeTeam");
          buildTeams(response, "awayTeam");
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send(JSON.stringify(payload));
      event.preventDefault();
    }
    else {
      alert("Error: Home and Away teams cannot be the same team");
      event.preventDefault();
    }

  });
}