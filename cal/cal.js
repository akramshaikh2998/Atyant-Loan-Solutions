/* =========================================================
   ATYANT LOAN SOLUTIONS
   EMI + FOIR CALCULATOR
   COMPLETE WORKING JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let emiChart = null;
let emiSchedule = [];


/* =========================================================
   EMI LIMITS
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

const totalPayment =
    getElement("totalPayment");

const totalInterest =
    getElement("totalInterest");

const principalAmount =
    getElement("principalAmount");

const chartInterest =
    getElement("chartInterest");

const chartPrincipal =
    getElement("chartPrincipal");


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
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )
    );
}


/* =========================================================
   FORMAT PERCENTAGE
========================================================= */

function formatPercent(value) {

    return (
        Number(value || 0).toFixed(2) +
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
                .replace(/Rs\./gi, "")
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
        (Number(value) + Number.EPSILON) * 100
    ) / 100;

}


/* =========================================================
   RANGE VISUAL
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
        ((value - min) /
        (max - min)) * 100;


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
   UPDATE ALL SLIDERS
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
   UPDATE LABELS
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

        const rate =
            getNumber(
                interestRateInput?.value,
                0
            );


        interestRateValue.textContent =
            rate + "%";

    }


    if (loanTermValue) {

        const term =
            getNumber(
                loanTermInput?.value,
                MIN_LOAN_TERM
            );


        loanTermValue.textContent =
            term + " Months";

    }

}


/* =========================================================
   SET LOAN AMOUNT
========================================================= */

function setLoanAmount(value) {

    let amount =
        getNumber(value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
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
            parts.slice(1).join("");

    }


    if (
        rateText === ""
    ) {

        if (interestRateValue) {

            interestRateValue.textContent =
                "0%";

        }

        calculateEMI();

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
   SET LOAN TERM
========================================================= */

function setLoanTerm(value) {

    let term =
        getNumber(value);


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


    let principal =
        getNumber(
            loanAmountInput.value,
            0
        );


    let annualRate =
        getNumber(
            interestRateInput.value,
            0
        );


    let months =
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


    principal =
        Math.min(
            Math.max(
                principal,
                MIN_LOAN_AMOUNT
            ),
            MAX_LOAN_AMOUNT
        );


    annualRate =
        Math.min(
            Math.max(
                annualRate,
                MIN_INTEREST_RATE
            ),
            MAX_INTEREST_RATE
        );


    months =
        Math.min(
            Math.max(
                Math.round(months),
                MIN_LOAN_TERM
            ),
            MAX_LOAN_TERM
        );


    const monthlyRate =
        annualRate /
        12 /
        100;


    let emi;


    /* ZERO INTEREST */

    if (
        monthlyRate === 0
    ) {

        emi =
            principal /
            months;

    }


    /* NORMAL EMI */

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
        Math.max(
            0,
            total -
            principal
        );


    /* =====================================================
       DISPLAY EMI RESULTS
    ===================================================== */

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


    /* =====================================================
       CREATE FULL REPAYMENT SCHEDULE
    ===================================================== */

    createSchedule(
        principal,
        annualRate,
        months,
        emi
    );


    /* =====================================================
       CREATE CHART
    ===================================================== */

    createChart(
        principal,
        interest
    );

}


/* =========================================================
   ZERO RESULTS
========================================================= */

function displayZeroResults() {

    if (monthlyPayment) {

        monthlyPayment.textContent =
            "₹0";

    }


    if (principalAmount) {

        principalAmount.textContent =
            "₹0";

    }


    if (totalInterest) {

        totalInterest.textContent =
            "₹0";

    }


    if (totalPayment) {

        totalPayment.textContent =
            "₹0";

    }


    if (chartPrincipal) {

        chartPrincipal.textContent =
            "₹0";

    }


    if (chartInterest) {

        chartInterest.textContent =
            "₹0";

    }


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


        let interestPart;


        let principalPart;


        let payment =
            emi;


        /* ZERO INTEREST */

        if (
            monthlyRate === 0
        ) {

            interestPart =
                0;


            principalPart =
                emi;

        }


        /* NORMAL INTEREST */

        else {

            interestPart =
                balance *
                monthlyRate;


            principalPart =
                emi -
                interestPart;

        }


        /* LAST MONTH */

        if (
            month === months
        ) {

            principalPart =
                balance;


            payment =
                principalPart +
                interestPart;

        }


        /* SAFETY */

        principalPart =
            Math.min(
                Math.max(
                    principalPart,
                    0
                ),
                balance
            );


        interestPart =
            Math.max(
                interestPart,
                0
            );


        payment =
            principalPart +
            interestPart;


        balance =
            balance -
            principalPart;


        if (
            Math.abs(balance) <
            0.01
        ) {

            balance =
                0;

        }


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

        emiChart =
            null;

    }


    emiChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",


                data:
                {

                    labels:
                    [
                        "Principal",
                        "Interest"
                    ],


                    datasets:
                    [
                        {

                            data:
                            [
                                principal,
                                interest
                            ],


                            backgroundColor:
                            [
                                "#0757d5",
                                "#55c7f0"
                            ],


                            borderWidth:
                                0

                        }
                    ]

                },


                options:
                {

                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    cutout:
                        "68%",


                    plugins:
                    {

                        legend:
                        {
                            display:
                                false
                        }

                    }

                }

            }
        );

}


/* =========================================================
   LOAN AMOUNT MANUAL INPUT
========================================================= */

if (loanAmountInput) {

    loanAmountInput.addEventListener(
        "input",
        function () {

            let value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );


            if (
                value === ""
            ) {

                if (loanAmountValue) {

                    loanAmountValue.textContent =
                        "₹0";

                }

                emiSchedule = [];

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


            if (
                loanAmountSlider
            ) {

                loanAmountSlider.value =
                    Math.min(
                        Math.max(
                            amount,
                            MIN_LOAN_AMOUNT
                        ),
                        MAX_LOAN_AMOUNT
                    );

            }


            if (
                loanAmountValue
            ) {

                loanAmountValue.textContent =
                    formatINR(
                        amount
                    );

            }


            calculateEMI();

        }
    );

}


/* =========================================================
   INTEREST RATE INPUT
========================================================= */

if (interestRateInput) {

    interestRateInput.addEventListener(
        "input",
        function () {

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
                    parts.slice(1).join("");

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


            if (
                interestRateValue
            ) {

                interestRateValue.textContent =
                    (value || "0") +
                    "%";

            }


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
        function () {

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


            if (
                loanTermValue
            ) {

                loanTermValue.textContent =
                    (value || "0") +
                    " Months";

            }


            calculateEMI();

        }
    );

}


/* =========================================================
   LOAN SLIDER
========================================================= */

if (loanAmountSlider) {

    loanAmountSlider.addEventListener(
        "input",
        function () {

            setLoanAmount(
                this.value
            );

        }
    );

}


/* =========================================================
   RATE SLIDER
========================================================= */

if (interestRateSlider) {

    interestRateSlider.addEventListener(
        "input",
        function () {

            if (
                interestRateInput
            ) {

                interestRateInput.value =
                    this.value;

            }


            setInterestRate(
                this.value
            );

        }
    );

}


/* =========================================================
   TERM SLIDER
========================================================= */

if (loanTermSlider) {

    loanTermSlider.addEventListener(
        "input",
        function () {

            setLoanTerm(
                this.value
            );

        }
    );

}


/* =========================================================
   PLUS / MINUS
========================================================= */

const loanMinus =
    getElement(
        "loanMinus"
    );


if (loanMinus) {

    loanMinus.addEventListener(
        "click",
        function () {

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
                current -
                step
            );

        }
    );

}


const loanPlus =
    getElement(
        "loanPlus"
    );


if (loanPlus) {

    loanPlus.addEventListener(
        "click",
        function () {

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
                current +
                step
            );

        }
    );

}


const interestMinus =
    getElement(
        "interestMinus"
    );


if (interestMinus) {

    interestMinus.addEventListener(
        "click",
        function () {

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


const interestPlus =
    getElement(
        "interestPlus"
    );


if (interestPlus) {

    interestPlus.addEventListener(
        "click",
        function () {

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


const termMinus =
    getElement(
        "termMinus"
    );


if (termMinus) {

    termMinus.addEventListener(
        "click",
        function () {

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


const termPlus =
    getElement(
        "termPlus"
    );


if (termPlus) {

    termPlus.addEventListener(
        "click",
        function () {

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
        function () {

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
        function () {

            downloadPDF();

        }
    );

}


/* =========================================================
   PDF DATE
========================================================= */

function getCurrentDate() {

    const date =
        new Date();


    return date.toLocaleDateString(
        "en-IN",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
    );

}


/* =========================================================
   PDF HEADER
========================================================= */

function drawPDFHeader(
    pdf,
    pageWidth
) {

    pdf.setFillColor(
        6,
        26,
        59
    );


    pdf.rect(
        0,
        0,
        pageWidth,
        34,
        "F"
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        16
    );


    pdf.setTextColor(
        255,
        255,
        255
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
        8
    );


    pdf.setTextColor(
        205,
        220,
        240
    );


    pdf.text(
        "Professional EMI Calculation & Repayment Report",
        15,
        22
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        8
    );


    pdf.setTextColor(
        115,
        180,
        255
    );


    pdf.text(
        "EMI REPORT",
        pageWidth - 15,
        13,
        {
            align:
                "right"
        }
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        7
    );


    pdf.setTextColor(
        205,
        220,
        240
    );


    pdf.text(
        getCurrentDate(),
        pageWidth - 15,
        21,
        {
            align:
                "right"
        }
    );

}


/* =========================================================
   PDF FOOTER
========================================================= */

function drawPDFFooter(
    pdf,
    pageWidth,
    pageHeight,
    pageNumber
) {

    pdf.setDrawColor(
        225,
        232,
        241
    );


    pdf.setLineWidth(
        0.3
    );


    pdf.line(
        15,
        pageHeight - 13,
        pageWidth - 15,
        pageHeight - 13
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        7
    );


    pdf.setTextColor(
        113,
        128,
        150
    );


    pdf.text(
        "Atyant Loan Solutions | EMI Calculator",
        15,
        pageHeight - 6
    );


    pdf.text(
        "Page " + pageNumber,
        pageWidth - 15,
        pageHeight - 6,
        {
            align:
                "right"
        }
    );

}


/* =========================================================
   PDF DOWNLOAD
   COMPLETE PROFESSIONAL PDF
========================================================= */

function downloadPDF() {

    /* =====================================================
       CHECK CALCULATION
    ===================================================== */

    if (
        !emiSchedule ||
        emiSchedule.length === 0
    ) {

        calculateEMI();

    }


    if (
        !emiSchedule ||
        emiSchedule.length === 0
    ) {

        alert(
            "Please enter valid loan details and calculate EMI first."
        );

        return;

    }


    /* =====================================================
       CHECK JSPDF
    ===================================================== */

    if (
        typeof window.jspdf ===
        "undefined"
    ) {

        alert(
            "jsPDF is not loaded. Please check your PDF library scripts."
        );

        return;

    }


    const jsPDF =
        window.jspdf.jsPDF;


    if (
        typeof jsPDF !==
        "function"
    ) {

        alert(
            "jsPDF is not available. Please refresh the page."
        );

        return;

    }


    /* =====================================================
       CREATE PDF
    ===================================================== */

    const pdf =
        new jsPDF(
            "p",
            "mm",
            "a4"
        );


    const pageWidth =
        pdf.internal
            .pageSize
            .getWidth();


    const pageHeight =
        pdf.internal
            .pageSize
            .getHeight();


    /* =====================================================
       INPUT VALUES
    ===================================================== */

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


    /* =====================================================
       TOTALS FROM ACTUAL SCHEDULE
    ===================================================== */

    const emi =
        emiSchedule.length > 0
            ? emiSchedule[0].emi
            : 0;


    const totalPrincipal =
        emiSchedule.reduce(
            function(
                total,
                row
            ) {

                return (
                    total +
                    Number(
                        row.principal
                    )
                );

            },
            0
        );


    const totalInterestAmount =
        emiSchedule.reduce(
            function(
                total,
                row
            ) {

                return (
                    total +
                    Number(
                        row.interest
                    )
                );

            },
            0
        );


    const totalPaymentAmount =
        emiSchedule.reduce(
            function(
                total,
                row
            ) {

                return (
                    total +
                    Number(
                        row.emi
                    )
                );

            },
            0
        );


    /* =====================================================
       HEADER
    ===================================================== */

    drawPDFHeader(
        pdf,
        pageWidth
    );


    /* =====================================================
       TITLE
    ===================================================== */

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        15
    );


    pdf.setTextColor(
        6,
        26,
        59
    );


    pdf.text(
        "Loan EMI Summary",
        15,
        48
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        8
    );


    pdf.setTextColor(
        113,
        128,
        150
    );


    pdf.text(
        "Estimated repayment details based on the information entered.",
        15,
        55
    );


    /* =====================================================
       EMI HIGHLIGHT CARD
    ===================================================== */

    pdf.setFillColor(
        238,
        245,
        255
    );


    pdf.setDrawColor(
        210,
        225,
        246
    );


    pdf.roundedRect(
        15,
        64,
        pageWidth - 30,
        39,
        4,
        4,
        "FD"
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        8
    );


    pdf.setTextColor(
        7,
        87,
        213
    );


    pdf.text(
        "ESTIMATED MONTHLY EMI",
        24,
        76
    );


    pdf.setFontSize(
        22
    );


    pdf.setTextColor(
        6,
        26,
        59
    );


    pdf.text(
        formatPDF(emi),
        24,
        91
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        7
    );


    pdf.setTextColor(
        113,
        128,
        150
    );


    pdf.text(
        "Monthly instalment",
        24,
        98
    );


    /* RIGHT SIDE */

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        7.5
    );


    pdf.setTextColor(
        52,
        68,
        90
    );


    pdf.text(
        "Loan Amount",
        pageWidth - 78,
        75
    );


    pdf.text(
        "Interest Rate",
        pageWidth - 78,
        84
    );


    pdf.text(
        "Loan Tenure",
        pageWidth - 78,
        93
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.text(
        formatPDF(loan),
        pageWidth - 20,
        75,
        {
            align:
                "right"
        }
    );


    pdf.text(
        rate + "%",
        pageWidth - 20,
        84,
        {
            align:
                "right"
        }
    );


    pdf.text(
        term + " Months",
        pageWidth - 20,
        93,
        {
            align:
                "right"
        }
    );


    /* =====================================================
       SUMMARY CARDS
    ===================================================== */

    const cardY =
        113;


    const gap =
        5;


    const cardWidth =
        (
            pageWidth -
            30 -
            gap * 2
        ) / 3;


    function drawSummaryCard(
        x,
        title,
        value,
        r,
        g,
        b
    ) {

        pdf.setFillColor(
            249,
            251,
            254
        );


        pdf.setDrawColor(
            225,
            232,
            241
        );


        pdf.roundedRect(
            x,
            cardY,
            cardWidth,
            32,
            3,
            3,
            "FD"
        );


        pdf.setFillColor(
            r,
            g,
            b
        );


        pdf.rect(
            x,
            cardY,
            3,
            32,
            "F"
        );


        pdf.setFont(
            "helvetica",
            "normal"
        );


        pdf.setFontSize(
            7
        );


        pdf.setTextColor(
            113,
            128,
            150
        );


        pdf.text(
            title,
            x + 9,
            cardY + 10
        );


        pdf.setFont(
            "helvetica",
            "bold"
        );


        pdf.setFontSize(
            10
        );


        pdf.setTextColor(
            6,
            26,
            59
        );


        pdf.text(
            value,
            x + 9,
            cardY + 22
        );

    }


    drawSummaryCard(
        15,
        "Principal Amount",
        formatPDF(totalPrincipal),
        7,
        87,
        213
    );


    drawSummaryCard(
        15 +
        cardWidth +
        gap,
        "Total Interest",
        formatPDF(totalInterestAmount),
        229,
        91,
        98
    );


    drawSummaryCard(
        15 +
        (cardWidth + gap) * 2,
        "Total Payment",
        formatPDF(totalPaymentAmount),
        21,
        150,
        106
    );


    /* =====================================================
       BREAKDOWN
    ===================================================== */

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        11
    );


    pdf.setTextColor(
        6,
        26,
        59
    );


    pdf.text(
        "Payment Breakdown",
        15,
        162
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        7
    );


    pdf.setTextColor(
        113,
        128,
        150
    );


    pdf.text(
        "Principal and interest composition of the total repayment.",
        15,
        169
    );


    const breakdownX =
        15;


    const breakdownY =
        177;


    const breakdownWidth =
        pageWidth - 30;


    const breakdownHeight =
        8;


    const totalBreakdown =
        totalPrincipal +
        totalInterestAmount;


    const principalWidth =
        totalBreakdown > 0
            ? (
                totalPrincipal /
                totalBreakdown
            ) *
              breakdownWidth
            : 0;


    pdf.setFillColor(
        7,
        87,
        213
    );


    if (
        principalWidth > 0
    ) {

        pdf.roundedRect(
            breakdownX,
            breakdownY,
            principalWidth,
            breakdownHeight,
            2,
            2,
            "F"
        );

    }


    if (
        breakdownWidth -
        principalWidth >
        0
    ) {

        pdf.setFillColor(
            229,
            91,
            98
        );


        pdf.rect(
            breakdownX +
            principalWidth,
            breakdownY,
            breakdownWidth -
            principalWidth,
            breakdownHeight,
            "F"
        );

    }


    pdf.setFillColor(
        7,
        87,
        213
    );


    pdf.circle(
        18,
        197,
        2,
        "F"
    );


    pdf.setFontSize(
        7
    );


    pdf.setTextColor(
        52,
        68,
        90
    );


    pdf.text(
        "Principal: " +
        formatPDF(totalPrincipal),
        24,
        199
    );


    pdf.setFillColor(
        229,
        91,
        98
    );


    pdf.circle(
        105,
        197,
        2,
        "F"
    );


    pdf.text(
        "Interest: " +
        formatPDF(totalInterestAmount),
        111,
        199
    );


    /* =====================================================
       REPAYMENT SCHEDULE TITLE
    ===================================================== */

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        12
    );


    pdf.setTextColor(
        6,
        26,
        59
    );


    pdf.text(
        "Repayment Schedule",
        15,
        216
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        7
    );


    pdf.setTextColor(
        113,
        128,
        150
    );


    pdf.text(
        "Monthly repayment schedule showing principal, interest and outstanding balance.",
        15,
        223
    );


    /* =====================================================
       CHECK AUTOTABLE
    ===================================================== */

    if (
        typeof pdf.autoTable !==
        "function"
    ) {

        alert(
            "jsPDF AutoTable is not loaded. Please add the AutoTable script before cal.js."
        );

        return;

    }


    /* =====================================================
       TABLE DATA
    ===================================================== */

    const tableRows =
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
            228,


        margin:
        {
            top:
                42,

            bottom:
                18,

            left:
                15,

            right:
                15
        },


        head:
        [[

            "Month",

            "Opening Balance",

            "EMI",

            "Principal",

            "Interest",

            "Closing Balance"

        ]],


        body:
            tableRows,


        theme:
            "grid",


        styles:
        {

            font:
                "helvetica",

            fontSize:
                6.7,

            cellPadding:
                2.3,

            lineWidth:
                0.1,

            lineColor:
                [225, 232, 241],

            textColor:
                [52, 68, 90],

            valign:
                "middle",

            halign:
                "right"
        },


        headStyles:
        {

            fillColor:
                [6, 26, 59],

            textColor:
                [255, 255, 255],

            fontStyle:
                "bold",

            fontSize:
                6.7,

            halign:
                "center",

            cellPadding:
                2.8
        },


        alternateRowStyles:
        {

            fillColor:
                [248, 250, 253]

        },


        columnStyles:
        {

            0:
            {
                cellWidth:
                    13,

                halign:
                    "center"
            },


            1:
            {
                cellWidth:
                    31
            },


            2:
            {
                cellWidth:
                    28
            },


            3:
            {
                cellWidth:
                    29
            },


            4:
            {
                cellWidth:
                    29
            },


            5:
            {
                cellWidth:
                    31
            }

        },


        didDrawPage:
            function(data) {

                const pageNumber =
                    pdf.internal
                        .getCurrentPageInfo()
                        .pageNumber;


                drawPDFHeader(
                    pdf,
                    pageWidth
                );


                drawPDFFooter(
                    pdf,
                    pageWidth,
                    pageHeight,
                    pageNumber
                );

            }

    });


    /* =====================================================
       FINAL INFORMATION
    ===================================================== */

    const finalY =
        pdf.lastAutoTable &&
        pdf.lastAutoTable.finalY
            ? pdf.lastAutoTable.finalY
            : 240;


    if (
        finalY <
        pageHeight - 38
    ) {

        pdf.setFont(
            "helvetica",
            "bold"
        );


        pdf.setFontSize(
            8
        );


        pdf.setTextColor(
            6,
            26,
            59
        );


        pdf.text(
            "Important Information",
            15,
            finalY + 12
        );


        pdf.setFont(
            "helvetica",
            "normal"
        );


        pdf.setFontSize(
            7
        );


        pdf.setTextColor(
            113,
            128,
            150
        );


        const note =
            "This EMI calculation is indicative only. Actual loan approval, " +
            "interest rate, fees, tenure and repayment terms are subject to " +
            "the applicable lender's eligibility criteria and policies.";


        const noteLines =
            pdf.splitTextToSize(
                note,
                pageWidth - 30
            );


        pdf.text(
            noteLines,
            15,
            finalY + 20
        );

    }


    /* =====================================================
       SAVE FILE
    ===================================================== */

    const date =
        new Date()
            .toISOString()
            .split("T")[0];


    pdf.save(
        "Atyant-Loan-EMI-Repayment-" +
        date +
        ".pdf"
    );

}


/* =========================================================
   INITIALIZE EMI
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
   FOIR CALCULATOR
========================================================= */


/* =========================================================
   FOIR INPUTS
========================================================= */

const foirMonthlyIncome =
    getElement(
        "foirMonthlyIncome"
    );


const foirExistingEmi =
    getElement(
        "foirExistingEmi"
    );


const foirOtherObligations =
    getElement(
        "foirOtherObligations"
    );


const foirTenure =
    getElement(
        "foirTenure"
    );


const foirPercentage =
    getElement(
        "foirPercentage"
    );


const calculateFoirButton =
    getElement(
        "calculateFoirButton"
    );


const foirCalculationError =
    getElement(
        "foirCalculationError"
    );


/* =========================================================
   FOIR RESULTS
========================================================= */

const foirActualResult =
    getElement(
        "foirActualResult"
    );


const foirResultStatus =
    getElement(
        "foirResultStatus"
    );


const foirResultBadge =
    getElement(
        "foirResultBadge"
    );


const foirResultIncome =
    getElement(
        "foirResultIncome"
    );


const foirResultExisting =
    getElement(
        "foirResultExisting"
    );


const foirResultEligibleEmi =
    getElement(
        "foirResultProposedEmi"
    );


const foirResultTotal =
    getElement(
        "foirResultTotal"
    );


const foirResultLimit =
    getElement(
        "foirResultLimit"
    );


const foirResultEligibleLoan =
    getElement(
        "foirResultEligibleLoan"
    );


const foirAssessmentIcon =
    getElement(
        "foirAssessmentIcon"
    );


const foirAssessmentTitle =
    getElement(
        "foirAssessmentTitle"
    );


const foirAssessmentMessage =
    getElement(
        "foirAssessmentMessage"
    );


/* =========================================================
   RESET FOIR
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
   FOIR CALCULATION
========================================================= */

function calculateFOIR() {

    if (
        !calculateFoirButton
    ) {

        return;

    }


    if (foirCalculationError) {

        foirCalculationError.textContent =
            "";

    }


    const income =
        getNumber(
            foirMonthlyIncome?.value,
            NaN
        );


    const existingEmi =
        getNumber(
            foirExistingEmi?.value,
            NaN
        );


    const otherObligations =
        getNumber(
            foirOtherObligations?.value,
            NaN
        );


    const tenure =
        getNumber(
            foirTenure?.value,
            NaN
        );


    const foirLimit =
        getNumber(
            foirPercentage?.value,
            NaN
        );


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
        !Number.isFinite(income) ||
        income <= 0
    ) {

        if (foirCalculationError) {

            foirCalculationError.textContent =
                "Please enter a valid monthly net income.";

        }


        resetFOIR();

        foirMonthlyIncome?.focus();

        return;

    }


    if (
        !Number.isFinite(existingEmi) ||
        existingEmi < 0
    ) {

        if (foirCalculationError) {

            foirCalculationError.textContent =
                "Please enter a valid existing EMI.";

        }


        resetFOIR();

        foirExistingEmi?.focus();

        return;

    }


    if (
        !Number.isFinite(otherObligations) ||
        otherObligations < 0
    ) {

        if (foirCalculationError) {

            foirCalculationError.textContent =
                "Please enter valid other monthly obligations.";

        }


        resetFOIR();

        foirOtherObligations?.focus();

        return;

    }


    if (
        !Number.isFinite(tenure) ||
        tenure <= 0
    ) {

        if (foirCalculationError) {

            foirCalculationError.textContent =
                "Please enter a valid loan tenure.";

        }


        resetFOIR();

        foirTenure?.focus();

        return;

    }


    if (
        !Number.isFinite(foirLimit) ||
        foirLimit <= 0 ||
        foirLimit > 100
    ) {

        if (foirCalculationError) {

            foirCalculationError.textContent =
                "Please enter FOIR between 0.01% and 100%.";

        }


        resetFOIR();

        foirPercentage?.focus();

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
       ACTUAL FOIR
    ===================================================== */

    const actualFOIR =
        (
            (
                existingObligations +
                maximumEligibleEmi
            ) /
            income
        ) *
        100;


    /* =====================================================
       MAXIMUM LOAN AMOUNT ELIGIBLE
       
       Since FOIR has no interest rate field,
       this is calculated as:

       Maximum Eligible EMI × Tenure
    ===================================================== */

    const maximumLoanAmountEligible =
        maximumEligibleEmi *
        Math.round(
            tenure
        );


    /* =====================================================
       DISPLAY
    ===================================================== */

    if (foirActualResult) {

        foirActualResult.textContent =
            formatPercent(
                actualFOIR
            );

    }


    if (foirResultIncome) {

        foirResultIncome.textContent =
            formatINR(
                income
            );

    }


    if (foirResultExisting) {

        foirResultExisting.textContent =
            formatINR(
                existingObligations
            );

    }


    if (foirResultEligibleEmi) {

        foirResultEligibleEmi.textContent =
            formatINR(
                maximumEligibleEmi
            );

    }


    if (foirResultTotal) {

        foirResultTotal.textContent =
            formatINR(
                existingObligations +
                maximumEligibleEmi
            );

    }


    if (foirResultLimit) {

        foirResultLimit.textContent =
            formatPercent(
                foirLimit
            );

    }


    if (foirResultEligibleLoan) {

        foirResultEligibleLoan.textContent =
            formatINR(
                maximumLoanAmountEligible
            );

    }


    /* =====================================================
       ELIGIBILITY
    ===================================================== */

    if (
        maximumEligibleEmi > 0
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
                "The maximum eligible EMI and maximum loan amount eligible are based on your income, existing obligations, entered FOIR and tenure.";

        }


        if (foirAssessmentIcon) {

            foirAssessmentIcon.className =
                "fa-solid fa-circle-check";

        }

    }


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
   FOIR BUTTON
========================================================= */

if (
    calculateFoirButton
) {

    calculateFoirButton.addEventListener(
        "click",
        function () {

            calculateFOIR();

        }
    );

}


/* =========================================================
   FOIR ENTER KEY
========================================================= */

[
    foirMonthlyIncome,
    foirExistingEmi,
    foirOtherObligations,
    foirTenure,
    foirPercentage

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
    foirMonthlyIncome,
    foirExistingEmi,
    foirOtherObligations

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
   FOIR PERCENTAGE INPUT
========================================================= */

if (
    foirPercentage
) {

    foirPercentage.addEventListener(
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
                    parts.slice(1).join("");

            }

        }
    );

}


/* =========================================================
   FOIR TENURE INPUT
========================================================= */

if (
    foirTenure
) {

    foirTenure.addEventListener(
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
   START CALCULATOR
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCalculator
    );

}

else {

    initializeCalculator();

}


/* =========================================================
   END
========================================================= */