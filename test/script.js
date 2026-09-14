const heading = document.getElementById('maskedHeading');
const video = document.getElementById('maskedVideo');

if (heading && video) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let driftTime = 0;

  const PARALLAX = 21;
  const DRIFT = 18;
  const SCALE = 1.18;


  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }


  function updateVideoTransform() {
    const rect = heading.getBoundingClientRect();

    const maxX = Math.max(
      0,
      ((SCALE - 1) / 2) * rect.width
    );

    const maxY = Math.max(
      0,
      ((SCALE - 1) / 2) * rect.height
    );

    const x = clamp(currentX, -maxX, maxX);
    const y = clamp(currentY, -maxY, maxY);

    video.style.transform =
      `translate3d(${x}px, ${y}px, 0) scale(${SCALE})`;
  }


  function handlePointerMove(event) {
    const rect = heading.getBoundingClientRect();

    const normalizedX =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;

    const normalizedY =
      ((event.clientY - rect.top) / rect.height) * 2 - 1;

    targetX = clamp(normalizedX, -1, 1) * -PARALLAX;
    targetY = clamp(normalizedY, -1, 1) * -PARALLAX;
  }


  function handlePointerLeave() {
    targetX = 0;
    targetY = 0;
  }


  function animateDrift() {
    driftTime += 0.008;

    const driftX =
      Math.sin(driftTime * 1.3) * DRIFT;

    const driftY =
      Math.cos(driftTime) * DRIFT * 0.55;

    currentX +=
      (targetX + driftX - currentX) * 0.045;

    currentY +=
      (targetY + driftY - currentY) * 0.045;

    updateVideoTransform();

    requestAnimationFrame(animateDrift);
  }


  heading.addEventListener(
    'pointermove',
    handlePointerMove
  );

  heading.addEventListener(
    'pointerleave',
    handlePointerLeave
  );


  /*
  ========================================
  REVEAL ANIMATION
  ========================================
  */

  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.set(heading, {
      opacity: 0,
      y: 90
    });

    gsap.set(video, {
      scale: 1.28
    });


    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;


          gsap.to(heading, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power4.out'
          });


          gsap.to(video, {
            scale: SCALE,
            duration: 1.8,
            ease: 'power3.out'
          });


          observer.disconnect();
        });
      },
      {
        threshold: 0.25
      }
    );

    observer.observe(heading);

  } else {
    heading.style.opacity = '1';
  }


  /*
  ========================================
  START VIDEO
  ========================================
  */

  const playVideo = async () => {
    try {
      await video.play();
    } catch (error) {
      console.log(
        'Autoplay prevented by browser:',
        error
      );
    }
  };

  playVideo();


  /*
  ========================================
  START MOTION
  ========================================
  */

  updateVideoTransform();

  if (!prefersReducedMotion) {
    requestAnimationFrame(animateDrift);
  }
}
