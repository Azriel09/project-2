// function tempConverter(a) {
//   let n = parseInt(a);
//   let unit = document.getElementById("converter");
//   let selected = unit.options[unit.selectedIndex].value;
//   if (isNaN(n)) {
//     result.innerHTML = "Not a number";
//   } else if (selected == "f2c") {
//     result.innerHTML = (n - 32) * (5 / 9) + "°C";
//   } else {
//     result.innerHTML = n * 1.8 + 32 + "°F";
//   }
// }

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
        console.log(baseContainer.options[baseContainer.selectedIndex].value);
        continue;
      }

      baseContainer.appendChild(option1);

      if (key == "USD") {
        option2.selected = true;
        var container = document.getElementById("to-currency");
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
}
