function loadNavbar() {
  const navbarContainer = document.getElementById("navbar-container");
  navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="../index.html">
          <img src="../assets/logo.png" width="45" height="45" class="me-2" alt="logo"/>
          <span class="fw-bold">Atyant Loan Solutions</span>
        </a>

        <!-- Correct Bootstrap toggler -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul class="navbar-nav text-center">
            <li class="nav-item"><a class="nav-link" href="../index.html">🏠 Home</a></li>
            <li class="nav-item"><a class="nav-link" href="../apply/apply.html">📝 Apply</a></li>
            <li class="nav-item"><a class="nav-link" href="../about/about.html">ℹ️ About</a></li>
            <li class="nav-item"><a class="nav-link" href="../contact/contact.html">📞 Contact</a></li>
            <li class="nav-item"><a class="nav-link" href="../cal/cal.html">🧮 Calculator</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  // Highlight active link
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll("#navbar-container .nav-link");
  links.forEach(link => {
    if (link.getAttribute("href").includes(currentPage)) {
      link.classList.add("active");
    }
  });
}

function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  footerContainer.innerHTML = `
    <footer class="bg-dark text-white text-center py-4 mt-5">
      <div class="container">
        <h5>Atyant Loan Solutions</h5>
        <p>Office No. 406, 4th Floor, Kaveri Building, Near Sakinaka Metro, Andheri East, Mumbai-400072</p>
        <p><strong>Phone:</strong> +91 7304228389 | <strong>Email:</strong> akram.shaikh@atyantloan.com</p>
        <div class="social-icons mb-3">
          <a href="#" class="text-white mx-2"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-white mx-2"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-white mx-2"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://www.instagram.com/atyantloansolutions/" class="text-white mx-2" target="_blank"><i class="fab fa-instagram"></i></a>
        </div>
        <p>&copy; 2025 Atyant Loan Solutions. All Rights Reserved.</p>
      </div>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  loadFooter();
});
