async function loadSection(containerId, filePath) {
  try {

    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Errore caricamento: ${filePath}`);
    }

    const html = await response.text();

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = html;

  } catch (error) {

    console.error(error);

    const container = document.getElementById(containerId);

    if (container) {
      container.innerHTML =
        "<p>Errore nel caricamento della sezione.</p>";
    }

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

  const menu =
    document.getElementById("languageMenu");

  if (!menu) return;

  menu.classList.toggle("active");

}


function setLanguage(lang) {

  document.documentElement.lang = lang;

  const currentLanguage =
    document.getElementById("currentLanguage");

  if (currentLanguage) {
    currentLanguage.textContent =
      lang.toUpperCase();
  }


  const translatableElements =
    document.querySelectorAll(
      "[data-it][data-en]"
    );


  translatableElements.forEach(
    element => {

      if (lang === "it") {
        element.textContent =
          element.dataset.it;
      }

      if (lang === "en") {
        element.textContent =
          element.dataset.en;
      }

    }
  );


  const languageMenu =
    document.getElementById("languageMenu");


  if (languageMenu) {
    languageMenu.classList.remove("active");
  }


  localStorage.setItem(
    "language",
    lang
  );

}


function closeCookie() {

  const cookieBar =
    document.getElementById("cookieBar");

  if (cookieBar) {
    cookieBar.style.display = "none";
  }


  localStorage.setItem(
    "cookieAccepted",
    "true"
  );

}


document.addEventListener(
  "click",
  function(event) {

    const selector =
      document.querySelector(
        ".language-selector"
      );

    const menu =
      document.getElementById(
        "languageMenu"
      );


    if (
      selector &&
      menu &&
      !selector.contains(event.target)
    ) {

      menu.classList.remove("active");

    }

  }
);


window.addEventListener(
  "DOMContentLoaded",
  async function() {

    await loadWebsiteSections();


    const savedLanguage =
      localStorage.getItem("language")
      || "it";


    setLanguage(savedLanguage);


    const cookieAccepted =
      localStorage.getItem(
        "cookieAccepted"
      );


    if (
      cookieAccepted === "true"
    ) {

      const cookieBar =
        document.getElementById(
          "cookieBar"
        );


      if (cookieBar) {
        cookieBar.style.display = "none";
      }

    }

  }
);
