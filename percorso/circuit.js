import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";


const container = document.getElementById("course3d");

if (!container) {
  console.error("course3d container not found");
}


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050b13);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
  35,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

camera.position.set(0, 9, 18);


/* =========================================================
   RENDERER
========================================================= */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  container.clientWidth,
  container.clientHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.4;

container.appendChild(renderer.domElement);


/* =========================================================
   CONTROLS
========================================================= */

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = 0.06;

controls.enablePan = false;

controls.minDistance = 10;

controls.maxDistance = 28;

controls.minPolarAngle = Math.PI * 0.20;

controls.maxPolarAngle = Math.PI * 0.48;

controls.target.set(0, 0.5, 0);


/* =========================================================
   LIGHTS
========================================================= */

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  1.4
);

scene.add(ambientLight);


const keyLight = new THREE.DirectionalLight(
  0x9edcff,
  4
);

keyLight.position.set(
  -7,
  12,
  8
);

scene.add(keyLight);


const rimLight = new THREE.DirectionalLight(
  0xffffff,
  3
);

rimLight.position.set(
  10,
  4,
  -5
);

scene.add(rimLight);


const blueLight = new THREE.PointLight(
  0x58aee0,
  35,
  30
);

blueLight.position.set(
  0,
  6,
  4
);

scene.add(blueLight);


/* =========================================================
   FLOOR
========================================================= */

const floorGeometry =
  new THREE.PlaneGeometry(
    35,
    35
  );


const floorMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x03070c,

    roughness: 0.22,

    metalness: 0.55,

    clearcoat: 1,

    clearcoatRoughness: 0.18

  });


const floor =
  new THREE.Mesh(
    floorGeometry,
    floorMaterial
  );


floor.rotation.x =
  -Math.PI / 2;


floor.position.y =
  -1.2;


scene.add(floor);


/* =========================================================
   GRID
========================================================= */

const grid =
  new THREE.GridHelper(
    30,
    30,
    0x15334a,
    0x0d2436
  );


grid.position.y =
  -1.18;


grid.material.opacity =
  0.32;


grid.material.transparent =
  true;


scene.add(grid);


/* =========================================================
   RACE COURSE
========================================================= */

const coursePoints = [

  new THREE.Vector3(
    -6,
    0,
    -1
  ),

  new THREE.Vector3(
    -4,
    0.8,
    -3
  ),

  new THREE.Vector3(
    -1,
    0.2,
    -2.6
  ),

  new THREE.Vector3(
    1,
    0.5,
    -1.2
  ),

  new THREE.Vector3(
    5,
    0.2,
    -3
  ),

  new THREE.Vector3(
    7,
    0.5,
    -1
  ),

  new THREE.Vector3(
    5,
    0.3,
    2
  ),

  new THREE.Vector3(
    1,
    0.6,
    1
  ),

  new THREE.Vector3(
    -2,
    0.3,
    2.6
  ),

  new THREE.Vector3(
    -6,
    0.1,
    1.5
  ),

  new THREE.Vector3(
    -6,
    0,
    -1
  )

];


const courseCurve =
  new THREE.CatmullRomCurve3(
    coursePoints,
    true,
    "catmullrom",
    0.45
  );


const courseGeometry =
  new THREE.TubeGeometry(
    courseCurve,
    220,
    0.24,
    18,
    true
  );


const courseMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x78c9f2,

    roughness: 0.17,

    metalness: 0.72,

    clearcoat: 1,

    clearcoatRoughness: 0.08

  });


const course =
  new THREE.Mesh(
    courseGeometry,
    courseMaterial
  );


scene.add(course);


/* =========================================================
   INNER LIGHT TRACE
========================================================= */

const glowGeometry =
  new THREE.TubeGeometry(
    courseCurve,
    220,
    0.08,
    12,
    true
  );


const glowMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xd9f2ff

  });


const glow =
  new THREE.Mesh(
    glowGeometry,
    glowMaterial
  );


scene.add(glow);


/* =========================================================
   BUOYS
========================================================= */

const buoyMaterial =
  new THREE.MeshStandardMaterial({

    color: 0xffffff,

    roughness: 0.25,

    metalness: 0.3

  });


const buoyPositions = [

  [-6, 0, -1],

  [-1, 0.2, -2.6],

  [5, 0.2, -3],

  [7, 0.5, -1],

  [5, 0.3, 2],

  [-2, 0.3, 2.6]

];


buoyPositions.forEach(position => {

  const buoy =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.18,
        24,
        24
      ),

      buoyMaterial

    );


  buoy.position.set(
    position[0],
    position[1],
    position[2]
  );


  scene.add(buoy);

});


/* =========================================================
   GROUP ROTATION
========================================================= */

const objectsToRotate = [
  course,
  glow
];


let autoRotate = true;


renderer.domElement.addEventListener(
  "pointerdown",
  () => {
    autoRotate = false;
  }
);


/* =========================================================
   ANIMATION
========================================================= */

function animate() {

  requestAnimationFrame(
    animate
  );


  if (autoRotate) {

    objectsToRotate.forEach(
      object => {

        object.rotation.y +=
          0.0015;

      }
    );

  }


  controls.update();


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   RESIZE
========================================================= */

function resizeRenderer() {

  const width =
    container.clientWidth;


  const height =
    container.clientHeight;


  camera.aspect =
    width / height;


  camera.updateProjectionMatrix();


  renderer.setSize(
    width,
    height
  );

}


window.addEventListener(
  "resize",
  resizeRenderer
);
