<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dinosaur Game 3D</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>
    <script type="module">
        import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
        import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        scene.add(light);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // Dinosaur
        const dinoGeometry = new THREE.BoxGeometry(1, 1, 1);
        const dinoMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const dino = new THREE.Mesh(dinoGeometry, dinoMaterial);
        dino.position.y = 0.5;
        scene.add(dino);

        // Obstacles
        const obstacles = [];
        const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
        const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

        let obstacleTimer = 0;
        let gameSpeed = 0.05;
        let isJumping = false;
        let jumpVelocity = 0;
        const gravity = -0.002;

        camera.position.set(0, 5, 10);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;

        function spawnObstacle() {
            const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            obstacle.position.set(10, 0.5, Math.random() * 2 - 1);
            obstacles.push(obstacle);
            scene.add(obstacle);
        }

        function handleJump() {
            if (isJumping) {
                jumpVelocity += gravity;
                dino.position.y += jumpVelocity;

                if (dino.position.y <= 0.5) {
                    dino.position.y = 0.5;
                    isJumping = false;
                }
            }
        }

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !isJumping) {
                isJumping = true;
                jumpVelocity = 0.05;
            }
        });

        function checkCollisions() {
            for (let i = 0; i < obstacles.length; i++) {
                const obstacle = obstacles[i];
                obstacle.position.x -= gameSpeed;

                if (obstacle.position.x < -10) {
                    scene.remove(obstacle);
                    obstacles.splice(i, 1);
                    i--;
                }

                if (
                    Math.abs(dino.position.x - obstacle.position.x) < 0.5 &&
                    Math.abs(dino.position.y - obstacle.position.y) < 0.5
                ) {
                    alert('Game Over!');
                    location.reload();
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            obstacleTimer++;
            if (obstacleTimer > 100) {
                spawnObstacle();
                obstacleTimer = 0;
            }

            handleJump();
            checkCollisions();
            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>
