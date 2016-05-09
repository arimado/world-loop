// WORLD LOOP THREE JS PROJECT
// SOURCE TUTORIAL: http://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/

var WL = {};
WL.ENV = {};
WL.SCENE = {};
WL.SCENE.OBJ = {};
WL.EVENT = {};

WL.ENV.color = {
    red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0
};

WL.SCENE.createScene = function () {

    WL.ENV.height = window.innerHeight;
    WL.ENV.width = window.innerWidth;

    // INIT SCENE

    WL.SCENE.scene = new THREE.Scene();
    WL.SCENE.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    // CREATE CAMERA;

    WL.ENV.aspectRatio = WL.ENV.width / WL.ENV.height;
	WL.ENV.fieldOfView = 60; // this is probs a angle a
	WL.ENV.nearPlane = 1; //
	WL.ENV.farPlane = 10000; //


	WL.SCENE.camera = new THREE.PerspectiveCamera(
        WL.ENV.fieldOfView,
		WL.ENV.aspectRatio,
		WL.ENV.nearPlane,
		WL.ENV.farPlane
	);

    // SET CAMERA

    WL.SCENE.camera.position.x = 0;
    WL.SCENE.camera.position.z = 200;
    WL.SCENE.camera.position.y = 100;

    // CREATE RENDERER

    WL.SCENE.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    // DEFINE SIZE
    WL.SCENE.renderer.setSize(WL.ENV.width, WL.ENV.height);

    // ENABLE SHADOW
    WL.SCENE.renderer.shadowMap.enabled = true;

    // add the DOM element of the rendere to the container element we created a
    WL.SCENE.container = document.getElementById('world');
    WL.SCENE.container.appendChild(WL.SCENE.renderer.domElement);

    window.addEventListener('resize', WL.EVENT.handleWindowResize, false);

};

WL.SCENE.createLights = function () {

    // gradient color light
    // THREE.HemisphereLight(skycolor, groundcolor, intensity);
    WL.SCENE.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

    // a directional light
    //DirectionalLight(color, intensity);
    WL.SCENE.shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    WL.SCENE.shadowLight.position.set(150, 350, 350);
    WL.SCENE.shadowLight.casting = true;

    // define visible area of projected shadow
    WL.SCENE.shadowLight.shadow.camera.left = -400;
	WL.SCENE.shadowLight.shadow.camera.right = 400;
	WL.SCENE.shadowLight.shadow.camera.top = 400;
	WL.SCENE.shadowLight.shadow.camera.bottom = -400;
	WL.SCENE.shadowLight.shadow.camera.near = 1;
	WL.SCENE.shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better,
	// but also the more expensive and less performant
	WL.SCENE.shadowLight.shadow.mapSize.width = 2048;
	WL.SCENE.shadowLight.shadow.mapSize.height = 2048;

    WL.SCENE.scene.add(WL.SCENE.hemisphereLight);
    WL.SCENE.scene.add(WL.SCENE.shadowLight);

};

WL.SCENE.OBJ.Sea = function () {
    // create a geometry ----------------------
    // Rad-top, Rad-bot, height, segments on radius,
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate it
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    // create a material -----------------------
    var mat = new THREE.MeshPhongMaterial({
        color: WL.ENV.color.blue,
        transparent: true,
        opacity: .6,
        shading: THREE.FlatShading
    });
    // pass them into a mesh -------------------
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    // add the mesh to our scene ---------------
};

WL.SCENE.createSea = function () {
    WL.SCENE.OBJ.sea = new WL.SCENE.OBJ.Sea();
    WL.SCENE.OBJ.sea.mesh.position.y = -600;
    WL.SCENE.scene.add(WL.SCENE.OBJ.sea.mesh);
}


WL.EVENT.handleWindowResize = function () {
    WL.ENV.height = window.innerHeight;
    WL.ENV.width = window.innerWidth;
    WL.SCENE.renderer.setSize(WL.ENV.width, WL.ENV.height);
    WL.SCENE.camera.aspect = WL.ENV.width /  WL.ENV.height;
    console.log('resizing');
}


WL.init = function () {

    // // set up the scene, the camera and the renderer
    WL.SCENE.createScene();
    WL.SCENE.createLights();
    WL.SCENE.createSea();
    WL.SCENE.renderer.render(WL.SCENE.scene, WL.SCENE.camera);

    //
    // // add the lights

    //
    // // add the objects
    // createPlane();
    // createSea();
    // createSky();
    //
    // // start a loop that will update the objects' positions
    // // and render the scene on each frame
    // loop();

    console.log('initialised');

};

window.addEventListener('load', WL.init, false);
