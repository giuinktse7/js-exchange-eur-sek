var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var baseUrl = "https://api.exchangeratesapi.io";
function getExchange(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, result, rates, rateResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = baseUrl;
                    if (to === undefined) {
                        url += "/" + from;
                        url += "?base=EUR";
                        url += "&symbols=SEK";
                    }
                    else {
                        url += "/history?start_at=" + from + "&end_at=" + to;
                        url += "&base=EUR";
                        url += "&symbols=SEK";
                    }
                    return [4 /*yield*/, fetch(url, {
                            method: "GET"
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    rates = result.rates;
                    rateResult = [];
                    if (rates.SEK !== undefined) {
                        rateResult.push({ date: from, sek: rates.SEK });
                    }
                    else {
                        Object.entries(rates).forEach(function (_a) {
                            var k = _a[0], rate = _a[1];
                            rateResult.push({ date: k, sek: rate.SEK });
                        });
                    }
                    return [2 /*return*/, rateResult];
            }
        });
    });
}
var btn = document.getElementById("exchange-button");
var fromDate = document.getElementById("from-date");
var toDate = document.getElementById("to-date");
var table = document.getElementById("output-table");
var tableBody = table.tBodies[0];
var data = {};
function getEarliestValue(date) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (date.getDay() == 6) {
                date.setDate(date.getDate() - 1);
            }
            else if (date.getDay() == 0) {
                date.setDate(date.getDate() - 2);
            }
            return [2 /*return*/, getExchange(formatDate(date))];
        });
    });
}
btn.addEventListener("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
    var earliestValue, fromDateStr, toDateStr, rates, currDate, endDate, prevDate, dateStr, sorted;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getEarliestValue(new Date(fromDate.value))];
            case 1:
                earliestValue = _a.sent();
                fromDateStr = fromDate.value;
                toDateStr = toDate.value === "" ? undefined : toDate.value;
                return [4 /*yield*/, getExchange(fromDateStr, toDateStr)];
            case 2:
                rates = _a.sent();
                while (table.rows.length > 1) {
                    tableBody.deleteRow(-1);
                }
                data = {};
                data[fromDateStr] = earliestValue[0].sek;
                rates.forEach(function (rate) {
                    if (data[rate.date] === undefined) {
                        data[rate.date] = rate.sek;
                    }
                });
                if (toDateStr !== undefined) {
                    currDate = new Date(fromDateStr);
                    endDate = new Date(toDate.value);
                    prevDate = formatDate(currDate);
                    while (currDate < endDate) {
                        dateStr = formatDate(currDate);
                        if (data[dateStr] === undefined) {
                            data[dateStr] = data[prevDate];
                        }
                        prevDate = formatDate(currDate);
                        currDate.setDate(currDate.getDate() + 1);
                    }
                }
                sorted = Object.entries(data).sort(function (a, b) { return new Date(a[0]).getTime() - new Date(b[0]).getTime(); });
                sorted.forEach(function (_a) {
                    var date = _a[0], value = _a[1];
                    console.log(date);
                    var row = tableBody.insertRow(-1);
                    var dateCell = row.insertCell(-1);
                    var valueCell = row.insertCell(-1);
                    valueCell.classList.add("value-cell");
                    dateCell.appendChild(document.createTextNode(date));
                    valueCell.appendChild(document.createTextNode("" + value));
                });
                return [2 /*return*/];
        }
    });
}); });
function formatDate(date) {
    var d = new Date(date), month = "" + (d.getMonth() + 1), day = "" + d.getDate(), year = d.getFullYear();
    if (month.length < 2)
        month = "0" + month;
    if (day.length < 2)
        day = "0" + day;
    return [year, month, day].join("-");
}
