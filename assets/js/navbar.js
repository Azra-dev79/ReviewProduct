document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbarApp");
  if (!navbar) return;

  const currentPage = getCurrentPage();
  const user = Session.get();

  // Menu untuk user biasa (guest/non-admin)
  const guestMenus = [
    {
      label: "Produk",
      href: "index.html",
      icon: "fa-box-open",
      match: ["", "index.html"],
    },
    // {
    //   label: "Beri Review",
    //   href: "review.html",
    //   icon: "fa-star-half-alt",
    //   match: ["review.html"],
    // },
  ];

  // Menu untuk admin
  const adminMenus = [
    {
      label: "Dashboard",
      href: "admin-dashboard.html",
      icon: "fa-tachometer-alt",
      match: ["admin-dashboard.html"],
    },
    {
      label: "Produk",
      href: "admin-products.html",
      icon: "fa-box",
      match: ["admin-products.html"],
    },
    {
      label: "Ulasan",
      href: "admin-reviews.html",
      icon: "fa-star",
      match: ["admin-reviews.html"],
    },
    {
      label: "Upload Produk",
      href: "admin-upload.html",
      icon: "fa-plus-circle",
      match: ["admin-upload.html"],
    },
  ];

  // Pilih menu berdasarkan role user
  let menus = [];
  let isAdmin = false;
  let isLoggedIn = false;

  if (user) {
    isLoggedIn = true;
    if (user.role === "admin") {
      menus = adminMenus;
      isAdmin = true;
    } else {
      menus = guestMenus;
    }
  } else {
    // Guest / belum login
    menus = guestMenus;
  }

  navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-glass fixed-top py-3">
      <div class="container px-3 px-lg-4">
        <a href="${isAdmin ? 'admin-dashboard.html' : 'index.html'}" class="navbar-brand d-flex align-items-center gap-2">
          <div class="brand-logo">
            <i class="fas fa-star-of-life"></i>
          </div>
          <span class="brand-gradient">ReviewProduct</span>
          ${isAdmin ? '<span class="admin-badge ms-2">Admin</span>' : ''}
        </a>

        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
          <i class="fas fa-bars fs-4"></i>
        </button>

        <div id="navbarMenu" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto gap-lg-2 mt-3 mt-lg-0">
            ${menus.map(menu => renderNavItem(menu, currentPage)).join("")}
            ${renderUserMenu(user)}
          </ul>
        </div>
      </div>
    </nav>
  `;

  injectNavbarStyles();
  attachScrollListener();
  initBootstrapDropdown();
});

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);
  return page || "index.html";
}

function renderNavItem(menu, currentPage) {
  const isActive = menu.match.includes(currentPage);
  return `
    <li class="nav-item">
      <a class="nav-link nav-link-modern ${isActive ? "active" : ""}" href="${menu.href}">
        <i class="fas ${menu.icon} me-2"></i>
        <span>${escapeHtml(menu.label)}</span>
      </a>
    </li>
  `;
}

function renderUserMenu(user) {
  if (!user) {
    // Guest / belum login
    return `
      <li class="nav-item">
        <a class="nav-link nav-link-modern" href="login.html">
          <i class="fas fa-right-to-bracket me-2"></i>
          <span>Login</span>
        </a>
      </li>
    `;
  }

  // User sudah login
  const avatarText = user.nama ? user.nama.charAt(0).toUpperCase() : "U";
  const roleColor = user.role === "admin" ? "#2563eb" : "#10b981";
  const isAdmin = user.role === "admin";

  return `
    <li class="nav-item dropdown">
      <a class="nav-link nav-link-modern dropdown-toggle d-flex align-items-center gap-2" href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false">
        <div class="user-avatar" style="background: ${roleColor}">
          ${escapeHtml(avatarText)}
        </div>
        <span class="d-none d-lg-inline">${escapeHtml(user.nama)}</span>
      </a>
      <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4 mt-2">
        <li>
          <div class="px-3 py-2">
            <div class="fw-semibold">${escapeHtml(user.nama)}</div>
            <small class="text-muted">${escapeHtml(user.email || 'user@example.com')}</small>
          </div>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <span class="dropdown-item-text">
            <i class="fas fa-shield-alt me-2 ${isAdmin ? 'text-primary' : 'text-success'}"></i>
            Role : <strong class="text-capitalize">${escapeHtml(user.role)}</strong>
          </span>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <button class="dropdown-item text-danger" onclick="handleLogout()">
            <i class="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </li>
      </ul>
    </li>
  `;
}

// Fungsi logout global
window.handleLogout = function() {
  Swal.fire({
    title: 'Yakin ingin logout?',
    text: "Anda akan keluar dari akun ini.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Logout!',
    cancelButtonText: 'Batal',
    borderRadius: '20px'
  }).then((result) => {
    if (result.isConfirmed) {
      Session.remove();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Logout!',
        text: 'Anda telah keluar dari aplikasi.',
        timer: 1500,
        showConfirmButton: false,
        borderRadius: '20px'
      }).then(() => {
        window.location.href = "login.html";
      });
    }
  });
};

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function initBootstrapDropdown() {
  // Trigger Bootstrap dropdown initialization
  const dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
  if (dropdownElementList.length > 0 && typeof bootstrap !== 'undefined') {
    dropdownElementList.map(function(dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl);
    });
  }
}

function injectNavbarStyles() {
  if (document.getElementById("navbar-styles")) return;

  const style = document.createElement("style");
  style.id = "navbar-styles";
  style.textContent = `
    /* Body padding for fixed navbar */
    body {
      padding-top: 84px;
    }
    
    @media (max-width: 991.98px) {
      body {
        padding-top: 72px;
      }
    }

    /* Navbar Glassmorphism Modern */
    .navbar-glass {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      padding: 1rem 0;
    }

    .navbar-glass.scrolled {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      padding: 0.6rem 0;
    }

    .navbar-glass.scrolled .brand-logo {
      width: 32px;
      height: 32px;
      font-size: 0.9rem;
    }

    .navbar-glass.scrolled .brand-gradient {
      font-size: 1.15rem;
    }

    .navbar-glass.scrolled .admin-badge {
      font-size: 0.65rem;
      padding: 0.2rem 0.6rem;
    }

    /* Brand Logo */
    .brand-logo {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.1rem;
      box-shadow: 0 6px 12px -6px rgba(15, 23, 42, 0.3);
      transition: all 0.25s ease;
    }

    .navbar-brand:hover .brand-logo {
      transform: scale(1.02) rotate(5deg);
      background: linear-gradient(135deg, #1e293b, #0f172a);
    }

    .brand-gradient {
      background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      font-weight: 800;
      letter-spacing: -0.3px;
      font-size: 1.25rem;
      transition: all 0.25s ease;
    }

    /* Admin Badge */
    .admin-badge {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 30px;
      letter-spacing: -0.2px;
      transition: all 0.25s ease;
    }

    /* User Avatar */
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .nav-link-modern:hover .user-avatar {
      transform: scale(1.05);
    }

    /* Navbar Toggler */
    .navbar-toggler {
      background: #f1f5f9;
      border-radius: 14px;
      padding: 0.5rem 0.9rem;
      transition: all 0.2s;
      border: none;
    }

    .navbar-toggler:hover {
      background: #e2e8f0;
    }

    .navbar-toggler i {
      color: #1e293b;
    }

    .navbar-toggler:focus {
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
      outline: none;
    }

    /* Nav Link Modern */
    .nav-link-modern {
      padding: 0.6rem 1.2rem;
      border-radius: 60px;
      font-weight: 600;
      font-size: 0.9rem;
      color: #475569;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }

    .nav-link-modern i {
      font-size: 0.95rem;
      transition: transform 0.15s ease, color 0.2s;
    }

    .nav-link-modern:hover {
      background: #f1f5f9;
      color: #0f172a;
      transform: translateY(-1px);
    }

    .nav-link-modern:hover i {
      transform: scale(1.08);
      color: #2563eb;
    }

    /* Active State - Gradient Biru Modern */
    .nav-link-modern.active {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      box-shadow: 0 6px 14px -4px rgba(37, 99, 235, 0.4);
    }

    .nav-link-modern.active i {
      color: white;
    }

    .nav-link-modern.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 3px;
      background: white;
      border-radius: 3px;
      opacity: 0.7;
    }

    /* Dropdown Menu Modern */
    .dropdown-menu {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 20px !important;
      padding: 0.5rem;
      min-width: 240px;
      animation: fadeInDown 0.2s ease;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-item {
      border-radius: 14px;
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
      transition: all 0.15s;
    }

    .dropdown-item:hover {
      background: #f1f5f9;
    }

    .dropdown-item.text-danger:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .dropdown-divider {
      margin: 0.4rem 0;
    }

    /* Dropdown Toggle Custom */
    .dropdown-toggle::after {
      margin-left: 8px;
      vertical-align: middle;
    }

    /* Responsive */
    @media (max-width: 991.98px) {
      .navbar-glass {
        padding: 0.75rem 0;
      }
      
      .navbar-glass.scrolled {
        padding: 0.5rem 0;
      }

      .nav-link-modern {
        justify-content: center;
        padding: 0.75rem 1rem;
        margin: 0.25rem 0;
      }
      
      .nav-link-modern.active::after {
        display: none;
      }
      
      .navbar-nav {
        padding: 0.75rem 0;
      }
      
      .dropdown-menu {
        background: white;
        margin-top: 0.5rem !important;
      }
      
      .user-avatar {
        width: 36px;
        height: 36px;
        font-size: 0.9rem;
      }
    }

    /* Desktop */
    @media (min-width: 992px) {
      .navbar-glass.scrolled .nav-link-modern {
        padding: 0.5rem 1.1rem;
      }
    }
  `;

  document.head.appendChild(style);
}

function attachScrollListener() {
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar-glass");
    if (navbar) {
      if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });
  
  window.dispatchEvent(new Event("scroll"));
}