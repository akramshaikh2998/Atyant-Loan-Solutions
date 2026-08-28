/* =========================================================
   ATYANT LOAN SOLUTIONS
   CIBIL FRONTEND
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* =====================================================
       CONFIGURATION
    ====================================================== */

    /*
      LOCAL DEVELOPMENT:

      http://localhost:3000

      WHEN DEPLOYED:

      Change this to your backend URL.

      Example:

      https://api.atyantloan.com
    */

    const API_BASE_URL =
      "http://localhost:3000";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const mobilePanel =
      document.getElementById(
        "mobilePanel"
      );

    const otpPanel =
      document.getElementById(
        "otpPanel"
      );

    const detailsPanel =
      document.getElementById(
        "detailsPanel"
      );

    const consentPanel =
      document.getElementById(
        "consentPanel"
      );

    const loadingPanel =
      document.getElementById(
        "loadingPanel"
      );

    const reportResult =
      document.getElementById(
        "reportResult"
      );


    const mobile =
      document.getElementById(
        "mobile"
      );

    const otp =
      document.getElementById(
        "otp"
      );

    const fullName =
      document.getElementById(
        "fullName"
      );

    const pan =
      document.getElementById(
        "pan"
      );

    const dob =
      document.getElementById(
        "dob"
      );

    const email =
      document.getElementById(
        "email"
      );

    const consent =
      document.getElementById(
        "consentCheckbox"
      );


    const sendOtpBtn =
      document.getElementById(
        "sendOtpBtn"
      );

    const verifyOtpBtn =
      document.getElementById(
        "verifyOtpBtn"
      );

    const resendOtpBtn =
      document.getElementById(
        "resendOtpBtn"
      );

    const detailsContinueBtn =
      document.getElementById(
        "detailsContinueBtn"
      );

    const getReportBtn =
      document.getElementById(
        "getReportBtn"
      );

    const newRequestBtn =
      document.getElementById(
        "newRequestBtn"
      );


    let verifiedMobile = "";


    let otpCooldown = false;


    /* =====================================================
       PRELOADER
    ====================================================== */

    window.addEventListener(
      "load",
      function () {

        const preloader =
          document.getElementById(
            "preloader"
          );


        setTimeout(
          function () {

            if (!preloader) {
              return;
            }


            preloader.style.opacity =
              "0";


            setTimeout(
              function () {

                preloader.style.display =
                  "none";

              },
              400
            );

          },
          500
        );

      }
    );


    /* =====================================================
       HELPERS
    ====================================================== */

    function clearErrors() {

      document
        .querySelectorAll(
          ".field-error"
        )
        .forEach(
          function (element) {

            element.textContent =
              "";

          }
        );

    }


    function showError(
      id,
      message
    ) {

      const element =
        document.getElementById(
          id
        );


      if (element) {

        element.textContent =
          message;

      }

    }


    function showPanel(
      panel
    ) {

      [
        mobilePanel,
        otpPanel,
        detailsPanel,
        consentPanel
      ]
        .forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );


      panel.classList.add(
        "active"
      );


      window.scrollTo({

        top:
          document.querySelector(
            ".cibil-main"
          ).offsetTop - 25,

        behavior:
          "smooth"

      });

    }


    function updateProgress(
      activeStep
    ) {

      for (
        let i = 1;
        i <= 4;
        i++
      ) {

        const element =
          document.getElementById(
            "progress" + i
          );


        if (!element) {
          continue;
        }


        element.classList.remove(
          "active",
          "completed"
        );


        if (i < activeStep) {

          element.classList.add(
            "completed"
          );

        }


        if (i === activeStep) {

          element.classList.add(
            "active"
          );

        }

      }

    }


    async function apiRequest(
      endpoint,
      options
    ) {

      const response =
        await fetch(
          API_BASE_URL +
          endpoint,
          options
        );


      let data = null;


      try {

        data =
          await response.json();

      }

      catch {

        throw new Error(
          "Invalid response from server."
        );

      }


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Server request failed."
        );

      }


      return data;

    }


    /* =====================================================
       MOBILE VALIDATION
    ====================================================== */

    function validateMobile() {

      const value =
        mobile.value.trim();


      if (
        !/^[6-9]\d{9}$/.test(
          value
        )
      ) {

        showError(
          "mobileError",
          "Please enter a valid 10-digit Indian mobile number."
        );

        return false;

      }


      return true;

    }


    /* =====================================================
       SEND OTP
    ====================================================== */

    sendOtpBtn.addEventListener(
      "click",
      async function () {

        clearErrors();


        if (!validateMobile()) {
          return;
        }


        if (otpCooldown) {
          return;
        }


        const mobileNumber =
          mobile.value.trim();


        sendOtpBtn.disabled =
          true;


        sendOtpBtn.innerHTML =

          `

          Sending OTP

          <i
            class="fa-solid fa-spinner fa-spin"
          ></i>

          `;


        try {

          const data =
            await apiRequest(
              "/api/cibil/send-otp",
              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify({

                    mobile:
                      mobileNumber

                  })

              }
            );


          if (!data.success) {

            throw new Error(
              data.message ||
              "Unable to send OTP."
            );

          }


          verifiedMobile =
            mobileNumber;


          document.getElementById(
            "otpMessage"
          ).textContent =

            "OTP sent to +91 " +
            mobileNumber;


          updateProgress(2);


          showPanel(
            otpPanel
          );


          startOtpCooldown();


        }

        catch (error) {

          console.error(
            error
          );


          showError(
            "mobileError",
            error.message ||
            "Unable to send OTP."
          );

        }

        finally {

          sendOtpBtn.disabled =
            false;


          sendOtpBtn.innerHTML =

            `

            Continue

            <i
              class="fa-solid fa-arrow-right"
            ></i>

            `;

        }

      }
    );


    /* =====================================================
       OTP INPUT
    ====================================================== */

    otp.addEventListener(
      "input",
      function () {

        otp.value =
          otp.value
            .replace(
              /\D/g,
              ""
            )
            .slice(
              0,
              6
            );

      }
    );


    /* =====================================================
       VERIFY OTP
    ====================================================== */

    verifyOtpBtn.addEventListener(
      "click",
      async function () {

        clearErrors();


        const otpValue =
          otp.value.trim();


        if (
          !/^\d{6}$/.test(
            otpValue
          )
        ) {

          showError(
            "otpError",
            "Please enter the 6-digit OTP."
          );

          return;

        }


        if (!verifiedMobile) {

          showError(
            "otpError",
            "Mobile number is missing. Please restart the verification."
          );

          return;

        }


        verifyOtpBtn.disabled =
          true;


        verifyOtpBtn.innerHTML =

          `

          Verifying

          <i
            class="fa-solid fa-spinner fa-spin"
          ></i>

          `;


        try {

          const data =
            await apiRequest(
              "/api/cibil/verify-otp",
              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify({

                    mobile:
                      verifiedMobile,

                    otp:
                      otpValue

                  })

              }
            );


          if (
            !data.success ||
            !data.verified
          ) {

            throw new Error(
              data.message ||
              "OTP verification failed."
            );

          }


          updateProgress(2);


          showPanel(
            detailsPanel
          );

        }

        catch (error) {

          console.error(
            error
          );


          showError(
            "otpError",
            error.message ||
            "Invalid or expired OTP."
          );

        }

        finally {

          verifyOtpBtn.disabled =
            false;


          verifyOtpBtn.innerHTML =

            `

            Verify OTP

            <i
              class="fa-solid fa-arrow-right"
            ></i>

            `;

        }

      }
    );


    /* =====================================================
       RESEND OTP
    ====================================================== */

    resendOtpBtn.addEventListener(
      "click",
      async function () {

        clearErrors();


        if (!verifiedMobile) {

          showError(
            "otpError",
            "Mobile number is missing."
          );

          return;

        }


        if (otpCooldown) {

          return;

        }


        resendOtpBtn.disabled =
          true;


        resendOtpBtn.textContent =
          "Sending...";


        try {

          const data =
            await apiRequest(
              "/api/cibil/send-otp",
              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify({

                    mobile:
                      verifiedMobile

                  })

              }
            );


          if (!data.success) {

            throw new Error(
              data.message ||
              "Unable to resend OTP."
            );

          }


          otp.value =
            "";


          startOtpCooldown();


        }

        catch (error) {

          showError(
            "otpError",
            error.message ||
            "Unable to resend OTP."
          );

        }

        finally {

          resendOtpBtn.disabled =
            false;

          resendOtpBtn.textContent =
            "Resend OTP";

        }

      }
    );


    /* =====================================================
       OTP COOLDOWN
    ====================================================== */

    function startOtpCooldown() {

      otpCooldown =
        true;


      let seconds =
        30;


      const originalText =
        "Resend OTP";


      const timer =
        setInterval(
          function () {

            resendOtpBtn.textContent =
              `Resend OTP (${seconds}s)`;


            seconds--;


            if (seconds < 0) {

              clearInterval(
                timer
              );


              otpCooldown =
                false;


              resendOtpBtn.textContent =
                originalText;

            }

          },
          1000
        );

    }


    /* =====================================================
       PAN FORMAT
    ====================================================== */

    pan.addEventListener(
      "input",
      function () {

        pan.value =
          pan.value
            .toUpperCase()
            .replace(
              /[^A-Z0-9]/g,
              ""
            )
            .slice(
              0,
              10
            );

      }
    );


    /* =====================================================
       DETAILS VALIDATION
    ====================================================== */

    function validateDetails() {

      clearErrors();


      let valid =
        true;


      const nameValue =
        fullName.value.trim();


      if (
        nameValue.length < 3
      ) {

        showError(
          "nameError",
          "Please enter the customer's full name."
        );

        valid =
          false;

      }


      const panValue =
        pan.value
          .trim()
          .toUpperCase();


      if (
        !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
          panValue
        )
      ) {

        showError(
          "panError",
          "Please enter a valid PAN number."
        );

        valid =
          false;

      }


      if (!dob.value) {

        showError(
          "dobError",
          "Please select the date of birth."
        );

        valid =
          false;

      }


      if (
        !email.value.trim()
      ) {

        showError(
          "emailError",
          "Please enter an email address."
        );

        valid =
          false;

      }

      else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email.value.trim()
        )
      ) {

        showError(
          "emailError",
          "Please enter a valid email address."
        );

        valid =
          false;

      }


      return valid;

    }


    /* =====================================================
       DETAILS CONTINUE
    ====================================================== */

    detailsContinueBtn.addEventListener(
      "click",
      function () {

        if (
          !validateDetails()
        ) {

          return;

        }


        document.getElementById(
          "summaryName"
        ).textContent =
          fullName.value.trim();


        document.getElementById(
          "summaryPan"
        ).textContent =
          maskPan(
            pan.value.trim()
          );


        document.getElementById(
          "summaryMobile"
        ).textContent =
          "+91 " +
          maskMobile(
            verifiedMobile
          );


        document.getElementById(
          "summaryDob"
        ).textContent =
          formatDate(
            dob.value
          );


        updateProgress(3);


        showPanel(
          consentPanel
        );

      }
    );


    /* =====================================================
       MASK PAN
    ====================================================== */

    function maskPan(
      value
    ) {

      if (
        value.length !== 10
      ) {

        return value;

      }


      return (
        value.substring(0, 3) +
        "****" +
        value.substring(7)
      );

    }


    /* =====================================================
       MASK MOBILE
    ====================================================== */

    function maskMobile(
      value
    ) {

      if (
        value.length !== 10
      ) {

        return value;

      }


      return (
        value.substring(0, 2) +
        "******" +
        value.substring(8)
      );

    }


    /* =====================================================
       DATE FORMAT
    ====================================================== */

    function formatDate(
      value
    ) {

      if (!value) {
        return "-";
      }


      const date =
        new Date(
          value +
          "T00:00:00"
        );


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


    /* =====================================================
       REQUEST REPORT
    ====================================================== */

    getReportBtn.addEventListener(
      "click",
      async function () {

        clearErrors();


        if (!consent.checked) {

          showError(
            "consentError",
            "Please provide customer consent before continuing."
          );

          return;

        }


        getReportBtn.disabled =
          true;


        getReportBtn.innerHTML =

          `

          Processing

          <i
            class="fa-solid fa-spinner fa-spin"
          ></i>

          `;


        try {

          const data =
            await apiRequest(
              "/api/cibil/request-report",
              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify({

                    mobile:
                      verifiedMobile,

                    name:
                      fullName.value.trim(),

                    pan:
                      pan.value.trim()
                        .toUpperCase(),

                    dob:
                      dob.value,

                    email:
                      email.value.trim(),

                    consent:
                      true

                  })

              }
            );


          if (!data.success) {

            throw new Error(
              data.message ||
              "Unable to process request."
            );

          }


          consentPanel.style.display =
            "none";


          loadingPanel.style.display =
            "block";


          updateProgress(4);


          const items =
            document.querySelectorAll(
              ".loading-item"
            );


          items.forEach(
            function (
              item,
              index
            ) {

              setTimeout(
                function () {

                  items.forEach(
                    function (
                      current
                    ) {

                      current.classList.remove(
                        "active"
                      );

                    }
                  );


                  item.classList.add(
                    "active"
                  );

                },
                index * 700
              );

            }
          );


          setTimeout(
            function () {

              loadingPanel.style.display =
                "none";


              reportResult.style.display =
                "block";


              window.scrollTo({

                top:
                  reportResult.offsetTop - 25,

                behavior:
                  "smooth"

              });

            },
            2400
          );

        }

        catch (error) {

          console.error(
            error
          );


          showError(
            "consentError",
            error.message ||
            "Unable to process the request."
          );

        }

        finally {

          getReportBtn.disabled =
            false;


          getReportBtn.innerHTML =

            `

            Request Credit Report

            <i
              class="fa-solid fa-arrow-right"
            ></i>

            `;

        }

      }
    );


    /* =====================================================
       NEW REQUEST
    ====================================================== */

    newRequestBtn.addEventListener(
      "click",
      function () {

        window.location.reload();

      }
    );

  }
);