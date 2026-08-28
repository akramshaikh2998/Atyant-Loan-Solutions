/* =========================================================
   ATYANT LOAN SOLUTIONS
   EMI + FOIR CALCULATOR
   COMPLETE REVISED JAVASCRIPT

   FEATURES
   ---------------------------------------------------------
   1. EMI Calculator
   2. Manual Loan Amount
   3. Manual Interest Rate
   4. Manual Loan Tenure
   5. EMI Sliders
   6. Plus / Minus Buttons
   7. EMI Doughnut Chart
   8. Full Repayment Schedule
   9. Professional PDF Download
   10. FOIR Calculator
   11. Manual FOIR %
   12. Manual ROI %
   13. Maximum Eligible EMI
   14. Maximum Loan Amount Eligible
========================================================= */

"use strict";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let emiChart = null;
let emiSchedule = [];


/* =========================================================
   EMI CONSTANTS
========================================================= */

const MIN_LOAN_AMOUNT = 10000;
const MAX_LOAN_AMOUNT = 5000000;

const MIN_INTEREST_RATE = 0;
const MAX_INTEREST_RATE = 50;

const MIN_LOAN_TERM = 1;
const MAX_LOAN_TERM = 360;


/* =========================================================
   ELEMENT HELPER
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   EMI ELEMENTS
========================================================= */

const loanAmountSlider =
    getElement("loanAmountSlider");

const loanAmountInput =
    getElement("loanAmountInput");

const interestRateSlider =
    getElement("interestRateSlider");

const interestRateInput =
    getElement("interestRateInput");

const loanTermSlider =
    getElement("loanTermSlider");

const loanTermInput =
    getElement("loanTermInput");


const loanAmountValue =
    getElement("loanAmountValue");

const interestRateValue =
    getElement("interestRateValue");

const loanTermValue =
    getElement("loanTermValue");


const monthlyPayment =
    getElement("monthlyPayment");

const principalAmount =
    getElement("principalAmount");

const totalInterest =
    getElement("totalInterest");

const totalPayment =
    getElement("totalPayment");

const chartPrincipal =
    getElement("chartPrincipal");

const chartInterest =
    getElement("chartInterest");


/* =========================================================
   FOIR ELEMENTS
========================================================= */

const foirIncomeInput =
    getElement("foirMonthlyIncome");

const foirExistingEmiInput =
    getElement("foirExistingEmi");

const foirOtherObligationsInput =
    getElement("foirOtherObligations");

const foirPercentageInput =
    getElement("foirPercentage");

const foirROIInput =
    getElement("foirROI");

const foirTenureInput =
    getElement("foirTenure");

const foirCalculateButton =
    getElement("calculateFoirButton");

const foirError =
    getElement("foirCalculationError");


/* =========================================================
   FOIR RESULT ELEMENTS
========================================================= */

const foirActualResult =
    getElement("foirActualResult");

const foirResultStatus =
    getElement("foirResultStatus");

const foirResultBadge =
    getElement("foirResultBadge");

const foirResultIncome =
    getElement("foirResultIncome");

const foirResultExisting =
    getElement("foirResultExisting");

const foirResultEligibleEmi =
    getElement("foirResultProposedEmi");

const foirResultTotal =
    getElement("foirResultTotal");

const foirResultLimit =
    getElement("foirResultLimit");

const foirResultEligibleLoan =
    getElement("foirResultEligibleLoan");

const foirAssessmentIcon =
    getElement("foirAssessmentIcon");

const foirAssessmentTitle =
    getElement("foirAssessmentTitle");

const foirAssessmentMessage =
    getElement("foirAssessmentMessage");


/* =========================================================
   FORMAT INR
========================================================= */

function formatINR(value) {

    value = Number(value) || 0;

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value);
}


/* =========================================================
   FORMAT NUMBER FOR PDF
========================================================= */

function formatPDF(value) {

    value = Number(value) || 0;

    return (
        "Rs. " +
        value.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 0
            }
        )
    );
}


/* =========================================================
   FORMAT PERCENTAGE
========================================================= */

function formatPercent(value) {

    value = Number(value) || 0;

    return (
        value.toFixed(2) +
        "%"
    );
}


/* =========================================================
   GET NUMBER
========================================================= */

function getNumber(
    value,
    defaultValue = 0
) {

    const number =
        parseFloat(
            String(value ?? "")
                .replace(/,/g, "")
                .replace(/₹/g, "")
                .replace(/%/g, "")
                .trim()
        );

    if (
        Number.isNaN(number)
    ) {
        return defaultValue;
    }

    return number;
}


/* =========================================================
   ROUND
========================================================= */

function round2(value) {

    return Math.round(
        (
            Number(value) +
            Number.EPSILON
        ) * 100
    ) / 100;
}


/* =========================================================
   UPDATE RANGE VISUAL
========================================================= */

function updateRangeVisual(
    slider,
    min,
    max
) {

    if (!slider) {
        return;
    }

    const value =
        getNumber(
            slider.value,
            min
        );

    const percentage =
        (
            (value - min) /
            (max - min)
        ) * 100;

    slider.style.background =
        `linear-gradient(
            90deg,
            #0757d5 0%,
            #0757d5 ${percentage}%,
            #dce5f1 ${percentage}%,
            #dce5f1 100%
        )`;
}


/* =========================================================
   UPDATE ALL RANGE VISUALS
========================================================= */

function updateAllRangeVisuals() {

    updateRangeVisual(
        loanAmountSlider,
        MIN_LOAN_AMOUNT,
        MAX_LOAN_AMOUNT
    );

    updateRangeVisual(
        interestRateSlider,
        MIN_INTEREST_RATE,
        MAX_INTEREST_RATE
    );

    updateRangeVisual(
        loanTermSlider,
        MIN_LOAN_TERM,
        MAX_LOAN_TERM
    );
}


/* =========================================================
   UPDATE EMI LABELS
========================================================= */

function updateLabels() {

    if (loanAmountValue) {

        loanAmountValue.textContent =
            formatINR(
                getNumber(
                    loanAmountInput?.value,
                    MIN_LOAN_AMOUNT
                )
            );
    }


    if (interestRateValue) {

        interestRateValue.textContent =
            getNumber(
                interestRateInput?.value,
                0
            ) + "%";
    }


    if (loanTermValue) {

        loanTermValue.textContent =
            getNumber(
                loanTermInput?.value,
                MIN_LOAN_TERM
            ) +
            " Months";
    }
}


/* =========================================================
   SET LOAN AMOUNT
========================================================= */

function setLoanAmount(value) {

    let amount =
        getNumber(value, MIN_LOAN_AMOUNT);


    if (
        !Number.isFinite(amount)
    ) {
        amount =
            MIN_LOAN_AMOUNT;
    }


    amount =
        Math.round(amount);


    amount =
        Math.min(
            Math.max(
                amount,
                MIN_LOAN_AMOUNT
            ),
            MAX_LOAN_AMOUNT
        );


    if (loanAmountInput) {

        loanAmountInput.value =
            amount;
    }


    if (loanAmountSlider) {

        loanAmountSlider.value =
            amount;
    }


    updateLabels();
    updateAllRangeVisuals();
    calculateEMI();
}


/* =========================================================
   SET INTEREST RATE
========================================================= */

function setInterestRate(value) {

    let rateText =
        String(value ?? "")
            .replace(
                /[^0-9.]/g,
                ""
            );


    const parts =
        rateText.split(".");


    if (
        parts.length > 2
    ) {

        rateText =
            parts[0] +
            "." +
            parts
                .slice(1)
                .join("");
    }


    if (
        rateText === ""
    ) {

        if (interestRateValue) {
            interestRateValue.textContent =
                "0%";
        }

        return;
    }


    let rate =
        parseFloat(rateText);


    if (
        !Number.isFinite(rate)
    ) {
        return;
    }


    rate =
        Math.min(
            Math.max(
                rate,
                MIN_INTEREST_RATE
            ),
            MAX_INTEREST_RATE
        );


    if (interestRateInput) {

        interestRateInput.value =
            rateText;
    }


    if (interestRateSlider) {

        interestRateSlider.value =
            rate;
    }


    if (interestRateValue) {

        interestRateValue.textContent =
            rateText + "%";
    }


    updateAllRangeVisuals();
    calculateEMI();
}


/* =========================================================
   SET LOAN TENURE
========================================================= */

function setLoanTerm(value) {

    let term =
        getNumber(
            value,
            MIN_LOAN_TERM
        );


    if (
        !Number.isFinite(term)
    ) {

        term =
            MIN_LOAN_TERM;
    }


    term =
        Math.round(term);


    term =
        Math.min(
            Math.max(
                term,
                MIN_LOAN_TERM
            ),
            MAX_LOAN_TERM
        );


    if (loanTermInput) {

        loanTermInput.value =
            term;
    }


    if (loanTermSlider) {

        loanTermSlider.value =
            term;
    }


    updateLabels();
    updateAllRangeVisuals();
    calculateEMI();
}


/* =========================================================
   EMI CALCULATION
========================================================= */

function calculateEMI() {

    if (
        !loanAmountInput ||
        !interestRateInput ||
        !loanTermInput
    ) {
        return;
    }


    const principal =
        getNumber(
            loanAmountInput.value,
            0
        );


    const annualRate =
        getNumber(
            interestRateInput.value,
            0
        );


    const months =
        getNumber(
            loanTermInput.value,
            0
        );


    if (
        principal <= 0 ||
        months <= 0
    ) {

        displayZeroResults();

        return;
    }


    const monthlyRate =
        annualRate /
        12 /
        100;


    let emi = 0;


    /* ZERO INTEREST */

    if (
        monthlyRate === 0
    ) {

        emi =
            principal /
            months;
    }

    /* NORMAL INTEREST */

    else {

        const power =
            Math.pow(
                1 + monthlyRate,
                months
            );


        emi =
            principal *
            monthlyRate *
            power /
            (power - 1);
    }


    const total =
        emi *
        months;


    const interest =
        total -
        principal;


    if (monthlyPayment) {

        monthlyPayment.textContent =
            formatINR(
                round2(emi)
            );
    }


    if (principalAmount) {

        principalAmount.textContent =
            formatINR(
                principal
            );
    }


    if (totalInterest) {

        totalInterest.textContent =
            formatINR(
                round2(interest)
            );
    }


    if (totalPayment) {

        totalPayment.textContent =
            formatINR(
                round2(total)
            );
    }


    if (chartPrincipal) {

        chartPrincipal.textContent =
            formatINR(
                principal
            );
    }


    if (chartInterest) {

        chartInterest.textContent =
            formatINR(
                round2(interest)
            );
    }


    createSchedule(
        principal,
        annualRate,
        months,
        emi
    );


    createChart(
        principal,
        interest
    );
}


/* =========================================================
   ZERO EMI RESULTS
========================================================= */

function displayZeroResults() {

    const zeroElements = [
        monthlyPayment,
        principalAmount,
        totalInterest,
        totalPayment,
        chartPrincipal,
        chartInterest
    ];


    zeroElements.forEach(
        function(element) {

            if (element) {
                element.textContent =
                    "₹0";
            }

        }
    );


    emiSchedule = [];


    createChart(
        0,
        0
    );
}


/* =========================================================
   CREATE FULL REPAYMENT SCHEDULE
========================================================= */

function createSchedule(
    principal,
    annualRate,
    months,
    emi
) {

    emiSchedule = [];


    let balance =
        Number(principal);


    const monthlyRate =
        Number(annualRate) /
        12 /
        100;


    for (
        let month = 1;
        month <= months;
        month++
    ) {

        const openingBalance =
            balance;


        let interestPart = 0;


        if (
            monthlyRate > 0
        ) {

            interestPart =
                balance *
                monthlyRate;
        }


        let principalPart =
            emi -
            interestPart;


        /*
         * Last payment correction.
         */

        if (
            month === months
        ) {

            principalPart =
                balance;
        }


        principalPart =
            Math.min(
                principalPart,
                balance
            );


        if (
            principalPart < 0
        ) {

            principalPart = 0;
        }


        const payment =
            principalPart +
            interestPart;


        balance =
            Math.max(
                0,
                balance -
                principalPart
            );


        emiSchedule.push({

            month:
                month,

            openingBalance:
                openingBalance,

            emi:
                payment,

            principal:
                principalPart,

            interest:
                interestPart,

            closingBalance:
                balance

        });
    }
}


/* =========================================================
   CREATE CHART
========================================================= */

function createChart(
    principal,
    interest
) {

    const canvas =
        getElement(
            "emiPieChart"
        );


    if (!canvas) {
        return;
    }


    if (
        typeof Chart ===
        "undefined"
    ) {
        return;
    }


    if (emiChart) {

        emiChart.destroy();

        emiChart = null;
    }


    if (
        principal <= 0 &&
        interest <= 0
    ) {

        return;
    }


    emiChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [
                        "Principal",
                        "Interest"
                    ],

                    datasets: [
                        {

                            data: [
                                principal,
                                interest
                            ],

                            backgroundColor: [
                                "#0757d5",
                                "#55c7f0"
                            ],

                            borderWidth: 0

                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "68%",

                    plugins: {

                        legend: {
                            display: false
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            formatINR(
                                                context.raw
                                            )
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


/* =========================================================
   LOAN AMOUNT INPUT
========================================================= */

if (loanAmountInput) {

    loanAmountInput.addEventListener(
        "input",
        function() {

            let value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );


            this.value =
                value;


            if (
                value === ""
            ) {

                if (loanAmountValue) {

                    loanAmountValue.textContent =
                        "₹0";
                }

                return;
            }


            let amount =
                parseInt(
                    value,
                    10
                );


            if (
                amount >
                MAX_LOAN_AMOUNT
            ) {

                amount =
                    MAX_LOAN_AMOUNT;

                this.value =
                    amount;
            }


            if (loanAmountSlider) {

                loanAmountSlider.value =
                    Math.min(
                        Math.max(
                            amount,
                            MIN_LOAN_AMOUNT
                        ),
                        MAX_LOAN_AMOUNT
                    );
            }


            if (loanAmountValue) {

                loanAmountValue.textContent =
                    formatINR(
                        amount
                    );
            }


            calculateEMI();
        }
    );


    loanAmountInput.addEventListener(
        "change",
        function() {

            const amount =
                getNumber(
                    this.value,
                    MIN_LOAN_AMOUNT
                );

            setLoanAmount(
                amount
            );
        }
    );
}


/* =========================================================
   INTEREST RATE INPUT
========================================================= */

if (interestRateInput) {

    interestRateInput.addEventListener(
        "input",
        function() {

            let value =
                this.value.replace(
                    /[^0-9.]/g,
                    ""
                );


            const parts =
                value.split(".");


            if (
                parts.length > 2
            ) {

                value =
                    parts[0] +
                    "." +
                    parts
                        .slice(1)
                        .join("");
            }


            let rate =
                parseFloat(value);


            if (
                Number.isFinite(rate) &&
                rate >
                MAX_INTEREST_RATE
            ) {

                rate =
                    MAX_INTEREST_RATE;

                value =
                    String(
                        MAX_INTEREST_RATE
                    );
            }


            this.value =
                value;


            if (
                interestRateSlider &&
                Number.isFinite(rate)
            ) {

                interestRateSlider.value =
                    rate;
            }


            if (interestRateValue) {

                interestRateValue.textContent =
                    (value || "0") +
                    "%";
            }


            updateAllRangeVisuals();
            calculateEMI();
        }
    );
}


/* =========================================================
   TENURE INPUT
========================================================= */

if (loanTermInput) {

    loanTermInput.addEventListener(
        "input",
        function() {

            let value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );


            let term =
                parseInt(
                    value,
                    10
                );


            if (
                Number.isFinite(term) &&
                term >
                MAX_LOAN_TERM
            ) {

                term =
                    MAX_LOAN_TERM;

                value =
                    String(
                        MAX_LOAN_TERM
                    );
            }


            this.value =
                value;


            if (
                loanTermSlider &&
                Number.isFinite(term)
            ) {

                loanTermSlider.value =
                    term;
            }


            if (loanTermValue) {

                loanTermValue.textContent =
                    (value || "0") +
                    " Months";
            }


            updateAllRangeVisuals();
            calculateEMI();
        }
    );
}


/* =========================================================
   LOAN AMOUNT SLIDER
========================================================= */

if (loanAmountSlider) {

    loanAmountSlider.addEventListener(
        "input",
        function() {

            setLoanAmount(
                this.value
            );
        }
    );
}


/* =========================================================
   INTEREST RATE SLIDER
========================================================= */

if (interestRateSlider) {

    interestRateSlider.addEventListener(
        "input",
        function() {

            setInterestRate(
                this.value
            );
        }
    );
}


/* =========================================================
   TENURE SLIDER
========================================================= */

if (loanTermSlider) {

    loanTermSlider.addEventListener(
        "input",
        function() {

            setLoanTerm(
                this.value
            );
        }
    );
}


/* =========================================================
   LOAN MINUS
========================================================= */

const loanMinus =
    getElement(
        "loanMinus"
    );


if (loanMinus) {

    loanMinus.addEventListener(
        "click",
        function() {

            const current =
                getNumber(
                    loanAmountInput?.value,
                    MIN_LOAN_AMOUNT
                );


            const step =
                current >= 100000
                    ? 10000
                    : 1000;


            setLoanAmount(
                current - step
            );
        }
    );
}


/* =========================================================
   LOAN PLUS
========================================================= */

const loanPlus =
    getElement(
        "loanPlus"
    );


if (loanPlus) {

    loanPlus.addEventListener(
        "click",
        function() {

            const current =
                getNumber(
                    loanAmountInput?.value,
                    MIN_LOAN_AMOUNT
                );


            const step =
                current >= 100000
                    ? 10000
                    : 1000;


            setLoanAmount(
                current + step
            );
        }
    );
}


/* =========================================================
   RATE MINUS
========================================================= */

const interestMinus =
    getElement(
        "interestMinus"
    );


if (interestMinus) {

    interestMinus.addEventListener(
        "click",
        function() {

            const current =
                getNumber(
                    interestRateInput?.value,
                    0
                );


            setInterestRate(
                Math.max(
                    0,
                    current - 0.1
                ).toFixed(2)
            );
        }
    );
}


/* =========================================================
   RATE PLUS
========================================================= */

const interestPlus =
    getElement(
        "interestPlus"
    );


if (interestPlus) {

    interestPlus.addEventListener(
        "click",
        function() {

            const current =
                getNumber(
                    interestRateInput?.value,
                    0
                );


            setInterestRate(
                Math.min(
                    MAX_INTEREST_RATE,
                    current + 0.1
                ).toFixed(2)
            );
        }
    );
}


/* =========================================================
   TERM MINUS
========================================================= */

const termMinus =
    getElement(
        "termMinus"
    );


if (termMinus) {

    termMinus.addEventListener(
        "click",
        function() {

            const current =
                getNumber(
                    loanTermInput?.value,
                    1
                );


            setLoanTerm(
                current - 1
            );
        }
    );
}


/* =========================================================
   TERM PLUS
========================================================= */

const termPlus =
    getElement(
        "termPlus"
    );


if (termPlus) {

    termPlus.addEventListener(
        "click",
        function() {

            const current =
                getNumber(
                    loanTermInput?.value,
                    1
                );


            setLoanTerm(
                current + 1
            );
        }
    );
}


/* =========================================================
   EMI CALCULATE BUTTON
========================================================= */

const calculateButton =
    getElement(
        "calculateBtn"
    );


if (calculateButton) {

    calculateButton.addEventListener(
        "click",
        function() {

            calculateEMI();

        }
    );
}


/* =========================================================
   PDF DOWNLOAD BUTTON
========================================================= */

const downloadPdfButton =
    getElement(
        "downloadPdfBtn"
    );


if (downloadPdfButton) {

    downloadPdfButton.addEventListener(
        "click",
        function() {

            downloadPDF();

        }
    );
}


/* =========================================================
   PDF HELPER
========================================================= */

function pdfText(
    pdf,
    text,
    x,
    y,
    size = 10,
    style = "normal"
) {

    pdf.setFontSize(
        size
    );

    pdf.setFont(
        "helvetica",
        style
    );

    pdf.text(
        String(text),
        x,
        y
    );
}


/* =========================================================
   ADD PDF HEADER
========================================================= */

function addPDFHeader(
    pdf
) {

    pdf.setFillColor(
        6,
        26,
        59
    );

    pdf.rect(
        0,
        0,
        210,
        35,
        "F"
    );


    pdf.setTextColor(
        255,
        255,
        255
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        20
    );


    pdf.text(
        "ATYANT LOAN SOLUTIONS",
        15,
        16
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        9
    );


    pdf.text(
        "EMI Repayment Schedule",
        15,
        25
    );


    pdf.setTextColor(
        6,
        26,
        59
    );
}


/* =========================================================
   DOWNLOAD PDF
========================================================= */

/* =========================================================
   PROFESSIONAL PDF DOWNLOAD
========================================================= */

function downloadPDF() {

    /* -----------------------------------------------------
       CHECK jsPDF
    ----------------------------------------------------- */

    if (
        typeof window.jspdf === "undefined" ||
        typeof window.jspdf.jsPDF === "undefined"
    ) {

        alert(
            "PDF library is not loaded. Please check your jsPDF script."
        );

        return;
    }


    /* -----------------------------------------------------
       CHECK AUTOTABLE
    ----------------------------------------------------- */

    if (
        typeof window.jspdf.jsPDF.API.autoTable !== "function"
    ) {

        alert(
            "PDF table library is not loaded. Please check jsPDF AutoTable."
        );

        return;
    }


    const {
        jsPDF
    } = window.jspdf;


    /* -----------------------------------------------------
       CREATE PDF
    ----------------------------------------------------- */

    const pdf =
        new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });


    /* -----------------------------------------------------
       GET CURRENT EMI VALUES
    ----------------------------------------------------- */

    const loan =
        getNumber(
            loanAmountInput?.value,
            0
        );


    const rate =
        getNumber(
            interestRateInput?.value,
            0
        );


    const term =
        getNumber(
            loanTermInput?.value,
            0
        );


    const emi =
        getNumber(
            monthlyPayment?.textContent,
            0
        );


    const interest =
        getNumber(
            totalInterest?.textContent,
            0
        );


    const total =
        getNumber(
            totalPayment?.textContent,
            0
        );


    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
        loan <= 0 ||
        term <= 0 ||
        emi <= 0
    ) {

        alert(
            "Please calculate EMI before downloading the PDF."
        );

        return;
    }


    /* -----------------------------------------------------
       RE-CREATE SCHEDULE IF EMPTY
    ----------------------------------------------------- */

    if (
        !Array.isArray(emiSchedule) ||
        emiSchedule.length === 0
    ) {

        calculateEMI();
    }


    /* =====================================================
       HEADER
    ===================================================== */

    pdf.setFillColor(
        6,
        26,
        59
    );


    pdf.rect(
        0,
        0,
        210,
        32,
        "F"
    );


    pdf.setTextColor(
        255,
        255,
        255
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        19
    );


    pdf.text(
        "ATYANT LOAN SOLUTIONS",
        15,
        14
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        9
    );


    pdf.text(
        "EMI & Loan Repayment Report",
        15,
        23
    );


    /* -----------------------------------------------------
       DATE
    ----------------------------------------------------- */

    const today =
        new Date();


    const dateString =
        today.toLocaleDateString(
            "en-IN"
        );


    pdf.text(
        "Date: " + dateString,
        155,
        18
    );


    /* =====================================================
       RESET TEXT COLOR
    ===================================================== */

    pdf.setTextColor(
        6,
        26,
        59
    );


    /* =====================================================
       LOAN SUMMARY TITLE
    ===================================================== */

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        14
    );


    pdf.text(
        "Loan Summary",
        15,
        45
    );


    /* =====================================================
       SUMMARY TABLE
    ===================================================== */

    const summaryBody = [

        [
            "Loan Amount",
            formatPDF(loan)
        ],

        [
            "Interest Rate",
            rate.toFixed(2) + "%"
        ],

        [
            "Loan Tenure",
            term + " Months"
        ],

        [
            "Monthly EMI",
            formatPDF(emi)
        ],

        [
            "Total Interest",
            formatPDF(interest)
        ],

        [
            "Total Payment",
            formatPDF(total)
        ]

    ];


    pdf.autoTable({

        startY: 50,

        margin: {
            left: 15,
            right: 15
        },

        head: [
            [
                "Particular",
                "Amount / Value"
            ]
        ],

        body:
            summaryBody,

        theme:
            "grid",

        styles: {

            font:
                "helvetica",

            fontSize:
                9,

            cellPadding:
                4,

            textColor: [
                30,
                40,
                55
            ],

            lineColor: [
                215,
                223,
                233
            ],

            lineWidth:
                0.2

        },

        headStyles: {

            fillColor: [
                7,
                87,
                213
            ],

            textColor: [
                255,
                255,
                255
            ],

            fontStyle:
                "bold",

            fontSize:
                9

        },

        columnStyles: {

            0: {
                cellWidth:
                    85
            },

            1: {
                cellWidth:
                    85,
                halign:
                    "right"
            }

        }

    });


    /* =====================================================
       REPAYMENT SCHEDULE TITLE
    ===================================================== */

    let scheduleY =
        pdf.lastAutoTable.finalY +
        14;


    if (
        scheduleY > 260
    ) {

        pdf.addPage();

        scheduleY = 45;
    }


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        14
    );


    pdf.setTextColor(
        6,
        26,
        59
    );


    pdf.text(
        "Detailed Repayment Schedule",
        15,
        scheduleY
    );


    /* =====================================================
       SCHEDULE BODY
    ===================================================== */

    const repaymentRows =
        emiSchedule.map(
            function(row) {

                return [

                    String(
                        row.month
                    ),

                    formatPDF(
                        row.openingBalance
                    ),

                    formatPDF(
                        row.emi
                    ),

                    formatPDF(
                        row.principal
                    ),

                    formatPDF(
                        row.interest
                    ),

                    formatPDF(
                        row.closingBalance
                    )

                ];

            }
        );


    /* =====================================================
       REPAYMENT TABLE
    ===================================================== */

    pdf.autoTable({

        startY:
            scheduleY + 5,

        margin: {

            top:
                40,

            bottom:
                15,

            left:
                8,

            right:
                8

        },

        head: [

            [

                "Month",

                "Opening Balance",

                "EMI",

                "Principal",

                "Interest",

                "Closing Balance"

            ]

        ],

        body:
            repaymentRows,

        theme:
            "grid",

        showHead:
            "everyPage",

        styles: {

            font:
                "helvetica",

            fontSize:
                6.5,

            cellPadding:
                2.2,

            textColor: [
                35,
                45,
                60
            ],

            lineColor: [
                215,
                223,
                233
            ],

            lineWidth:
                0.15,

            valign:
                "middle"

        },

        headStyles: {

            fillColor: [
                6,
                26,
                59
            ],

            textColor: [
                255,
                255,
                255
            ],

            fontStyle:
                "bold",

            fontSize:
                7,

            halign:
                "center",

            valign:
                "middle"

        },

        alternateRowStyles: {

            fillColor: [
                247,
                250,
                253
            ]

        },

        columnStyles: {

            0: {

                cellWidth:
                    13,

                halign:
                    "center"

            },

            1: {

                cellWidth:
                    35,

                halign:
                    "right"

            },

            2: {

                cellWidth:
                    31,

                halign:
                    "right"

            },

            3: {

                cellWidth:
                    31,

                halign:
                    "right"

            },

            4: {

                cellWidth:
                    30,

                halign:
                    "right"

            },

            5: {

                cellWidth:
                    35,

                halign:
                    "right"

            }

        },

        didDrawPage:
            function() {

                /* -------------------------------------------------
                   HEADER ON EVERY PAGE
                ------------------------------------------------- */

                pdf.setFillColor(
                    6,
                    26,
                    59
                );


                pdf.rect(
                    0,
                    0,
                    210,
                    30,
                    "F"
                );


                pdf.setTextColor(
                    255,
                    255,
                    255
                );


                pdf.setFont(
                    "helvetica",
                    "bold"
                );


                pdf.setFontSize(
                    15
                );


                pdf.text(
                    "ATYANT LOAN SOLUTIONS",
                    15,
                    13
                );


                pdf.setFont(
                    "helvetica",
                    "normal"
                );


                pdf.setFontSize(
                    8
                );


                pdf.text(
                    "Detailed EMI Repayment Schedule",
                    15,
                    21
                );


                /* -------------------------------------------------
                   FOOTER
                ------------------------------------------------- */

                const pageNumber =
                    pdf.internal
                        .getNumberOfPages();


                pdf.setTextColor(
                    110,
                    120,
                    135
                );


                pdf.setFontSize(
                    7
                );


                pdf.text(
                    "Atyant Loan Solutions | Indicative calculation only",
                    15,
                    290
                );


                pdf.text(
                    "Page " +
                    pageNumber,
                    180,
                    290
                );

            }

    });


    /* =====================================================
       FINAL DISCLAIMER PAGE CONTENT
    ===================================================== */

    let finalY =
        pdf.lastAutoTable.finalY +
        10;


    if (
        finalY > 275
    ) {

        pdf.addPage();

        finalY =
            45;
    }


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        9
    );


    pdf.setTextColor(
        6,
        26,
        59
    );


    pdf.text(
        "Important Note",
        15,
        finalY
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        7.5
    );


    pdf.setTextColor(
        100,
        110,
        125
    );


    pdf.text(
        "This calculator provides an indicative EMI and repayment schedule.",
        15,
        finalY + 6
    );


    pdf.text(
        "Actual loan approval, interest rate, tenure and other terms are",
        15,
        finalY + 11
    );


    pdf.text(
        "subject to the applicable lender's eligibility criteria and policies.",
        15,
        finalY + 16
    );


    /* =====================================================
       SAVE
    ===================================================== */

    const fileDate =
        today
            .toISOString()
            .split("T")[0];


    pdf.save(
        "Atyant-Loan-EMI-Repayment-" +
        fileDate +
        ".pdf"
    );

}

/* =========================================================
   INITIALIZE EMI CALCULATOR
========================================================= */

function initializeCalculator() {

    if (loanAmountSlider) {

        loanAmountSlider.min =
            MIN_LOAN_AMOUNT;

        loanAmountSlider.max =
            MAX_LOAN_AMOUNT;
    }


    if (interestRateSlider) {

        interestRateSlider.min =
            MIN_INTEREST_RATE;

        interestRateSlider.max =
            MAX_INTEREST_RATE;
    }


    if (loanTermSlider) {

        loanTermSlider.min =
            MIN_LOAN_TERM;

        loanTermSlider.max =
            MAX_LOAN_TERM;
    }


    let initialLoan =
        getNumber(
            loanAmountInput?.value,
            1000000
        );


    let initialRate =
        getNumber(
            interestRateInput?.value,
            9.99
        );


    let initialTerm =
        getNumber(
            loanTermInput?.value,
            60
        );


    initialLoan =
        Math.min(
            Math.max(
                initialLoan,
                MIN_LOAN_AMOUNT
            ),
            MAX_LOAN_AMOUNT
        );


    initialRate =
        Math.min(
            Math.max(
                initialRate,
                MIN_INTEREST_RATE
            ),
            MAX_INTEREST_RATE
        );


    initialTerm =
        Math.min(
            Math.max(
                Math.round(initialTerm),
                MIN_LOAN_TERM
            ),
            MAX_LOAN_TERM
        );


    if (loanAmountInput) {

        loanAmountInput.value =
            initialLoan;
    }


    if (loanAmountSlider) {

        loanAmountSlider.value =
            initialLoan;
    }


    if (interestRateInput) {

        interestRateInput.value =
            initialRate;
    }


    if (interestRateSlider) {

        interestRateSlider.value =
            initialRate;
    }


    if (loanTermInput) {

        loanTermInput.value =
            initialTerm;
    }


    if (loanTermSlider) {

        loanTermSlider.value =
            initialTerm;
    }


    updateLabels();

    updateAllRangeVisuals();

    calculateEMI();
}


/* =========================================================
   FOIR RESET
========================================================= */

function resetFOIR() {

    if (foirActualResult) {

        foirActualResult.textContent =
            "0.00%";
    }


    if (foirResultStatus) {

        foirResultStatus.textContent =
            "Enter details and click Calculate FOIR";
    }


    if (foirResultBadge) {

        foirResultBadge.innerHTML =
            '<i class="fa-solid fa-calculator"></i> Ready';
    }


    if (foirResultIncome) {

        foirResultIncome.textContent =
            "₹0";
    }


    if (foirResultExisting) {

        foirResultExisting.textContent =
            "₹0";
    }


    if (foirResultEligibleEmi) {

        foirResultEligibleEmi.textContent =
            "₹0";
    }


    if (foirResultTotal) {

        foirResultTotal.textContent =
            "₹0";
    }


    if (foirResultLimit) {

        foirResultLimit.textContent =
            "0.00%";
    }


    if (foirResultEligibleLoan) {

        foirResultEligibleLoan.textContent =
            "₹0";
    }


    if (foirAssessmentTitle) {

        foirAssessmentTitle.textContent =
            "Awaiting Calculation";
    }


    if (foirAssessmentMessage) {

        foirAssessmentMessage.textContent =
            "Enter the values on the left and click Calculate FOIR.";
    }


    if (foirAssessmentIcon) {

        foirAssessmentIcon.className =
            "fa-solid fa-circle-check";
    }
}


/* =========================================================
   FOIR ERROR
========================================================= */

function showFOIRError(
    message,
    input
) {

    if (foirError) {

        foirError.textContent =
            message;
    }


    if (input) {

        input.focus();
    }
}


/* =========================================================
   FOIR CALCULATION
========================================================= */

function calculateFOIR() {

    if (
        !foirCalculateButton
    ) {
        return;
    }


    if (foirError) {

        foirError.textContent =
            "";
    }


    /* =====================================================
       READ INPUTS
    ===================================================== */

    const income =
        getNumber(
            foirIncomeInput?.value,
            NaN
        );


    const existingEmi =
        getNumber(
            foirExistingEmiInput?.value,
            NaN
        );


    const otherObligations =
        getNumber(
            foirOtherObligationsInput?.value,
            NaN
        );


    const foirLimit =
        getNumber(
            foirPercentageInput?.value,
            NaN
        );


    const roi =
        getNumber(
            foirROIInput?.value,
            NaN
        );


    const tenure =
        getNumber(
            foirTenureInput?.value,
            NaN
        );


    /* =====================================================
       VALIDATE INCOME
    ===================================================== */

    if (
        !Number.isFinite(income) ||
        income <= 0
    ) {

        showFOIRError(
            "Please enter a valid monthly net income.",
            foirIncomeInput
        );

        resetFOIR();

        return;
    }


    /* =====================================================
       VALIDATE EXISTING EMI
    ===================================================== */

    if (
        !Number.isFinite(existingEmi) ||
        existingEmi < 0
    ) {

        showFOIRError(
            "Please enter a valid existing EMI.",
            foirExistingEmiInput
        );

        resetFOIR();

        return;
    }


    /* =====================================================
       VALIDATE OTHER OBLIGATIONS
    ===================================================== */

    if (
        !Number.isFinite(otherObligations) ||
        otherObligations < 0
    ) {

        showFOIRError(
            "Please enter valid other monthly obligations.",
            foirOtherObligationsInput
        );

        resetFOIR();

        return;
    }


    /* =====================================================
       VALIDATE FOIR
    ===================================================== */

    if (
        !Number.isFinite(foirLimit) ||
        foirLimit <= 0 ||
        foirLimit > 100
    ) {

        showFOIRError(
            "Please enter FOIR between 0.01% and 100%.",
            foirPercentageInput
        );

        resetFOIR();

        return;
    }


    /* =====================================================
       VALIDATE ROI
    ===================================================== */

    if (
        !Number.isFinite(roi) ||
        roi < 0 ||
        roi > 50
    ) {

        showFOIRError(
            "Please enter ROI between 0% and 50%.",
            foirROIInput
        );

        resetFOIR();

        return;
    }


    /* =====================================================
       VALIDATE TENURE
    ===================================================== */

    if (
        !Number.isFinite(tenure) ||
        tenure <= 0
    ) {

        showFOIRError(
            "Please enter a valid loan tenure.",
            foirTenureInput
        );

        resetFOIR();

        return;
    }


    /* =====================================================
       EXISTING OBLIGATIONS
    ===================================================== */

    const existingObligations =
        existingEmi +
        otherObligations;


    /* =====================================================
       MAXIMUM TOTAL OBLIGATION
    ===================================================== */

    const maximumTotalObligation =
        income *
        foirLimit /
        100;


    /* =====================================================
       MAXIMUM ELIGIBLE EMI
    ===================================================== */

    const maximumEligibleEmi =
        Math.max(
            0,
            maximumTotalObligation -
            existingObligations
        );


    /* =====================================================
       MAXIMUM LOAN AMOUNT
       
       Formula:

       EMI = P × r × (1+r)^n /
             ((1+r)^n - 1)

       Therefore:

       P = EMI × ((1+r)^n - 1) /
           (r × (1+r)^n)
    ===================================================== */

    const monthlyRate =
        roi /
        12 /
        100;


    let maximumLoanAmountEligible =
        0;


    if (
        maximumEligibleEmi > 0
    ) {

        /* ZERO ROI */

        if (
            monthlyRate === 0
        ) {

            maximumLoanAmountEligible =
                maximumEligibleEmi *
                tenure;
        }


        /* ROI > 0 */

        else {

            const factor =
                Math.pow(
                    1 + monthlyRate,
                    tenure
                );


            maximumLoanAmountEligible =
                maximumEligibleEmi *
                (
                    factor - 1
                ) /
                (
                    monthlyRate *
                    factor
                );
        }
    }


    /* =====================================================
       ACTUAL EXISTING FOIR
       
       This represents current obligations
       before adding the new loan EMI.
    ===================================================== */

    const actualFOIR =
        (
            existingObligations /
            income
        ) *
        100;


    /* =====================================================
       RESULT FOIR

       After adding maximum eligible EMI,
       the total reaches the entered FOIR limit.
    ===================================================== */

    const finalFOIR =
        (
            (
                existingObligations +
                maximumEligibleEmi
            ) /
            income
        ) *
        100;


    /* =====================================================
       DISPLAY ACTUAL FOIR
    ===================================================== */

    if (foirActualResult) {

        foirActualResult.textContent =
            formatPercent(
                actualFOIR
            );
    }


    /* =====================================================
       DISPLAY INCOME
    ===================================================== */

    if (foirResultIncome) {

        foirResultIncome.textContent =
            formatINR(
                income
            );
    }


    /* =====================================================
       DISPLAY EXISTING OBLIGATIONS
    ===================================================== */

    if (foirResultExisting) {

        foirResultExisting.textContent =
            formatINR(
                existingObligations
            );
    }


    /* =====================================================
       DISPLAY MAXIMUM ELIGIBLE EMI
    ===================================================== */

    if (foirResultEligibleEmi) {

        foirResultEligibleEmi.textContent =
            formatINR(
                maximumEligibleEmi
            );
    }


    /* =====================================================
       DISPLAY TOTAL OBLIGATIONS
    ===================================================== */

    if (foirResultTotal) {

        foirResultTotal.textContent =
            formatINR(
                existingObligations +
                maximumEligibleEmi
            );
    }


    /* =====================================================
       DISPLAY FOIR LIMIT
    ===================================================== */

    if (foirResultLimit) {

        foirResultLimit.textContent =
            formatPercent(
                foirLimit
            );
    }


    /* =====================================================
       DISPLAY MAXIMUM LOAN
    ===================================================== */

    if (foirResultEligibleLoan) {

        foirResultEligibleLoan.textContent =
            formatINR(
                maximumLoanAmountEligible
            );
    }


    /* =====================================================
       ELIGIBLE
    ===================================================== */

    if (
        maximumEligibleEmi > 0 &&
        maximumLoanAmountEligible > 0
    ) {

        if (foirResultBadge) {

            foirResultBadge.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> Eligible';
        }


        if (foirResultStatus) {

            foirResultStatus.textContent =
                "Additional EMI capacity is available within the entered FOIR limit.";
        }


        if (foirAssessmentTitle) {

            foirAssessmentTitle.textContent =
                "Eligible for Indicative Loan Amount";
        }


        if (foirAssessmentMessage) {

            foirAssessmentMessage.textContent =
                "Maximum eligible EMI is calculated from income, existing obligations and FOIR. Maximum loan amount is calculated using the entered ROI and tenure.";
        }


        if (foirAssessmentIcon) {

            foirAssessmentIcon.className =
                "fa-solid fa-circle-check";
        }
    }


    /* =====================================================
       NOT ELIGIBLE
    ===================================================== */

    else {

        if (foirResultBadge) {

            foirResultBadge.innerHTML =
                '<i class="fa-solid fa-circle-exclamation"></i> Not Eligible';
        }


        if (foirResultStatus) {

            foirResultStatus.textContent =
                "Existing obligations have used the available FOIR capacity.";
        }


        if (foirAssessmentTitle) {

            foirAssessmentTitle.textContent =
                "No Additional EMI Capacity";
        }


        if (foirAssessmentMessage) {

            foirAssessmentMessage.textContent =
                "Existing monthly obligations are already at or above the entered FOIR limit.";
        }


        if (foirAssessmentIcon) {

            foirAssessmentIcon.className =
                "fa-solid fa-circle-exclamation";
        }
    }
}


/* =========================================================
   FOIR CALCULATE BUTTON
========================================================= */

if (
    foirCalculateButton
) {

    foirCalculateButton.addEventListener(
        "click",
        calculateFOIR
    );
}


/* =========================================================
   FOIR ENTER KEY
========================================================= */

[
    foirIncomeInput,
    foirExistingEmiInput,
    foirOtherObligationsInput,
    foirPercentageInput,
    foirROIInput,
    foirTenureInput

].forEach(
    function(input) {

        if (!input) {
            return;
        }


        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    calculateFOIR();
                }
            }
        );
    }
);


/* =========================================================
   FOIR MONEY INPUTS
========================================================= */

[
    foirIncomeInput,
    foirExistingEmiInput,
    foirOtherObligationsInput

].forEach(
    function(input) {

        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            function() {

                this.value =
                    this.value.replace(
                        /[^0-9,]/g,
                        ""
                    );
            }
        );
    }
);


/* =========================================================
   FOIR % AND ROI %
========================================================= */

[
    foirPercentageInput,
    foirROIInput

].forEach(
    function(input) {

        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            function() {

                this.value =
                    this.value.replace(
                        /[^0-9.]/g,
                        ""
                    );


                const parts =
                    this.value.split(".");


                if (
                    parts.length > 2
                ) {

                    this.value =
                        parts[0] +
                        "." +
                        parts
                            .slice(1)
                            .join("");
                }
            }
        );
    }
);


/* =========================================================
   FOIR TENURE INPUT
========================================================= */

if (
    foirTenureInput
) {

    foirTenureInput.addEventListener(
        "input",
        function() {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );
        }
    );
}


/* =========================================================
   PRELOADER
========================================================= */

function initializePreloader() {

    const preloader =
        getElement(
            "preloader"
        );


    if (!preloader) {
        return;
    }


    window.addEventListener(
        "load",
        function() {

            setTimeout(
                function() {

                    preloader.classList.add(
                        "loaded"
                    );

                    setTimeout(
                        function() {

                            preloader.style.display =
                                "none";

                        },
                        500
                    );

                },
                300
            );

        }
    );
}


/* =========================================================
   INITIALIZE EVERYTHING
========================================================= */

function initializeAll() {

    initializeCalculator();

    initializePreloader();

    resetFOIR();
}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAll
    );

}

else {

    initializeAll();
}


/* =========================================================
   END OF CAL.JS
========================================================= */