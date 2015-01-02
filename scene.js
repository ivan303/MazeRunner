/**
 * Created by Ivan303 on 2015-01-02.
 */

var sceneObj;
var Scene = function () {

    this.init = function () {
        // Define the container for the renderer
        //this.container = $('#scene');
        this.container = document.getElementById('scene');


        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(50, this.container.clientWidth/this.container.clientHeight, 0.1, 10000);
        //fairly good coords of camera
        //this.camera.lookAt(new THREE.Vector3(5, 0, 5));
        //this.camera.position.set(-10, 5, -10);

        this.camera.lookAt(new THREE.Vector3(2, 0, 2));
        this.camera.position.set(-25, 15, -25);

        this.scene.add(this.camera);

        this.light = new THREE.DirectionalLight(0xffffff, 0.8);
        this.light.position.set(10, 10, 10);
        this.scene.add(this.light);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColorHex(0xeeeedd, 1.0);


        // Creating maze
        this.mazeObj = new Maze();
        this.maze = this.mazeObj.createMaze(7, 7);
        //this.mazeDrawn = this.mazeObj.displayMaze(this.maze);
        console.log(this.mazeObj.displayMaze(this.maze));


        //for(var i = 0; i<this.maze.horiz.length; i++) {
        //    for(var j = 0; j<this.maze.horiz[i].length; j++) {
        //        console.log(this.maze.horiz[i][j]);
        //    }
        //}

        this.worldObj = new World();
        this.worldObj.createGround(10, 10);
        this.worldObj.createWalls(this.maze);
        this.scene.add(this.worldObj.mesh);

        this.container.appendChild(this.renderer.domElement);




        // things associated with world and character - later
        //this.user = new Character()

        //this.setAspect();
        //this.setControls();
    };

    // Event handlers
    this.setControls = function () {

    };

    this.frame = function () {
        this.renderer.render(this.scene, this.camera);
    }
};