let converter = new Currency();

function timeSeriesChart(
  base,
  to,
  currentDate,
  oneYearStart,
  twoYearEnd,
  twoYearStart
) {
  // Getting data from Current date to 1 year ago
  var requestURL2 = `https://api.exchangerate.host/timeseries?start_date=${oneYearStart}&end_date=${currentDate}&base=${base}&symbols=${to}&places=4`;
  var get = new XMLHttpRequest();
  get.open("GET", requestURL2);
  get.responseType = "json";
  get.send();
  get.onload = function () {
    // Getting data from 1 year ago to 2 years ago
    // Needed because time-series api have 1-year limit
    var requestURL = `https://api.exchangerate.host/timeseries?start_date=${twoYearStart}&end_date=${twoYearEnd}&base=${base}&symbols=${to}&places=4`;
    var request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
      // Empty list to store the dates & amount
      var dates = [];
      var rates = [];
      var response1 = request.response;

      // Looping through the json to push it to the empty list
      for (var [date, value] of Object.entries(response1["rates"])) {
        for (var [currency, amount] of Object.entries(value)) {
          dates.push(date);
          rates.push(amount);
        }
      }
      var response2 = get.response;
      for (var [date, value] of Object.entries(response2["rates"])) {
        for (var [currency, amount] of Object.entries(value)) {
          dates.push(date);
          rates.push(amount);
        }
      }

      // Chart Data
      var trace1 = {
        type: "scatter",
        mode: "lines",
        name: "History",
        x: dates,
        y: rates,
        line: { color: "#17BECF" },
      };

      var data = [trace1];

      // Chart Layout
      var layout = {
        showlegend: true,
        hovermode: "x",
        title: `${base} to ${to} History Graph`,
        xaxis: {
          showspikes: true,
          spikemode: "across",
          spikesnap: "cursor",
          showline: true,
          showgrid: true,
          autorange: true,
          range: ["2020-11-26", "2022-11-26"],
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
              {
                count: 12,
                label: "1y",
                step: "month",
                stepmode: "backward",
              },
              { label: "2y", step: "all" },
            ],
          },
          rangeslider: { range: ["2020-11-26", "2022-11-26"] },
          type: "date",
        },
        yaxis: {
          autorange: true,
          range: [0, 100],
          type: "linear",
        },
      };

      // Executing the graph
      Plotly.newPlot("graph", data, layout, {
        responsive: true,
        scrollZoom: true,
      });
    };
  };
}

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
      var baseContainer1 = document.getElementById("base-currency1");
      var baseContainer2 = document.getElementById("base-currency2");
      var toContainer = document.getElementById("to-currency");
      var toContainer1 = document.getElementById("to-currency1");
      var toContainer2 = document.getElementById("to-currency2");

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
        var baseContainer1 = document.getElementById("base-currency1");
        var baseContainer2 = document.getElementById("base-currency2");
        var toContainer = document.getElementById("to-currency");
        var toContainer1 = document.getElementById("to-currency1");
        var toContainer2 = document.getElementById("to-currency2");
        baseContainer.appendChild(option1);
        baseContainer1.appendChild(option1.cloneNode(true));
        baseContainer2.appendChild(option1.cloneNode(true));
        toContainer.append(option2);
        toContainer1.append(option2.cloneNode(true));
        toContainer2.append(option2.cloneNode(true));
        continue;
      }

      baseContainer.appendChild(option1.cloneNode(true));
      baseContainer1.appendChild(option1.cloneNode(true));
      baseContainer2.appendChild(option1);

      // Making the USD selected by default in the second option
      if (key == "USD") {
        option2.selected = true;
        var baseContainer = document.getElementById("base-currency");
        var baseContainer1 = document.getElementById("base-currency1");
        var baseContainer2 = document.getElementById("base-currency2");
        var toContainer = document.getElementById("to-currency");
        var toContainer1 = document.getElementById("to-currency1");
        var toContainer2 = document.getElementById("to-currency2");
        toContainer.append(option2);
        toContainer1.append(option2.cloneNode(true));
        toContainer2.append(option2.cloneNode(true));
        continue;
      }
      toContainer.appendChild(option2);
      toContainer1.appendChild(option2.cloneNode(true));
      toContainer2.appendChild(option2.cloneNode(true));
    }

    // Creating a table
    var fromSelected = document.getElementById("base-currency2");
    var toSelected = document.getElementById("to-currency2");
    var base = fromSelected.options[fromSelected.selectedIndex].value;
    var to = toSelected.options[toSelected.selectedIndex].value;
    converter.createTable1(base);
    converter.createTable2(base, to);

    // Creating a chart
    var fromSelected1 = document.getElementById("base-currency1");
    var toSelected1 = document.getElementById("to-currency1");
    var base1 = fromSelected1.options[fromSelected1.selectedIndex].value;
    var to1 = toSelected1.options[toSelected1.selectedIndex].value;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var dd2 = dd;
    var mm2 = mm;
    if (dd2 == 01) {
      switch (mm2) {
        case "01":
        case "02":
        case "04":
        case "06":
        case "08":
        case "09":
        case "11":
        case "12":
          mm2--;
          dd2 = 31;
          break;
        case "03":
          if (yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0)) {
            mm2--;
            dd2 = 29;
            break;
          }
        case "05":
        case "07":
        case "10":
          mm2--;
          dd2 = 30;
          break;
      }
    }
    var currentDate = `${yyyy}-${mm}-${dd}`;
    var twoYearEnd = `${yyyy - 1}-${mm2}-${dd2}`;
    var oneYearStart = `${yyyy - 1}-${mm}-${dd}`;
    var twoYearStart = `${yyyy - 2}-${mm}-${dd}`;
    timeSeriesChart(
      base1,
      to1,
      currentDate,
      oneYearStart,
      twoYearEnd,
      twoYearStart
    );

    // Convert amount function
    document.getElementById("convert").onclick = (base, to) => {
      var fromSelected = document.getElementById("base-currency");
      var toSelected = document.getElementById("to-currency");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;
      var amount = document.getElementById("amount").value;
      converter.convertAmount(base, to, amount);
    };

    // Change the chart content everytime the option is changed
    document.getElementById("base-currency1").onchange = () => {
      var fromSelected = document.getElementById("base-currency1");
      var toSelected = document.getElementById("to-currency1");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;

      // Getting the date today
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      var dd2 = dd;
      var mm2 = mm;

      if (dd2 == 01) {
        switch (mm2) {
          case "01":
          case "02":
          case "04":
          case "06":
          case "08":
          case "09":
          case "11":
          case "12":
            mm2--;
            dd2 = 31;
            break;
          case "03":
            if (yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0)) {
              mm2--;
              dd2 = 29;
              break;
            }
          case "05":
          case "07":
          case "10":
            mm2--;
            dd2 = 30;
            break;
        }
      }

      var currentDate = `${yyyy}-${mm}-${dd}`;
      var twoYearEnd = `${yyyy - 1}-${mm2}-${dd2}`;
      var oneYearStart = `${yyyy - 1}-${mm}-${dd}`;
      var twoYearStart = `${yyyy - 2}-${mm}-${dd}`;
      timeSeriesChart(
        base,
        to,
        currentDate,
        oneYearStart,
        twoYearEnd,
        twoYearStart
      );
    };

    document.getElementById("to-currency1").onchange = () => {
      var fromSelected = document.getElementById("base-currency1");
      var toSelected = document.getElementById("to-currency1");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      var dd2 = dd;
      var mm2 = mm;

      if (dd2 == 01) {
        switch (mm2) {
          case "01":
          case "02":
          case "04":
          case "06":
          case "08":
          case "09":
          case "11":
          case "12":
            mm2--;
            dd2 = 31;
            break;
          case "03":
            if (yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0)) {
              mm2--;
              dd2 = 29;
              break;
            }
          case "05":
          case "07":
          case "10":
            mm2--;
            dd2 = 30;
            break;
        }
      }

      var currentDate = `${yyyy}-${mm}-${dd}`;
      var twoYearEnd = `${yyyy - 1}-${mm2}-${dd2}`;
      var oneYearStart = `${yyyy - 1}-${mm}-${dd}`;
      var twoYearStart = `${yyyy - 2}-${mm}-${dd}`;
      timeSeriesChart(
        base,
        to,
        currentDate,
        oneYearStart,
        twoYearEnd,
        twoYearStart
      );
    };

    // Changing table content everytime option is changed
    document.getElementById("base-currency2").onchange = () => {
      var fromSelected = document.getElementById("base-currency2");
      var toSelected = document.getElementById("to-currency2");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;
      converter.changedOption(base, to);
    };

    document.getElementById("to-currency2").onchange = () => {
      var fromSelected = document.getElementById("base-currency2");
      var toSelected = document.getElementById("to-currency2");
      var base = fromSelected.options[fromSelected.selectedIndex].value;
      var to = toSelected.options[toSelected.selectedIndex].value;
      converter.changedOption(base, to);
    };
  };
}
