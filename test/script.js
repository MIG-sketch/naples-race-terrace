const container = document.getElementById('videoText');
const canvas = document.getElementById('videoTextCanvas');
const video = document.getElementById('videoSource');

if (container && canvas && video) {

  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = 1;

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let time = 0;

  const PARALLAX = 21;
  const DRIFT = 18;
  const VIDEO_SCALE = 1.25;


  /* ========================================
     CANVAS SIZE
  ======================================== */

  function resizeCanvas() {

    const rect = container.getBoundingClientRect();

    width = rect.width;
    height = rect.height;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }


  /* ========================================
     VIDEO POSITION
  ======================================== */

  function getVideoDimensions() {

    const videoRatio =
      video.videoWidth / video.videoHeight;

    const containerRatio =
      width / height;

    let drawWidth;
    let drawHeight;

    if (videoRatio > containerRatio) {

      drawHeight = height * VIDEO_SCALE;

      drawWidth =
        drawHeight * videoRatio;

    } else {

      drawWidth = width * VIDEO_SCALE;

      drawHeight =
        drawWidth / videoRatio;
    }

    return {
      width: drawWidth,
      height: drawHeight
    };
  }


  /* ========================================
     TEXT MASK
  ======================================== */

  function drawTextMask() {

    const mobile = width < 750;

    const fontSize = mobile
      ? Math.min(width * 0.145, 82)
      : Math.min(width * 0.105, 150);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#ffffff';

    ctx.font =
      `500 ${fontSize}px "Playfair Display", serif`;


    if (mobile) {

      ctx.fillText(
        'The race,',
        width / 2,
        height * 0.36
      );

      ctx.save();

      ctx.font =
        `italic 500 ${fontSize}px "Playfair Display", serif`;

      ctx.fillText(
        'from above.',
        width / 2,
        height * 0.70
      );

      ctx.restore();

    } else {

      ctx.fillText(
        'The race, from above.',
        width / 2,
        height / 2
      );
    }
  }


  /* ========================================
     DRAW FRAME
  ======================================== */

  function draw() {

    if (
      video.readyState < 2 ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      requestAnimationFrame(draw);
      return;
    }


    time += 0.008;


    /* automatic slow drift */

    const driftX =
      Math.sin(time * 1.25) * DRIFT;

    const driftY =
      Math.cos(time * 0.9) * DRIFT * 0.55;


    /* smooth pointer movement */

    currentX +=
      (targetX + driftX - currentX) * 0.04;

    currentY +=
      (targetY + driftY - currentY) * 0.04;


    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    /* ----------------------------------------
       DRAW VIDEO
    ---------------------------------------- */

    const dimensions =
      getVideoDimensions();

    const videoX =
      (width - dimensions.width) / 2 +
      currentX;

    const videoY =
      (height - dimensions.height) / 2 +
      currentY;


    ctx.globalCompositeOperation = 'source-over';


    ctx.drawImage(
      video,
      videoX,
      videoY,
      dimensions.width,
      dimensions.height
    );


    /* ----------------------------------------
       CUT VIDEO INTO TEXT
    ---------------------------------------- */

    ctx.globalCompositeOperation =
      'destination-in';


    drawTextMask();


    ctx.globalCompositeOperation =
      'source-over';


    requestAnimationFrame(draw);
  }


  /* ========================================
     PARALLAX
  ======================================== */

  function pointerMove(event) {

    const rect =
      container.getBoundingClientRect();


    const normalizedX =
      ((event.clientX - rect.left) /
        rect.width) *
        2 -
      1;


    const normalizedY =
      ((event.clientY - rect.top) /
        rect.height) *
        2 -
      1;


    targetX =
      normalizedX * -PARALLAX;

    targetY =
      normalizedY * -PARALLAX;
  }


  function pointerLeave() {

    targetX = 0;
    targetY = 0;
  }


  container.addEventListener(
    'pointermove',
    pointerMove
  );


  container.addEventListener(
    'pointerleave',
    pointerLeave
  );


  /* ========================================
     RESIZE
  ======================================== */

  window.addEventListener(
    'resize',
    resizeCanvas
  );


  /* ========================================
     START VIDEO
  ======================================== */

  async function startVideo() {

    try {

      video.muted = true;

      await video.play();

    } catch (error) {

      console.log(
        'Video autoplay prevented:',
        error
      );
    }
  }


  /* ========================================
     REVEAL
  ======================================== */

  function reveal() {

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;


    if (
      reducedMotion ||
      typeof gsap === 'undefined'
    ) {

      canvas.style.opacity = '1';

      return;
    }


    gsap.fromTo(
      canvas,

      {
        opacity: 0,
        y: 90
      },

      {
        opacity: 1,
        y: 0,

        duration: 1.1,

        ease: 'power4.out',

        delay: 0.2
      }
    );
  }


  /* ========================================
     INITIALIZE
  ======================================== */

  async function init() {

    resizeCanvas();

    await document.fonts.ready;

    await startVideo();

    reveal();

    requestAnimationFrame(draw);
  }


  init();
}
