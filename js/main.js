var popularCurrencies = [
  "PHP",
  "USD",
  "AUD",
  "EUR",
  "JPY",
  "GBP",
  "CAD",
  "CNY",
];

function convertCurrency(base, to) {
  const convertFunction = () =>
    fetch(`https://api.exchangerate.host/convert?from=${base}&to=${to}`).then(
      (response) => response.json()
    );

  const data = convertFunction();

  data.then((currencyValues) => {
    let value = currencyValues["result"];
    let currency = currencyValues["query"]["to"];
    $("div.value-here").html(`${value} ${currency}`);
  });
}

function onLoad2() {
  var fromSelected = document.getElementById("base-currency");
  var toSelected = document.getElementById("to-currency");
  var baseCurrency = fromSelected.options[fromSelected.selectedIndex].value;
  var toCurrency = toSelected.options[toSelected.selectedIndex].value;

  convertCurrency(baseCurrency, toCurrency);
  createGraph(baseCurrency);
}

function onLoad1() {
  var requestURL = "https://api.exchangerate.host/symbols";
  var request = new XMLHttpRequest();
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    var response = request.response;
    console.log(response["symbols"]);

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

      if (key == "PHP") {
        option1.selected = true;
        var baseContainer = document.getElementById("base-currency");
        baseContainer.appendChild(option1);
        var toContainer = document.getElementById("to-currency");
        toContainer.append(option2);
        console.log(baseContainer.options[baseContainer.selectedIndex].value);
        continue;
      }

      baseContainer.appendChild(option1);

      if (key == "USD") {
        option2.selected = true;
        var toContainer = document.getElementById("to-currency");
        toContainer.append(option2);
        continue;
      }
      toContainer.appendChild(option2);
    }
    onLoad2();
  };
}

document
  .getElementById("base-currency")
  .addEventListener("change", changeOption);
document.getElementById("to-currency").addEventListener("change", changeOption);

function changeOption() {
  var fromSelected = document.getElementById("base-currency");
  var toSelected = document.getElementById("to-currency");
  var baseCurrency = fromSelected.options[fromSelected.selectedIndex].value;
  var toCurrency = toSelected.options[toSelected.selectedIndex].value;
  convertCurrency(baseCurrency, toCurrency);
  createGraph(baseCurrency);
}

function createGraph(base) {
  latestRates(base);
}

function latestRates(base) {
  const latestFunction = () =>
    fetch(`https://api.exchangerate.host/latest?base=${base}`).then(
      (response) => response.json()
    );

  const data = latestFunction();

  data.then((currencyRates) => {
    var rates = currencyRates["rates"];
    var placer = 0;
    $("td.baserate").html(`${base} 1`);
    for (var [key, value] of Object.entries(rates)) {
      for (i = 0; i < popularCurrencies.length; i++) {
        if (key == popularCurrencies[i]) {
          console.log(`Match! ${key}`);
          $(`#rate${placer}`).html(`${key} ${value}`);
          placer++;
        }
      }
    }
  });
}

//     for (i = 0; i < popularCurrencies.length; i++) {
//       var table = document.getElementById("table-graph");
//       var row = table.insertRow(i);
//       var cell1 = row.insertCell(0);
//       var cell2 = row.insertCell(1);
//       cell1.innerHTML = `${base} 1`;
//       cell2.innerHTML = popularCurrencies[i];
//     }
//   });
// }
