!(async function () {
  let api = "https://booking.polnasauna.sk";

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  id = params.id;

  if (!id) {
    alert("Invalid payment ID");
    return;
  }

  let url = `${api}/return/${id}`;
  const api_call = await fetch(url, {});

  var msg = document.getElementById("message");

  if (api_call.status == "404") {
    msg.innerHTML = "Rezervácia nenájdená";
  } else {
    msg.innerHTML = "Rezervácia úspešná";
  }
})();
