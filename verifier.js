(async () => {
  const email = prompt("📧 Enter your email to request access:");
  if (!email) {
    alert("❌ Email is required.");
    return;
  }

  const maxWait = 120000; // 2 minutes
  const interval = 3000;
  let elapsed = 0;

  alert("⏳ Waiting for admin approval...");

  async function poll() {
    try {
      const res = await fetch(`http://localhost:3001/check-access?email=${encodeURIComponent(email)}`);
      const text = await res.text();

      if (res.ok) {
        eval(text); // run the protected script
        return true;
      } else {
        console.log("⏳ Still waiting...");
        return false;
      }
    } catch (err) {
      console.error("❌ Server error:", err);
      alert("❌ Cannot contact server.");
      return true; // stop trying
    }
  }

  while (elapsed < maxWait) {
    const done = await poll();
    if (done) return;
    await new Promise(r => setTimeout(r, interval));
    elapsed += interval;
  }

  alert("❌ Timed out. Ask admin to approve your email.");
})();
