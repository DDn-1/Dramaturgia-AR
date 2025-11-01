let trackableImages = new Array(10);
let qrcodes = {};
let models = new Array(10);
let bitmaps = {};
let includedModels = [];

let planets = [
    'El cuerpo guarda la memoria del tiempo.',
    'La piel escribe la historia de los días.',
    'Los huesos sostienen el peso de los años.',
    'El pulso mide la distancia entre pasado y futuro.',
    'La respiración traduce el paso del tiempo en vida.',
    'El cuerpo anuncia lo que el alma aún ignora.',
    'La carne recuerda lo que la mente olvida.',
    'El movimiento revela los secretos del devenir.',
    'El cuerpo predice el destino con su propio ritmo.',
    'La piel escucha el lenguaje oculto del tiempo.'
];

let planetColors = [
    0xfefe99,
    0xfecc77,
    0xe066e0,
    0x66c9fe,
    0xfe66e0,
    0xc0c0b0,
    0xe0c0b0,
    0x40c0e0,
    0x20c0fe,
    0xcccccc
];

// === Crear modelos y QRs ===
let fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    for (let i = 0; i < planets.length; i++) {
        let planetText = planets[i]; // puede tener varias palabras
        let el = document.createElement('div');
        el.id = 'qr' + i; // QR basado en número

        // ======= Dividir texto largo en líneas =======
        const maxCharsPerLine = 20;
        const words = planetText.split(" ");
        let lines = [];
        let currentLine = "";

        for (let w of words) {
            if ((currentLine + " " + w).trim().length > maxCharsPerLine) {
                lines.push(currentLine.trim());
                currentLine = w;
            } else {
                currentLine += " " + w;
            }
        }
        if (currentLine.trim().length > 0) lines.push(currentLine.trim());

        // ======= Ajustar tamaño según cantidad de líneas =======
        let textSize = 0.05;
        if (lines.length === 2) textSize = 0.04;
        else if (lines.length >= 3) textSize = 0.03;

        // ======= Crear grupo para todas las líneas =======
        let textGroup = new THREE.Group();
        const lineSpacing = 0.07; // distancia entre líneas

        for (let j = 0; j < lines.length; j++) {
            let lineGeometry = new THREE.TextGeometry(lines[j].toUpperCase(), {
                font: font,
                size: textSize,
                height: 0.008,
                curveSegments: 12,
            });
            lineGeometry.computeBoundingBox();

            // Centrar cada línea
            const centerOffsetX = -0.5 * (lineGeometry.boundingBox.max.x - lineGeometry.boundingBox.min.x);
            const centerOffsetY = -0.5 * (lineGeometry.boundingBox.max.y - lineGeometry.boundingBox.min.y);
            lineGeometry.translate(centerOffsetX, centerOffsetY, 0);

            let textMaterial = new THREE.MeshStandardMaterial({ color: planetColors[i] });
            let textMesh = new THREE.Mesh(lineGeometry, textMaterial);

            // Posicionar las líneas una debajo de otra
            textMesh.position.z = (j * lineSpacing);
            textMesh.rotation.x = -Math.PI / 2;

            textGroup.add(textMesh);
        }

        // Acostar todo el grupo
        textGroup.position.y = 0.02;
        textGroup.rotation.x = -Math.PI / 2;

        // Guardar rotación offset (por si se usa en onXRFrame)
        let offsetEuler = new THREE.Euler(Math.PI, 0, 0, 'XYZ');
        let offsetQuaternion = new THREE.Quaternion().setFromEuler(offsetEuler);
        textGroup.userData.offsetQuaternion = offsetQuaternion;

        models[i] = textGroup;

        // === Generar QR basado en número ===
        let qrNumber = i.toString();
        qrcodes[qrNumber] = (new QRCode(el, qrNumber))._oDrawing._elCanvas;

        createImageBitmap(qrcodes[qrNumber]).then((x) => {
            bitmaps[qrNumber] = x;
            trackableImages[i] = { image: x, widthInMeters: 0.1 };
        });
    }
});



// === Escena ===
let camera, scene, renderer, xrRefSpace, gl;

scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x222222));

let dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(0.9, 1, 0.6).normalize();
scene.add(dirLight);

camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 20000);
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// === WebXR AR ===
function getXRSessionInit(mode, options) {
    if (options && options.referenceSpaceType) {
        renderer.xr.setReferenceSpaceType(options.referenceSpaceType);
    }
    var space = (options || {}).referenceSpaceType || 'local-floor';
    var sessionInit = (options && options.sessionInit) || {};
    var newInit = Object.assign({}, sessionInit);
    newInit.requiredFeatures = [space];
    if (sessionInit.requiredFeatures) {
        newInit.requiredFeatures = newInit.requiredFeatures.concat(sessionInit.requiredFeatures);
    }
    return newInit;
}

function AR() {
    var currentSession = null;

    function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded);
        renderer.xr.setSession(session);
        gl = renderer.getContext();
        button.textContent = 'EXIT AR';
        currentSession = session;
        session.requestReferenceSpace('local').then((refSpace) => {
            xrRefSpace = refSpace;
            session.requestAnimationFrame(onXRFrame);
        });
    }

    function onSessionEnded() {
        button.textContent = 'ENTER AR';
        currentSession = null;
    }

    if (currentSession === null) {
        let options = {
            requiredFeatures: ['dom-overlay', 'image-tracking'],
            trackedImages: trackableImages,
            domOverlay: { root: document.body }
        };
        var sessionInit = getXRSessionInit('immersive-ar', {
            mode: 'immersive-ar',
            referenceSpaceType: 'local',
            sessionInit: options
        });
        navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted);
    } else {
        currentSession.end();
    }
}

function onXRFrame(t, frame) {
    const session = frame.session;
    session.requestAnimationFrame(onXRFrame);
    const baseLayer = session.renderState.baseLayer;
    const pose = frame.getViewerPose(xrRefSpace);

    renderer.render(scene, camera);

    if (pose) {
        for (const view of pose.views) {
            const viewport = baseLayer.getViewport(view);
            gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

            const results = frame.getImageTrackingResults();

            for (const result of results) {
                const imageIndex = result.index;
                const pose1 = frame.getPose(result.imageSpace, xrRefSpace);
                if (!pose1) continue;

                const pos = pose1.transform.position;
                const quat = pose1.transform.orientation;

                // 🔹 Determinar qué tres modelos corresponden a este QR
                // (QR 0 → frases 0,1,2 / QR 1 → 3,4,5 / QR 2 → 6,7,8)
                const startIndex = imageIndex * 3;
                const endIndex = startIndex + 3;

                for (let i = startIndex; i < endIndex; i++) {
                    const model = models[i];
                    if (!model) continue; // por si no hay suficientes modelos

                    // Añadir al escenario si no está aún
                    if (!scene.children.includes(model)) {
                        scene.add(model);
                    }

                    // 🔸 Copiar la posición y orientación del QR detectado
                    model.position.copy(pos);
                    model.quaternion.copy(quat);

                    // 🔸 Separar visualmente las frases
                    const offset = (i - startIndex - 1) * 0.08; 
                    // esto da -0.08, 0, +0.08 para izquierda, centro, derecha
                    model.position.x += offset;
                }
            }
        }
    }
}


// === Render loop básico ===
function render() {
    renderer.render(scene, camera);
}

// === Botón principal ===
var button = document.createElement('button');
button.id = 'ArButton';
button.textContent = 'ENTER AR';
button.style.cssText = `
    position: absolute;
    top: 80%;
    left: 40%;
    width: 20%;
    height: 2rem;
`;
document.body.appendChild(button);
button.addEventListener('click', () => AR());
