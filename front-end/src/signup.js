const baseUrl = 'https://your-backend-url.com';

document.querySelector('#signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userName = document.querySelector('#userName').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const res = await fetch(`${baseUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, email, password })
    });

    if (!res.ok) {
      alert('Signup failed');
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.jwtToken);
    localStorage.setItem('userName', data.userName);

    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
  }
});
