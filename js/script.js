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

WL.SCENE.OBJ.Cloud = function () {
    // empty container
    this.mesh = new THREE.Object3D();
    // create cube geometry
    var geom = new THREE.BoxGeometry(20, 20, 20);

    //create a material
    var mat = new THREE.MeshPhongMaterial({color: WL.ENV.color.white});

    //duplicate the geom x mat a random number of times
    var nBlocs = 3+Math.floor(Math.random()*3) // generate always at least 3 blocks
    for (var i = 0; i < nBlocs; i += 1) {

        var m = new THREE.Mesh(geom, mat);

        // set position
        m.position.x = i * 15; //why this?
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;

        // random rotation to a factor of idk 2 or something
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        // set random size
        var s = .1 + Math.random() * .9 // rand num between .1 and .9999999
        m.scale.set(s, s, s);

        // allow each cube to cast and to receive shadows
        m.castShadow = true;
        m.receiveShadow = true;

        // add cube to the container we created
        this.mesh.add(m);
        console.log('cloud');
    }
};

WL.SCENE.OBJ.Sky = function () {
    // empty container
    this.mesh = new THREE.Object3D();

    // part of the sky object that will be created
    this.nClouds = 1000;                                                            // TEST IF THIS WORKS
                                                                                // Not assigned to this
    // equal angle between clouds
    // 2PI is equal to a circle
    var stepAngle = Math.PI * 2 / this.nClouds;

    for (var i = 0; i < this.nClouds; i += 1) {

        var cloud = new WL.SCENE.OBJ.Cloud();

        // set rotation and position of each cloud
        var angle = stepAngle * i;
        var height = 750 + Math.random() * 200;                                 // Check if this is
                                                                                // Actually height
        //convert polar coordinates (angle distance) into
        //cartesian coordinates
        cloud.mesh.position.y = Math.sin(angle) * height;
        cloud.mesh.position.x = Math.cos(angle) * height;
        cloud.mesh.position.z = -400-Math.random()*400;
        //rotate cloud according to its position
        cloud.mesh.rotation.z = angle + Math.PI/2;                              // Just check if all these
                                                                                // do what you think they do
        // set random scale for each cloud
        var scale = 1 + Math.random() * 2;
        cloud.mesh.scale.set(scale, scale, scale);

        this.mesh.add(cloud.mesh);
    }
}

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
    WL.SCENE.camera.position.z = 200; // ORIGINAL 200
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

WL.SCENE.createSea = function () {
    WL.SCENE.OBJ.sea = new WL.SCENE.OBJ.Sea();
    WL.SCENE.OBJ.sea.mesh.position.y = -600;
    WL.SCENE.scene.add(WL.SCENE.OBJ.sea.mesh);
};

WL.SCENE.createSky = function () {
    WL.SCENE.OBJ.sky = new WL.SCENE.OBJ.Sky();
    WL.SCENE.OBJ.sky.mesh.position.y = -600;
    WL.SCENE.scene.add(WL.SCENE.OBJ.sky.mesh);
};

WL.EVENT.handleWindowResize = function () {
    WL.ENV.height = window.innerHeight;
    WL.ENV.width = window.innerWidth;
    WL.SCENE.renderer.setSize(WL.ENV.width, WL.ENV.height);
    WL.SCENE.camera.aspect = WL.ENV.width /  WL.ENV.height;
    console.log('resizing');
};

WL.init = function () {

    // // set up the scene, the camera and the renderer
    WL.SCENE.createScene();
    WL.SCENE.createLights();
    WL.SCENE.createSea();
    WL.SCENE.createSky();
    WL.loop();
    console.log('initialised');

};


WL.loop = function () {
    WL.SCENE.OBJ.sea.mesh.rotation.z += .005;
    WL.SCENE.OBJ.sky.mesh.rotation.z += .01;
    WL.SCENE.renderer.render(WL.SCENE.scene, WL.SCENE.camera);
    requestAnimationFrame(WL.loop);
}

window.addEventListener('load', WL.init, false);
