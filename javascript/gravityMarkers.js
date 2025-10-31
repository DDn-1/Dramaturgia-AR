let trackableImages = new Array(9);
let qrcodes = {};
let models = new Array(9);
let bitmaps = {};
let includedModels = [];

let planets = [
    'sun',
    'earth',
    'venus',
    'mars',
    'mercury',
    'jupiter',
    'neptune',
    'uranus',
    'saturn'
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
    0x20c0fe
];

// === Crear modelos y QR ===
let fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    for (let i in planets) {
        let planetName = planets[i];
        let el = document.createElement('div');
        el.id = 'qr' + planetName;

        // Crear texto 3D
        let textGeometry = new THREE.TextGeometry(planetName.toUpperCase(), {
            font: font,
            size: 0.05,
            height: 0.01,
            curveSegments: 12,
        });
        textGeometry.computeBoundingBox();

        // Centrar el texto
        const centerOffsetX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        const centerOffsetY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
        const centerOffsetZ = -0.5 * (textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z);
        textGeometry.translate(centerOffsetX, centerOffsetY, centerOffsetZ);

        // Material y mesh
        let textMaterial = new THREE.MeshStandardMaterial({ color: planetColors[i] });
        let textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Crear un grupo para manipular la rotación correctamente
        let textGroup = new THREE.Group();
        textGroup.add(textMesh);
        textGroup.position.y = 0.02; // elevar un poco el texto

        // === Definir rotación como quaternion offset ===
        // Queremos que esté echado sobre el plano
        let offsetEuler = new THREE.Euler(-Math.PI / 2, 0, 0, 'XYZ');
        let offsetQuaternion = new THREE.Quaternion().setFromEuler(offsetEuler);

        // Guardar el offset en userData para aplicarlo en onXRFrame
        textGroup.userData.offsetQuaternion = offsetQuaternion;

        // Guardar modelo
        models[i] = textGroup;

        // === Generar QR e imagen rastreable ===
        qrcodes[planetName] = (new QRCode(el, planetName))._oDrawing._elCanvas;
        createImageBitmap(qrcodes[planetName]).then((x) => {
            bitmaps[planetName] = x;
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
