
const baseUrl = 'http://localhost:8080';

const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      alert('Invalid credentials');
      return;
    }

    const data = await res.json();
  
    localStorage.setItem('token', data.jwtToken);
    localStorage.setItem('userName', data.userName);

    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    alert('Something went wrong. Please check console');
  }
});
