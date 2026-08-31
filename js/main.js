async function loadSection(containerId, filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Errore caricamento: ${filePath}`);
    }

    const html = await response.text();

    document.getElementById(containerId).innerHTML = html;

  } catch (error) {
    console.error(error);

    document.getElementById(containerId).innerHTML =
      "<p>Errore nel caricamento della sezione.</p>";
  }
}


async function loadWebsiteSections() {

  await loadSection(
    "experience",
    "esperienza/index.html"
  );

  await loadSection(
    "tickets",
    "biglietti/index.html"
  );

  await loadSection(
    "guide",
    "guida/index.html"
  );

  await loadSection(
    "faq",
    "faq/index.html"
  );

  await loadSection(
    "team",
    "team/index.html"
  );

  await loadSection(
    "contact",
    "contatti/index.html"
  );

}


function toggleLanguageMenu() {
  document
    .getElementById("languageMenu")
    .classList
    .toggle("active");
}


function setLanguage(lang) {

  document.documentElement.lang = lang;

  document.getElementById("currentLanguage").textContent =
    lang.toUpperCase();


  const translatableElements =
    document.querySelectorAll("[data-it][data-en]");


  translatableElements.forEach(element => {

    if (lang === "it") {
      element.textContent = element.dataset.it;
    }

    if (lang === "en") {
      element.textContent = element.dataset.en;
    }

  });


  document
    .getElementById("languageMenu")
    .classList
    .remove("active");


  localStorage.setItem("language", lang);
}


function closeCookie() {
  document.getElementById("cookieBar").style.display = "none";
  localStorage.setItem("cookieAccepted", "true");
}


document.addEventListener("click", function(event) {

  const selector =
    document.querySelector(".language-selector");

  if (
    selector &&
    !selector.contains(event.target)
  ) {

    document
      .getElementById("languageMenu")
      .classList
      .remove("active");

  }

});


window.addEventListener("DOMContentLoaded", async function() {

  await loadWebsiteSections();


  const savedLanguage =
    localStorage.getItem("language") || "it";

  setLanguage(savedLanguage);


  const cookieAccepted =
    localStorage.getItem("cookieAccepted");

  if (cookieAccepted === "true") {

    document
      .getElementById("cookieBar")
      .style
      .display = "none";

  }

});
