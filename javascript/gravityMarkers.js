const loader = new THREE.FontLoader();
let  desktopCube, socket;
let clock = new THREE.Clock()
let trackableImages = new Array(9)
let includedModels = []
let qrcodes = {}
let play = false
let planets = [
	'sun',
	'earth',
	'venus',
	'mars',
	'mercury',
	'jupiter',
	'neptune',
	'uranus',
	'staturn'
]
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
]
const sujetos = [
	'El pelo negro',
	'Yo',
	'Mi tia',
	'Esto',
	'Toda la parte baja',
	'Ella',
	'Los colores de esa pintura',
	'El',
	'Mi vientre',
	'una practica',
	'Las unas de mi hija',
	'Las unas de el',
	'Algo',
	'brazos',
	'genitales',
	'Las miradas',
	'el movimiento del ojo',
	'nosotros',
	'esa mirada',
	'La gramatica',
	'Las capas',
	'Alguien',
	'Los besos',
	'alas',
	'La lengua',
	'tu'
]

const verbos = [
'cae', 'hay', 'represento', 'era', 'no existe', 'no siente', 'son', 'imagino', 'dijo', 'siente', 'Corto', 'sublima', 'Son', 'eran', 'Quedan', 'no se controlan', 'andan', 'nos acercan', 'nos ayudan', 'Nos ayudan', 'Saco', 'Oculto', 'Las hago', 'decoro', 'pinto', 'Tiene', 'que se mueven', 'que se hinchan', 'explotan', 'entiendo', 'hacen modificar', 'construye', 'Digo', 'No podemos asegurar', 'da cuenta de', 'Construye', 'constituye', 'Abren', 'cierran', 'dan lugar', 'construyen', 'diria', 'son', 'se construyen', 'Juega', 'Habla', 'Camina', 'se deja lamer', 'son', 'Escriben', 'Aprenden', 'inventan', 'son', 'son', 'son', 'Asistes', 'Gustan', 'Asustan', 'Eres', 'Esperas', 'esperas', 'Miras', 'Preguntas', 'Ries', 'Sabes', 'rompes', 'vuelves'
]

const predicados = [
'sobre mis hombros',
'imagenes que en vez de rostro muestran muecas',
'desnuda tomandome las piernas',
'una representacion mia',
'quiza como ella misma',
'las piernas',
'azul, amarillo y naranja',
'en un vacio-rostro',
'que deseaba mis piernas fuertes',
'Calor',
'Hinchazon',
'Enojo',
'Rabia',
'Frustracion',
'Latidos',
'Calambres',
'ninas creciendo',
'enamoramiento',
'calentura',
'placer',
'las unas de las manos y los pies, mias y de mi hija.',
'la sombra',
'el vacio del yo',
'el enigma',
'delgadas',
'Grandes y largas',
'Por ahi',
'A las bestias',
'a tipear',
'a rascar',
'a acariciar',
'a dar placer',
'a defendernos',
'Las unas',
'largas',
'De colores',
'Impulsos',
'latidos y pensamientos',
'imagenes-sonidos',
'sensaciones somaticas',
'pies en movimiento',
'en electricidad multicolor',
'que no es solo eso',
'los ojos',
'desde donde una mira',
'pero tambien los ojos de otros y otras',
'las pupilas',
'una mirada',
"parece",
'a partir de los gestos nada de cierto',
'lo que sucede somaticamente',
'lo que podria parecer un estado de ser y estar',
'tecnicas del habla',
'una personalidad',
'un estar',
'un configurar y compartir codigos',
'vínculos',
'Posibilidades',
'encuentro',
'distancia',
'la memoria, la perdida de la misma',
'la posibilidad de construir un relato, de variarlo, de volverlo a relatar y que sea distinto',
'la mutacion de la narrativa de la existencia antes y ahora',
'que los besos.',
'presente y distancia',
'tocar sin saber que hay dentro',
'que demonios',
'tuneles',
'en la lengua',
'Silencio',
'Estancia',
'despliegue',
'arrugas',
'nuevas palabras',
'estilos',
'formas de inscripcion',
'como reflejo de eso que son pero no saben que y quienes.',
'la textura de su voz',
'el tono de sus frases',
'las pausas',
'los errores',
'el canto',
'la musica que sale como habla',
'los balbuceos',
'los silbidos.',
'los dibujos de las estrellas',
'los mantos',
'los tapices..',
'Algodones',
'arcoiris',
'dinosaurios de juguete',
'aunque estuviera muerta',
'en el cuerpo momia quedaria el corte mediano con puntas decoloradas de mi forma',
'como prueba de mi existencia.',
'o en su reverso galaxias en movimiento',
'como es arriba es abajo',
'especificamente las rodillas.',
'Mas estridente',
'el color morado y el dorado',
'cariño',
'maternidad',
'dolor',
'expansion',
'expulsion',
'fuerza',
'impulso',
'rectitud',
'postura',
'sueño',
'relajacion',
'a un encuentro de mujeres',
'a un encuentro de mujeres dramaturgas',
'a un encuentro de la nueva dramaturgia iberoamericana, escrita por mujeres que se encuentran',
'los encuentros',
'los encuentros y te dan miedo, tambien',
'las dramaturgas y te dan miedo, tambien',
'dramaturga y es mentira pero es verdad, tambien',
'una mesa de trabajo de dramaturgias expandidas',
'que no te obliguen a participar',
'que no sea como en esas obras de teatro',
'donde rompen la cuarta pared',
'que los actores te hablen',
'que te pregunten cosas',
'que no sea como esas conferencias',
'encontrar asiento',
'que haya una silla en las ultimas filas para sentarte',
'mirar a veces tu celular',
'mirar la nuca de la señora sentada adelante tuyo',
'con la gente que siempre viene a estos encuentros',
'A Esa gente que es tu gente',
'que esto sea mentira pero es verdad, tambien',
'las cosas expandidas',
'la hora en tu celular',
'que no sea una mesa de trabajo',
'esas mesas de trabajo donde se sientan personas',
'que tengan una botellita de agua en su lugar sobre la mesa y un microfono que no funciona',
'que las personas hablen y se encuentren y se den la razon',
'que pregunten si alguien tiene preguntas',
'cuanto va a durar',
'una experta en cosas que se expanden.',
'una experta en cosas que se salen de los bordes, que rebalsan',
'a un encuentro de mujeres dramaturgas expandidas',
'porque eres experta en expansion',
'porque te asustan los encuentros',
'porque buscas un asiento cerca de la salida',
'porque quieres retirarte sin llamar la atencion de las dramaturgas que se expanden',
'tapandote la boca con la mano',
'de expansion',
'de bordes permeables',
'cada dia la cuarta pared y la quinta.'
]

function generarOpcionAleatoria() {
    const sujetoAleatorio = sujetos[Math.floor(Math.random() * sujetos.length)];
    const verboAleatorio = verbos[Math.floor(Math.random() * verbos.length)];
    const predicadoAleatorio = predicados[Math.floor(Math.random() * predicados.length)];

    const opcion = Math.floor(Math.random() * 5) + 1;

    switch (opcion) {
        case 1:
            return `${sujetoAleatorio} ${verboAleatorio} ${predicadoAleatorio}`;
        case 2:
            return `${sujetoAleatorio} ${predicadoAleatorio}`;
        case 3:
            return `${verboAleatorio}`;
        case 4:
            return `${verboAleatorio} ${predicadoAleatorio}`;
        case 5:
            return `${sujetoAleatorio} ${verboAleatorio}`;
    }
}


// masses
let planetMasses =[]
let items = {}
let models = new Array(9)
let bitmaps = {}

let subject = new Array(3)
let verb = new Array(3)
let predicate = new Array(2)


// Lista de textos o frases
let textos = ["Hola", "Bienvenido", "Robótica", "Innovación", "Aprendizaje"]

// Objetos y arreglos para manejar datos
let qrCanvases = {}
let qrBitmaps = {}
let modelosTexto = new Array(textos.length)

// Recorremos cada texto y generamos su modelo + QR
for (let i in textos) {
  let texto = textos[i]

  // Crear elemento HTML donde irá el código QR
  let elementoQR = document.createElement('div')
  elementoQR.id = 'qr' + i

  // Crear geometría simple (esfera pequeña como marcador)
  let geometria = new THREE.SphereGeometry(0.05, 32, 16)
  let material = new THREE.MeshStandardMaterial({ color: 0x0077ff })
  let esfera = new THREE.Mesh(geometria, material)

  // Generar QR del texto
  let qr = new QRCode(elementoQR, texto)
  let canvasQR = qr._oDrawing._elCanvas
  qrCanvases[texto] = canvasQR

  // Convertir a bitmap para usarlo como imagen rastreable
  createImageBitmap(canvasQR).then(bitmap => {
    qrBitmaps[texto] = bitmap
    trackableImages[i] = {
      image: bitmap,
      widthInMeters: 0.1
    }
  })

  // Guardar el modelo asociado al texto
  models[i] = esfera
} 

function xwwwform(jsonObject){
	return Object.keys(jsonObject).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(jsonObject[key])).join('&');
}

let camera, scene, renderer, xrRefSpace, gl;
let poseToArray = (obj) => [obj.x, obj.y, obj.z]

scene = new THREE.Scene();

var cross = (vec1, vec2) => {
	return [
	  vec1[1] * vec2[2] - vec1[2] * vec2[1],
	  vec1[2] * vec2[0] - vec1[0] * vec2[2],
	  vec1[0] * vec2[1] - vec1[1] * vec2[0]
	]
  }
let centerMass = (positions) => {
	let count = 0
	let totals = [0, 0, 0]
	for(let pos of positions){
		totals[0] += pos[0]
		totals[1] += pos[1]
		totals[2] += pos[2]
		count += 1
	}
	return [totals[0]/count, totals[1]/count, totals[2]/count]
}
var sum = (arr) => arr.reduce( ( a, b ) => a + b, 0 )
let turnUnit = (arr) =>{
	if(sum(arr)==0){
		return [0,0,0]
	}
	let mag = Math.sqrt(arr[0]**2 + arr[1]**2 + arr[2]**2)
	return [arr[0]/mag, arr[1]/mag, arr[2]/mag]
}
let calcAngular = (pos, centerMass) =>{
	let ang = [pos[0]-centerMass[0], pos[1]-centerMass[1], pos[2]-centerMass[2]]
	let up = [0, 1, 0]
	return cross(up, ang)
}

let lenSqr = (pos1, pos2) => {
    return (pos2[0]-pos1[0])**2+(pos2[1]-pos1[1])**2+(pos2[2]-pos1[2])**2
}
let verletIntegrate = (positions, force, dt)=>{
    let newPositions = [ 0, 0, 0]
    newPositions[0] = 2*positions[0][0] - positions[1][0] + force[0]*dt**2
    newPositions[1] = 2*positions[0][1] - positions[1][1] + force[1]*dt**2
    newPositions[2] = 2*positions[0][2] - positions[1][2] + force[2]*dt**2
    return newPositions
}
let forceSum = (setOfPositions) => {
    let setOfNetForces = []
    for(position1 of setOfPositions){
        netForce = [0,0,0]
        for(position2 of setOfPositions){
            if(JSON.stringify(position1)!==JSON.stringify(position2)){
                // inverse cube reduces to inverse square when included mag on top.
                forceMag = 0.001/(lenSqr(position1,position2)**(3/2))
                netForce[0] +=  forceMag*(position2[0]-position1[0])
                netForce[1] +=  forceMag*(position2[1]-position1[1])
                netForce[2] +=  forceMag*(position2[2]-position1[2])
            }
        }
        setOfNetForces.push(netForce)
    }
    return setOfNetForces
}

let calcNewPositions = (pos, old, dt) => {
    netForces = forceSum(pos)
    newPos = []
    for(let position in pos){
        newPos.push( verletIntegrate([pos[position],old[position]], netForces[position], dt))
    }
    return newPos
}


var ambient = new THREE.AmbientLight( 0x222222 );
scene.add( ambient );
var directionalLight = new THREE.DirectionalLight( 0xdddddd, 1.5 );
directionalLight.position.set( 0.9, 1, 0.6 ).normalize();
scene.add( directionalLight );
var directionalLight2 = new THREE.DirectionalLight( 0xdddddd, 1 );
directionalLight2.position.set( -0.9, -1, -0.4 ).normalize();
scene.add( directionalLight2 );


camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 20000 );
renderer = new THREE.WebGLRenderer({antialias: true,alpha:true });
renderer.setPixelRatio( window.devicePixelRatio );
camera.aspect = window.innerWidth / window.innerHeight;
renderer.setSize(window.innerWidth, window.innerHeight );
camera.updateProjectionMatrix();
document.body.appendChild( renderer.domElement );	
renderer.xr.enabled = true;

function init() {
	window.addEventListener( 'resize', onWindowResize, false );
}

function getXRSessionInit( mode, options) {
  	if ( options && options.referenceSpaceType ) {
  		renderer.xr.setReferenceSpaceType( options.referenceSpaceType );
  	}
  	var space = (options || {}).referenceSpaceType || 'local-floor';
  	var sessionInit = (options && options.sessionInit) || {};
  
  	// Nothing to do for default features.
  	if ( space == 'viewer' )
  		return sessionInit;
  	if ( space == 'local' && mode.startsWith('immersive' ) )
  		return sessionInit;
  
  	// If the user already specified the space as an optional or required feature, don't do anything.
  	if ( sessionInit.optionalFeatures && sessionInit.optionalFeatures.includes(space) )
  		return sessionInit;
  	if ( sessionInit.requiredFeatures && sessionInit.requiredFeatures.includes(space) )
  		return sessionInit;
  
  	var newInit = Object.assign( {}, sessionInit );
  	newInit.requiredFeatures = [ space ];
  	if ( sessionInit.requiredFeatures ) {
  		newInit.requiredFeatures = newInit.requiredFeatures.concat( sessionInit.requiredFeatures );
  	}
  	return newInit;
   }

function AR(){
	var currentSession = null;
	function onSessionStarted( session ) {
		session.addEventListener( 'end', onSessionEnded );
		renderer.xr.setSession( session );
		gl = renderer.getContext()
		button.style.display = 'none';
		button.textContent = 'EXIT AR';
		currentSession = session;
		session.requestReferenceSpace('local').then((refSpace) => {
          xrRefSpace = refSpace;
          session.requestAnimationFrame(onXRFrame);
        });
	}
	function onSessionEnded( /*event*/ ) {
		currentSession.removeEventListener( 'end', onSessionEnded );
		renderer.xr.setSession( null );
		button.textContent = 'ENTER AR' ;
		currentSession = null;
	}
	if ( currentSession === null ) {
		
        let options = {
            requiredFeatures: ['dom-overlay','image-tracking'],
            trackedImages: trackableImages,
            domOverlay: { root: document.body }
        };
		var sessionInit = getXRSessionInit( 'immersive-ar', {
			mode: 'immersive-ar',
			referenceSpaceType: 'local', // 'local-floor'
			sessionInit: options
		});
		navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );
	} else {
		currentSession.end();
	}
	renderer.xr.addEventListener('sessionstart',
		function(ev) {
			console.log('sessionstart', ev);
			document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)';
			renderer.domElement.style.display = 'none';
		});
	renderer.xr.addEventListener('sessionend',
		function(ev) {
			console.log('sessionend', ev);
			document.body.style.backgroundColor = '';
			renderer.domElement.style.display = '';
		});
}
let newPositions = []
let oldPositions = []
dt = 0.03
function onXRFrame(t, frame) {
const session = frame.session;
session.requestAnimationFrame(onXRFrame);
const baseLayer = session.renderState.baseLayer;
const pose = frame.getViewerPose(xrRefSpace);

	render()
	if (pose && !play) {
		for (const view of pose.views) {
            const viewport = baseLayer.getViewport(view);
            gl.viewport(viewport.x, viewport.y,
                        viewport.width, viewport.height);

			const results = frame.getImageTrackingResults();
			for (const result of results) {
			  // The result's index is the image's position in the trackedImages array specified at session creation
			  const imageIndex = result.index;
			
			  // Get the pose of the image relative to a reference space.
			  const pose1 = frame.getPose(result.imageSpace, xrRefSpace);
			  var model = undefined;
			  pos = pose1.transform.position
			  quat = pose1.transform.orientation
			  //quat.x = Math.PI / 2
			  //quat.y = 1
			//   label
			  if( !includedModels.includes(imageIndex) ){
				let posi = poseToArray(pos)
				newPositions.push(posi)
				let center = centerMass(newPositions)
				let ang = turnUnit(calcAngular(posi, center))
				oldPositions.push( posi.map( (x,i) => x + 3e-3*ang[i]) )
				includedModels.push(imageIndex);
				model = models[imageIndex];
			  	scene.add( model );
			  }else{
				model = models[imageIndex];
			  }
			  const state = result.trackingState;
			  if (state == "tracked") {
				let posi = poseToArray(pos)
				let index = includedModels.indexOf(imageIndex)
				newPositions[index] = posi
				let center = centerMass(newPositions)
				let ang = turnUnit(calcAngular(posi, center))
				oldPositions[index] =  posi.map( (x,i) => x + 3e-3*ang[i]) 
				.position.copy( pos.toJSON());
				model.quaternion.copy(quat.toJSON());
			  } else if (state == "emulated") {
			  }
			}


        }
    }
	if(play){
		let tempPositions = newPositions
		newPositions = calcNewPositions(newPositions, oldPositions, dt)
		oldPositions = tempPositions
		// update positions
		let posIndex = 0
		for(let modelIndex of includedModels){
			model = models[modelIndex];
			model.position.x = newPositions[posIndex][0];
			model.position.y = newPositions[posIndex][1];
			model.position.z = newPositions[posIndex][2];
			// model.quaternion.copy(quat.toJSON()); //ignore for now
			posIndex += 1
		}
	}

}

init()
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
render()
function render() {
	renderer.render( scene, camera );
}


var button = document.createElement( 'button' );
button.id = 'ArButton'
button.textContent = 'ENTRAR A REALIDAD AUMENTADA' ;
button.style.cssText+= `position: absolute;top:80%;left:40%;width:20%;height:2rem;`;
    
document.body.appendChild(button)
document.getElementById('ArButton').addEventListener('click',x=>AR())

document.getElementById('startGravity').addEventListener('click',x=>{
    if(play){
        play = false
		document.getElementById('startGravity').style.background = 'rgba(100,200,100,1)';
        // document.getElementById('startGravity').innerHTML = 'play'
    }else{
        play = true
		document.getElementById('startGravity').style.background = 'rgba(200,100,100,1)';
        // document.getElementById('startGravity').innerHTML = 'stop'
    }
})
