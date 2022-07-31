!async function() {
  let api = "https://polnasauna.deta.dev"

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  code = params.code;

  if (!code) {
    alert("Invalid code");
    return;
  }

  let url = `${api}/cancel/${code}`;
  const api_call = await fetch(url, { method: 'POST' })

  var msg = document.getElementById('message');

  if (api_call.status == "404") {
      msg.innerHTML = "Rezervácia nenájdená";
  } else {
      msg.innerHTML = "Rezervácia zrušená";
  }
 }();
