/**
 * Created by Ivan303 on 2015-01-02.
 */
var World = function () {
    this.mesh = new THREE.Object3D();
    this.obstacles = [];

    this.createGround = function (groundLength, groundWidth) { // groundLength, groundWidth w polach
        var ground = new THREE.PlaneGeometry(groundWidth, groundLength);

        var texture = THREE.ImageUtils.loadTexture("images/wall4.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(100,100);

        var material = new THREE.MeshPhongMaterial({ map : texture });

        this.ground = new THREE.Mesh(ground, material);
        this.ground.material.side = THREE.DoubleSide;
        this.ground.castShadow = true;

        this.ground.position.y = -0.5;
        this.ground.position.x = groundWidth/2-1;
        this.ground.position.z = groundLength/2-1;
        this.ground.rotation.x = -Math.PI/2;
        this.mesh.add(this.ground);

        // making ceiling
        this.ceiling = new THREE.Mesh(ground, material);
        this.ceiling.material.side = THREE.DoubleSide;
        this.ceiling.castShadow = true;

        this.ceiling.position.y = 1.4;
        this.ceiling.position.x = groundWidth/2-1;
        this.ceiling.position.z = groundLength/2-1;
        this.ceiling.rotation.x = -Math.PI/2;
        this.mesh.add(this.ceiling);
    };

    this.createWalls = function (maze) {
        this.heightOfWalls = 2;
        var sizeOfCell = 3;
        var sizeOfCellPlusOne = sizeOfCell+1;

        var rows = maze.x;
        var columns = maze.y;
        var cube = new THREE.BoxGeometry(1,1,1);

        var materialForFaces = [];
        for (var i=0; i<6; i++) {
            materialForFaces.push(
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture("images/metal.jpg")
                })
            )
        }
        var material = new THREE.MeshFaceMaterial(materialForFaces);

        // walls in vertices
        for(var i=0; i<rows*sizeOfCellPlusOne+1; i++) {
            for(var j=0; j<columns*sizeOfCellPlusOne+1; j++) {
                if(i%sizeOfCellPlusOne == 0 && j%sizeOfCellPlusOne == 0) {
                    for(var k=0; k<this.heightOfWalls; k++) {
                        var cubeMesh = new THREE.Mesh(cube, material);
                        cubeMesh.position.x = j;
                        cubeMesh.position.z = i;
                        cubeMesh.position.y = k;
                        //position of centroid

                        cubeMesh.geometry.centroid = new THREE.Vector3();
                        for(var p=0; p < cubeMesh.geometry.vertices.length; p++) {
                            cubeMesh.geometry.centroid.add(cubeMesh.geometry.vertices[p]);
                        }

                        this.mesh.add(cubeMesh);
                        this.obstacles.push(cubeMesh);
                    }
                }
            }
        }

        // walls in edges

        //near
        for(var i=1; i<columns*sizeOfCellPlusOne; i++) { // need to close the entrance later
            if(i%sizeOfCellPlusOne != 0) {
                for(var k=0; k<this.heightOfWalls; k++) {
                    var cubeMesh = new THREE.Mesh(cube, material);
                    cubeMesh.position.z = 0;
                    cubeMesh.position.x = i;
                    cubeMesh.position.y = k;
                    this.mesh.add(cubeMesh);
                    this.obstacles.push(cubeMesh);

                }
            }
        }

        //far
        for(var i=1; i<columns*sizeOfCellPlusOne; i++) {
            if(i%sizeOfCellPlusOne != 0) {
                for(var k=0; k<this.heightOfWalls; k++) {
                    var cubeMesh = new THREE.Mesh(cube, material);
                    cubeMesh.position.z = rows * sizeOfCellPlusOne;
                    cubeMesh.position.x = i;
                    cubeMesh.position.y = k;
                    this.mesh.add(cubeMesh);
                    this.obstacles.push(cubeMesh);

                }
            }
        }

        //right
        for(var i=1; i<rows*sizeOfCellPlusOne; i++) {
            if(i%sizeOfCellPlusOne != 0) {
                for(var k=0; k<this.heightOfWalls; k++) {
                    var cubeMesh = new THREE.Mesh(cube, material);
                    cubeMesh.position.z = i;
                    cubeMesh.position.x = 0;
                    cubeMesh.position.y = k;
                    this.mesh.add(cubeMesh);
                    this.obstacles.push(cubeMesh);

                }
            }
        }






        //left
        for(var i=1; i<(rows)*(sizeOfCellPlusOne); i++) {
            if(i%sizeOfCellPlusOne != 0 && i != rows*sizeOfCellPlusOne-2 && i != rows*sizeOfCellPlusOne-1) {
                for(var k=0; k<this.heightOfWalls; k++) {
                    var cubeMesh = new THREE.Mesh(cube, material);
                    cubeMesh.position.x = columns * sizeOfCellPlusOne;
                    cubeMesh.position.z = i;
                    cubeMesh.position.y = k;
                    this.mesh.add(cubeMesh);
                    this.obstacles.push(cubeMesh);

                }
            }
        }



        // doors
        var cuboid = new THREE.BoxGeometry(1,2,2);
        var m = [];
        for (var i=0; i<6; i++) {
            m.push(
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture("images/doomDoors.jpg")
                })
            )
        }
        var mat = new THREE.MeshFaceMaterial(m);
        this.doors = new THREE.Mesh(cuboid,mat);
        this.doors.position.x = columns * sizeOfCellPlusOne;
        this.doors.position.z = rows*sizeOfCellPlusOne-1.5;
        this.doors.position.y = 0.5;
        this.mesh.add(this.doors);
        this.obstacles.push(this.doors);


        //inner walls of maze
        //horizontal; variable verti
        for(var i=0; i<rows-1; i++) {
            for(var j=0; j<columns; j++) {
                if(maze.verti[i][j] == undefined) {
                    for(var k=0; k<sizeOfCell; k++) {
                        for(var l=0; l<this.heightOfWalls; l++) {
                            var cubeMesh = new THREE.Mesh(cube, material);
                            cubeMesh.position.x = j*sizeOfCellPlusOne+k+1;
                            cubeMesh.position.z = i*sizeOfCellPlusOne+sizeOfCellPlusOne;
                            cubeMesh.position.y = l;
                            this.mesh.add(cubeMesh);
                            this.obstacles.push(cubeMesh);

                        }
                    }
                }
            }
        }

        //vertical; variable horiz
        for(var i=0; i<rows; i++) {
            for(var j=0; j<columns-1; j++) {
                if(maze.horiz[i][j] == undefined) {
                    for(var k=0; k<sizeOfCell; k++) {
                        for(var l=0; l<this.heightOfWalls; l++) {
                            var cubeMesh = new THREE.Mesh(cube, material);
                            cubeMesh.position.x = j*sizeOfCellPlusOne+sizeOfCellPlusOne;
                            cubeMesh.position.z = i*sizeOfCellPlusOne+k+1;
                            cubeMesh.position.y = l;
                            this.mesh.add(cubeMesh);
                            this.obstacles.push(cubeMesh);

                        }

                    }
                }
            }
        }

    };

    this.getObstacles = function () {
        return this.obstacles;
    };
};