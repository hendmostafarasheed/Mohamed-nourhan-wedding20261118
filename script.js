const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");

openBtn?.addEventListener("click", () => {
  cover.style.display = "none";
  invitation.classList.remove("hidden");
  window.scrollTo({top:0, behavior:"smooth"});
});

const weddingDate = new Date("2026-11-18T19:00:00+02:00").getTime();
function updateCountdown(){
  const now = Date.now();
  let diff = weddingDate - now;
  if(diff < 0) diff = 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById("days").textContent = String(days).padStart(2,"0");
  document.getElementById("hours").textContent = String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
function updateMusicButton() {
  if (!musicToggle || !bgMusic) return;
  const playing = !bgMusic.paused;
  musicToggle.textContent = playing ? "♫" : "▶";
  musicToggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  musicToggle.title = playing ? "Pause music" : "Play music";
  musicToggle.classList.toggle("playing", playing);
}
openBtn?.addEventListener("click", async () => {
  if (!bgMusic) return;
  try { await bgMusic.play(); } catch (e) {}
  updateMusicButton();
});
musicToggle?.addEventListener("click", async () => {
  if (!bgMusic) return;
  if (bgMusic.paused) { try { await bgMusic.play(); } catch (e) {} }
  else bgMusic.pause();
  updateMusicButton();
});
bgMusic?.addEventListener("play", updateMusicButton);
bgMusic?.addEventListener("pause", updateMusicButton);

// Shared click counter: stores only the total number of confirmations.
// No names, forms, or personal details are collected.
const confirmAttendanceBtn = document.getElementById("confirmAttendanceBtn");
const attendanceCount = document.getElementById("attendanceCount");
const rsvpNote = document.getElementById("rsvpNote");
const COUNTER_NS = "muhammed-nourhan-wedding-2026";
const COUNTER_ACTION = "attendance";
const COUNTER_KEY = "confirmed-attendance";
const counterUrl = (readOnly = false) => {
  const url = `https://counterapi.com/api/${encodeURIComponent(COUNTER_NS)}/${COUNTER_ACTION}/${COUNTER_KEY}`;
  return readOnly ? `${url}?readOnly=true` : url;
};

async function loadAttendanceCount() {
  if (!attendanceCount) return;
  try {
    const response = await fetch(counterUrl(true), {cache:"no-store"});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    attendanceCount.textContent = Number(data.value || 0).toLocaleString();
  } catch (error) {
    console.error("Attendance counter read error:", error);
    attendanceCount.textContent = "0";
  }
}

confirmAttendanceBtn?.addEventListener("click", async () => {
  if (confirmAttendanceBtn.disabled) return;
  confirmAttendanceBtn.disabled = true;
  confirmAttendanceBtn.textContent = "✓ Confirming...";
  try {
    const response = await fetch(counterUrl(false), {cache:"no-store"});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    attendanceCount.textContent = Number(data.value || 0).toLocaleString();
    confirmAttendanceBtn.textContent = "✓ Confirmed";
    rsvpNote.textContent = "Thank you! Your attendance has been counted ♥";
  } catch (error) {
    console.error("Attendance counter increment error:", error);
    confirmAttendanceBtn.disabled = false;
    confirmAttendanceBtn.textContent = "♥ Confirm Attendance";
    rsvpNote.textContent = "Please try again in a moment.";
  }
});

loadAttendanceCount();
