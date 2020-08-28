const baseUrl = "https://api.exchangeratesapi.io";

type Rate = { SEK: number };

async function getExchange(
  from: string,
  to?: string
): Promise<{ date: string; sek: number }[]> {
  let url: string = baseUrl;
  if (to === undefined) {
    url += "/" + from;
    url += "?base=EUR";
    url += "&symbols=SEK";
  } else {
    url += `/history?start_at=${from}&end_at=${to}`;
    url += "&base=EUR";
    url += "&symbols=SEK";
  }

  const response = await fetch(url, {
    method: "GET",
  });

  const result = await response.json();
  const rates: { [k: string]: Rate } = result.rates;

  const rateResult = [];

  if (rates.SEK !== undefined) {
    rateResult.push({ date: from, sek: rates.SEK });
  } else {
    Object.entries(rates).forEach(([k, rate]) => {
      rateResult.push({ date: k, sek: rate.SEK });
    });
  }

  return rateResult;
}

const btn = document.getElementById("exchange-button");
const fromDate = <HTMLInputElement>document.getElementById("from-date");
const toDate = <HTMLInputElement>document.getElementById("to-date");
const table = <HTMLTableElement>document.getElementById("output-table");
const tableBody = table.tBodies[0];
let data: { [date: string]: number } = {};

async function getEarliestValue(date: Date) {
  if (date.getDay() == 6) {
    date.setDate(date.getDate() - 1);
  } else if (date.getDay() == 0) {
    date.setDate(date.getDate() - 2);
  }

  return getExchange(formatDate(date));
}

btn.addEventListener("click", async (e: Event) => {
  const earliestValue = await getEarliestValue(new Date(fromDate.value));

  const fromDateStr = fromDate.value;
  const toDateStr = toDate.value === "" ? undefined : toDate.value;
  const rates = await getExchange(fromDateStr, toDateStr);

  while (table.rows.length > 1) {
    tableBody.deleteRow(-1);
  }
  data = {};

  data[fromDateStr] = earliestValue[0].sek;

  rates.forEach((rate) => {
    if (data[rate.date] === undefined) {
      data[rate.date] = rate.sek;
    }
  });

  if (toDateStr !== undefined) {
    let currDate = new Date(fromDateStr);
    let endDate = new Date(toDate.value);

    let prevDate = formatDate(currDate);
    while (currDate < endDate) {
      const dateStr = formatDate(currDate);
      if (data[dateStr] === undefined) {
        data[dateStr] = data[prevDate];
      }

      prevDate = formatDate(currDate);
      currDate.setDate(currDate.getDate() + 1);
    }
  }

  const sorted = Object.entries(data).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  sorted.forEach(([date, value]) => {
    console.log(date);
    let row = tableBody.insertRow(-1);
    const dateCell = row.insertCell(-1);
    const valueCell = row.insertCell(-1);
    valueCell.classList.add("value-cell");
    dateCell.appendChild(document.createTextNode(date));
    valueCell.appendChild(document.createTextNode(`${value}`));
  });
});

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
