function toggleMenu(menuId, clickedButton) {
  document.querySelectorAll(".menu-content").forEach((menu) => {
    menu.style.display = "none";
  });

  requestAnimationFrame(() => {
    const selectedMenu = document.getElementById(menuId);
    selectedMenu.style.display = "block";
  });

  document.querySelectorAll(".admin-button").forEach((button) => {
    button.classList.remove("selected");
  });

  clickedButton.classList.add("selected");
}
