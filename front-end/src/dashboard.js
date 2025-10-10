import './style.css';

// Check auth
const token = localStorage.getItem('token');
const userName = localStorage.getItem('userName');

if (!token) {
  window.location.href = 'login.html';
} else {
  document.querySelector('#app').innerHTML = `
    <div id="mySidenav" class="sidenav">
        <h1>Alchemy Care</h1>
        <hr>
        <p>Welcome, ${userName}</p>
        <a href="#">Dashboard</a>
        <a href="#">Schedule</a>
        <a href="#">Medicines</a>
        <a href="#">Account</a>
        <a href="#" id="logout">Logout</a>
    </div>
  `;
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'logout') {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
  }
});
