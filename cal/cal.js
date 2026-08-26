/* =========================================================
   ATYANT LOAN SOLUTIONS
   PROFESSIONAL EMI CALCULATOR
   COMPLETE REVISED JAVASCRIPT
========================================================= */

let emiChart = null;
let emiSchedule = [];


/* =========================================================
   CONSTANTS
========================================================= */

const MIN_LOAN_AMOUNT = 10000;
const MAX_LOAN_AMOUNT = 5000000; // ₹50 Lakh

const MIN_INTEREST_RATE = 0;
const MAX_INTEREST_RATE = 50;

const MIN_LOAN_TERM = 1;
const MAX_LOAN_TERM = 360;


/* =========================================================
   GET ELEMENTS
========================================================= */

const loanAmountSlider =
    document.getElementById("loanAmountSlider");

const loanAmountInput =
    document.getElementById("loanAmountInput");

const interestRateSlider =
    document.getElementById("interestRateSlider");

const interestRateInput =
    document.getElementById("interestRateInput");

const loanTermSlider =
    document.getElementById("loanTermSlider");

const loanTermInput =
    document.getElementById("loanTermInput");


const loanAmountValue =
    document.getElementById("loanAmountValue");

const interestRateValue =
    document.getElementById("interestRateValue");

const loanTermValue =
    document.getElementById("loanTermValue");


const monthlyPayment =
    document.getElementById("monthlyPayment");

const totalPayment =
    document.getElementById("totalPayment");

const totalInterest =
    document.getElementById("totalInterest");

const principalAmount =
    document.getElementById("principalAmount");

const chartInterest =
    document.getElementById("chartInterest");

const chartPrincipal =
    document.getElementById("chartPrincipal");


/* =========================================================
   HELPER - ELEMENT CHECK
========================================================= */

function elementExists(element) {
    return element !== null && element !== undefined;
}


/* =========================================================
   FORMAT INDIAN RUPEES
========================================================= */

function formatINR(value) {

    value = Number(value) || 0;

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
}


/* =========================================================
   FORMAT NUMBER FOR PDF
========================================================= */

function formatPDF(value) {

    value = Number(value) || 0;

    return (
        "Rs. " +
        value.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    );
}


/* =========================================================
   FORMAT PDF NUMBER WITHOUT RS
========================================================= */

function formatPDFNumber(value) {

    value = Number(value) || 0;

    return value.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}


/* =========================================================
   SAFE NUMBER
========================================================= */

function getNumber(value, defaultValue = 0) {

    const number = parseFloat(value);

    if (Number.isNaN(number)) {
        return defaultValue;
    }

    return number;
}


/* =========================================================
   ROUND TO 2 DECIMAL
========================================================= */

function round2(value) {

    return Math.round(
        (Number(value) + Number.EPSILON) * 100
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

    if (!elementExists(slider)) {
        return;
    }

    const value =
        getNumber(slider.value, min);

    const percentage =
        ((value - min) / (max - min)) * 100;

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
   UPDATE ALL SLIDER VISUALS
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
   SET LOAN AMOUNT
========================================================= */

function setLoanAmount(value) {

    let amount =
        parseFloat(
            String(value).replace(/,/g, "")
        );


    if (Number.isNaN(amount)) {
        amount = MIN_LOAN_AMOUNT;
    }


    /*
       Minimum ₹10,000
    */

    if (amount < MIN_LOAN_AMOUNT) {
        amount = MIN_LOAN_AMOUNT;
    }


    /*
       Maximum ₹50 Lakh
    */

    if (amount > MAX_LOAN_AMOUNT) {
        amount = MAX_LOAN_AMOUNT;
    }


    /*
       Whole number
    */

    amount = Math.round(amount);


    if (elementExists(loanAmountInput)) {
        loanAmountInput.value = amount;
    }


    if (elementExists(loanAmountSlider)) {
        loanAmountSlider.value = amount;
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
        String(value)
            .trim()
            .replace(/[^0-9.]/g, "");


    /*
       Allow only one decimal point
    */

    const parts =
        rateText.split(".");


    if (parts.length > 2) {

        rateText =
            parts[0] +
            "." +
            parts.slice(1).join("");

    }


    /*
       Empty value
    */

    if (rateText === "") {

        if (elementExists(interestRateValue)) {
            interestRateValue.textContent = "0%";
        }

        return;
    }


    let rate =
        parseFloat(rateText);


    if (Number.isNaN(rate)) {
        return;
    }


    /*
       Minimum
    */

    if (rate < MIN_INTEREST_RATE) {

        rate = MIN_INTEREST_RATE;

        rateText = "0";

    }


    /*
       Maximum
    */

    if (rate > MAX_INTEREST_RATE) {

        rate = MAX_INTEREST_RATE;

        rateText = "50";

    }


    if (elementExists(interestRateInput)) {
        interestRateInput.value = rateText;
    }


    if (elementExists(interestRateSlider)) {
        interestRateSlider.value = rate;
    }


    if (elementExists(interestRateValue)) {

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
        parseFloat(value);


    if (Number.isNaN(term)) {
        term = MIN_LOAN_TERM;
    }


    term = Math.round(term);


    /*
       Minimum 1 month
    */

    if (term < MIN_LOAN_TERM) {
        term = MIN_LOAN_TERM;
    }


    /*
       Maximum 360 months
    */

    if (term > MAX_LOAN_TERM) {
        term = MAX_LOAN_TERM;
    }


    if (elementExists(loanTermInput)) {
        loanTermInput.value = term;
    }


    if (elementExists(loanTermSlider)) {
        loanTermSlider.value = term;
    }


    updateLabels();

    updateAllRangeVisuals();

    calculateEMI();

}


/* =========================================================
   LOAN AMOUNT SLIDER
========================================================= */

if (elementExists(loanAmountSlider)) {

    loanAmountSlider.addEventListener(
        "input",
        function () {

            setLoanAmount(this.value);

        }
    );

}


/* =========================================================
   INTEREST RATE SLIDER
========================================================= */

if (elementExists(interestRateSlider)) {

    interestRateSlider.addEventListener(
        "input",
        function () {

            if (elementExists(interestRateInput)) {
                interestRateInput.value = this.value;
            }

            setInterestRate(this.value);

        }
    );

}


/* =========================================================
   TENURE SLIDER
========================================================= */

if (elementExists(loanTermSlider)) {

    loanTermSlider.addEventListener(
        "input",
        function () {

            setLoanTerm(this.value);

        }
    );

}


/* =========================================================
   LOAN AMOUNT MANUAL INPUT
========================================================= */

if (elementExists(loanAmountInput)) {

    loanAmountInput.addEventListener(
        "input",
        function () {

            let value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );


            /*
               Allow temporary empty input
            */

            if (value === "") {

                if (elementExists(loanAmountValue)) {
                    loanAmountValue.textContent = "₹0";
                }

                return;
            }


            let amount =
                parseInt(value, 10);


            if (amount > MAX_LOAN_AMOUNT) {

                amount =
                    MAX_LOAN_AMOUNT;

                this.value = amount;

            }


            if (amount >= MIN_LOAN_AMOUNT) {

                if (elementExists(loanAmountSlider)) {
                    loanAmountSlider.value = amount;
                }

                updateLabels();

                updateAllRangeVisuals();

                calculateEMI();

            }

        }
    );


    loanAmountInput.addEventListener(
        "blur",
        function () {

            let amount =
                parseInt(
                    this.value,
                    10
                );


            if (
                Number.isNaN(amount) ||
                amount < MIN_LOAN_AMOUNT
            ) {

                amount =
                    MIN_LOAN_AMOUNT;

            }


            if (amount > MAX_LOAN_AMOUNT) {

                amount =
                    MAX_LOAN_AMOUNT;

            }


            setLoanAmount(amount);

        }
    );

}


/* =========================================================
   INTEREST RATE MANUAL INPUT
========================================================= */

if (elementExists(interestRateInput)) {

    interestRateInput.addEventListener(
        "input",
        function () {

            setInterestRate(
                this.value
            );

        }
    );


    interestRateInput.addEventListener(
        "blur",
        function () {

            let rate =
                parseFloat(
                    this.value
                );


            if (Number.isNaN(rate)) {
                rate = 0;
            }


            if (rate < MIN_INTEREST_RATE) {
                rate = MIN_INTEREST_RATE;
            }


            if (rate > MAX_INTEREST_RATE) {
                rate = MAX_INTEREST_RATE;
            }


            setInterestRate(
                round2(rate).toString()
            );

        }
    );

}


/* =========================================================
   TENURE MANUAL INPUT
========================================================= */

if (elementExists(loanTermInput)) {

    loanTermInput.addEventListener(
        "input",
        function () {

            let value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );


            if (value === "") {

                if (elementExists(loanTermValue)) {
                    loanTermValue.textContent =
                        "0 Months";
                }

                return;
            }


            let term =
                parseInt(
                    value,
                    10
                );


            if (term > MAX_LOAN_TERM) {

                term =
                    MAX_LOAN_TERM;

                this.value = term;

            }


            if (term >= MIN_LOAN_TERM) {

                if (elementExists(loanTermSlider)) {
                    loanTermSlider.value = term;
                }

                updateLabels();

                updateAllRangeVisuals();

                calculateEMI();

            }

        }
    );


    loanTermInput.addEventListener(
        "blur",
        function () {

            let term =
                parseInt(
                    this.value,
                    10
                );


            if (
                Number.isNaN(term) ||
                term < MIN_LOAN_TERM
            ) {

                term = MIN_LOAN_TERM;

            }


            if (term > MAX_LOAN_TERM) {
                term = MAX_LOAN_TERM;
            }


            setLoanTerm(term);

        }
    );

}


/* =========================================================
   LOAN AMOUNT MINUS
========================================================= */

const loanMinus =
    document.getElementById("loanMinus");

if (elementExists(loanMinus)) {

    loanMinus.addEventListener(
        "click",
        function () {

            let amount =
                getNumber(
                    loanAmountInput.value,
                    MIN_LOAN_AMOUNT
                );


            /*
               Step ₹1
            */

            amount =
                amount - 1;


            if (amount < MIN_LOAN_AMOUNT) {
                amount = MIN_LOAN_AMOUNT;
            }


            setLoanAmount(amount);

        }
    );

}


/* =========================================================
   LOAN AMOUNT PLUS
========================================================= */

const loanPlus =
    document.getElementById("loanPlus");

if (elementExists(loanPlus)) {

    loanPlus.addEventListener(
        "click",
        function () {

            let amount =
                getNumber(
                    loanAmountInput.value,
                    MIN_LOAN_AMOUNT
                );


            /*
               Step ₹1
            */

            amount =
                amount + 1;


            if (amount > MAX_LOAN_AMOUNT) {
                amount = MAX_LOAN_AMOUNT;
            }


            setLoanAmount(amount);

        }
    );

}


/* =========================================================
   INTEREST MINUS
========================================================= */

const interestMinus =
    document.getElementById("interestMinus");

if (elementExists(interestMinus)) {

    interestMinus.addEventListener(
        "click",
        function () {

            let rate =
                getNumber(
                    interestRateInput.value,
                    0
                );


            rate =
                rate - 0.01;


            if (rate < MIN_INTEREST_RATE) {
                rate = MIN_INTEREST_RATE;
            }


            rate =
                round2(rate);


            setInterestRate(
                rate.toFixed(2)
            );

        }
    );

}


/* =========================================================
   INTEREST PLUS
========================================================= */

const interestPlus =
    document.getElementById("interestPlus");

if (elementExists(interestPlus)) {

    interestPlus.addEventListener(
        "click",
        function () {

            let rate =
                getNumber(
                    interestRateInput.value,
                    0
                );


            rate =
                rate + 0.01;


            if (rate > MAX_INTEREST_RATE) {
                rate = MAX_INTEREST_RATE;
            }


            rate =
                round2(rate);


            setInterestRate(
                rate.toFixed(2)
            );

        }
    );

}


/* =========================================================
   TENURE MINUS
========================================================= */

const termMinus =
    document.getElementById("termMinus");

if (elementExists(termMinus)) {

    termMinus.addEventListener(
        "click",
        function () {

            let term =
                getNumber(
                    loanTermInput.value,
                    1
                );


            term =
                term - 1;


            if (term < MIN_LOAN_TERM) {
                term = MIN_LOAN_TERM;
            }


            setLoanTerm(term);

        }
    );

}


/* =========================================================
   TENURE PLUS
========================================================= */

const termPlus =
    document.getElementById("termPlus");

if (elementExists(termPlus)) {

    termPlus.addEventListener(
        "click",
        function () {

            let term =
                getNumber(
                    loanTermInput.value,
                    1
                );


            term =
                term + 1;


            if (term > MAX_LOAN_TERM) {
                term = MAX_LOAN_TERM;
            }


            setLoanTerm(term);

        }
    );

}


/* =========================================================
   UPDATE LABELS
========================================================= */

function updateLabels() {

    const loan =
        getNumber(
            loanAmountInput?.value,
            MIN_LOAN_AMOUNT
        );


    const rate =
        getNumber(
            interestRateInput?.value,
            0
        );


    const term =
        getNumber(
            loanTermInput?.value,
            MIN_LOAN_TERM
        );


    if (elementExists(loanAmountValue)) {

        loanAmountValue.textContent =
            formatINR(loan);

    }


    if (elementExists(interestRateValue)) {

        interestRateValue.textContent =
            String(
                interestRateInput?.value || rate
            ) + "%";

    }


    if (elementExists(loanTermValue)) {

        loanTermValue.textContent =
            term +
            (
                term === 1
                    ? " Month"
                    : " Months"
            );

    }

}


/* =========================================================
   CALCULATE EMI
========================================================= */

function calculateEMI() {

    let principal =
        getNumber(
            loanAmountInput?.value,
            0
        );


    let annualRate =
        getNumber(
            interestRateInput?.value,
            0
        );


    let months =
        getNumber(
            loanTermInput?.value,
            1
        );


    /*
       Protect values
    */

    principal =
        Math.min(
            Math.max(
                principal,
                0
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


    /*
       Zero loan amount
    */

    if (principal <= 0) {

        displayZeroResults();

        emiSchedule = [];

        createChart(
            0,
            0
        );

        return;

    }


    /*
       Monthly interest rate
    */

    const monthlyRate =
        annualRate /
        12 /
        100;


    let emi;


    /*
       Zero interest
    */

    if (monthlyRate === 0) {

        emi =
            principal /
            months;

    }


    /*
       Normal EMI
    */

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


    /*
       Total payment
    */

    const totalPaymentAmount =
        emi *
        months;


    /*
       Total interest
    */

    const totalInterestAmount =
        Math.max(
            0,
            totalPaymentAmount -
            principal
        );


    /*
       Display
    */

    if (elementExists(monthlyPayment)) {

        monthlyPayment.textContent =
            formatINR(emi);

    }


    if (elementExists(totalPayment)) {

        totalPayment.textContent =
            formatINR(
                totalPaymentAmount
            );

    }


    if (elementExists(totalInterest)) {

        totalInterest.textContent =
            formatINR(
                totalInterestAmount
            );

    }


    if (elementExists(principalAmount)) {

        principalAmount.textContent =
            formatINR(principal);

    }


    if (elementExists(chartInterest)) {

        chartInterest.textContent =
            formatINR(
                totalInterestAmount
            );

    }


    if (elementExists(chartPrincipal)) {

        chartPrincipal.textContent =
            formatINR(principal);

    }


    /*
       Schedule
    */

    createSchedule(
        principal,
        annualRate,
        months,
        emi
    );


    /*
       Chart
    */

    createChart(
        principal,
        totalInterestAmount
    );

}


/* =========================================================
   DISPLAY ZERO RESULTS
========================================================= */

function displayZeroResults() {

    const zero =
        formatINR(0);


    if (elementExists(monthlyPayment)) {
        monthlyPayment.textContent = zero;
    }

    if (elementExists(totalPayment)) {
        totalPayment.textContent = zero;
    }

    if (elementExists(totalInterest)) {
        totalInterest.textContent = zero;
    }

    if (elementExists(principalAmount)) {
        principalAmount.textContent = zero;
    }

    if (elementExists(chartInterest)) {
        chartInterest.textContent = zero;
    }

    if (elementExists(chartPrincipal)) {
        chartPrincipal.textContent = zero;
    }

}


/* =========================================================
   CREATE EMI SCHEDULE
========================================================= */

function createSchedule(
    principal,
    annualRate,
    months,
    emi
) {

    emiSchedule = [];


    let balance =
        principal;


    const monthlyRate =
        annualRate /
        12 /
        100;


    for (
        let month = 1;
        month <= months;
        month++
    ) {

        const openingBalance =
            balance;


        let interestAmount = 0;

        let principalPaid = 0;

        let payment = emi;


        /*
           Zero interest
        */

        if (monthlyRate === 0) {

            interestAmount = 0;

            principalPaid = emi;

        }


        /*
           Normal interest
        */

        else {

            interestAmount =
                balance *
                monthlyRate;


            principalPaid =
                emi -
                interestAmount;

        }


        /*
           Protect against rounding
        */

        if (principalPaid > balance) {

            principalPaid =
                balance;


            payment =
                principalPaid +
                interestAmount;

        }


        /*
           Prevent negative values
        */

        if (principalPaid < 0) {
            principalPaid = 0;
        }


        if (interestAmount < 0) {
            interestAmount = 0;
        }


        /*
           Update balance
        */

        balance =
            balance -
            principalPaid;


        /*
           Remove tiny floating value
        */

        if (
            Math.abs(balance) <
            0.01
        ) {

            balance = 0;

        }


        emiSchedule.push({

            month:
                month,

            opening:
                openingBalance,

            emi:
                payment,

            principal:
                principalPaid,

            interest:
                interestAmount,

            closing:
                balance

        });

    }

}


/* =========================================================
   CREATE PIE CHART
========================================================= */

function createChart(
    principal,
    interest
) {

    const canvas =
        document.getElementById(
            "emiPieChart"
        );


    if (!canvas) {
        return;
    }


    /*
       Destroy old chart
    */

    if (emiChart) {

        emiChart.destroy();

        emiChart = null;

    }


    /*
       Empty chart
    */

    if (principal <= 0) {
        return;
    }


    const safeInterest =
        Math.max(
            0,
            interest
        );


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
                                safeInterest
                            ],


                            backgroundColor: [
                                "#3182f6",
                                "#e55b62"
                            ],


                            borderColor:
                                "#ffffff",


                            borderWidth:
                                4,


                            hoverOffset:
                                5

                        }

                    ]

                },


                options: {

                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    cutout:
                        "63%",


                    animation: {

                        duration:
                            700

                    },


                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            backgroundColor:
                                "#061a3b",

                            titleColor:
                                "#ffffff",

                            bodyColor:
                                "#ffffff",

                            padding:
                                12,

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
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
   CALCULATE BUTTON
========================================================= */

const calculateBtn =
    document.getElementById(
        "calculateBtn"
    );


if (elementExists(calculateBtn)) {

    calculateBtn.addEventListener(
        "click",
        function () {

            /*
               Add small button animation
            */

            this.classList.add(
                "calculating"
            );


            calculateEMI();


            setTimeout(
                () => {

                    this.classList.remove(
                        "calculating"
                    );

                },
                250
            );

        }
    );

}


/* =========================================================
   PDF BUTTON
========================================================= */

const downloadPdfBtn =
    document.getElementById(
        "downloadPdfBtn"
    );


if (elementExists(downloadPdfBtn)) {

    downloadPdfBtn.addEventListener(
        "click",
        function () {

            downloadPDF();

        }
    );

}


/* =========================================================
   PDF COLORS
========================================================= */

const PDF_COLORS = {

    navy:
        [6, 26, 59],

    blue:
        [7, 87, 213],

    lightBlue:
        [238, 245, 255],

    green:
        [21, 150, 106],

    red:
        [229, 91, 98],

    text:
        [52, 68, 90],

    muted:
        [113, 128, 150],

    light:
        [247, 249, 252],

    border:
        [225, 232, 241],

    white:
        [255, 255, 255]

};


/* =========================================================
   PDF HEADER
========================================================= */

function drawPDFHeader(
    pdf,
    pageWidth
) {

    /*
       Top navy header
    */

    pdf.setFillColor(
        ...PDF_COLORS.navy
    );

    pdf.rect(
        0,
        0,
        pageWidth,
        38,
        "F"
    );


    /*
       Brand
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        17
    );

    pdf.setTextColor(
        ...PDF_COLORS.white
    );

    pdf.text(
        "ATYANT LOAN SOLUTIONS",
        15,
        15
    );


    /*
       Subtitle
    */

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        8
    );

    pdf.setTextColor(
        190,
        210,
        235
    );

    pdf.text(
        "Professional EMI Calculation Report",
        15,
        23
    );


    /*
       Report label
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        8
    );

    pdf.setTextColor(
        115,
        175,
        255
    );

    pdf.text(
        "EMI REPORT",
        pageWidth - 15,
        14,
        {
            align:
                "right"
        }
    );


    /*
       Date
    */

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        7
    );

    pdf.setTextColor(
        190,
        210,
        235
    );

    pdf.text(
        getCurrentDate(),
        pageWidth - 15,
        23,
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
        ...PDF_COLORS.border
    );

    pdf.setLineWidth(
        0.3
    );

    pdf.line(
        15,
        pageHeight - 14,
        pageWidth - 15,
        pageHeight - 14
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        7
    );

    pdf.setTextColor(
        ...PDF_COLORS.muted
    );


    pdf.text(
        "Atyant Loan Solutions | +91 8692877974",
        15,
        pageHeight - 7
    );


    pdf.text(
        "Page " + pageNumber,
        pageWidth - 15,
        pageHeight - 7,
        {
            align:
                "right"
        }
    );

}


/* =========================================================
   PDF SUMMARY CARD
========================================================= */

function drawPDFCard(
    pdf,
    x,
    y,
    width,
    height,
    title,
    value,
    accent
) {

    pdf.setFillColor(
        249,
        251,
        254
    );

    pdf.setDrawColor(
        ...PDF_COLORS.border
    );

    pdf.roundedRect(
        x,
        y,
        width,
        height,
        3,
        3,
        "FD"
    );


    /*
       Accent line
    */

    pdf.setFillColor(
        ...accent
    );

    pdf.roundedRect(
        x,
        y,
        3,
        height,
        1.5,
        1.5,
        "F"
    );


    /*
       Title
    */

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        7
    );

    pdf.setTextColor(
        ...PDF_COLORS.muted
    );

    pdf.text(
        title,
        x + 10,
        y + 10
    );


    /*
       Value
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        11
    );

    pdf.setTextColor(
        ...PDF_COLORS.navy
    );

    pdf.text(
        value,
        x + 10,
        y + 22
    );

}


/* =========================================================
   GET CURRENT DATE
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
   DOWNLOAD PROFESSIONAL PDF
========================================================= */

function downloadPDF() {

    /*
       Validate schedule
    */

    if (
        !emiSchedule ||
        emiSchedule.length === 0
    ) {

        alert(
            "Please enter valid loan details and calculate EMI first."
        );

        return;

    }


    /*
       Check jsPDF
    */

    if (
        typeof window.jspdf ===
        "undefined"
    ) {

        alert(
            "PDF library is not loaded. Please refresh the page."
        );

        return;

    }


    if (
        typeof window.jspdf.jsPDF !==
        "function"
    ) {

        alert(
            "PDF library is not available. Please refresh the page."
        );

        return;

    }


    const jsPDF =
        window.jspdf.jsPDF;


    /*
       Create A4 Portrait PDF
    */

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


    /*
       Input values
    */

    const principal =
        getNumber(
            loanAmountInput?.value,
            0
        );


    const rate =
        getNumber(
            interestRateInput?.value,
            0
        );


    const months =
        getNumber(
            loanTermInput?.value,
            1
        );


    /*
       Calculate totals directly
    */

    const monthlyEMI =
        emiSchedule[0]?.emi || 0;


    const totalInterestAmount =
        emiSchedule.reduce(
            (
                total,
                row
            ) => {

                return (
                    total +
                    row.interest
                );

            },
            0
        );


    const totalPaymentAmount =
        emiSchedule.reduce(
            (
                total,
                row
            ) => {

                return (
                    total +
                    row.emi
                );

            },
            0
        );


    /* =====================================================
       PAGE 1 HEADER
    ====================================================== */

    drawPDFHeader(
        pdf,
        pageWidth
    );


    /*
       Report title
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        15
    );

    pdf.setTextColor(
        ...PDF_COLORS.navy
    );

    pdf.text(
        "Loan EMI Summary",
        15,
        52
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        8
    );

    pdf.setTextColor(
        ...PDF_COLORS.muted
    );

    pdf.text(
        "Estimated repayment summary based on the information entered.",
        15,
        59
    );


    /* =====================================================
       MAIN EMI CARD
    ====================================================== */

    pdf.setFillColor(
        ...PDF_COLORS.lightBlue
    );

    pdf.setDrawColor(
        207,
        224,
        247
    );

    pdf.roundedRect(
        15,
        68,
        pageWidth - 30,
        38,
        4,
        4,
        "FD"
    );


    /*
       Left label
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        8
    );

    pdf.setTextColor(
        ...PDF_COLORS.blue
    );

    pdf.text(
        "ESTIMATED MONTHLY EMI",
        24,
        80
    );


    /*
       EMI
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        24
    );

    pdf.setTextColor(
        ...PDF_COLORS.navy
    );

    pdf.text(
        formatPDF(monthlyEMI),
        24,
        94
    );


    /*
       EMI note
    */

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        7
    );

    pdf.setTextColor(
        ...PDF_COLORS.muted
    );

    pdf.text(
        "Estimated monthly instalment",
        24,
        101
    );


    /*
       Right information
    */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        8
    );

    pdf.setTextColor(
        ...PDF_COLORS.text
    );

    pdf.text(
        "Loan Amount",
        pageWidth - 75,
        79
    );

    pdf.text(
        "Interest Rate",
        pageWidth - 75,
        88
    );

    pdf.text(
        "Tenure",
        pageWidth - 75,
        97
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.text(
        formatPDF(principal),
        pageWidth - 20,
        79,
        {
            align:
                "right"
        }
    );

    pdf.text(
        rate + "%",
        pageWidth - 20,
        88,
        {
            align:
                "right"
        }
    );

    pdf.text(
        months + " Months",
        pageWidth - 20,
        97,
        {
            align:
                "right"
        }
    );


    /* =====================================================
       SUMMARY CARDS
    ====================================================== */

    const cardY =
        116;

    const cardGap =
        5;

    const cardWidth =
        (
            pageWidth -
            30 -
            cardGap * 2
        ) / 3;


    drawPDFCard(
        pdf,
        15,
        cardY,
        cardWidth,
        34,
        "Principal Amount",
        formatPDF(principal),
        PDF_COLORS.blue
    );


    drawPDFCard(
        pdf,
        15 +
            cardWidth +
            cardGap,
        cardY,
        cardWidth,
        34,
        "Total Interest",
        formatPDF(totalInterestAmount),
        PDF_COLORS.red
    );


    drawPDFCard(
        pdf,
        15 +
            (cardWidth + cardGap) * 2,
        cardY,
        cardWidth,
        34,
        "Total Payment",
        formatPDF(totalPaymentAmount),
        PDF_COLORS.green
    );


    /* =====================================================
       PAYMENT BREAKDOWN
    ====================================================== */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        12
    );

    pdf.setTextColor(
        ...PDF_COLORS.navy
    );

    pdf.text(
        "Payment Breakdown",
        15,
        166
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        7
    );

    pdf.setTextColor(
        ...PDF_COLORS.muted
    );

    pdf.text(
        "Principal versus total interest over the selected tenure.",
        15,
        173
    );


    /*
       Breakdown bar
    */

    const barX =
        15;

    const barY =
        182;

    const barWidth =
        pageWidth - 30;

    const barHeight =
        9;


    const totalForBar =
        principal +
        totalInterestAmount;


    const principalWidth =
        totalForBar > 0
            ? (
                principal /
                totalForBar
            ) * barWidth
            : 0;


    pdf.setFillColor(
        ...PDF_COLORS.blue
    );

    pdf.roundedRect(
        barX,
        barY,
        principalWidth,
        barHeight,
        2,
        2,
        "F"
    );


    if (
        barWidth -
        principalWidth >
        0
    ) {

        pdf.setFillColor(
            ...PDF_COLORS.red
        );

        pdf.rect(
            barX +
                principalWidth,
            barY,
            barWidth -
                principalWidth,
            barHeight,
            "F"
        );

    }


    /*
       Legend
    */

    pdf.setFillColor(
        ...PDF_COLORS.blue
    );

    pdf.circle(
        18,
        202,
        2,
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
        ...PDF_COLORS.text
    );

    pdf.text(
        "Principal: " +
        formatPDF(principal),
        24,
        204
    );


    pdf.setFillColor(
        ...PDF_COLORS.red
    );

    pdf.circle(
        105,
        202,
        2,
        "F"
    );


    pdf.text(
        "Interest: " +
        formatPDF(totalInterestAmount),
        111,
        204
    );


    /* =====================================================
       REPAYMENT SCHEDULE TITLE
    ====================================================== */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        12
    );

    pdf.setTextColor(
        ...PDF_COLORS.navy
    );

    pdf.text(
        "Repayment Schedule",
        15,
        222
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        7
    );

    pdf.setTextColor(
        ...PDF_COLORS.muted
    );

    pdf.text(
        "Detailed monthly principal, interest and outstanding balance.",
        15,
        229
    );


    /* =====================================================
       TABLE
    ====================================================== */

    if (
        typeof pdf.autoTable !==
        "function"
    ) {

        alert(
            "PDF table plugin is not loaded. Please refresh the page."
        );

        return;

    }


    const tableRows =
        emiSchedule.map(
            function (row) {

                return [

                    String(
                        row.month
                    ),

                    formatPDF(
                        row.opening
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
                        row.closing
                    )

                ];

            }
        );


    pdf.autoTable({

        startY:
            234,

        margin: {

            top:
                45,

            left:
                15,

            right:
                15,

            bottom:
                18

        },


        head: [[

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


        styles: {

            font:
                "helvetica",

            fontSize:
                7,

            cellPadding:
                2.5,

            lineWidth:
                0.1,

            lineColor:
                PDF_COLORS.border,

            textColor:
                PDF_COLORS.text,

            valign:
                "middle",

            halign:
                "right"

        },


        headStyles: {

            fillColor:
                PDF_COLORS.navy,

            textColor:
                PDF_COLORS.white,

            fontStyle:
                "bold",

            fontSize:
                7,

            halign:
                "center",

            cellPadding:
                3

        },


        alternateRowStyles: {

            fillColor:
                [248, 250, 253]

        },


        columnStyles: {

            0: {

                halign:
                    "center",

                cellWidth:
                    14

            },

            1: {

                cellWidth:
                    31

            },

            2: {

                cellWidth:
                    29

            },

            3: {

                cellWidth:
                    29

            },

            4: {

                cellWidth:
                    29

            },

            5: {

                cellWidth:
                    31

            }

        },


        didDrawPage:
            function () {

                const currentPage =
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
                    currentPage
                );

            }

    });


    /* =====================================================
       FINAL DISCLAIMER PAGE CONTENT
    ====================================================== */

    const finalY =
        pdf.lastAutoTable &&
        pdf.lastAutoTable.finalY
            ? pdf.lastAutoTable.finalY
            : 240;


    /*
       If enough room exists on current page
    */

    if (
        finalY <
        pageHeight - 45
    ) {

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(
            8
        );

        pdf.setTextColor(
            ...PDF_COLORS.navy
        );

        pdf.text(
            "Important Information",
            15,
            finalY + 15
        );


        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(
            7
        );

        pdf.setTextColor(
            ...PDF_COLORS.muted
        );


        const disclaimer =
            "This EMI calculation is indicative and provided for planning purposes only. " +
            "Actual interest rates, processing fees, loan tenure, EMI and approval are " +
            "subject to the applicable lender's eligibility criteria, policies and terms.";


        const disclaimerLines =
            pdf.splitTextToSize(
                disclaimer,
                pageWidth - 30
            );


        pdf.text(
            disclaimerLines,
            15,
            finalY + 23
        );

    }


    /* =====================================================
       SAVE
    ====================================================== */

    const safeDate =
        new Date()
            .toISOString()
            .split("T")[0];


    pdf.save(
        "Atyant-Loan-EMI-Report-" +
        safeDate +
        ".pdf"
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeCalculator() {

    /*
       Make sure slider limits are correct
    */

    if (elementExists(loanAmountSlider)) {

        loanAmountSlider.min =
            MIN_LOAN_AMOUNT;

        loanAmountSlider.max =
            MAX_LOAN_AMOUNT;

    }


    if (elementExists(interestRateSlider)) {

        interestRateSlider.min =
            MIN_INTEREST_RATE;

        interestRateSlider.max =
            MAX_INTEREST_RATE;

    }


    if (elementExists(loanTermSlider)) {

        loanTermSlider.min =
            MIN_LOAN_TERM;

        loanTermSlider.max =
            MAX_LOAN_TERM;

    }


    /*
       Default values
    */

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


    /*
       Protect initial values
    */

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


    /*
       Set values
    */

    if (elementExists(loanAmountInput)) {
        loanAmountInput.value =
            initialLoan;
    }


    if (elementExists(loanAmountSlider)) {
        loanAmountSlider.value =
            initialLoan;
    }


    if (elementExists(interestRateInput)) {
        interestRateInput.value =
            initialRate;
    }


    if (elementExists(interestRateSlider)) {
        interestRateSlider.value =
            initialRate;
    }


    if (elementExists(loanTermInput)) {
        loanTermInput.value =
            initialTerm;
    }


    if (elementExists(loanTermSlider)) {
        loanTermSlider.value =
            initialTerm;
    }


    updateLabels();

    updateAllRangeVisuals();

    calculateEMI();

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCalculator
    );

} else {

    initializeCalculator();

}