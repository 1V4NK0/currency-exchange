import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [amount, setAmount] = useState(1);
  const [conversionRates, setConversionRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [error, setError] = useState(null); // State to track errors
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const api = process.env.REACT_APP_RATES_API_KEY;

  useEffect(() => {
    async function fetchRates() {
      try {
        setIsLoading(true); // Start loading
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${api}/latest/EUR`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conversion rates.");
        }
        const data = await response.json();
        setConversionRates(data.conversion_rates);
        setIsLoading(false); // Stop loading
      } catch (error) {
        setError(error.message);
        setIsLoading(false); // Stop loading even if there's an error
      }
    }

    fetchRates();
  }, [api]);

  return (
    <>
      <h3>best currency converter</h3>
      <div className="container">
        <div className="main">
          <InputField text={"Amount"} amount={amount} setAmount={setAmount} />
          <SelectField
            text="From"
            value={fromCurrency}
            data={conversionRates}
            onChange={(e) => {
              setFromCurrency(e.target.value);
              console.log("from: ", e.target.value);
            }}
            isLoading={isLoading}
            error={error}
          />
          <button
            onClick={() => {
              setFromCurrency((prevFromCurrency) => {
                setToCurrency(prevFromCurrency);
                return toCurrency;
              });
            }}
          >
            <i className="fa-solid fa-rotate"></i>{" "}
          </button>
          <SelectField
            text="To"
            value={toCurrency}
            data={conversionRates}
            onChange={(e) => {
              setToCurrency(e.target.value);
              console.log("to: ", e.target.value);
            }}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="result-container">
          {error ? (
            <p className="error">{error}</p>
          ) : (
            <Result
              toCurrency={toCurrency}
              amount={amount}
              fromCurrency={fromCurrency}
              conversionRates={conversionRates}
            />
          )}
        </div>
      </div>
    </>
  );
}

function Result({ toCurrency, amount, fromCurrency, conversionRates }) {
  if (!conversionRates[toCurrency] || !conversionRates[fromCurrency]) {
    return <div className="result">Loading...</div>;
  }
  const result =
    (amount * conversionRates[toCurrency]) / conversionRates[fromCurrency];
  return (
    <div className="result">
      <p>
        {amount} {fromCurrency} =
      </p>
      <h4>
        {result.toFixed(2)} {toCurrency}
      </h4>
      <p>
        1 {fromCurrency} ={" "}
        {conversionRates[toCurrency] / conversionRates[fromCurrency]}{" "}
        {toCurrency}{" "}
      </p>
      <p>
        1 {toCurrency} ={" "}
        {(conversionRates[fromCurrency] / conversionRates[toCurrency]).toFixed(
          4
        )}{" "}
        {fromCurrency}{" "}
      </p>
    </div>
  );
}

function SelectField({ text, data, value, onChange, isLoading, error }) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="select-container">
      <p>{text}</p>
      <select name="" id="" value={value} onChange={onChange}>
        {Object.keys(data).map((currency, index) => (
          <option value={currency} key={index}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputField({ text, amount, setAmount }) {
  return (
    <div className="input-container">
      <p>{text}</p>
      <input
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
    </div>
  );
}

export default App;
