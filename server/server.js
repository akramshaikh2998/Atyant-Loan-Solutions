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


    verifyOtpBtn.disabled =
      true;

    verifyOtpBtn.innerHTML =
      `
      Verifying
      <i class="fa-solid fa-spinner fa-spin"></i>
      `;


    try {

      const response =
        await fetch(
          "http://localhost:3000/api/cibil/verify-otp",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              mobile:
                verifiedMobile,

              otp:
                otpValue

            })
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        showError(
          "otpError",
          data.message ||
            "Invalid OTP."
        );

        return;

      }


      updateProgress(2);

      showPanel(
        step2
      );

    }

    catch (error) {

      console.error(error);

      showError(
        "otpError",
        "Unable to connect to verification server."
      );

    }

    finally {

      verifyOtpBtn.disabled =
        false;

      verifyOtpBtn.innerHTML =
        `
        Verify OTP
        <i class="fa-solid fa-arrow-right"></i>
        `;

    }

  }
);