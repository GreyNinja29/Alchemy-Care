// API Configuration
const BASE_URL = 'http://localhost:8080';

// Frequency Types
const FrequencyType = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY'
};

// Application State
let state = {
  token: null,
  user: null,
  dashboardData: null,
  allMedicines: [],
  isModalOpen: false
};

// Check for existing auth token
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('userName');
  
  if (!token || !user) {
    window.location.href = '/login.html'; // or wherever your login page is
    return false;
  }
  
  state.token = token;
  state.user = JSON.parse(user);
  return true;
}

// API Helper Functions
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function getDashboardData(token) {
  const response = await fetch(`${BASE_URL}/api/user/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

async function getAllMedicines(token) {
  const response = await fetch(`${BASE_URL}/api/medicines/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
}

async function addMedicine(token, medicine) {
  const response = await fetch(`${BASE_URL}/api/medicines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(medicine)
  });
  return handleResponse(response);
}

async function deleteMedicine(token, medicineId) {
  const response = await fetch(`${BASE_URL}/api/medicines/${medicineId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to delete medicine');
  }
}

// Utility Functions
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString();
}

function formatNextDose(isoString) {
  if (!isoString) return 'No upcoming doses';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatFrequency(type, interval) {
  switch (type) {
    case 'HOURLY':
      return `Every ${interval} hour(s)`;
    case 'DAILY':
      return `Every ${interval} day(s)`;
    case 'WEEKLY':
      return `Every ${interval} week(s)`;
    default:
      return 'N/A';
  }
}

// Event Handlers
window.openAddMedicineModal = function() {
  state.isModalOpen = true;
  render();
};

window.closeModal = function() {
  state.isModalOpen = false;
  render();
};

window.handleAddMedicineSubmit = async function(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = {
    medicineName: formData.get('medicineName'),
    dosage: formData.get('dosage'),
    description: formData.get('description'),
    frequencyType: formData.get('frequencyType'),
    frequencyInterval: parseInt(formData.get('frequencyInterval'), 10),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    startTimeOfDay: formData.get('startTimeOfDay')
  };

  try {
    if (!data.endTime) {
      throw new Error('End date is required.');
    }

    const startDateTimeUTC = new Date(`${data.startTime}T${data.startTimeOfDay}:00.000Z`);
    const endDateTimeUTC = new Date(`${data.endTime}T23:59:59.999Z`);

    if (startDateTimeUTC >= endDateTimeUTC) {
      throw new Error('Start date must be before end date.');
    }

    const payload = {
      medicineName: data.medicineName,
      dosage: data.dosage,
      description: data.description,
      frequencyType: data.frequencyType,
      frequencyInterval: data.frequencyInterval,
      startTime: startDateTimeUTC.toISOString(),
      endTime: endDateTimeUTC.toISOString()
    };

    await addMedicine(state.token, payload);
    state.isModalOpen = false;
    await fetchData();
  } catch (err) {
    alert(err.message);
  }
};

window.handleDeleteMedicine = async function(medicineId) {
  if (confirm('Are you sure you want to delete this medicine?')) {
    try {
      await deleteMedicine(state.token, medicineId);
      await fetchData();
    } catch (err) {
      alert(`Error deleting medicine: ${err.message}`);
    }
  }
};

window.handleLogout = function() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = '/login.html';
};

// Data Fetching
async function fetchData() {
  try {
    const [dashData, medData] = await Promise.all([
      getDashboardData(state.token),
      getAllMedicines(state.token)
    ]);
    
    state.dashboardData = dashData;
    state.allMedicines = medData;
    render();
  } catch (err) {
    console.error('Error fetching data:', err);
    alert('Failed to load dashboard data');
  }
}

// Render Functions
function renderDashboard() {
  const data = state.dashboardData;
  
  return `
    <div class="dashboard-container">
      <header>
        <h1>Your Dashboard</h1>
        <div class="header-actions">
          <span>Welcome, ${state.user.userName}</span>
          <button onclick="openAddMedicineModal()">Add Medicine</button>
          <button onclick="handleLogout()">Logout</button>
        </div>
      </header>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Medicines</h3>
          <p>${data?.totalMedicines ?? 0}</p>
        </div>
        <div class="stat-card">
          <h3>Active</h3>
          <p>${data?.activeMedicines ?? 0}</p>
        </div>
        <div class="stat-card">
          <h3>Completed</h3>
          <p>${data?.completedMedicines ?? 0}</p>
        </div>
        <div class="stat-card">
          <h3>Next Dose</h3>
          <p>${formatNextDose(data?.nextDoseTime ?? null)}</p>
        </div>
      </div>
      
      ${renderMedicineList()}
    </div>
  `;
}

function renderMedicineList() {
  const medicines = state.allMedicines;
  
  return `
    <div class="medicine-list">
      <h2>All Medications</h2>
      ${medicines.length === 0 ? 
        '<p>You haven\'t added any medicines yet.</p>' :
        '<table>' +
          '<thead>' +
            '<tr>' +
              '<th>Name</th>' +
              '<th>Dosage</th>' +
              '<th>Frequency</th>' +
              '<th>End Date</th>' +
              '<th>Actions</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            medicines.map(med => 
              '<tr>' +
                '<td>' +
                  '<strong>' + med.medicineName + '</strong>' +
                  '<br><small>' + med.description + '</small>' +
                '</td>' +
                '<td>' + med.dosage + '</td>' +
                '<td>' + formatFrequency(med.frequencyType, med.frequencyInterval) + '</td>' +
                '<td>' + formatDate(med.endTime) + '</td>' +
                '<td>' +
                  '<button onclick="handleDeleteMedicine(' + med.medicineId + ')">Delete</button>' +
                '</td>' +
              '</tr>'
            ).join('') +
          '</tbody>' +
        '</table>'
      }
    </div>
  `;
}

function renderModal() {
  if (!state.isModalOpen) return '';
  
  const today = new Date().toISOString().split('T')[0];
  
  return `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <h2>Add New Medicine</h2>
        <form onsubmit="handleAddMedicineSubmit(event)">
          <div class="form-group">
            <label for="medicineName">Medicine Name *</label>
            <input type="text" name="medicineName" id="medicineName" required />
          </div>
          
          <div class="form-group">
            <label for="dosage">Dosage (e.g., 1 pill, 10mg) *</label>
            <input type="text" name="dosage" id="dosage" required />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" id="description" rows="2"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="frequencyType">Frequency Type *</label>
              <select name="frequencyType" id="frequencyType">
                <option value="HOURLY">Hourly</option>
                <option value="DAILY" selected>Daily</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="frequencyInterval">Interval *</label>
              <input type="number" name="frequencyInterval" id="frequencyInterval" min="1" value="1" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="startTime">Start Date *</label>
              <input type="date" name="startTime" id="startTime" value="${today}" required />
            </div>
            
            <div class="form-group">
              <label for="startTimeOfDay">Time *</label>
              <input type="time" name="startTimeOfDay" id="startTimeOfDay" value="08:00" required />
            </div>
            
            <div class="form-group">
              <label for="endTime">End Date *</label>
              <input type="date" name="endTime" id="endTime" required />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" onclick="closeModal()">Cancel</button>
            <button type="submit">Add Medicine</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = renderDashboard() + renderModal();
}

if (checkAuth()) {
  fetchData();
}