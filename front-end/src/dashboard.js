
const token = localStorage.getItem('token');

const baseUrl = 'http://localhost:8080';

async function loadDashboard() {
  try {
    const response = await fetch(`${baseUrl}/user/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();
    
    document.getElementById("welcomeText").innerText = `Welcome`;

    const dataResp = await fetch(`${baseUrl}/dashboard/data`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const secureData = await dataResp.json();
    document.getElementById("dataOutput").innerText = JSON.stringify(secureData, null, 2);
    
  } catch (err) {
    console.error("Error loading dashboard:", err);
    alert("Session expired or server error.");
    localStorage.removeItem('token');
    window.location.href = "login.html";
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem('token');
  window.location.href = "login.html";
});

loadDashboard();

