var yahooFinance = require('yahoo-finance');
var moment = require('moment');

var historical = function (symbol, from, to) {
  yahooFinance.historical({
    symbol: symbol,
    from: from,
    to: to,
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
  }, function (err, quotes) {
    let unwrap = ({date, close, symbol}) => ({date, close, symbol});
    const quotesMap = quotes.map( obj => {
      return unwrap(obj)
    });

    if(symbol === 'VT' ) {
      const arrDate = quotesMap.map( obj =>  moment(obj.date).format("yyyy-MM-DD"));
      arrDate.unshift('x');
      console.log(arrDate);
    }

    const arrClose = quotesMap.map( obj => obj.close.toFixed(2));
    arrClose.unshift(quotes[0].symbol);
    console.log(arrClose);
    // https://c3js.org/samples/axes_x_tick_count.html
    //if(arrClose.length !==  undefined ) return arrClose
  });
}

// historical('vt', '2020-05-11', '2020-05-15')


let arrStock = ['VT','VTI','EWJ','EWY','EWT','EWH','EWS']

// for(let stock of arrStock){
//   historical(stock, '2020-05-11', '2020-05-15') 
// }

const d = new Date();
const today = d.toISOString().substring(0, 10);
//console.log(today) //  "yyyy-mm-dd" format. 2020-05-25

let sevenDaysAgo = d.setDate(d.getDate() - 7);
sevenDaysAgo = new Date(sevenDaysAgo).toISOString().substring(0, 10);;
//console.log(sevenDaysAgo) // 2020-05-18

for(let i = 0; i < arrStock.length; i++) {
  historical(arrStock[i], sevenDaysAgo, today) 
}