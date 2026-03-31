// Firebase imports (compat mode for CDN)
// Config is set in index.html before this script loads

let db = null;

function initLeaderboard() {
  if (!window.firebase || !firebase.apps.length) return;
  db = firebase.firestore();
  loadLeaderboard();
}

async function submitScore(name, seconds, timeStr, mode, accuracy) {
  if (!db) return;
  try {
    await db.collection("leaderboard").add({
      name: name.substring(0, 15),
      seconds: seconds,
      time: timeStr,
      mode: mode,
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
    try {
      const snapshot = await db
        .collection("leaderboard")
        .where("mode", "==", mode)
        .orderBy("seconds", "desc")
        .limit(10)
        .get();

      const list = document.getElementById("lb-list-" + mode);
      if (!list) continue;

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
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
