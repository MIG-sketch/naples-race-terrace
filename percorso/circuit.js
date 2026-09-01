import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/+esm";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js/+esm";


/* =========================================================
   CONTAINER
========================================================= */

const container = document.getElementById("course3d");

if (!container) {
  throw new Error("Container #course3d non trovato");
}


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x03080f);

scene.fog = new THREE.Fog(
  0x03080f,
  22,
  45
);


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(
  38,
  1,
  0.1,
  100
);

camera.position.set(
  0,
  9,
  17
);


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

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.25;

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

container.appendChild(
  renderer.domElement
);


/* =========================================================
   CONTROLS
========================================================= */

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = 0.055;

controls.enablePan = false;

controls.enableZoom = true;

controls.minDistance = 10;

controls.maxDistance = 25;

controls.minPolarAngle =
  Math.PI * 0.20;

controls.maxPolarAngle =
  Math.PI * 0.49;

controls.target.set(
  0,
  0,
  0
);


/* automatic slow rotation */

controls.autoRotate = true;

controls.autoRotateSpeed = 0.45;


/* stop auto rotation when user interacts */

controls.addEventListener(
  "start",
  () => {
    controls.autoRotate = false;
  }
);


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    1.4
  );

scene.add(ambientLight);



const mainLight =
  new THREE.DirectionalLight(
    0xffffff,
    4.5
  );

mainLight.position.set(
  -6,
  12,
  8
);

mainLight.castShadow = true;

scene.add(mainLight);



const blueLight =
  new THREE.DirectionalLight(
    0x78c9f2,
    3
  );

blueLight.position.set(
  10,
  5,
  -4
);

scene.add(blueLight);



const rimLight =
  new THREE.PointLight(
    0xbde8ff,
    35,
    30
  );

rimLight.position.set(
  -6,
  3,
  -3
);

scene.add(rimLight);


/* =========================================================
   FLOOR
========================================================= */

const floorGeometry =
  new THREE.PlaneGeometry(
    38,
    38
  );


const floorMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x050b12,

    roughness: 0.20,

    metalness: 0.65,

    clearcoat: 1,

    clearcoatRoughness: 0.12

  });


const floor =
  new THREE.Mesh(
    floorGeometry,
    floorMaterial
  );


floor.rotation.x =
  -Math.PI / 2;


floor.position.y =
  -1.45;


floor.receiveShadow = true;


scene.add(floor);


/* =========================================================
   SUBTLE GRID
========================================================= */

const grid =
  new THREE.GridHelper(
    34,
    34,
    0x16364e,
    0x0b2132
  );


grid.position.y =
  -1.42;


grid.material.transparent =
  true;


grid.material.opacity =
  0.20;


scene.add(grid);


/* =========================================================
   COURSE GROUP
========================================================= */

const courseGroup =
  new THREE.Group();


scene.add(courseGroup);


/* =========================================================
   COURSE SHAPE
========================================================= */

/*
  Per ora è un percorso concettuale.

  Più avanti sostituiremo questi punti
  con il campo di regata definitivo.
*/

const points = [

  new THREE.Vector3(
    -6.2,
    0,
    -1.8
  ),

  new THREE.Vector3(
    -4.4,
    0.15,
    -3.3
  ),

  new THREE.Vector3(
    -1.2,
    0.30,
    -3.0
  ),

  new THREE.Vector3(
    1.8,
    0.10,
    -2.2
  ),

  new THREE.Vector3(
    5.3,
    0.30,
    -3.0
  ),

  new THREE.Vector3(
    7.0,
    0,
    -1.0
  ),

  new THREE.Vector3(
    6.2,
    0.15,
    1.5
  ),

  new THREE.Vector3(
    3.4,
    0.20,
    2.8
  ),

  new THREE.Vector3(
    0.4,
    0.05,
    2.0
  ),

  new THREE.Vector3(
    -2.6,
    0.30,
    3.0
  ),

  new THREE.Vector3(
    -5.8,
    0.10,
    1.7
  )

];


/* smooth closed curve */

const curve =
  new THREE.CatmullRomCurve3(
    points,
    true,
    "centripetal"
  );


/* =========================================================
   MAIN 3D TUBE
========================================================= */

const tubeGeometry =
  new THREE.TubeGeometry(
    curve,
    300,
    0.30,
    24,
    true
  );


const tubeMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x73c7f2,

    metalness: 0.70,

    roughness: 0.16,

    clearcoat: 1,

    clearcoatRoughness: 0.05

  });


const tube =
  new THREE.Mesh(
    tubeGeometry,
    tubeMaterial
  );


tube.castShadow = true;

tube.receiveShadow = true;


courseGroup.add(tube);


/* =========================================================
   INNER HIGHLIGHT
========================================================= */

const highlightGeometry =
  new THREE.TubeGeometry(
    curve,
    300,
    0.075,
    12,
    true
  );


const highlightMaterial =
  new THREE.MeshBasicMaterial({

    color: 0xe4f6ff

  });


const highlight =
  new THREE.Mesh(
    highlightGeometry,
    highlightMaterial
  );


courseGroup.add(highlight);


/* =========================================================
   COURSE SUPPORT SHADOW
========================================================= */

const shadowCurveGeometry =
  new THREE.TubeGeometry(
    curve,
    300,
    0.35,
    20,
    true
  );


const shadowMaterial =
  new THREE.MeshBasicMaterial({

    color: 0x020509,

    transparent: true,

    opacity: 0.30

  });


const courseShadow =
  new THREE.Mesh(
    shadowCurveGeometry,
    shadowMaterial
  );


courseShadow.position.y =
  -0.25;


courseGroup.add(courseShadow);


/* =========================================================
   BUOYS
========================================================= */

const buoyGeometry =
  new THREE.SphereGeometry(
    0.19,
    32,
    32
  );


const buoyMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0xffffff,

    metalness: 0.25,

    roughness: 0.18,

    clearcoat: 1

  });


const buoyIndexes = [
  0,
  2,
  4,
  5,
  7,
  9
];


buoyIndexes.forEach(index => {

  const buoy =
    new THREE.Mesh(
      buoyGeometry,
      buoyMaterial
    );


  buoy.position.copy(
    points[index]
  );


  buoy.position.y += 0.10;


  buoy.castShadow = true;


  courseGroup.add(buoy);

});


/* =========================================================
   START / FINISH MARKER
========================================================= */

const startGeometry =
  new THREE.CylinderGeometry(
    0.16,
    0.22,
    0.7,
    20
  );


const startMaterial =
  new THREE.MeshPhysicalMaterial({

    color: 0x59aee0,

    roughness: 0.15,

    metalness: 0.45

  });


const startMarker =
  new THREE.Mesh(
    startGeometry,
    startMaterial
  );


startMarker.position.copy(
  points[0]
);


startMarker.position.y += 0.35;


courseGroup.add(startMarker);


/* =========================================================
   POSITION MODEL
========================================================= */

courseGroup.rotation.x =
  -0.03;


courseGroup.position.y =
  0.20;


/* =========================================================
   RESIZE
========================================================= */

function resize() {

  const width =
    container.clientWidth;


  const height =
    container.clientHeight;


  if (
    width === 0 ||
    height === 0
  ) {
    return;
  }


  camera.aspect =
    width / height;


  camera.updateProjectionMatrix();


  renderer.setSize(
    width,
    height,
    false
  );

}


resize();


const resizeObserver =
  new ResizeObserver(
    resize
  );


resizeObserver.observe(
  container
);


/* =========================================================
   ANIMATION
========================================================= */

let animationFrame;


function animate() {

  animationFrame =
    requestAnimationFrame(
      animate
    );


  controls.update();


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   TAB VISIBILITY
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden &&
      animationFrame
    ) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame = null;

    }

    else if (
      !document.hidden &&
      !animationFrame
    ) {

      animate();

    }

  }
);
