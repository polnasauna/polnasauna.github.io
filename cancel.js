(async function () {
  const api = "https://booking.polnasauna.sk";

  const params = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  const code = params.code;
  const skipconfirm = params.skipconfirm;
  const msg = document.getElementById("message");
  const modal = document.getElementById("cancelModal");

  if (!code) {
    msg.innerHTML = "Neplatný kód rezervácie.";
    return;
  }

  async function cancelBooking() {
    try {
      const response = await fetch(`${api}/cancel/${code}`, {
        method: "POST",
      });

      if (response.status === 200) {
        msg.innerHTML = "Rezervácia zrušená.";
      } else if (response.status === 404) {
        msg.innerHTML = "Rezervácia nenájdená.";
      } else {
        msg.innerHTML = "Chyba: Rezerváciu sa nepodarilo zrušiť, kontaktujte prosím správcu.";
      }
    } catch (err) {
      msg.innerHTML = "Chyba pripojenia: Rezerváciu sa nepodarilo zrušiť.";
    }
  }

  if (skipconfirm) {
    cancelBooking();
    return;
  }

  modal.classList.remove("hidden");

  document.getElementById("cancelCancel").onclick = () => {
    modal.classList.add("hidden");
    msg.innerHTML = "Zrušenie rezervácie bolo prerušené.";
  };

  document.getElementById("confirmCancel").onclick = async () => {
    modal.classList.add("hidden");
    cancelBooking();
  };

})();
