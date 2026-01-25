!(async function () {
  let api = "https://booking.polnasauna.sk";

  const urlSearchParams = new URLSearchParams(window.location.search);
  const id = urlSearchParams.get("id");
  const msg = document.getElementById("message");

  if (!id) {
    msg.textContent = "Neplatné ID platby.";
    return;
  }

  try {
    const response = await fetch(`${api}/payment/${id}`);

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

  } catch (err) {
    console.error(err);
    msg.textContent = "Nepodarilo sa spojiť so serverom.";
  }
})();
