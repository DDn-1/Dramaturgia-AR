function AR(){
    var currentSession = null;

    // ======== NUEVO: capa de texto ========
    function showOverlayText(text){
        let overlay = document.getElementById('ar-overlay-text');
        if(!overlay){
            overlay = document.createElement('div');
            overlay.id = 'ar-overlay-text';
            overlay.style.position = 'absolute';
            overlay.style.top = '1rem';
            overlay.style.left = '1rem';
            overlay.style.zIndex = '10000';
            overlay.style.fontSize = '1.5rem';
            overlay.style.color = 'white';
            overlay.style.textShadow = '0 0 6px black';
            overlay.style.fontFamily = 'Arial, sans-serif';
            document.body.appendChild(overlay);
        }
        overlay.textContent = text;
    }
    // =====================================

    function startWebXRSession() {
        const sessionInit = {
			requiredFeatures: ['dom-overlay', 'image-tracking'],
			trackedImages: trackableImages,
			domOverlay: { root: document.body }
		};
        return navigator.xr.requestSession('immersive-ar', sessionInit);
    }

    function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded);
        renderer.xr.setSession(session);
        gl = renderer.getContext();
        if (typeof button !== 'undefined') button.textContent = 'EXIT AR';
        currentSession = session;
        session.requestReferenceSpace('local').then((refSpace) => {
            xrRefSpace = refSpace;
            session.requestAnimationFrame(onXRFrame);
        });

        // Mostrar texto sobre la cámara
        showOverlayText("Modo Realidad Aumentada Activo 🚀");
    }

    function onSessionEnded(){
        try { currentSession.removeEventListener('end', onSessionEnded); } catch(e){}
        renderer.xr.setSession(null);
        if (typeof button !== 'undefined') button.textContent = 'ENTER AR';
        currentSession = null;

        // Eliminar texto al salir
        let overlay = document.getElementById('ar-overlay-text');
        if(overlay) overlay.remove();
    }

    if (currentSession && typeof currentSession.end === 'function') {
        currentSession.end();
        return;
    }

    // ======== Fallback: cámara normal ========
    function fallbackToGetUserMedia() {
        console.warn("Usando cámara normal (fallback).");
        let v = document.getElementById('ar-fallback-video');
        if (!v) {
            v = document.createElement('video');
            v.id = 'ar-fallback-video';
            v.autoplay = true;
            v.playsInline = true;
            v.style.position = 'absolute';
            v.style.top = '0';
            v.style.left = '0';
            v.style.width = '100vw';
            v.style.height = '100vh';
            v.style.objectFit = 'cover';
            v.style.zIndex = 9999;
            document.body.appendChild(v);
        }

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
            .then(stream => {
                v.srcObject = stream;
                if (typeof button !== 'undefined') button.textContent = 'EXIT CAMERA';

                // Mostrar texto también en fallback
                showOverlayText("Vista de Cámara Activada 📷");

                if (!document.getElementById('stopCameraBtn')) {
                    const stopBtn = document.createElement('button');
                    stopBtn.id = 'stopCameraBtn';
                    stopBtn.textContent = 'Cerrar cámara';
                    stopBtn.style.position = 'absolute';
                    stopBtn.style.top = '1rem';
                    stopBtn.style.right = '1rem';
                    stopBtn.style.zIndex = 10000;
                    document.body.appendChild(stopBtn);

                    stopBtn.addEventListener('click', () => {
                        stream.getTracks().forEach(t => t.stop());
                        v.remove();
                        stopBtn.remove();
                        if (typeof button !== 'undefined') button.textContent = 'Entrar a Realidad Aumentada';
                        let overlay = document.getElementById('ar-overlay-text');
                        if(overlay) overlay.remove();
                    });
                }
            })
            .catch(err => {
                console.error('No se pudo abrir la cámara con getUserMedia:', err);
                alert('No se pudo abrir la cámara. Revisa permisos o usa un dispositivo compatible con WebXR.');
            });
    }

    // ======== Lógica principal ========
    if (!navigator.xr) {
        console.warn("WebXR no disponible en este navegador. Usando cámara normal.");
        fallbackToGetUserMedia();
        return;
    }

    navigator.xr.isSessionSupported('immersive-ar')
        .then((supported) => {
            if (supported) {
                startWebXRSession()
                    .then(onSessionStarted)
                    .catch(err => {
                        console.warn("Fallo al crear sesión WebXR:", err);
                        fallbackToGetUserMedia();
                    });
            } else {
                console.warn("immersive-ar no soportado en este dispositivo.");
                fallbackToGetUserMedia();
            }
        })
        .catch(err => {
            console.warn("Error verificando isSessionSupported:", err);
            fallbackToGetUserMedia();
        });
}
