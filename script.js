const converter1 = document.querySelector(".con-1");
const converter2 = document.querySelector(".con-2");
const currencyDivs1 = converter1.querySelectorAll(".currency div");
const currencyDivs2 = converter2.querySelectorAll(".currency div");
const input1 = converter1.querySelector("input");
const input2 = converter2.querySelector("input");
const span1 = converter1.querySelector(".input span");
const span2 = converter2.querySelector(".input span");
import { API_KEY } from "./constants.js";
import { DELAY_TIME } from "./constants.js";

//RESPONSIVLIYY QALIBBB

let currency1 = "RUB";
let currency2 = "USD";
let input1Timer;
let input2Timer;

const convertCurrency = async (currency) => {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const handleCurrencyDivClick = (currencyDiv, currencyValue) => {
  currencyDiv.forEach((currency) => {
    currency.addEventListener("click", () => {
      if (currency.textContent === currencyValue) return;
      currencyDiv.forEach((el) => el.classList.remove("active"));
      currencyValue = currency.textContent;
      currency.classList.add("active");
    });
  });
};

handleCurrencyDivClick(currencyDivs1, currency1);
handleCurrencyDivClick(currencyDivs2, currency2);

const formatInputs = (input) => {
  input.addEventListener("focus", () => {
    if (input.value === "0") {
      input.value = "";
    }
  });

  input.addEventListener("blur", () => {
    if (input.value.trim() === "") {
      input.value = "0";
    }
  });
};

formatInputs(input1);
formatInputs(input2);

input1.addEventListener("input", () => {
  let data;
  clearTimeout(input1Timer);
  if (input1.value.trim() === "") return;

  input1Timer = setTimeout(async () => {
    data = await convertCurrency(currency1);
    console.log(data);
    const convertedAmount = input1.value * data.conversion_rates[currency2];
    input2.value = convertedAmount.toFixed(5);
  }, DELAY_TIME);
});

input2.addEventListener("input", () => {
  let data;
  clearTimeout(input2Timer);
  if (input2.value.trim() === "") return;

  input2Timer = setTimeout(async () => {
    data = await convertCurrency(currency2);
    console.log(data);
    const amount = input2.value * data.conversion_rates[currency1];
    input1.value = amount.toFixed(5);
  }, DELAY_TIME);
});
