async function loadComponent(path, elementId) {
  try {
    const response = await fetch(path);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${path}:`, error);
  }
}

// Load all components
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("components/NavBar.html", "navbar-container"),
    loadComponent("components/SideBar.html", "sidebar-container"),
    loadComponent("components/Hero.html", "hero-container"),
    loadComponent("components/About.html", "about-container"),
    loadComponent("components/Skills.html", "skills-container"),
  ]);

  initApp(); // 🔥 everything starts here
});

function initApp() {
  // Navbar active highlight
  // Navbar active highlight using viewport midpoint
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");

  function updateActiveNav() {
    const scrollMiddle = window.scrollY + window.innerHeight / 2; // middle of viewport
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      // If viewport middle is inside this section, mark it active
      if (scrollMiddle >= sectionTop && scrollMiddle < sectionBottom) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current)
        link.classList.add("active");
    });
  }

  // Listen to scroll and resize
  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);
  updateActiveNav(); // initial check

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      const offset = 100; // navbar + padding
      window.scrollTo({
        top: targetSection.offsetTop - offset,
        behavior: "smooth",
      });
    });
  });

  // Sidebar toggle
  const menuBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");

  // Toggle open/close
  function toggleSidebar() {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("show");
    menuBtn.classList.toggle("open");
  }

  menuBtn.addEventListener("click", toggleSidebar);

  // Click outside to close
  backdrop.addEventListener("click", () => {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
    menuBtn.classList.remove("open");
  });

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");

  // Load saved theme
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  });

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
      themeLabel.textContent = "☀️ Light Mode";
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
      themeLabel.textContent = "🌙 Dark Mode";
    }
  });
}
