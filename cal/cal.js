// Elements
const sliders = [
  { slider: document.getElementById("loanAmountSlider"), input: document.getElementById("loanAmountInput"), label: document.getElementById("loanAmountValue"), type: "number" },
  { slider: document.getElementById("interestRateSlider"), input: document.getElementById("interestRateInput"), label: document.getElementById("interestRateValue"), type: "percent" },
  { slider: document.getElementById("loanTermSlider"), input: document.getElementById("loanTermInput"), label: document.getElementById("loanTermValue"), type: "months" }
];

const monthlyPayment = document.getElementById("monthlyPayment");
const totalPayment = document.getElementById("totalPayment");
const totalInterest = document.getElementById("totalInterest");

// Sync slider and input
function syncSliderInput(obj) {
  let value = parseFloat(obj.input.value) || 0;
  const min = parseFloat(obj.slider.min);
  const max = parseFloat(obj.slider.max);

  // Clamp for slider display
  const sliderVal = Math.min(Math.max(value, min), max);
  obj.slider.value = sliderVal;

  // Update label
  obj.label.textContent = obj.type==="percent"? sliderVal.toFixed(2)+"%" : obj.type==="months"? sliderVal+" months" : Number(sliderVal).toLocaleString();

  // Slider fill
  const percent = ((sliderVal - min) / (max - min)) * 100;
  obj.slider.style.background = `linear-gradient(to right, #0d6efd ${percent}%, #e0e0e0 ${percent}%)`;
}

// Calculate EMI
function calculateEMI() {
  const principal = parseFloat(sliders[0].input.value) || 0;
  const rate = parseFloat(sliders[1].input.value) || 0;
  const term = parseInt(sliders[2].input.value) || 1;

  sliders.forEach(syncSliderInput);

  const monthlyRate = rate / 12 / 100;
  let emi = 0;
  if(monthlyRate === 0){
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

// Event listeners
sliders.forEach(obj=>{
  obj.slider.addEventListener("input", ()=>{
    obj.input.value = obj.slider.value;
    calculateEMI();
  });
  obj.input.addEventListener("input", ()=>{
    calculateEMI();
  });
});

// Initialize
window.addEventListener("DOMContentLoaded", calculateEMI);
  