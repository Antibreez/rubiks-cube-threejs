import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from 'three/examples/jsm/libs/tween.module';

import './style.css';

let startX;
let startY;
let isCubeMoving = false;
let cellNormal;
let cellIndex;
let rowIndex;
let rotateDirection;
let groupAxe;
let rotationDiff;
let shuffleCounter = 0;

const canvas = document.querySelector('.canvas');
const shuffleBtn = document.querySelector('.shuffle-button');

const scene = new THREE.Scene();

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const geometry = new THREE.BoxGeometry(1, 1, 1);

// const materials = [
//   new THREE.MeshBasicMaterial({ color: 'yellow' }), //right
//   new THREE.MeshBasicMaterial({ color: 'pink' }), //left
//   new THREE.MeshBasicMaterial({ color: 'blue' }), //top
//   new THREE.MeshBasicMaterial({ color: 'green' }), //bottom
//   new THREE.MeshBasicMaterial({ color: 'white' }), //front
//   new THREE.MeshBasicMaterial({ color: 'orange' }), //back
// ]
// const mesh = new THREE.Mesh(geometry, materials);
// const meshes = [];
const group = new THREE.Group();

const axeGroups = {
  x: [
    new THREE.Group(),
    new THREE.Group(),
    new THREE.Group(),
  ],
  y: [
    new THREE.Group(),
    new THREE.Group(),
    new THREE.Group(),
  ],
  z: [
    new THREE.Group(),
    new THREE.Group(),
    new THREE.Group(),
  ],
}
// const groupX1 = new THREE.Group();
// const groupX2 = new THREE.Group();
// const groupX3 = new THREE.Group();
// const groupY1 = new THREE.Group();
// const groupY2 = new THREE.Group();
// const groupY3 = new THREE.Group();
// const groupZ1 = new THREE.Group();
// const groupZ2 = new THREE.Group();
// const groupZ3 = new THREE.Group();

const commonMaterial = {
  metalness: 0,
  roughness: 0.4
};

for (let i = -1.1; i <= 1.1; i += 1.1) {
  for (let j = -1.1; j <= 1.1; j += 1.1) {
    for (let k = -1.1; k <= 1.1; k += 1.1) {
      const materials = [
        new THREE.MeshStandardMaterial({
          color: i === 1.1 ? 'red' : '#333333',
          ...commonMaterial,
        }),
        new THREE.MeshStandardMaterial({
          color: i === -1.1 ? 'orange' : '#333333',
          ...commonMaterial,
        }),
        new THREE.MeshStandardMaterial({
          color: j === 1.1 ? 'yellow' : '#333333',
          ...commonMaterial,
        }),
        new THREE.MeshStandardMaterial({
          color: j === -1.1 ? 'white' : '#333333',
          ...commonMaterial,
        }),
        new THREE.MeshStandardMaterial({
          color: k === 1.1 ? 'blue' : '#333333',
          ...commonMaterial,
        }),
        new THREE.MeshStandardMaterial({
          color: k === -1.1 ? 'green' : '#333333',
          ...commonMaterial,
        }),
      ];

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(i, j, k);

      const cloneX = mesh.clone();
      const cloneY = mesh.clone();
      const cloneZ = mesh.clone();

      i === -1.1 ? axeGroups.x[0].add(cloneX) : i === 0 ? axeGroups.x[1].add(cloneX) : i === 1.1 ? axeGroups.x[2].add(cloneX) : null;
      j === -1.1 ? axeGroups.y[0].add(cloneY) : j === 0 ? axeGroups.y[1].add(cloneY) : j === 1.1 ? axeGroups.y[2].add(cloneY) : null;
      k === -1.1 ? axeGroups.z[0].add(cloneZ) : k === 0 ? axeGroups.z[1].add(cloneZ) : k === 1.1 ? axeGroups.z[2].add(cloneZ) : null;
    }
  }
}

// group.add(...axeGroups.x);
// group.add(...axeGroups.y);
group.add(...axeGroups.y);
// group.add(groupX2);
// group.add(groupX3);
// group.add(groupY1);
// group.add(groupY2);
// group.add(groupY3);
// group.add(groupZ1);
// group.add(groupZ2);
// group.add(groupZ3);

// mesh.position.x = 1;
// mesh.position.y = 1;
// mesh.position.z = -1;

// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;


// group.add(mesh);

// group.rotation.z = 0.2;

// group.scale.y = 0.5;
// group.scale.x = 0.25;
// group.scale.z = 0.1;

scene.add(group);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 6;
camera.position.y = 3;
camera.position.x = -3;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.maxPolarAngle = Math.PI * 2;

scene.add(camera);

group.receiveShadow = true;

// const light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
const pointLight = new THREE.PointLight(0xffffff, 40);

// scene.add(light);
camera.add(pointLight);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const tick = () => {
  controls.update();
  TWEEN.update();
  // axeGroups.z[0].rotation.z = elapsedTime;

  if (isCubeMoving && rotateDirection) {
    axeGroups[groupAxe][rowIndex].rotation[groupAxe] = rotationDiff;
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();

const setNewGroups = () => {
  const meshes = [];

  group.children.forEach(gr => {
    gr.children.forEach(m => {
      meshes.push(m.clone());
    })
  });

  Object.values(axeGroups).forEach(v => {
    v.forEach(g => {
      g.clear();
    })
  })

  for (let i = -1.1; i <= 1.1; i += 1.1) {
    for (let j = -1.1; j <= 1.1; j += 1.1) {
      for (let k = -1.1; k <= 1.1; k += 1.1) {
        const current = meshes.find(m => m.position.x === i && m.position.y === j && m.position.z === k);
        const cloneX = current.clone();
        const cloneY = current.clone();
        const cloneZ = current.clone();

        i === -1.1 ? axeGroups.x[0].add(cloneX) : i === 0 ? axeGroups.x[1].add(cloneX) : i === 1.1 ? axeGroups.x[2].add(cloneX) : null;
        j === -1.1 ? axeGroups.y[0].add(cloneY) : j === 0 ? axeGroups.y[1].add(cloneY) : j === 1.1 ? axeGroups.y[2].add(cloneY) : null;
        k === -1.1 ? axeGroups.z[0].add(cloneZ) : k === 0 ? axeGroups.z[1].add(cloneZ) : k === 1.1 ? axeGroups.z[2].add(cloneZ) : null;
      }
    }
  }
}

const makeGroups = (normal, direction) => {
  const axe = cellNormal.length > 1 ? cellNormal[1] : normal;

    switch (axe) {
      case 'x':
        groupAxe = direction === 'horizontal' ? 'y' : 'z';
        break;
      case 'y':
        const angle = controls.getAzimuthalAngle();

        if (
          (angle <= 0 && angle > -(Math.PI / 4))
          || (angle < -(Math.PI / 4 * 3) && angle >= -Math.PI)
          || (angle <= Math.PI && angle > Math.PI * 3 / 4)
          || (angle >= 0 && angle < Math.PI / 4) 
        ) {
          groupAxe = direction === 'horizontal' ? 'z' : 'x';
        } else {
          groupAxe = direction === 'horizontal' ? 'x' : 'z';
        }
        break;
      case 'z':
        groupAxe = direction === 'horizontal' ? 'y' : 'x';
      default:
        break;
    }

    // console.log('###group', meshes);

    group.clear();
    // group.add(...axeGroups[groupAxe]);
    group.add(...axeGroups[groupAxe]);
    // axeGroups[groupAxe][0].add(...meshes.filter(m => m.index[groupAxe] === -1.1));
    // axeGroups[groupAxe][1].add(...meshes.filter(m => m.index[groupAxe] === 0));
    // axeGroups[groupAxe][2].add(...meshes.filter(m => m.index[groupAxe] === 1.1));
}

const shuffle = (count) => {
  canvas.style.pointerEvents = 'none';
  shuffleBtn.setAttribute('disabled', true);

  if (shuffleCounter >= count) {
    shuffleCounter = 0;
    canvas.style.pointerEvents = 'unset';
    shuffleBtn.removeAttribute('disabled');
    return;
  }

  groupAxe = ['x', 'y', 'z'][3 * Math.random() | 0];
  rowIndex = [0, 2][2 * Math.random() | 0];
  const rotation = [-1, 1][2 * Math.random() | 0] * (Math.PI / 2);

  group.clear();
  group.add(...axeGroups[groupAxe]);

  const tween = new TWEEN.Tween(axeGroups[groupAxe][rowIndex].rotation)
  .to({
    [groupAxe]: rotation,
  }, 100)
  .easing(TWEEN.Easing.Exponential.InOut).start();

  tween.onComplete(() => {

    axeGroups[groupAxe][rowIndex].children.forEach((mesh, index) => {
      const target = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      mesh.getWorldPosition(target);
      mesh.getWorldQuaternion(quat);


      mesh.position.x = +target.x.toFixed(1);
      mesh.position.y = +target.y.toFixed(1);
      mesh.position.z = +target.z.toFixed(1);

      mesh.quaternion.x = quat.x;
      mesh.quaternion.y = quat.y;
      mesh.quaternion.z = quat.z;
      mesh.quaternion.w = quat.w;

    })

    axeGroups[groupAxe][rowIndex].rotation.x = 0;
    axeGroups[groupAxe][rowIndex].rotation.y = 0;
    axeGroups[groupAxe][rowIndex].rotation.z = 0;

    rotationDiff = null;

    setNewGroups();
    shuffleCounter++;
    shuffle(count);
  })
}

const raycaster = new THREE.Raycaster();
const raycaster2 = new THREE.Raycaster();

const handleMouseOver = (event) => {
  const pointer = new THREE.Vector2();
  pointer.x = (event.clientX / sizes.width) * 2 - 1;
  pointer.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster2.setFromCamera(pointer, camera);
  const intersections = raycaster2.intersectObjects(group.children);

  if (intersections.length) {
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = 'default';
  }
}

const handleMouseDown = (e) => {
  const event = e.touches ? e.touches[0] : e;

  const pointer = new THREE.Vector2();
  pointer.x = (event.clientX / sizes.width) * 2 - 1;
  pointer.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(group.children);

  if (intersections.length) {
    controls.enabled = false;
    isCubeMoving = true;
    startX = event.clientX;
    startY = event.clientY;

    var normalMatrix = new THREE.Matrix3().getNormalMatrix( intersections[0].object.matrixWorld );
    const globalNormal = intersections[0].normal.clone().applyMatrix3( normalMatrix )

    if (globalNormal.x === 1) {
      cellNormal = 'x';
    } else if (globalNormal.x === -1) {
      cellNormal = '-x';
    } else if (globalNormal.y === 1) {
      cellNormal = 'y';
    } else if (globalNormal.y === -1) {
      cellNormal = '-y';
    } else if (globalNormal.z === 1) {
      cellNormal = 'z';
    } else if (globalNormal.z === -1) {
      cellNormal = '-z';
    }

    cellIndex = intersections[0].object.position;

    // if (intersections[0].normal.z) {
    //   group.children.forEach(gr => {
    //     gr.children.forEach(g => {
    //       newGroup.push(g);
    //     })
    //   })

    //   groupX1.add(...newGroup.filter(m => m.indexX === -1.1));
    //   groupX2.add(...newGroup.filter(m => m.indexX === 0));
    //   groupX3.add(...newGroup.filter(m => m.indexX === 1.1));

    //   groupX1.rotation.x = 0.3;
    // }
  }

  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('touchmove', handleMouseMove);
}

const handleMouseMove = (e) => {
  const event = e.touches ? e.touches[0] : e;

  if (isCubeMoving) {
    const newX = event.clientX;
    const newY = event.clientY;

    if (!rotateDirection) {
      if (Math.abs(newX - startX) > 10) {
        rotateDirection = 'horizontal';
      }
  
      if (Math.abs(newY - startY) > 10) {
        rotateDirection = 'vertical';
      }

      if (rotateDirection) {
        makeGroups(cellNormal, rotateDirection);
        rowIndex = cellIndex[groupAxe] === -1.1
          ? 0
          : cellIndex[groupAxe] === 0
          ? 1
          : cellIndex[groupAxe] === 1.1
          ? 2
          : null;
      }

      return;
    }

    const angle = controls.getAzimuthalAngle();

    switch (rotateDirection) {
      case 'horizontal':
        let j = 1;
        if (cellNormal === 'y') {
          j = angle < (Math.PI / 4 * 3) && angle > -(Math.PI / 4) ? -1 : 1;
        }
        rotationDiff = j * (newX - startX)*0.005;
        break;
      case 'vertical':
        let k = cellNormal === '-z' || cellNormal === 'x' ? -1 : 1;
        if (cellNormal === 'y' || cellNormal === '-y') {
          k = angle > Math.PI / 4 || angle < -(Math.PI / 4 * 3) ? -1 : 1;
        }
        rotationDiff = k * (newY - startY)*0.005;
        break;
      default:
        break;
    }

    // console.log('##rotate!!!', axeGroups[groupAxe][rowIndex]);

    // axeGroups[groupAxe][rowIndex].rotation.groupAxe = newX - startX;
  }
}

const handleMouseUp = () => {

  // console.log(Math.abs(rotationDiff) < Math.PI / 4, rotationDiff);
  let rotation = null;

  if (rotationDiff === null) {
    controls.enabled = true;
    isCubeMoving = false;
    rotateDirection = null;
    return
  };

  if (rotationDiff <= 0) {
    if (rotationDiff < -(Math.PI / 4)) {
      rotation = -(Math.PI / 2);

      // console.log('####sdfsfdas', axeGroups[groupAxe][rowIndex]);
    } else {
      rotation = 0;
    }
  }

  if (rotationDiff > 0) {
    if (rotationDiff > Math.PI / 4) {
      rotation = Math.PI / 2;
    } else {
      rotation = 0;
    }
  }

  if (rotation !== null) {
    const tween = new TWEEN.Tween(axeGroups[groupAxe][rowIndex].rotation)
    .to({
      [groupAxe]: rotation,
    }, 200)
    .easing(TWEEN.Easing.Exponential.InOut).start();

    tween.onComplete(() => {

      axeGroups[groupAxe][rowIndex].children.forEach((mesh, index) => {
        const target = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        mesh.getWorldPosition(target);
        mesh.getWorldQuaternion(quat);


        mesh.position.x = +target.x.toFixed(1);
        mesh.position.y = +target.y.toFixed(1);
        mesh.position.z = +target.z.toFixed(1);

        mesh.quaternion.x = quat.x;
        mesh.quaternion.y = quat.y;
        mesh.quaternion.z = quat.z;
        mesh.quaternion.w = quat.w;

      })

      axeGroups[groupAxe][rowIndex].rotation.x = 0;
      axeGroups[groupAxe][rowIndex].rotation.y = 0;
      axeGroups[groupAxe][rowIndex].rotation.z = 0;

      rotationDiff = null;

      setNewGroups();

    })
  }

  controls.enabled = true;
  isCubeMoving = false;
  rotateDirection = null;

  canvas.removeEventListener('mousemove', handleMouseMove);
  canvas.removeEventListener('touchmove', handleMouseMove);
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('touchstart', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('touchend', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseOver);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
})

shuffleBtn.addEventListener('click', () => shuffle(30));