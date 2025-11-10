// threejs-setup.js (концептуальный пример)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Создание сцены, камеры и рендерера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Настройка рендерера и добавление его на страницу
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Добавление управления камерой
const controls = new OrbitControls(camera, renderer.domElement);

// Создание Солнца (сферы с текстурой)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunTexture = new THREE.TextureLoader().load('path/to/sun_texture.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Размещение камеры
camera.position.set(30, 10, 40);
controls.update();

// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    // Вращение планет вокруг своих осей и по орбитам
    sun.rotation.y += 0.005;
    renderer.render(scene, camera);
}
animate();
