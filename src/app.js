import "./styles.css";

const STORAGE_KEY = "anipulse-library-v1";

const futureDate = (days, hours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours, 0, 0, 0);
  return date.toISOString();
};

const demoLibrary = [
  {
    id: crypto.randomUUID(),
    title: "Frieren: Beyond Journey's End",
    status: "watching",
    currentEpisode: 18,
    totalEpisodes: 28,
    nextRelease: futureDate(2, 4),
    image: "",
    color: "#8f73ff"
  },
  {
    id: crypto.randomUUID(),
    title: "Solo Leveling",
    status: "watching",
    currentEpisode: 7,
    totalEpisodes: 12,
    nextRelease: futureDate(0, 8),
    image: "",
    color: "#2ec5ce"
  },
  {
    id: crypto.randomUUID(),
    title: "Attack on Titan",
    status: "completed",
    currentEpisode: 87,
    totalEpisodes: 87,
    nextRelease: "",
    image: "",
    color: "#ff6b43"
  }
];

const elements = {
  grid: document.querySelector("#animeGrid"),
  empty: document.querySelector("#emptyState"),
  template: document.querySelector("#animeCardTemplate"),
  dialog: document.querySelector("#animeDialog"),
  form: document.querySelector("#animeForm"),
  formError: document.querySelector("#formError"),
  search: document.querySelector("#searchInput"),
  filters: document.querySelector("#filterRow"),
  toast: document.querySelector("#toast"),
  notificationButton: document.querySelector("#notificationButton")
};

let library = loadLibrary();
let activeFilter = "all";
let searchTerm = "";
let toastTimer;

function loadLibrary() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : demoLibrary;
  } catch {
    return demoLibrary;
  }
}

function saveLibrary() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
}

function escapeText(value) {
  const node = document.createElement("span");
  node.textContent = value;
  return node.textContent;
}

function statusLabel(status) {
  return ({ watching: "Watching", completed: "Completed", planned: "Planned", paused: "Paused" })[status] || status;
}

function releaseDetails(dateString) {
  if (!dateString) return { short: "No upcoming release", long: "Release schedule unavailable", milliseconds: Infinity };
  const date = new Date(dateString);
  const difference = date.getTime() - Date.now();
  if (difference <= 0) return { short: "Available now", long: "A new episode may be available", milliseconds: difference };
  const hours = Math.floor(difference / 3_600_000);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const short = days > 0 ? `${days}d ${remainingHours}h` : `${Math.max(1, hours)}h`;
  const formatted = new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }).format(date);
  return { short, long: `Next episode · ${formatted}`, milliseconds: difference };
}

function render() {
  const visible = library.filter((anime) => {
    const matchesFilter = activeFilter === "all" || anime.status === activeFilter;
    const matchesSearch = anime.title.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  elements.grid.replaceChildren();
  visible.forEach((anime) => elements.grid.append(createCard(anime)));
  elements.empty.hidden = visible.length > 0;
  elements.grid.hidden = visible.length === 0;
  renderStats();
}

function createCard(anime) {
  const card = elements.template.content.firstElementChild.cloneNode(true);
  const progress = Math.min(100, Math.round((anime.currentEpisode / anime.totalEpisodes) * 100));
  const release = releaseDetails(anime.nextRelease);
  card.style.setProperty("--accent", anime.color || "#ff6b43");
  card.dataset.id = anime.id;
  card.querySelector("h3").textContent = escapeText(anime.title);
  card.querySelector(".status-badge").textContent = statusLabel(anime.status);
  card.querySelector(".episode-label").textContent = `Episode ${anime.currentEpisode} of ${anime.totalEpisodes}`;
  card.querySelector(".episode-percent").textContent = `${progress}%`;
  card.querySelector(".progress-track span").style.width = `${progress}%`;
  card.querySelector(".release-copy").innerHTML = anime.nextRelease
    ? `<strong>${release.short}</strong> · ${release.long}`
    : release.long;

  const image = card.querySelector("img");
  if (anime.image) {
    image.src = anime.image;
    image.alt = `${anime.title} poster`;
    image.addEventListener("error", () => image.remove());
  } else {
    image.remove();
  }

  const initials = anime.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  card.querySelector(".poster-fallback span").textContent = initials;
  const decrease = card.querySelector(".decrease");
  const increase = card.querySelector(".increase");
  const next = card.querySelector(".continue-button");
  decrease.disabled = anime.currentEpisode <= 0;
  increase.disabled = anime.currentEpisode >= anime.totalEpisodes;
  next.disabled = anime.currentEpisode >= anime.totalEpisodes;
  next.textContent = anime.currentEpisode >= anime.totalEpisodes ? "Completed" : "Mark next episode";

  decrease.addEventListener("click", () => updateEpisode(anime.id, -1));
  increase.addEventListener("click", () => updateEpisode(anime.id, 1));
  next.addEventListener("click", () => updateEpisode(anime.id, 1));
  card.querySelector(".delete-button").addEventListener("click", () => removeAnime(anime.id));
  return card;
}

function renderStats() {
  const counts = {
    watching: library.filter((item) => item.status === "watching").length,
    completed: library.filter((item) => item.status === "completed").length,
    planned: library.filter((item) => item.status === "planned").length,
    paused: library.filter((item) => item.status === "paused").length
  };
  const watched = library.reduce((sum, item) => sum + Number(item.currentEpisode), 0);
  const next = library
    .map((item) => releaseDetails(item.nextRelease))
    .filter((release) => release.milliseconds > 0)
    .sort((a, b) => a.milliseconds - b.milliseconds)[0];

  document.querySelector("#watchingStat").textContent = counts.watching;
  document.querySelector("#completedStat").textContent = counts.completed;
  document.querySelector("#episodesStat").textContent = watched.toLocaleString();
  document.querySelector("#nextDropStat").textContent = next?.short || "—";
  document.querySelector("#allCount").textContent = library.length;
  document.querySelector("#watchingCount").textContent = counts.watching;
  document.querySelector("#completedCount").textContent = counts.completed;
  document.querySelector("#plannedCount").textContent = counts.planned;
  document.querySelector("#pausedCount").textContent = counts.paused;
}

function updateEpisode(id, amount) {
  const anime = library.find((item) => item.id === id);
  if (!anime) return;
  anime.currentEpisode = Math.max(0, Math.min(anime.totalEpisodes, anime.currentEpisode + amount));
  if (anime.currentEpisode === anime.totalEpisodes) anime.status = "completed";
  else if (amount > 0 && anime.status !== "watching") anime.status = "watching";
  saveLibrary();
  render();
  showToast(amount > 0 ? `Episode ${anime.currentEpisode} marked watched` : `Progress moved back to episode ${anime.currentEpisode}`);
}

function removeAnime(id) {
  const anime = library.find((item) => item.id === id);
  if (!anime || !window.confirm(`Remove “${anime.title}” from your library?`)) return;
  library = library.filter((item) => item.id !== id);
  saveLibrary();
  render();
  showToast(`${anime.title} removed`);
}

function openDialog() {
  elements.form.reset();
  elements.formError.textContent = "";
  elements.dialog.showModal();
  setTimeout(() => elements.form.elements.title.focus(), 50);
}

function closeDialog() {
  elements.dialog.close();
}

function addAnime(event) {
  event.preventDefault();
  const data = new FormData(elements.form);
  const total = Number(data.get("totalEpisodes"));
  const current = Number(data.get("currentEpisode"));
  if (current > total) {
    elements.formError.textContent = "Episode reached cannot be greater than total episodes.";
    return;
  }
  const title = data.get("title").trim();
  if (library.some((item) => item.title.toLowerCase() === title.toLowerCase())) {
    elements.formError.textContent = "That anime is already in your library.";
    return;
  }

  const nextRelease = data.get("nextRelease");
  library.unshift({
    id: crypto.randomUUID(),
    title,
    status: current === total ? "completed" : data.get("status"),
    currentEpisode: current,
    totalEpisodes: total,
    nextRelease: nextRelease ? new Date(nextRelease).toISOString() : "",
    image: data.get("image").trim(),
    color: data.get("color")
  });
  saveLibrary();
  activeFilter = "all";
  document.querySelectorAll(".filter").forEach((button) => button.classList.toggle("active", button.dataset.filter === "all"));
  closeDialog();
  render();
  showToast(`${title} added to your library`);
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

async function enableNotifications() {
  if (!("Notification" in window)) {
    showToast("Notifications are not supported in this browser");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    showToast("Notification permission was not enabled");
    return;
  }
  elements.notificationButton.innerHTML = "<span>✓</span> Alerts enabled";
  showToast("Release alerts are enabled on this device");
  notifyUpcomingRelease();
}

function notifyUpcomingRelease() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const upcoming = library.find((anime) => {
    const time = releaseDetails(anime.nextRelease).milliseconds;
    return time > 0 && time <= 24 * 3_600_000;
  });
  if (upcoming) {
    new Notification(`${upcoming.title} airs soon`, {
      body: releaseDetails(upcoming.nextRelease).long,
      icon: `${import.meta.env.BASE_URL}favicon.svg`
    });
  }
}

document.querySelector("#openAddButton").addEventListener("click", openDialog);
document.querySelector("#emptyAddButton").addEventListener("click", openDialog);
document.querySelector("#closeDialogButton").addEventListener("click", closeDialog);
document.querySelector("#cancelButton").addEventListener("click", closeDialog);
elements.form.addEventListener("submit", addAnime);
elements.search.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  render();
});
elements.filters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
  render();
});
elements.notificationButton.addEventListener("click", enableNotifications);
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) closeDialog();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`);
}
if ("Notification" in window && Notification.permission === "granted") {
  elements.notificationButton.innerHTML = "<span>✓</span> Alerts enabled";
  notifyUpcomingRelease();
}

render();
setInterval(render, 60_000);
