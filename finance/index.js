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
    const arrDate = quotesMap.map( obj =>  moment(obj.date).format("yyyy-MM-DD"));
    arrDate.unshift('x');
    console.log(arrDate);
    
    const arrClose = quotesMap.map( obj => obj.close.toFixed(2));
    arrClose.unshift(quotes[0].symbol);
    console.log(arrClose);
    // https://c3js.org/samples/axes_x_tick_count.html

  });
}

historical('vt', '2020-05-11', '2020-05-15')
historical('vti', '2020-05-11', '2020-05-15')

