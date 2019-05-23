document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rows] of response.rows.entries()) {
    let id = rows[0];
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
  }
}

function initialize() {
  var req = new XMLHttpRequest();
  var url = 'http://flip2.engr.oregonstate.edu:3742/teams';
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
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindButtons() {
  document.getElementById("addTeam").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var url = "http://flip2.engr.oregonstate.edu:3742/teams";
    var payload = {};
    payload.location = document.getElementById("location").value;
    payload.name = document.getElementById("teamName").value;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function() {
      if (req.status >= 200 && req.status < 400) {
        var tbody = document.getElementsByTagName("tbody")[0];
        while (tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
        document.getElementById("location").value = "";
        document.getElementById("teamName").value = "";
        var response = JSON.parse(req.responseText);
        buildTable(response);
      } else {
        console.log("Error in network request: " + req.statusText);
      }
    });
    req.send(JSON.stringify(payload)); 
    event.preventDefault();
  });
}