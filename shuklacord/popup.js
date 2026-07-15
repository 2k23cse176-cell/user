const SERVER_URL = 'http://localhost:3000';
let currentGain = 2500;

// Check server connection on load
document.addEventListener('DOMContentLoaded', () => {
  const gainSlider = document.getElementById('gainSlider');
  const gainDisplay = document.getElementById('gainDisplay');
  
  // Load saved gain value
  chrome.storage.local.get(['audioGain'], (result) => {
    if (result.audioGain) {
      currentGain = result.audioGain;
      gainSlider.value = currentGain;
      updateDisplay();
    }
  });

  // Update display when slider changes
  gainSlider.addEventListener('input', (e) => {
    currentGain = parseFloat(e.target.value);
    updateDisplay();
  });

  // Check server status
  checkServerStatus();
  setInterval(checkServerStatus, 3000);
});

function updateDisplay() {
  const gainDisplay = document.getElementById('gainDisplay');
  gainDisplay.textContent = currentGain.toFixed(1) + 'x';
}

function setGain(value) {
  const gainSlider = document.getElementById('gainSlider');
  currentGain = value;
  gainSlider.value = value;
  updateDisplay();
}

async function applyGain() {
  const statusMessage = document.getElementById('statusMessage');
  
  try {
    const response = await fetch(`${SERVER_URL}/audio/volume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volume: currentGain })
    });

    if (response.ok) {
      const data = await response.json();
      showStatus(`✅ Gain Applied: ${currentGain.toFixed(1)}x`, 'success');
      
      // Save to storage
      chrome.storage.local.set({ audioGain: currentGain });
    } else {
      showStatus('❌ Failed to apply gain', 'error');
    }
  } catch (error) {
    showStatus('❌ Server not responding', 'error');
  }
}

function resetGain() {
  setGain(2500);
  applyGain();
}

function showStatus(message, type) {
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
  statusMessage.style.display = 'block';
  
  setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 3000);
}

async function checkServerStatus() {
  try {
    const response = await fetch(`${SERVER_URL}/status`, { method: 'GET' });
    if (response.ok) {
      document.getElementById('statusDot').className = 'status-dot connected';
      document.getElementById('statusText').textContent = 'Connected ✓';
    } else {
      setDisconnected();
    }
  } catch (error) {
    setDisconnected();
  }
}

function setDisconnected() {
  document.getElementById('statusDot').className = 'status-dot';
  document.getElementById('statusText').textContent = 'Not Connected';
}
