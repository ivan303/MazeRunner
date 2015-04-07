/**
 * Created by Ivan303 on 2015-01-02.
 */

var sceneObj;
var Scene = function () {
    this.init = function () {
        // Define the container for the renderer
        this.container = document.getElementById('scene');

        this.clock = new THREE.Clock();

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

        this.camera = new THREE.PerspectiveCamera(50, this.container.clientWidth/this.container.clientHeight, 0.1, 10000);
        
        this.camera.position.set(1, 0.5, 1);
        this.camera.up = new THREE.Vector3(0,1,0);
        this.camera.rotation.order = "YXZ";
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        //settings of FirstPersonControls
        this.camControls = new THREE.FirstPersonControls(this.camera);

        this.camControls.lookSpeed = 0.1;
        this.camControls.movementSpeed = 5;
        this.camControls.noFly = true;
        this.camControls.activeLook = true;
        this.camControls.lookVertical = false;
        this.camControls.lon = 90;
        this.camControls.phi = 90;

        this.collisionsObj = new Collisions(this.camera);

        this.scene.add(this.camera);
        this.light = new THREE.SpotLight(0xffffff,2);
        
        this.light.angle = Math.PI/2;
        
        this.camera.add(this.light.target);
        this.light.target.position.set(0,0,-1);
        
        this.camera.add(this.light);
        
        this.animateDoors = false;


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColorHex(0xffffff, 1.0);

        // Creating maze
        this.mazeLength = 10;
        this.mazeWidth = 10;


        this.mazeObj = new Maze();
        this.maze = this.mazeObj.createMaze(this.mazeLength, this.mazeWidth);
        console.log(this.mazeObj.displayMaze(this.maze));

        this.worldObj = new World();
        this.worldObj.createGround(this.mazeLength*4+2, this.mazeWidth*4+2);
        this.worldObj.createWalls(this.maze);
        this.scene.add(this.worldObj.mesh);

        this.container.appendChild(this.renderer.domElement);
        this.setControls();
    };

    // Event handlers
    this.setControls = function () {

        var scene = this;

        var controls = {
            left: false,
            up: false,
            right: false,
            down: false
        };

        $(document).keydown(function (e) {
            var prevent = true;

            switch (e.keyCode) {
                case 37:
                    controls.left = true;
                    break;
                case 38:
                    controls.up = true;
                    break;
                case 39:
                    controls.right = true;
                    break;
                case 40:
                    controls.down = true;
                    break;
                default:
                    prevent = false;
            }

            if(prevent) {
                e.preventDefault();
            }
            else {
                return;
            }


            scene.setPositionOfCamera(controls);
        });

        $(document).keyup(function (e) {
            var prevent = true;

            switch(e.keyCode) {
                case 37:
                    controls.left = false;
                    break;
                case 38:
                    controls.up = false;
                    break;
                case 39:
                    controls.right = false;
                    break;
                case 40:
                    controls.down = false;
                    break;
                default:
                    prevent = false;
            }

            if (prevent) {
                e.preventDefault();
            }
            else {
                return;
            }


            scene.setPositionOfCamera(controls);
        });

        $(window).resize(function () {
            scene.setAspect();
        })
    };

    this.createVectorsToCast = function () {
        //creating vector to cast ray
        var vectors = [];
        var vector = this.camControls.target.clone().sub(this.camControls.object.position).normalize();
        var vectorBack = new THREE.Vector3(-vector.x, vector.y, -vector.z);
        var vectorRight, vectorLeft;
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;



        if(x < 0 && z > 0) {
            vectorRight = new THREE.Vector3((-1-x), y, -(1-z));
            vectorLeft = new THREE.Vector3(-(-1-x), y, (1-z));
        }
        if(x < 0 && z < 0) {
            vectorRight = new THREE.Vector3(-(-1-x), y, (-1-z));
            vectorLeft = new THREE.Vector3((-1-x), y, -(-1-z));
        }
        if(x > 0 &&z < 0) {
            vectorRight = new THREE.Vector3((1-x), y, -(-1-z));
            vectorLeft = new THREE.Vector3(-(1-x), y, (-1-z));
        }
        if(x > 0 && z > 0) {
            vectorRight = new THREE.Vector3(-(1-x), y, (1-z));
            vectorLeft = new THREE.Vector3((1-x), y, -(1-z));
        }

        var vectors = [];
        vectors.push(vector);
        vectors.push(vectorBack);
        vectors.push(vectorRight);
        vectors.push(vectorLeft);

        return vectors;
    };

    this.frame = function () {

        var delta = this.clock.getDelta();
        var vectors = this.createVectorsToCast();

        var prohibitMovement = this.collisionsObj.detectCollision(vectors);
        this.camControls.update(delta, prohibitMovement);

        if(this.camControls.object.position.x >= this.mazeWidth*4-2 && this.camControls.object.position.z >= this.mazeLength*4-2)
            this.animateDoors = true;

        if(this.animateDoors)
            this.liftDoors();

        this.renderer.render(this.scene, this.camera);
    };

    this.liftDoors = function () {
        if(this.worldObj.doors.position.y <= 2.5)
            this.worldObj.doors.position.y += 0.01;
    };

    this.setPositionOfCamera = function (controls) {

        if(this.camera){
            if(controls.up) {
                this.camera.position.z += 0.2;
            }
            if(controls.left) {
                this.rotateAroundWorldAxis(this.camera, new THREE.Vector3(0,1,0), -1);
            }
            if(controls.right) {
                this.rotateAroundWorldAxis(this.camera, new THREE.Vector3(0,1,0), 1);
            }
            if(controls.down) {
                this.camera.position.z -= 0.2;
            }
        }

    };

    this.rotateAroundWorldAxis = function (mesh, axis, degrees) {
        var radians = this.deg2ra(degrees);
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        rotWorldMatrix.multiply(mesh.matrix);
        mesh.matrix = rotWorldMatrix;

        mesh.rotation.setEulerFromRotationMatrix(mesh.matrix);
    };

    this.deg2ra = function (degrees) {
        return degrees*(Math.PI/180);
    };

    this.setAspect = function () {
        var w = this.container.clientWidth;
        var h = this.container.clientHeight;

        this.renderer.setSize(w, h);
        this.camera.aspect = w/h;
        this.camera.updateProjectionMatrix();
    };
};