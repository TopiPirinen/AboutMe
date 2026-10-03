/*
 * Portfolio Website
 * -----------------
 * Main JavaScript file.
 *
 * Responsibilities:
 * 1. Load reusable HTML components.
 * 2. Initialize navbar navigation.
 * 3. Initialize the sidebar menu.
 * 4. Initialize the dark/light theme toggle.
 */


/* =========================================================
   COMPONENT LOADING
   ========================================================= */

/**
 * Loads an HTML component and inserts it into the page.
 *
 * @param {string} path - Path to the HTML component.
 * @param {string} elementId - ID of the container element.
 */
async function loadComponent(path, elementId) {
  try {
    const response = await fetch(path);

    // Stop if the server could not load the component.
    if (!response.ok) {
      console.error("Failed to load component:", path);
      return;
    }

    const html = await response.text();

    const container = document.getElementById(elementId);

    if (!container) {
      console.error("Container not found:", elementId);
      return;
    }

    container.innerHTML = html;
  } catch (error) {
    console.error("Error loading component:", path, error);
  }
}


/**
 * Loads all reusable HTML components.
 *
 * Components are loaded in parallel to make page loading faster.
 */
async function loadComponents() {
  await Promise.all([
    loadComponent("components/NavBar.html", "navbar-container"),
    loadComponent("components/SideBar.html", "sidebar-container"),
    loadComponent("components/Hero.html", "hero-container"),
    loadComponent("components/About.html", "about-container"),
    loadComponent("components/Skills.html", "skills-container"),
    loadComponent("components/Footer.html", "footer-container"),
  ]);
}


/* =========================================================
   NAVBAR
   ========================================================= */

/**
 * Initializes navbar links and active section highlighting.
 *
 * The active navigation item changes depending on which
 * section is currently visible in the middle of the screen.
 */
function initNavbar() {
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");

  /**
   * Updates which navbar link is marked as active.
   */
  function updateActiveNav() {
    const viewportMiddle =
      window.scrollY + window.innerHeight / 2;

    let currentSection = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionBottom =
        sectionTop + section.offsetHeight;

      const isVisible =
        viewportMiddle >= sectionTop &&
        viewportMiddle < sectionBottom;

      if (isVisible) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const target = link.getAttribute("href");

      link.classList.toggle(
        "active",
        target === "#" + currentSection
      );
    });
  }

  // Update active link while scrolling or resizing.
  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("resize", updateActiveNav);

  // Set the correct active link when the page first loads.
  updateActiveNav();

  /**
   * Smoothly scrolls to a section when a navbar link is clicked.
   */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return;
      }

      const targetId = href.substring(1);
      const targetSection =
        document.getElementById(targetId);

      if (!targetSection) {
        return;
      }

      // Leave space for the fixed navbar.
      const navbarOffset = 100;

      window.scrollTo({
        top: targetSection.offsetTop - navbarOffset,
        behavior: "smooth",
      });
    });
  });
}


/* =========================================================
   SIDEBAR
   ========================================================= */

/**
 * Initializes the sidebar menu.
 *
 * Handles:
 * - Opening the sidebar
 * - Closing the sidebar
 * - Opening/closing the backdrop
 * - Animating the menu button
 */
function initSidebar() {
  const menuButton =
    document.getElementById("menu-toggle");

  const sidebar =
    document.getElementById("sidebar");

  const backdrop =
    document.getElementById("sidebar-backdrop");

  // Make sure all required elements exist.
  if (!menuButton || !sidebar || !backdrop) {
    console.error("Sidebar elements not found.");
    return;
  }

  /**
   * Opens or closes the sidebar.
   */
  function toggleSidebar() {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("show");
    menuButton.classList.toggle("open");
  }

  /**
   * Closes the sidebar.
   */
  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
    menuButton.classList.remove("open");
  }

  // Menu button opens/closes the sidebar.
  menuButton.addEventListener("click", toggleSidebar);

  // Clicking the backdrop closes the sidebar.
  backdrop.addEventListener("click", closeSidebar);
}


/* =========================================================
   THEME
   ========================================================= */

/**
 * Initializes the dark/light mode toggle.
 *
 * The selected theme is stored in localStorage so the
 * user's preference remains after refreshing the page.
 */
function initTheme() {
  const themeToggle =
    document.getElementById("theme-toggle");

  if (!themeToggle) {
    console.error("Theme toggle not found.");
    return;
  }

  // Load the user's saved theme.
  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme === "light") {
    enableLightMode();
  } else {
    enableDarkMode();
  }

  // Change theme when the toggle is used.
  themeToggle.addEventListener("change", function () {
    if (themeToggle.checked) {
      enableLightMode();
    } else {
      enableDarkMode();
    }
  });


  /**
   * Enables light mode.
   */
  function enableLightMode() {
    document.body.classList.add("light");
    themeToggle.checked = true;

    localStorage.setItem("theme", "light");
  }


  /**
   * Enables dark mode.
   */
  function enableDarkMode() {
    document.body.classList.remove("light");
    themeToggle.checked = false;

    localStorage.setItem("theme", "dark");
  }
}


/* =========================================================
   APPLICATION INITIALIZATION
   ========================================================= */

/**
 * Starts all interactive features after the HTML components
 * have been loaded into the page.
 */
function initApp() {
  initNavbar();
  initSidebar();
  initTheme();
}


/* =========================================================
   PAGE STARTUP
   ========================================================= */

/*
 * Wait until the initial HTML document has loaded.
 *
 * Components must be loaded before initApp() because
 * navbar/sidebar/theme elements do not exist in index.html
 * directly — they are loaded from separate HTML files.
 */
document.addEventListener("DOMContentLoaded", async function () {
  await loadComponents();

  initApp();
});
