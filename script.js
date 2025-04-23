const converter1 = document.querySelector(".con-1");
const converter2 = document.querySelector(".con-2");
const currencyDivs1 = converter1.querySelectorAll(".currency div");
const currencyDivs2 = converter2.querySelectorAll(".currency div");
const input1 = converter1.querySelector("input");
const input2 = converter2.querySelector("input");
const span1 = converter1.querySelector(".input span");
const span2 = converter2.querySelector(".input span");
const errorDiv = document.querySelector(".error");
const errorMessage = errorDiv.querySelector("p");
const hamburgerContainer = document.querySelector(".hamburger");
const hamburgerBtn = hamburgerContainer.querySelector("button");
const hamburgerDropdown = hamburgerContainer.querySelector(".dropdown");
import { API_KEY } from "./constants.js";
import { DELAY_TIME } from "./constants.js";

//RESPONSIVLIYY TELEFON UCUN

let currency1 = "RUB";
let currency2 = "USD";
let input1Timer;
let input2Timer;
let lastChanged = "input1";

const convertCurrency = async (currency) => {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`
    );
    if (!response.ok) throw new Error();
    const data = await response.json();
    hideError();
    return data;
  } catch (error) {
    showError(
      "Valyuta məlumatlarını əldə etmək mümkün olmadı. Zəhmət olmasa internet bağlantınızın olduğundan əmin olun!"
    );
    throw error;
  }
};

const handleCurrencyDivClick = (currencyDiv, setCurrency) => {
  currencyDiv.forEach((currency) => {
    currency.addEventListener("click", async () => {
      const selectedCurrency = currency.textContent;
      if (selectedCurrency === setCurrency()) return;

      currencyDiv.forEach((el) => el.classList.remove("active"));
      currency.classList.add("active");
      setCurrency(selectedCurrency);
      await updateForNewCurrency();
    });
  });
};

handleCurrencyDivClick(currencyDivs1, (value) => {
  if (value !== undefined) currency1 = value;
  return currency1;
});

handleCurrencyDivClick(currencyDivs2, (value) => {
  if (value !== undefined) currency2 = value;
  return currency2;
});

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
  clearTimeout(input1Timer);
  if (input1.value.trim() === "") return;
  lastChanged = "input1";

  input1Timer = setTimeout(async () => {
    if (currency2 === currency1) {
      input2.value = Number(input1.value).toFixed(5);
    } else {
      const data = await convertCurrency(currency1);
      const amount = input1.value * data.conversion_rates[currency2];
      input2.value = amount.toFixed(5);
    }
  }, DELAY_TIME);
});

input2.addEventListener("input", () => {
  clearTimeout(input2Timer);
  if (input2.value.trim() === "") return;
  lastChanged = "input2";

  input2Timer = setTimeout(async () => {
    if (currency1 === currency2) {
      input1.value = Number(input2.value).toFixed(5);
    } else {
      const data = await convertCurrency(currency2);
      const amount = input2.value * data.conversion_rates[currency1];
      input1.value = amount.toFixed(5);
    }
  }, DELAY_TIME);
});

const updateForNewCurrency = async () => {
  if (currency1 === currency2) {
    span1.textContent = `1 ${currency1} = 1 ${currency2}`;
    span2.textContent = `1 ${currency2} = 1 ${currency1}`;

    if (lastChanged === "input1") {
      const value = +input1.value;
      console.log(value);
      input2.value = value ? value.toFixed(5) : 0;
    } else {
      const value = +input2.value;
      input1.value = value ? value.toFixed(5) : 0;
    }
    return;
  }

  if (lastChanged === "input1") {
    const data = await convertCurrency(currency1);
    const currencyRate = data.conversion_rates[currency2];
    const reversedRate = 1 / currencyRate;
    const amount = input1.value * currencyRate;
    input2.value = amount ? amount.toFixed(5) : 0;
    span1.textContent = `1 ${currency1} = ${currencyRate.toFixed(
      5
    )} ${currency2}`;
    span2.textContent = `1 ${currency2} = ${reversedRate.toFixed(
      5
    )} ${currency1}`;
  } else {
    const data = await convertCurrency(currency2);
    const currencyRate = data.conversion_rates[currency1];
    const reversedRate = 1 / currencyRate;
    const amount = input2.value * currencyRate;
    input1.value = amount ? amount.toFixed(5) : 0;
    span1.textContent = `1 ${currency1} = ${currencyRate.toFixed(
      5
    )} ${currency2}`;
    span2.textContent = `1 ${currency2} = ${reversedRate.toFixed(
      5
    )} ${currency1}`;
  }
};

updateForNewCurrency();

const formatInputValue = (input) => {
  input.addEventListener("input", () => {
    const parts = input.value.split(".");
    if (parts[1] && parts[1].length > 5) {
      parts[1] = parts[1].slice(0, 5);
      input.value = parts.join(".");
    }
  });
};

formatInputValue(input1);
formatInputValue(input2);

hamburgerBtn.addEventListener("click", () => {
  if (hamburgerDropdown.classList.contains("hide")) {
    hamburgerDropdown.classList.remove("hide");
    hamburgerDropdown.classList.add("show");
  } else {
    hamburgerDropdown.classList.add("hide");
  }
});

window.addEventListener("resize", () => {
  if (
    window.innerWidth > 1100 &&
    hamburgerDropdown.classList.contains("show")
  ) {
    hamburgerDropdown.classList.add("hide");
  }
});

const showError = (message) => {
  errorMessage.textContent = message;
  errorDiv.style.display = "flex";
};

const hideError = () => {
  errorDiv.style.display = 'none';
};

window.addEventListener("online", async () => {
  hideError();
  await updateForNewCurrency();
});

window.addEventListener("offline", () => {
  showError("Internet bağlantınız yoxdur!");
});
