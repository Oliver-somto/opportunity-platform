const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("menu-open");
  menuToggle.classList.toggle("menu-active");

  const isOpen = navigation.classList.contains("menu-open");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

function navigations(key) {
  if (key === 'logo') {
    window.location = '/index.html'
  }
  
  else if (key === '') {
    
  }
  
  else {
    alert('Invalid command')
  }
}