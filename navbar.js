// =================== Navbar ===================
function loadNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="../index.html">
          <img src="../assets/logo.png" width="50" height="50" class="me-2"/>
          <span>Atyant Loan Solutions</span>
        </a>
        <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
          <span class="navbar-toggler-icon"><div></div></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto">
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
  const links = document.querySelectorAll("#navbar-container .nav-link");
  links.forEach(link => {
    if (link.href === window.location.href) link.classList.add("active");
  });
}

// =================== Footer ===================
function loadFooter() {
  const footerContainer = document.getElementById('footer-container');
  footerContainer.innerHTML = `
    <footer class="bg-dark text-white text-center py-4">
      <div class="container">
        <h5>Atyant Loan Solutions</h5>
        <p>Office No. 406, 4th Floor, Kaveri Building, Near Sakinaka Metro, Andheri East, Mumbai-400072</p>
        <p><strong>Phone:</strong> +91 7304228389 | <strong>Email:</strong> akram.shaikh@atyantloan.com</p>
        <div class="social-icons mb-3">
          <a href="#" target="_blank"><i class="fab fa-facebook-f"></i></a>
          <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
          <a href="#" target="_blank"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://www.instagram.com/atyantloansolutions/" target="_blank"><i class="fab fa-instagram"></i></a>
        </div>
        <p>&copy; 2025 Atyant Loan Solutions. All Rights Reserved.</p>
      </div>
    </footer>
  `;
}

// =================== Initialize ===================
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
});
