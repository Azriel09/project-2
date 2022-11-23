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
