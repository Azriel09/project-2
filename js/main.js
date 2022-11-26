let converter = new Currency();

function onLoad() {
  // GETTING FROM API ALL COUNTRIES' SYMBOLS (Ex: USD, PHP, etc)
  var requestURL = "https://api.exchangerate.host/symbols";
  var request = new XMLHttpRequest();
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    var response = request.response;

    // Making multiple currency options
    for (var [key, value] of Object.entries(response["symbols"])) {
      var description = value["description"];

      var baseContainer = document.getElementById("base-currency");
      var toContainer = document.getElementById("to-currency");

      var option1 = document.createElement("option");
      var option2 = document.createElement("option");
      option1.classList.add("currency-option");
      option1.innerHTML = `${key} - ${description}`;
      option1.value = key;
      option2.classList.add("currency-option");
      option2.innerHTML = `${key} - ${description}`;
      option2.value = key;

      // Making the PHP selected by default in the first option
      if (key == "PHP") {
        option1.selected = true;
        var baseContainer = document.getElementById("base-currency");
        baseContainer.appendChild(option1);
        var toContainer = document.getElementById("to-currency");
        toContainer.append(option2);
        continue;
      }

      baseContainer.appendChild(option1);

      // Making the USD selected by default in the second option
      if (key == "USD") {
        option2.selected = true;
        var toContainer = document.getElementById("to-currency");
        toContainer.append(option2);
        continue;
      }
      toContainer.appendChild(option2);
    }

    // Creating a table
    var fromSelected = document.getElementById("base-currency");
    var toSelected = document.getElementById("to-currency");
    var base = fromSelected.options[fromSelected.selectedIndex].value;
    var to = toSelected.options[toSelected.selectedIndex].value;
    converter.createTable1(base);
    converter.createTable2(base, to);

    // Convert amount function
    document.getElementById("convert").onclick = () => {
      var fromSelected = document.getElementById("base-currency");
      var toSelected = document.getElementById("to-currency");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;
      var amount = document.getElementById("amount").value;
      converter.convertAmount(base, to, amount);
    };

    // Change the table content everytime the option is changed
    document.getElementById("base-currency").onchange = () => {
      var fromSelected = document.getElementById("base-currency");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;
      converter.changedOption(base, to);
    };

    document.getElementById("to-currency").onchange = () => {
      var fromSelected = document.getElementById("base-currency");
      var toSelected = document.getElementById("to-currency");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;
      converter.changedOption(base, to);
    };
  };
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0");
var yyyy = today.getFullYear();
var fullDate = `${yyyy}-${mm}-${dd}`;
var startDate = `${yyyy - 1}-${mm}-${dd}`;

// Time-series Chart
d3.json(
  `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${fullDate}&base=USD&symbols=PHP&places=2`,
  function (err, data) {
    var dates = [];
    var rates = [];
    for (var [date, value] of Object.entries(data["rates"])) {
      for (var [currency, amount] of Object.entries(value)) {
        dates.push(date);
        rates.push(amount);
      }
    }
    console.log(dates);
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: "AAPL High",
      x: dates,
      y: rates,
      line: { color: "#17BECF" },
    };

    var data = [trace1];

    var layout = {
      title: "USD to PHP History Graph",
      xaxis: {
        autorange: true,
        range: ["2020-01-01", "2020-12-31"],
        rangeselector: {
          buttons: [
            {
              count: 1,
              label: "1m",
              step: "month",
              stepmode: "backward",
            },
            {
              count: 3,
              label: "3m",
              step: "month",
              stepmode: "backward",
            },
            {
              count: 6,
              label: "6m",
              step: "month",
              stepmode: "backward",
            },
            { step: "all" },
          ],
        },
        rangeslider: { range: [`${startDate}`, `${fullDate}`] },
        type: "date",
      },
      yaxis: {
        autorange: true,
        range: [0, 100],
        type: "linear",
      },
    };

    Plotly.newPlot("graph", data, layout, {
      responsive: true,
      scrollZoom: true,
    });
  }
);
