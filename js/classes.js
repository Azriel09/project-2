class Currency {
  constructor() {
    this.popularCurrencies = [
      "PHP",
      "USD",
      "AUD",
      "EUR",
      "JPY",
      "GBP",
      "CAD",
      "CNY",
    ];
    this.table2 = [1, 10, 50, 100, 200, 500, 1000, 10000];
  }

  convertAmount(base, to, amount) {
    console.log("Function success");
    this.reset;
    const convertFunction = () =>
      fetch(
        `https://api.exchangerate.host/convert?amount=${amount}&from=${base}&to=${to}`
      ).then((response) => response.json());

    const data = convertFunction();

    data.then((currencyValues) => {
      let value = currencyValues["result"];
      let currency = currencyValues["query"]["to"];
      $("div.value-here").html(`${value} ${currency}`);
      value;
      currency;
    });
  }

  createTable1(base) {
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
        for (let i = 0; i < this.popularCurrencies.length; i++) {
          if (key == this.popularCurrencies[i]) {
            $(`#rate${placer}`).html(`${key} ${value}`);
            placer++;
          }
        }
      }
    });
  }

  changedOption(base, to) {
    this.createTable1(base);
    this.createTable2(base, to);
  }

  createTable2(base, to) {
    const latestFunction = () =>
      fetch(`https://api.exchangerate.host/convert?from=${base}&to=${to}`).then(
        (response) => response.json()
      );

    const data = latestFunction();

    data.then((currencyRates) => {
      let value = currencyRates["result"];
      let currency = currencyRates["query"]["to"];
      let td = document.getElementsByClassName("baserate2");
      for (let i = 0; i < this.table2.length; i++) {
        let finalValue = value * this.table2[i];
        $(`#t2rate${this.table2[i]}`).html(`${base} ${this.table2[i]}`);
        td[i].innerHTML = `${
          Math.round((finalValue + Number.EPSILON) * 100) / 100
        } ${currency}`;
      }
    });
  }
}

// class TimeSeries {
//   constructor() {
//     this.today = new Date();
//     this.dd = String(today.getDate()).padStart(2, "0");
//     this.mm = String(today.getMonth() + 1).padStart(2, "0");
//     this.yyyy = today.getFullYear();
//     this.fullDate = `${yyyy}-${mm}-${dd}`;
//     this.startDate = `${yyyy - 1}-${mm}-${dd}`;
//   }

//   createGraph(base, to) {
//     var requestURL = `https://api.exchangerate.host/timeseries?start_date=${this.startDate}&end_date=${this.fullDate}&base=${base}&symbols=${to}&places=2`;
//     var request = new XMLHttpRequest();
//     request.open("GET", requestURL);
//     request.responseType = "json";
//     request.send();

//     request.onload = function () {
//       var response = request.response;
//       var dates = [];
//       var rates = [];
//       for (var [date, value] of Object.entries(response["rates"])) {
//         for (var [currency, amount] of Object.entries(value)) {
//           dates.push(date);
//           rates.push(amount);
//         }
//       }
//       var trace1 = {
//         type: "scatter",
//         mode: "lines",
//         name: "AAPL High",
//         x: dates,
//         y: rates,
//         line: { color: "#17BECF" },
//       };

//       var data = [trace1];

//       var layout = {
//         title: "USD to PHP History Graph",
//         xaxis: {
//           autorange: true,
//           range: [startDate, fullDate],
//           rangeselector: {
//             buttons: [
//               {
//                 count: 1,
//                 label: "1m",
//                 step: "month",
//                 stepmode: "backward",
//               },
//               {
//                 count: 3,
//                 label: "3m",
//                 step: "month",
//                 stepmode: "backward",
//               },
//               {
//                 count: 6,
//                 label: "6m",
//                 step: "month",
//                 stepmode: "backward",
//               },
//               { step: "all" },
//             ],
//           },
//           rangeslider: { range: [`${startDate}`, `${fullDate}`] },
//           type: "date",
//         },
//         yaxis: {
//           autorange: true,
//           range: [0, 100],
//           type: "linear",
//         },
//       };

//       Plotly.newPlot("graph", data, layout, {
//         responsive: true,
//         scrollZoom: true,
//       });
//     };
//   }
// }
