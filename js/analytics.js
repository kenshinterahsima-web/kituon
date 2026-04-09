(() => {
  const measurementId = (window.GA_MEASUREMENT_ID || "").trim();
  if (!measurementId || measurementId === "G-XXXXXXXXXX") {
    return;
  }

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId
  )}`;
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag("js", new Date());
  gtag("config", measurementId);
})();
