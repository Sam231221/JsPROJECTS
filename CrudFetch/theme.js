export function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function setTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
  }

  // Check for saved theme preference or use the system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDarkScheme.matches) {
    setTheme("dark");
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    setTheme(isDark ? "dark" : "light");
  });

  // Listen for changes in system color scheme
  prefersDarkScheme.addEventListener("change", (e) => {
    setTheme(e.matches ? "dark" : "light");
  });
}
