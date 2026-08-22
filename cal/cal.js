// =====================================================
// ATYANT LOAN SOLUTIONS
// EMI CALCULATOR - COMPLETE JS
// =====================================================

let emiChart = null;

let emiSchedule = [];


// =====================================================
// GET ELEMENTS
// =====================================================

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


// =====================================================
// FORMAT INDIAN RUPEES
// =====================================================

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


// =====================================================
// FORMAT CURRENCY FOR PDF
// Using Rs. because standard jsPDF fonts
// don't reliably support ₹.
// =====================================================

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


// =====================================================
// SAFE NUMBER
// =====================================================

function getNumber(
    value,
    defaultValue = 0
) {

    const number =
        parseFloat(value);

    if (
        Number.isNaN(number)
    ) {

        return defaultValue;

    }

    return number;

}


// =====================================================
// LOAN AMOUNT
//
// Range:
// ₹0 to ₹1,00,00,000
//
// Manual entry allowed
//
// + / - changes by ₹1
// =====================================================

function setLoanAmount(value) {

    let amount =
        parseFloat(value);


    if (
        Number.isNaN(amount)
    ) {

        amount = 0;

    }


    // Minimum ₹0

    if (
        amount < 0
    ) {

        amount = 0;

    }


    // Maximum ₹1 crore

    if (
        amount > 10000000
    ) {

        amount = 10000000;

    }


    // Loan amount should be a whole number

    amount =
        Math.round(amount);


    // Update input

    loanAmountInput.value =
        amount;


    // Update slider

    loanAmountSlider.value =
        amount;


    // Update label

    updateLabels();


    // Calculate

    calculateEMI();

}


// =====================================================
// INTEREST RATE
//
// Examples:
// 0.11
// 0.12
// 1
// 5.5
// 9.99
// 10.5
// 12
//
// + / - changes by 0.01
// =====================================================

function setInterestRate(value) {

    let rateText =
        String(value).trim();


    // Remove invalid characters

    rateText =
        rateText.replace(
            /[^0-9.]/g,
            ""
        );


    // Allow only one decimal point

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


    // Empty value

    if (
        rateText === ""
    ) {

        interestRateValue.textContent =
            "0%";

        return;

    }


    let rate =
        parseFloat(rateText);


    if (
        Number.isNaN(rate)
    ) {

        return;

    }


    // Minimum 0%

    if (
        rate < 0
    ) {

        rate = 0;

        rateText = "0";

    }


    // Maximum 50%

    if (
        rate > 50
    ) {

        rate = 50;

        rateText = "50";

    }


    // Update input

    interestRateInput.value =
        rateText;


    // Update slider

    interestRateSlider.value =
        rate;


    // Update label

    interestRateValue.textContent =
        rateText + "%";


    // Calculate

    calculateEMI();

}


// =====================================================
// LOAN TENURE
//
// Range:
// 1 to 360 months
//
// + / - changes by 1 month
// =====================================================

function setLoanTerm(value) {

    let term =
        parseFloat(value);


    if (
        Number.isNaN(term)
    ) {

        term = 1;

    }


    term =
        Math.round(term);


    // Minimum 1 month

    if (
        term < 1
    ) {

        term = 1;

    }


    // Maximum 360 months

    if (
        term > 360
    ) {

        term = 360;

    }


    // Update input

    loanTermInput.value =
        term;


    // Update slider

    loanTermSlider.value =
        term;


    // Update label

    updateLabels();


    // Calculate

    calculateEMI();

}


// =====================================================
// LOAN AMOUNT SLIDER
// =====================================================

loanAmountSlider.addEventListener(
    "input",
    function () {

        setLoanAmount(
            this.value
        );

    }
);


// =====================================================
// INTEREST RATE SLIDER
// =====================================================

interestRateSlider.addEventListener(
    "input",
    function () {

        interestRateInput.value =
            this.value;

        setInterestRate(
            this.value
        );

    }
);


// =====================================================
// LOAN TENURE SLIDER
// =====================================================

loanTermSlider.addEventListener(
    "input",
    function () {

        setLoanTerm(
            this.value
        );

    }
);


// =====================================================
// LOAN AMOUNT MANUAL INPUT
// =====================================================

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

            loanAmountValue.textContent =
                "₹0";

            return;

        }


        setLoanAmount(
            value
        );

    }
);


// =====================================================
// INTEREST RATE MANUAL INPUT
// =====================================================

interestRateInput.addEventListener(
    "input",
    function () {

        setInterestRate(
            this.value
        );

    }
);


// =====================================================
// TENURE MANUAL INPUT
// =====================================================

loanTermInput.addEventListener(
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

            loanTermValue.textContent =
                "0 Months";

            return;

        }


        setLoanTerm(
            value
        );

    }
);


// =====================================================
// LOAN AMOUNT MINUS
// STEP = ₹1
// =====================================================

document
    .getElementById("loanMinus")
    .addEventListener(
        "click",
        function () {

            let amount =
                getNumber(
                    loanAmountInput.value,
                    0
                );


            amount =
                amount - 1;


            if (
                amount < 0
            ) {

                amount = 0;

            }


            setLoanAmount(
                amount
            );

        }
    );


// =====================================================
// LOAN AMOUNT PLUS
// STEP = ₹1
// =====================================================

document
    .getElementById("loanPlus")
    .addEventListener(
        "click",
        function () {

            let amount =
                getNumber(
                    loanAmountInput.value,
                    0
                );


            amount =
                amount + 1;


            if (
                amount > 10000000
            ) {

                amount = 10000000;

            }


            setLoanAmount(
                amount
            );

        }
    );


// =====================================================
// INTEREST RATE MINUS
// STEP = 0.01
// =====================================================

document
    .getElementById("interestMinus")
    .addEventListener(
        "click",
        function () {

            let rate =
                getNumber(
                    interestRateInput.value,
                    0
                );


            rate =
                rate - 0.01;


            if (
                rate < 0
            ) {

                rate = 0;

            }


            rate =
                Math.round(
                    rate * 100
                ) / 100;


            const value =
                rate.toFixed(2);


            setInterestRate(
                value
            );

        }
    );


// =====================================================
// INTEREST RATE PLUS
// STEP = 0.01
// =====================================================

document
    .getElementById("interestPlus")
    .addEventListener(
        "click",
        function () {

            let rate =
                getNumber(
                    interestRateInput.value,
                    0
                );


            rate =
                rate + 0.01;


            if (
                rate > 50
            ) {

                rate = 50;

            }


            rate =
                Math.round(
                    rate * 100
                ) / 100;


            const value =
                rate.toFixed(2);


            setInterestRate(
                value
            );

        }
    );


// =====================================================
// TENURE MINUS
// STEP = 1 MONTH
// =====================================================

document
    .getElementById("termMinus")
    .addEventListener(
        "click",
        function () {

            let term =
                getNumber(
                    loanTermInput.value,
                    1
                );


            term =
                term - 1;


            if (
                term < 1
            ) {

                term = 1;

            }


            setLoanTerm(
                term
            );

        }
    );


// =====================================================
// TENURE PLUS
// STEP = 1 MONTH
// =====================================================

document
    .getElementById("termPlus")
    .addEventListener(
        "click",
        function () {

            let term =
                getNumber(
                    loanTermInput.value,
                    1
                );


            term =
                term + 1;


            if (
                term > 360
            ) {

                term = 360;

            }


            setLoanTerm(
                term
            );

        }
    );


// =====================================================
// UPDATE LABELS
// =====================================================

function updateLabels() {

    const loan =
        getNumber(
            loanAmountInput.value,
            0
        );


    const rate =
        getNumber(
            interestRateInput.value,
            0
        );


    const term =
        getNumber(
            loanTermInput.value,
            1
        );


    // Loan amount

    loanAmountValue.textContent =
        formatINR(
            loan
        );


    // Interest rate

    interestRateValue.textContent =
        interestRateInput.value +
        "%";


    // Tenure

    loanTermValue.textContent =
        term +
        (
            term === 1
                ? " Month"
                : " Months"
        );

}


// =====================================================
// CALCULATE EMI
// =====================================================

function calculateEMI() {

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
            1
        );


    // If loan amount is zero

    if (
        principal <= 0
    ) {

        monthlyPayment.textContent =
            formatINR(0);

        totalPayment.textContent =
            formatINR(0);

        totalInterest.textContent =
            formatINR(0);

        principalAmount.textContent =
            formatINR(0);

        chartInterest.textContent =
            formatINR(0);


        emiSchedule = [];


        createChart(
            0,
            0
        );


        return;

    }


    // If tenure is invalid

    if (
        months <= 0
    ) {

        return;

    }


    // =================================================
    // MONTHLY INTEREST RATE
    // =================================================

    const monthlyRate =
        annualRate /
        12 /
        100;


    let emi;


    // =================================================
    // ZERO INTEREST
    // =================================================

    if (
        monthlyRate === 0
    ) {

        emi =
            principal /
            months;

    }


    // =================================================
    // NORMAL EMI
    // =================================================

    else {

        emi =
            principal *
            monthlyRate *
            Math.pow(
                1 + monthlyRate,
                months
            )
            /
            (
                Math.pow(
                    1 + monthlyRate,
                    months
                ) - 1
            );

    }


    // =================================================
    // TOTAL
    // =================================================

    const totalPaymentAmount =
        emi *
        months;


    const totalInterestAmount =
        totalPaymentAmount -
        principal;


    // =================================================
    // DISPLAY RESULTS
    // =================================================

    monthlyPayment.textContent =
        formatINR(
            emi
        );


    totalPayment.textContent =
        formatINR(
            totalPaymentAmount
        );


    totalInterest.textContent =
        formatINR(
            totalInterestAmount
        );


    principalAmount.textContent =
        formatINR(
            principal
        );


    chartInterest.textContent =
        formatINR(
            totalInterestAmount
        );


    // =================================================
    // CREATE SCHEDULE
    // =================================================

    createSchedule(
        principal,
        annualRate,
        months,
        emi
    );


    // =================================================
    // CREATE CHART
    // =================================================

    createChart(
        principal,
        Math.max(
            0,
            totalInterestAmount
        )
    );

}


// =====================================================
// CREATE EMI SCHEDULE
// =====================================================

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


        // =================================================
        // ZERO INTEREST
        // =================================================

        if (
            monthlyRate === 0
        ) {

            interestAmount =
                0;


            principalPaid =
                emi;

        }


        // =================================================
        // NORMAL INTEREST
        // =================================================

        else {

            interestAmount =
                balance *
                monthlyRate;


            principalPaid =
                emi -
                interestAmount;

        }


        // =================================================
        // LAST EMI ADJUSTMENT
        // =================================================

        if (
            principalPaid >
            balance
        ) {

            principalPaid =
                balance;


            payment =
                principalPaid +
                interestAmount;

        }


        // =================================================
        // UPDATE BALANCE
        // =================================================

        balance =
            balance -
            principalPaid;


        // Remove tiny floating point balance

        if (
            Math.abs(balance) <
            0.01
        ) {

            balance = 0;

        }


        // =================================================
        // STORE
        // =================================================

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


// =====================================================
// CREATE PIE CHART
// =====================================================

function createChart(
    principal,
    interest
) {

    const canvas =
        document.getElementById(
            "emiPieChart"
        );


    if (
        !canvas
    ) {

        return;

    }


    // Destroy old chart

    if (
        emiChart
    ) {

        emiChart.destroy();

        emiChart = null;

    }


    // Don't create invalid chart

    if (
        principal <= 0
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

                                Math.max(
                                    0,
                                    interest
                                )

                            ],


                            backgroundColor: [

                                "#0d6efd",

                                "#dc3545"

                            ],


                            borderColor:
                                "#ffffff",


                            borderWidth:
                                4

                        }

                    ]

                },


                options: {

                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    cutout:
                        "58%",


                    plugins: {

                        legend: {

                            position:
                                "bottom",


                            labels: {

                                padding:
                                    18,


                                font: {

                                    size:
                                        13

                                }

                            }

                        },


                        tooltip: {

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


// =====================================================
// CALCULATE BUTTON
// =====================================================

document
    .getElementById("calculateBtn")
    .addEventListener(
        "click",
        function () {

            calculateEMI();

        }
    );


// =====================================================
// PDF BUTTON
// =====================================================

document
    .getElementById("downloadPdfBtn")
    .addEventListener(
        "click",
        function () {

            downloadPDF();

        }
    );


// =====================================================
// DOWNLOAD PDF
// =====================================================

function downloadPDF() {

    // Check schedule

    if (
        emiSchedule.length === 0
    ) {

        alert(
            "Please enter a valid loan amount and calculate EMI first."
        );

        return;

    }


    // Check jsPDF

    if (
        typeof window.jspdf ===
        "undefined"
    ) {

        alert(
            "PDF library is not loaded. Please check your internet connection and refresh the page."
        );

        return;

    }


    // Check AutoTable

    if (
        typeof window.jspdf.jsPDF !==
        "function"
    ) {

        alert(
            "PDF library is not available."
        );

        return;

    }


    const jsPDF =
        window.jspdf.jsPDF;


    // =================================================
    // CREATE PDF
    // =================================================

    const pdf =
        new jsPDF(
            "landscape",
            "mm",
            "a4"
        );


    // =================================================
    // INPUT VALUES
    // =================================================

    const principal =
        getNumber(
            loanAmountInput.value,
            0
        );


    const rate =
        getNumber(
            interestRateInput.value,
            0
        );


    const months =
        getNumber(
            loanTermInput.value,
            1
        );


    // =================================================
    // TOTAL INTEREST
    // =================================================

    const totalInterest =
        emiSchedule.reduce(
            function (
                total,
                row
            ) {

                return (
                    total +
                    row.interest
                );

            },
            0
        );


    // =================================================
    // TOTAL PAYMENT
    // =================================================

    const totalPaymentAmount =
        emiSchedule.reduce(
            function (
                total,
                row
            ) {

                return (
                    total +
                    row.emi
                );

            },
            0
        );


    // =================================================
    // MONTHLY EMI
    // =================================================

    const firstEMI =
        emiSchedule[0].emi;


    // =================================================
    // HEADER
    // =================================================

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.setFontSize(
        20
    );


    pdf.text(
        "ATYANT LOAN SOLUTIONS",
        148,
        15,
        {
            align:
                "center"
        }
    );


    pdf.setFontSize(
        14
    );


    pdf.text(
        "EMI REPAYMENT SCHEDULE",
        148,
        23,
        {
            align:
                "center"
        }
    );


    // =================================================
    // SUMMARY
    // =================================================

    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.setFontSize(
        10
    );


    pdf.text(
        "Loan Amount: " +
        formatPDF(
            principal
        ),
        15,
        37
    );


    pdf.text(
        "Interest Rate: " +
        rate +
        "%",
        15,
        45
    );


    pdf.text(
        "Loan Tenure: " +
        months +
        " Months",
        15,
        53
    );


    pdf.text(
        "Monthly EMI: " +
        formatPDF(
            firstEMI
        ),
        155,
        37
    );


    pdf.text(
        "Total Interest: " +
        formatPDF(
            totalInterest
        ),
        155,
        45
    );


    pdf.text(
        "Total Payment: " +
        formatPDF(
            totalPaymentAmount
        ),
        155,
        53
    );


    // =================================================
    // TABLE
    // =================================================

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


    // =================================================
    // AUTO TABLE
    // =================================================

    if (
        typeof pdf.autoTable !==
        "function"
    ) {

        alert(
            "PDF table plugin is not loaded. Please refresh the page."
        );

        return;

    }


    pdf.autoTable({

        startY:
            60,


        margin: {

            left:
                10,

            right:
                10,

            bottom:
                15

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
                2,

            lineWidth:
                0.1,

            lineColor:
                [210, 210, 210],

            textColor:
                [40, 40, 40],

            halign:
                "right"

        },


        headStyles: {

            fillColor:
                [13, 110, 253],

            textColor:
                [255, 255, 255],

            fontStyle:
                "bold",

            fontSize:
                8,

            halign:
                "center"

        },


        columnStyles: {

            0: {

                cellWidth:
                    18,

                halign:
                    "center"

            },

            1: {

                cellWidth:
                    50

            },

            2: {

                cellWidth:
                    43

            },

            3: {

                cellWidth:
                    43

            },

            4: {

                cellWidth:
                    43

            },

            5: {

                cellWidth:
                    50

            }

        },


        alternateRowStyles: {

            fillColor:
                [248, 249, 250]

        },


        didDrawPage:
            function () {

                const pageWidth =
                    pdf.internal
                        .pageSize
                        .getWidth();


                const pageHeight =
                    pdf.internal
                        .pageSize
                        .getHeight();


                const pageNumber =
                    pdf.internal
                        .getCurrentPageInfo()
                        .pageNumber;


                pdf.setFont(
                    "helvetica",
                    "normal"
                );


                pdf.setFontSize(
                    8
                );


                pdf.text(
                    "Atyant Loan Solutions",
                    10,
                    pageHeight - 7
                );


                pdf.text(
                    "Page " +
                    pageNumber,
                    pageWidth - 10,
                    pageHeight - 7,
                    {
                        align:
                            "right"
                    }
                );

            }

    });


    // =================================================
    // SAVE PDF
    // =================================================

    pdf.save(
        "Atyant-Loan-EMI-Schedule.pdf"
    );

}


// =====================================================
// INITIAL CALCULATION
// =====================================================

updateLabels();

calculateEMI();