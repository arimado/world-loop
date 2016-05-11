// WORLD LOOP THREE JS PROJECT
// SOURCE TUTORIAL: http://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/

var WL = {};
WL.UTIL = {};
WL.ENV = {};
WL.SCENE = {};
WL.SCENE.OBJ = {};
WL.EVENT = {};

WL.UTIL.normalize = function (v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

WL.ENV.color = {
    red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0
};

WL.ENV.mousePos = {x: 0, y:0};

WL.SCENE.OBJ.Sea = function () {
    // create a geometry ----------------------
    // Rad-top, Rad-bot, height, segments on radius,
    var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate it
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // merge verticies - ensures continuity of waves
    geom.mergeVertices();

    // get verticies length
    var numOfVertices = geom.vertices.length;

    // this will store data associated to each vertex
    this.waves = [];

    for (var i = 0; i < numOfVertices; i += 1) {
        var v = geom.vertices[i];

        var waveData = {};
        waveData.y = v.y;
        waveData.x = v.x;
        waveData.z = v.z;
        waveData.ang = Math.random() * Math.PI * 2;
        waveData.amp = 5 + Math.random() * 0.032;
        waveData.speed = 0.016 + Math.random() * 0.032;

        this.waves.push(waveData);
    };

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

WL.SCENE.OBJ.Sea.prototype.moveWaves = function () {
    var verts = this.mesh.geometry.vertices;
    var numOfVertices = verts.length;

    // update position of verticies
    for  (var i = 0; i < numOfVertices; i += 1) {
        var v = verts[i];
        var vprops = this.waves[i];

        v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

        vprops.ang += vprops.speed;
    }

    this.mesh.geometry.verticesNeedUpdate = true;

    WL.SCENE.OBJ.sea.mesh.rotation.z += .005;
}

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
    this.nClouds = 30;                                                            // TEST IF THIS WORKS
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

WL.SCENE.OBJ.Plane = function () {
    // create geomtries
    // create material
    // add geom to mesh
    // create 4 geomoties and materials and add them to the container mesh

    this.mesh = new THREE.Object3D();

    // COCKPIT
    var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
    var matCockpit = new THREE.MeshPhongMaterial(
        {color: WL.ENV.color.red,
         shading: THREE.FlatShading});

     geomCockpit.vertices[4].y-=10;
     geomCockpit.vertices[4].z+=20;
     geomCockpit.vertices[5].y-=20;
     geomCockpit.vertices[5].z-=20;
     geomCockpit.vertices[6].y+=30;
     geomCockpit.vertices[6].z+=20;
     geomCockpit.vertices[7].y+=30;
     geomCockpit.vertices[7].z-=20;

    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    this.mesh.add(cockpit);

    // CREATE ENGINE
    var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
    var matEngine = new THREE.MeshPhongMaterial({color:WL.ENV.color.white,
         shading:THREE.FlatShading});
    var engine = new THREE.Mesh(geomEngine, matEngine);

    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // TAIL
    var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	var matTailPlane = new THREE.MeshPhongMaterial({color:WL.ENV.color.red,
        shading:THREE.FlatShading});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);

    tailPlane.position.set(-35,25,0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;

	this.mesh.add(tailPlane);

    // Create the wing
	var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
	var matSideWing = new THREE.MeshPhongMaterial({color:WL.ENV.color.red,
        shading:THREE.FlatShading});
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

	// propeller
	var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
	var matPropeller = new THREE.MeshPhongMaterial({color:WL.ENV.color.brown,
         shading:THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller); // WHATS
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;

	// blades
	var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
	var matBlade = new THREE.MeshPhongMaterial({color:WL.ENV.color.brownDark,
         shading:THREE.FlatShading});
	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8,0,0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.add(blade);
	this.propeller.position.set(50,0,0);
	this.mesh.add(this.propeller);

    // PILOT
    this.pilot = new WL.SCENE.OBJ.Pilot();
    this.pilot.mesh.position.set(-10, 27, 0);
    this.mesh.add(this.pilot.mesh);
};

WL.SCENE.OBJ.Pilot = function () {

    this.mesh = new THREE.Object3D();

    this.mesh.name = "pilot";
    this.angleHairs = 0;

    // BODY
    var bodyGeom = new THREE.BoxGeometry(15,15,15);
	var bodyMat = new THREE.MeshPhongMaterial({color:WL.ENV.color.brown, shading:THREE.FlatShading});
	var body = new THREE.Mesh(bodyGeom, bodyMat);
	body.position.set(2,-12,0);
	this.mesh.add(body);

    //FACE ******
    var faceGeom = new THREE.BoxGeometry(10,10,10);
	var faceMat = new THREE.MeshLambertMaterial({color:WL.ENV.color.pink});
	var face = new THREE.Mesh(faceGeom, faceMat);
	this.mesh.add(face);

    // HAIR ******
    var hairGeom = new THREE.BoxGeometry(4,4,4);
	var hairMat = new THREE.MeshLambertMaterial({color:WL.ENV.color.brown});
	var hair = new THREE.Mesh(hairGeom, hairMat);
	// Align the shape of the hair to its bottom boundary, that will make it easier to scale.
	hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));

    var hairs = new THREE.Object3D();

    this.hairsTop = new THREE.Object3D();

    for ( var i = 0; i < 12; i += 1) {
        var h = hair.clone(); // calling this on an 3DObject
        var col = i % 3;
        var row = Math.floor(i/3);
        var startPosZ = -4;
        var startPosX = -4;
        h.position.set(startPosX + row*4, 0, startPosZ + col*4);
        this.hairsTop.add(h);
    }

    hairs.add(this.hairsTop);

    // SIDE HAIR

    var hairSideGeom = new THREE.BoxGeometry(12,4,2);
	hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
	var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
	var hairSideL = hairSideR.clone();
	hairSideR.position.set(8,-2,6);
	hairSideL.position.set(8,-2,-6);
	hairs.add(hairSideR);
	hairs.add(hairSideL);

    // create the hairs at the back of the head
	var hairBackGeom = new THREE.BoxGeometry(2,8,10);
	var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
	hairBack.position.set(-1,-4,0)
	hairs.add(hairBack);
	hairs.position.set(-5,5,0);
    this.mesh.add(hairs);

    // GLASS

    var glassGeom = new THREE.BoxGeometry(5,5,5);
	var glassMat = new THREE.MeshLambertMaterial({color:WL.ENV.color.brown});
	var glassR = new THREE.Mesh(glassGeom,glassMat);
	glassR.position.set(6,0,3);
	var glassL = glassR.clone();
	glassL.position.z = -glassR.position.z

	var glassAGeom = new THREE.BoxGeometry(11,1,11);
	var glassA = new THREE.Mesh(glassAGeom, glassMat);
	this.mesh.add(glassR);
	this.mesh.add(glassL);
	this.mesh.add(glassA);

    var earGeom = new THREE.BoxGeometry(2,3,2);
	var earL = new THREE.Mesh(earGeom,faceMat);
	earL.position.set(0,0,-6);
	var earR = earL.clone();
	earR.position.set(0,0,6);
	this.mesh.add(earL);
	this.mesh.add(earR);

}

WL.SCENE.OBJ.Pilot.prototype.updateHairs = function () {
    var hairs = this.hairsTop.children;
    var l = hairs.length;
    for (var i = 0; i < 1; i++) {
        var h = hairs[i];
        h.scale.y = .75 + Math.cos(this.angleHairs + i/3) * .25
    }
    this.angleHairs += 0.16
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

WL.SCENE.createPlane = function () {
    WL.SCENE.OBJ.plane = new WL.SCENE.OBJ.Plane ();
    WL.SCENE.OBJ.plane.mesh.scale.set(.25, .25, .25);
    WL.SCENE.OBJ.plane.mesh.position.y = 100;
    WL.SCENE.scene.add(WL.SCENE.OBJ.plane.mesh);
};

WL.SCENE.updatePlane = function () {
    // move plane witihn limited coordinates
    var targetX = WL.UTIL.normalize(WL.ENV.mousePos.x, -1, 1, -100, 100);
    var targetY = WL.UTIL.normalize(WL.ENV.mousePos.y, -1, 1, 25, 175);

    WL.SCENE.OBJ.plane.mesh.position.y = targetY;
    WL.SCENE.OBJ.plane.mesh.position.x = targetX;
    WL.SCENE.OBJ.plane.propeller.rotation.x += 0.3;
}

WL.EVENT.handleWindowResize = function () {
    WL.ENV.height = window.innerHeight;
    WL.ENV.width = window.innerWidth;
    WL.SCENE.renderer.setSize(WL.ENV.width, WL.ENV.height);
    WL.SCENE.camera.aspect = WL.ENV.width /  WL.ENV.height;
    console.log('resizing');
};

WL.EVENT.handleMouseMove = function (event) {
    // Normalize mouse coordinates between -1/1
    WL.ENV.mousePos.x = -1 + (event.clientX / WL.ENV.width) * 2;
    WL.ENV.mousePos.y = 1 - (event.clientY / WL.ENV.height) * 2;
}

WL.init = function () {
    // // set up the scene, the camera and the rendere
    WL.SCENE.createScene();
    WL.SCENE.createLights();
    WL.SCENE.createSea();
    WL.SCENE.createSky();
    WL.SCENE.createPlane();

    // listener

    document.addEventListener('mousemove', WL.EVENT.handleMouseMove, false);

    WL.loop();
    console.log('initialised');
};

WL.loop = function () {
    WL.SCENE.OBJ.plane.propeller.rotation.x += 0.3;
    WL.SCENE.OBJ.sea.mesh.rotation.z += .005;
    WL.SCENE.OBJ.sea.moveWaves();
    WL.SCENE.OBJ.sky.mesh.rotation.z += .01;
    WL.SCENE.updatePlane();
    WL.SCENE.OBJ.plane.pilot.updateHairs();
    WL.SCENE.renderer.render(WL.SCENE.scene, WL.SCENE.camera);
    requestAnimationFrame(WL.loop);
}

window.addEventListener('load', WL.init, false);
