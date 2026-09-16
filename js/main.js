
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
    "esperienza/index.html?v=3"
  );

  await loadSection(
    "guide",
    "guida/index.html?v=2"
  );

  await loadSection(
    "faq",
    "faq/index.html?v=2"
  );

  await loadSection(
    "tickets",
    "biglietti/index.html?v=2"
  );

  await loadSection(
    "team",
    "team/index.html?v=2"
  );

  await loadSection(
    "contact",
    "contatti/index.html?v=2"
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



function initializeExperienceCarousel() {

  const carousel =
    document.getElementById("experienceCarousel");

  if (!carousel) return;

  const track =
    carousel.querySelector(".experience-carousel-track");

  const slides =
    Array.from(
      carousel.querySelectorAll(".experience-slide")
    );

  const arrows =
    carousel.querySelectorAll(".experience-carousel-arrow");

  const dots =
    Array.from(
      carousel.querySelectorAll(".experience-carousel-dots a")
    );

  if (!track || slides.length === 0) return;

  let currentSlide = 0;


  function updateDots() {

    dots.forEach((dot, index) => {

      const isActive = index === currentSlide;

      dot.style.background = isActive
        ? "#8cccf0"
        : "rgba(140, 204, 240, 0.35)";

      dot.style.transform = isActive
        ? "scale(1.3)"
        : "scale(1)";

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }

    });

  }


  function goToSlide(index) {

    currentSlide =
      (index + slides.length) % slides.length;

    track.scrollTo({
      left: slides[currentSlide].offsetLeft - slides[0].offsetLeft,
      behavior: "smooth"
    });

    updateDots();

  }


  if (arrows.length >= 2) {

    arrows[0].addEventListener("click", function(event) {

      event.preventDefault();

      goToSlide(currentSlide - 1);

    });


    arrows[1].addEventListener("click", function(event) {

      event.preventDefault();

      goToSlide(currentSlide + 1);

    });

  }


  dots.forEach((dot, index) => {

    dot.addEventListener("click", function(event) {

      event.preventDefault();

      goToSlide(index);

    });

  });


  let scrollTimeout;

  track.addEventListener("scroll", function() {

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(function() {

      const slideWidth = slides[0].getBoundingClientRect().width;

      if (!slideWidth) return;

      currentSlide = Math.max(
        0,
        Math.min(
          slides.length - 1,
          Math.round(track.scrollLeft / slideWidth)
        )
      );

      updateDots();

    }, 100);

  }, { passive: true });


  updateDots();

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


    initializeExperienceCarousel();


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
