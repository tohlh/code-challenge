import React, { useState, useEffect } from "react";

const SwapForm = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BLUR");
  const [fromAmount, setFromAmount] = useState(Number(0).toFixed(2));
  const [toAmount, setToAmount] = useState(Number(0).toFixed(2));
  const [usdAmount, setUsdAmount] = useState(Number(0).toFixed(2));
  const [currencies, setCurrencies] = useState([]);

  const findCurrency = (currency) =>
    currencies.find((x) => x.currency === currency);

  const calculateAmount = (amount, fromPrice, toPrice) =>
    Number((amount * fromPrice) / toPrice).toFixed(2);

  const changeFromAmount = (amount) => {
    const fromCurrencyObject = findCurrency(fromCurrency);
    const toCurrencyObject = findCurrency(toCurrency);
    setFromAmount(Math.max(amount, 0));
    setUsdAmount(
      Math.max(Number(amount / fromCurrencyObject.price), 0).toFixed(2),
    );
    setToAmount(
      calculateAmount(
        Math.max(amount, 0),
        toCurrencyObject.price,
        fromCurrencyObject.price,
      ),
    );
  };

  const changeToAmount = (amount) => {
    const fromCurrencyObject = findCurrency(fromCurrency);
    const toCurrencyObject = findCurrency(toCurrency);
    setToAmount(Math.max(amount, 0));
    setUsdAmount(Number(amount / toCurrencyObject.price).toFixed(2));
    setFromAmount(
      calculateAmount(
        Math.max(amount, 0),
        fromCurrencyObject.price,
        toCurrencyObject.price,
      ),
    );
  };

  const changeFromCurrency = (currency) => {
    setFromCurrency(currency);
    const fromCurrencyObject = findCurrency(currency);
    const toCurrencyObject = findCurrency(toCurrency);
    setFromAmount(
      calculateAmount(
        toAmount,
        fromCurrencyObject.price,
        toCurrencyObject.price,
      ),
    );
  };

  const changeToCurrency = (currency) => {
    setToCurrency(currency);
    const fromCurrencyObject = findCurrency(fromCurrency);
    const toCurrencyObject = findCurrency(currency);
    setToAmount(
      calculateAmount(
        fromAmount,
        toCurrencyObject.price,
        fromCurrencyObject.price,
      ),
    );
  };

  const blurFromAmount = () => {
    if (fromAmount === "") {
      setFromAmount(Number(0).toFixed(2));
      setToAmount(Number(0).toFixed(2));
    } else {
      setFromAmount(Number(fromAmount).toFixed(2));
    }
  };

  const blurToAmount = () => {
    if (toAmount === "") {
      setFromAmount(Number(0).toFixed(2));
      setToAmount(Number(0).toFixed(2));
    } else {
      setToAmount(Number(toAmount).toFixed(2));
    }
  };

  const exchange = () => {
    const tempCurrency = fromCurrency;
    const tempAmount = fromAmount;
    setFromCurrency(toCurrency);
    setFromAmount(toAmount);
    setToCurrency(tempCurrency);
    setToAmount(tempAmount);
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const response = await fetch(
        `https://interview.switcheo.com/prices.json`,
      );
      const json = await response.json();

      const uniquePrices = json.reduce((acc, current) => {
        const x = acc.find((item) => item.currency === current.currency);
        if (!x) {
          return acc.concat([current]);
        } else {
          if (new Date(x.date) < new Date(current.date)) {
            x.price = current.price;
          }
          return acc;
        }
      }, []);

      const data = uniquePrices.map((currency) => {
        return {
          currency: currency.currency,
          price: currency.price,
        };
      });
      setCurrencies(data);
    };
    fetchExchangeRates();
  }, [fromCurrency, toCurrency]);

  return (
    <div className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
      <div className="prose h-full w-96 content-center rounded-lg bg-white p-8 align-middle ">
        <h1>Swap</h1>

        <div className="flex-row">
          <h4>You pay</h4>
          <div className="flex justify-between rounded-lg border bg-white">
            <input
              className="w-full rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none"
              type="number"
              value={fromAmount}
              onChange={(e) => changeFromAmount(e.target.value)}
              onBlur={() => blurFromAmount()}
              onFocus={(e) => e.target.select()}
            />
            <select
              className="rounded-r-lg p-2.5 text-sm text-gray-900 focus:outline-none"
              value={fromCurrency}
              onChange={(e) => changeFromCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.currency} value={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex w-full flex-row justify-between">
          <p className="ml-2 mt-0 text-sm text-gray-500">≈ {usdAmount} USD</p>
          <button
            className="mb-0 mt-4 rounded-lg border border-gray-200 bg-white p-2 text-gray-900 focus:outline-none"
            onClick={() => exchange()}
          >
            <svg height="15" width="15" viewBox="0 0 423.755 423.755">
              <path d="M43.84 281.457c-18.585-44.869-18.586-94.29 0-139.159 10.649-25.709 26.678-48.152 46.86-66.135l60.86 60.86V15.099H29.635l39.88 39.88c-64.293 58.426-88.5 153.2-53.391 237.959 14.167 34.202 37.07 64.159 66.234 86.634 28.275 21.789 61.873 36.201 97.162 41.677l4.601-29.646c-63.343-9.829-115.784-51.006-140.281-110.146zM407.516 292.938c21.652-52.272 21.652-109.848 0-162.12-14.167-34.202-37.071-64.159-66.234-86.633-28.275-21.79-61.873-36.202-97.162-41.678l-4.601 29.646c63.342 9.829 115.783 51.005 140.28 110.146 18.586 44.869 18.586 94.29 0 139.159-10.649 25.709-26.678 48.152-46.859 66.135l-60.86-60.86v121.924h121.924l-39.801-39.801c22.915-20.757 41.131-46.508 53.313-75.918z" />
            </svg>
          </button>
        </div>

        <div className="flex-row">
          <h4 className="mt-0">You receive</h4>
          <div className="flex justify-between rounded-lg border bg-white">
            <input
              className="w-full rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none"
              type="number"
              value={toAmount}
              onChange={(e) => changeToAmount(e.target.value)}
              onBlur={() => blurToAmount()}
              onFocus={(e) => e.target.select()}
            />
            <select
              className="rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none"
              value={toCurrency}
              onChange={(e) => changeToCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.currency} value={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 text-white">
          Swap
        </button>
      </div>
    </div>
  );
};

export default SwapForm;
