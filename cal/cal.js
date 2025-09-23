// DOM Elements
const loanAmountSlider = document.getElementById("loanAmountSlider");
const loanAmountInput = document.getElementById("loanAmountInput");
const interestRateSlider = document.getElementById("interestRateSlider");
const interestRateInput = document.getElementById("interestRateInput");
const loanTermSlider = document.getElementById("loanTermSlider");
const loanTermInput = document.getElementById("loanTermInput");

const monthlyPayment = document.getElementById("monthlyPayment");
const totalPayment = document.getElementById("totalPayment");
const totalInterest = document.getElementById("totalInterest");

const loanAmountValue = document.getElementById("loanAmountValue");
const interestRateValue = document.getElementById("interestRateValue");
const loanTermValue = document.getElementById("loanTermValue");

// Update sliders and input values
function syncValues(slider, input) {
  slider.value = input.value;
  input.value = slider.value;
}

// Calculate EMI
function calculateEMI() {
  const principal = parseFloat(loanAmountInput.value) || 0;
  const rate = parseFloat(interestRateInput.value) || 0;
  const term = parseInt(loanTermInput.value) || 1;

  loanAmountValue.textContent = principal.toLocaleString();
  interestRateValue.textContent = rate + "%";
  loanTermValue.textContent = term + " months";

  const monthlyRate = rate / 12 / 100;
  let emi = 0;

  if (monthlyRate === 0) {
    emi = principal / term;
  } else {
    emi = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  }

  const total = emi * term;
  const interest = total - principal;

  monthlyPayment.value = emi.toFixed(2);
  totalPayment.value = total.toFixed(2);
  totalInterest.value = interest.toFixed(2);
}

// Event Listeners
[loanAmountSlider, loanAmountInput].forEach(el => el.addEventListener("input", calculateEMI));
[interestRateSlider, interestRateInput].forEach(el => el.addEventListener("input", calculateEMI));
[loanTermSlider, loanTermInput].forEach(el => el.addEventListener("input", calculateEMI));

// Initialize
window.addEventListener("DOMContentLoaded", calculateEMI);
