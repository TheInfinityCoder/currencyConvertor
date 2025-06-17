const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    // Default selections
    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  // Update flag when selection changes
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Set correct flag image
function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

// Fetch exchange rate and update the UI
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  try {
    const url = `${BASE_URL}/${from}.json`;
    const res = await fetch(url);
    const data = await res.json();

    const rate = data[from][to];
    const convertedAmount = (amtVal * rate).toFixed(2);

    const msg = document.querySelector(".msg");
    msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    document.querySelector(".msg").innerText =
      "Failed to get exchange rate. Please try again.";
  }
});
