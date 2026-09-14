const container = document.getElementById("videoText");
const canvas = document.getElementById("videoTextCanvas");
const video = document.getElementById("videoSource");

if (container && canvas && video) {
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let dpr = 1;


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


  function drawText() {
    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const firstLineSize = Math.min(width * 0.13, 170);
    const secondLineSize = Math.min(width * 0.14, 180);

    ctx.font = `500 ${firstLineSize}px "Playfair Display", serif`;

    ctx.fillText(
      "The race,",
      width / 2,
      height * 0.32
    );


    ctx.font = `italic 500 ${secondLineSize}px "Playfair Display", serif`;

    ctx.fillText(
      "from above.",
      width / 2,
      height * 0.72
    );
  }


  function drawVideoCover() {
    if (!video.videoWidth || !video.videoHeight) return;

    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = width / height;

    let drawWidth;
    let drawHeight;

    if (videoRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = drawHeight * videoRatio;
    } else {
      drawWidth = width;
      drawHeight = drawWidth / videoRatio;
    }

    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    ctx.drawImage(
      video,
      x,
      y,
      drawWidth,
      drawHeight
    );
  }


  function render() {
    ctx.clearRect(0, 0, width, height);

    /*
      STEP 1:
      draw the letters as a solid mask
    */

    ctx.globalCompositeOperation = "source-over";

    drawText();


    /*
      STEP 2:
      draw the video ONLY where
      the letters already exist
    */

    ctx.globalCompositeOperation = "source-in";

    drawVideoCover();


    /*
      reset canvas mode
    */

    ctx.globalCompositeOperation = "source-over";

    requestAnimationFrame(render);
  }


  async function start() {
    resizeCanvas();

    await document.fonts.ready;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    try {
      await video.play();
    } catch (error) {
      console.log("Autoplay blocked:", error);
    }

    requestAnimationFrame(render);
  }


  window.addEventListener("resize", resizeCanvas);

  start();
}
