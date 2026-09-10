const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("menu-open");
  menuToggle.classList.toggle("menu-active");
  
  const isOpen = navigation.classList.contains("menu-open");
  
  menuToggle.setAttribute("aria-expanded", isOpen);
});

function navigations(key) {
  if (key === '') {
    window.location = '/index.html'
  }
  
  else if (key === '') {
    
  }
  
  else {
    alert('Invalid command')
  }
}

function getWithExpiry() {
  
  const signInTime = localStorage.getItem('logInTime')
  
  if (signInTime) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - Number(signInTime);
    
    if (elapsedTime >= 5400000000) {
      localStorage.removeItem("Authenticated user");
      localStorage.removeItem("logInTime");
      
      console.log("Login session expired");
    }
  }
}

getWithExpiry()

const loggedInUser = localStorage.getItem('Authenticated user')
const signUp = document.querySelectorAll('.signUp')
const explore = document.getElementById('explore')

if (loggedInUser) {

  signUp.forEach(x => {
    x.style.display = 'none';
  });

  if (explore) {
    explore.style.display = 'flex';
  }

} else {

  console.log('User not logged in');

}