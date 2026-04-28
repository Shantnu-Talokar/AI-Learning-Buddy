(async () => {
  const BASE = "http://localhost:3001"; // 🔥 FIXED

  const email = prompt("📧 Enter your email:");
  if (!email) {
    alert("❌ Email required");
    return;
  }

  alert("⏳ Waiting for admin approval...");

  async function poll() {
    try {
      console.log("📡 Calling:", BASE);

      const res = await fetch(`${BASE}/check-access?email=${encodeURIComponent(email)}`, {
        method: "GET",
        mode: "cors"
      });

      const text = await res.text();

      if (res.ok && text.startsWith("(async")) {
        console.log("✅ Access granted");
        new Function(text)(); // safer than eval
        return true;
      } else {
        console.log("⏳ Waiting...");
        return false;
      }

    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("❌ Cannot contact server");
      return true;
    }
  }

  let elapsed = 0;
  const maxWait = 300000;

  while (elapsed < maxWait) {
    const done = await poll();
    if (done) return;

    await new Promise(r => setTimeout(r, 3000));
    elapsed += 3000;
  }

  alert("❌ Timeout");
})();
