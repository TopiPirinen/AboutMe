async function loadComponent(path, elementId) {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      console.error("Failed to load " + path);
      return;
    }

    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error("Failed to load component:", path, error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await Promise.all([
    loadComponent("components/NavBar.html", "navbar-container"),
    loadComponent("components/SideBar.html", "sidebar-container"),
    loadComponent("components/Hero.html", "hero-container"),
    loadComponent("components/About.html", "about-container"),
    loadComponent("components/Skills.html", "skills-container"),
    loadComponent("components/Footer.html", "footer-container"),
  ]);

  initApp();
});

function initApp() {
  // ================= NAVBAR =================

  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");

  function updateActiveNav() {
    const scrollMiddle =
      window.scrollY + window.innerHeight / 2;

    let current = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionBottom =
        sectionTop + section.offsetHeight;

      if (
        scrollMiddle >= sectionTop &&
        scrollMiddle < sectionBottom
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");

      if (
        link.getAttribute("href") === "#" + current
      ) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

  updateActiveNav();

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const href = link.getAttribute("href");

      if (!href) {
        return;
      }

      const targetId = href.substring(1);
      const targetSection =
        document.getElementById(targetId);

      if (!targetSection) {
        return;
      }

      const offset = 100;

      window.scrollTo({
        top: targetSection.offsetTop - offset,
        behavior: "smooth",
      });
    });
  });

  // ================= SIDEBAR =================

  const menuBtn =
    document.getElementById("menu-toggle");

  const sidebar =
    document.getElementById("sidebar");

  const backdrop =
    document.getElementById("sidebar-backdrop");

  if (menuBtn && sidebar && backdrop) {
    menuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show");
      menuBtn.classList.toggle("open");
    });

    backdrop.addEventListener("click", function () {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
      menuBtn.classList.remove("open");
    });
  }

  // ================= THEME =================

  const themeToggle =
    document.getElementById("theme-toggle");

  if (themeToggle) {
    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light");
      themeToggle.checked = true;
    } else {
      document.body.classList.remove("light");
      themeToggle.checked = false;
    }

    // Toggle theme
    themeToggle.addEventListener("change", function () {
      if (themeToggle.checked) {
        document.body.classList.add("light");
        localStorage.setItem("theme", "light");
      } else {
        document.body.classList.remove("light");
        localStorage.setItem("theme", "dark");
      }
    });
  }
}
