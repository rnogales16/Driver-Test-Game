let db = null;

function initLeaderboard() {
  if (!window.firebase || !firebase.apps.length) return;
  try {
    db = firebase.firestore();
    loadLeaderboard();
  } catch (e) {
    console.error("Firebase init error:", e);
  }
}

async function submitScore(name, seconds, timeStr, mode, accuracy) {
  if (!db || seconds <= 0) return;
  try {
    await db.collection("scores_" + mode).add({
      name: name.substring(0, 15),
      seconds: seconds,
      time: timeStr,
      accuracy: accuracy,
      date: firebase.firestore.FieldValue.serverTimestamp()
    });
    loadLeaderboard();
  } catch (e) {
    console.error("Error submitting score:", e);
  }
}

async function loadLeaderboard() {
  if (!db) return;

  const modes = ["progressive", "constant"];
  for (const mode of modes) {
    const list = document.getElementById("lb-list-" + mode);
    if (!list) continue;

    try {
      const snapshot = await db
        .collection("scores_" + mode)
        .orderBy("seconds", "desc")
        .limit(10)
        .get();

      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = '<li class="lb-empty">Sin puntuaciones todavia</li>';
        continue;
      }

      let rank = 1;
      snapshot.forEach((doc) => {
        const d = doc.data();
        const medal = rank === 1 ? "&#129351;" : rank === 2 ? "&#129352;" : rank === 3 ? "&#129353;" : "";
        const li = document.createElement("li");
        li.className = "lb-row";
        li.innerHTML = `
          <span class="lb-rank">${medal || rank}</span>
          <span class="lb-name">${escapeHtml(d.name)}</span>
          <span class="lb-time">${d.time}</span>
          <span class="lb-accuracy">${d.accuracy}%</span>
        `;
        list.appendChild(li);
        rank++;
      });
    } catch (e) {
      console.error("Error loading leaderboard:", e);
      list.innerHTML = '<li class="lb-empty">Error al cargar</li>';
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
