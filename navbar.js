/* =========================================================
   ATYANT LOAN SOLUTIONS
   SHARED NAVBAR
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadNavbar();

  }
);


/* =========================================================
   DETERMINE PAGE DEPTH
========================================================= */

function getBasePath() {

  const path =
    window.location.pathname;


  const cleanPath =
    path
      .split("?")[0]
      .split("#")[0];


  const parts =
    cleanPath
      .split("/")
      .filter(Boolean);


  /*
    ROOT:

    /index.html

    returns:

    /
  */

  if (parts.length <= 1) {

    return "/";

  }


  /*
    FOLDER:

    /apply/apply.html

    returns:

    /
  */

  return "/";

}


/* =========================================================
   LOAD NAVBAR CSS
========================================================= */

function loadNavbarCSS() {

  /*
    Prevent loading the CSS more than once.
  */

  if (
    document.getElementById(
      "atyant-navbar-css"
    )
  ) {

    return;

  }


  const link =
    document.createElement(
      "link"
    );


  link.id =
    "atyant-navbar-css";


  link.rel =
    "stylesheet";


  link.href =
    "/navbar.css";


  document.head.appendChild(
    link
  );

}


/* =========================================================
   LOAD NAVBAR
========================================================= */

async function loadNavbar() {

  const container =
    document.getElementById(
      "navbar-container"
    );


  if (!container) {

    console.warn(
      "navbar-container was not found."
    );

    return;

  }


  /*
    Load navbar CSS.
  */

  loadNavbarCSS();


  try {

    const response =
      await fetch(
        "/navbar.html",
        {
          cache: "no-cache"
        }
      );


    if (!response.ok) {

      throw new Error(
        "Navbar HTML could not be loaded. Status: " +
        response.status
      );

    }


    const html =
      await response.text();


    container.innerHTML =
      html;


    initializeNavbar();


  } catch (error) {

    console.error(
      "Atyant Navbar Error:",
      error
    );


    container.innerHTML = `

      <div class="navbar-error">

        Navigation could not be loaded.

      </div>

    `;

  }

}


/* =========================================================
   INITIALIZE NAVBAR
========================================================= */

function initializeNavbar() {

  const navbar =
    document.getElementById(
      "atyantNavbar"
    );


  if (!navbar) {

    console.error(
      "atyantNavbar was not found."
    );

    return;

  }


  /* =======================================================
     SCROLL EFFECT
  ======================================================== */

  function handleScroll() {

    if (
      window.scrollY > 15
    ) {

      navbar.classList.add(
        "navbar-scrolled"
      );

    } else {

      navbar.classList.remove(
        "navbar-scrolled"
      );

    }

  }


  window.addEventListener(
    "scroll",
    handleScroll
  );


  handleScroll();


  /* =======================================================
     ACTIVE PAGE
  ======================================================== */

  const currentPath =
    window.location.pathname
      .toLowerCase()
      .replace(
        /\/$/,
        ""
      );


  const links =
    navbar.querySelectorAll(
      ".atyant-nav-link, .atyant-login-btn"
    );


  links.forEach(
    function (link) {

      const href =
        link.getAttribute(
          "href"
        );


      if (!href) {

        return;

      }


      try {

        const linkPath =
          new URL(
            href,
            window.location.origin
          )
            .pathname
            .toLowerCase()
            .replace(
              /\/$/,
              ""
            );


        if (
          linkPath === currentPath
        ) {

          link.classList.add(
            "active"
          );

        }

      } catch (error) {

        console.warn(
          "Navbar link error:",
          href
        );

      }

    }
  );


  /* =======================================================
     MOBILE MENU
  ======================================================== */

  const menu =
    document.getElementById(
      "atyantNavbarMenu"
    );


  if (!menu) {

    return;

  }


  const menuLinks =
    menu.querySelectorAll(
      "a"
    );


  menuLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          if (
            window.innerWidth < 992
          ) {

            if (
              typeof bootstrap !==
              "undefined"
            ) {

              const collapse =
                bootstrap.Collapse
                  .getInstance(
                    menu
                  );


              if (collapse) {

                collapse.hide();

              }

            }

          }

        }
      );

    }
  );

}