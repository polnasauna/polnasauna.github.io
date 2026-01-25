(async function () {
  const api = "https://booking.polnasauna.sk";
  const urlSearchParams = new URLSearchParams(window.location.search);
  const id = urlSearchParams.get("id");
  const msg = document.getElementById("message");

  if (!id) {
    msg.textContent = "Neplatné ID platby.";
    return;
  }

  const MAX_ATTEMPTS = 20;      // stop after ~1 minute (20 × 3s)
  const INTERVAL = 3000;        // 3 seconds
  let attempts = 0;

  async function checkPayment() {
    try {
      const response = await fetch(`${api}/payment/${id}`, { cache: "no-store" });

      if (response.status === 404) {
        msg.textContent = "Rezervácia nebola nájdená.";
        return;
      }

      if (!response.ok) {
        msg.textContent = "Chyba pri overovaní platby. Skúste neskôr.";
        return;
      }

      const data = await response.json();
      msg.textContent = data.message;

      if (data.pending === true) {
        attempts++;

        if (attempts >= MAX_ATTEMPTS) {
          msg.textContent = "Platba sa stále spracúva. Obnovte stránku o chvíľu.";
          return;
        }

        setTimeout(checkPayment, INTERVAL);
      }

    } catch (err) {
      console.error(err);
      msg.textContent = "Nepodarilo sa spojiť so serverom.";
    }
  }

  checkPayment();
})();
