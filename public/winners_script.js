document.addEventListener("DOMContentLoaded", initialize);
// document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rows] of response.rows.entries()) {
    let id = rows["id"];
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

function initialize() {
  var req = new XMLHttpRequest();
  var url = 'http://localhost:3742/winners';
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