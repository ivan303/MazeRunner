/**
 * Created by Ivan303 on 2015-01-02.
 */
var World = function () {
    this.mesh = new THREE.Object3D();

    this.createGround = function (groundLength, groundWidth) { // groundLength, groundWidth w polach

        var ground = new THREE.PlaneGeometry(100, 100);
        var material = new THREE.MeshLambertMaterial({
            color: 0x00ff00
        });


        this.ground = new THREE.Mesh(ground, material);
        this.ground.position.y = -0.5;
        this.ground.position.x = 2;
        this.ground.position.z = 3;
        this.ground.rotation.x = -Math.PI/2;
        this.mesh.add(this.ground);

        //material.color.set(0x00ff00);
        //var cube = new THREE.CubeGeometry(2,2,2);
        //this.cube = new THREE.Mesh(cube, material);
        //this.cube.position.x = 4;
        //this.mesh.add(this.cube);
    };

    this.createWalls = function (maze) {
        var sizeOfCell = 3;
        var sizeOfCellPlusOne = sizeOfCell+1;

        var rows = maze.x;
        var columns = maze.y;
        var cube = new THREE.CubeGeometry(1,1,1);
        var material = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });

        // walls in vertices
        for(var i=0; i<rows*sizeOfCellPlusOne+1; i++) {
            for(var j=0; j<columns*sizeOfCellPlusOne+1; j++) {
                if(i%sizeOfCellPlusOne == 0 && j%sizeOfCellPlusOne == 0) {
                    var cubeMesh = new THREE.Mesh(cube, material);
                    cubeMesh.position.x = j;
                    cubeMesh.position.z = i;
                    this.mesh.add(cubeMesh);

                    var cubeMesh = new THREE.Mesh(cube, material);
                    cubeMesh.position.x = j;
                    cubeMesh.position.z = i;
                    cubeMesh.position.y = 1;
                    this.mesh.add(cubeMesh);
                }
            }
        }

        // walls in edges

        //near
        for(var i=sizeOfCellPlusOne+1; i<columns*sizeOfCellPlusOne; i++) { // need to close the entrance later
            if(i%sizeOfCellPlusOne != 0) {
                var cubeMesh = new THREE.Mesh(cube, material);
                cubeMesh.position.z = 0;
                cubeMesh.position.x = i;
                this.mesh.add(cubeMesh);
            }
        }

        //far
        for(var i=1; i<columns*sizeOfCellPlusOne; i++) {
            if(i%sizeOfCellPlusOne != 0) {
                var cubeMesh = new THREE.Mesh(cube, material);
                cubeMesh.position.z = rows*sizeOfCellPlusOne;
                cubeMesh.position.x = i;
                this.mesh.add(cubeMesh);
            }
        }

        //right
        for(var i=1; i<rows*sizeOfCellPlusOne; i++) {
            if(i%sizeOfCellPlusOne != 0) {
                var cubeMesh = new THREE.Mesh(cube, material);
                cubeMesh.position.z = i;
                cubeMesh.position.x = 0;
                this.mesh.add(cubeMesh);
            }
        }

        //left
        for(var i=1; i<rows*(sizeOfCellPlusOne-1); i++) {
            if(i%sizeOfCellPlusOne != 0) {
                var cubeMesh = new THREE.Mesh(cube, material);
                cubeMesh.position.x = columns*sizeOfCellPlusOne;
                cubeMesh.position.z = i;
                this.mesh.add(cubeMesh);
            }
        }


        //inner walls of maze
        //horizontal; variable verti
        for(var i=0; i<rows-1; i++) {
            for(var j=0; j<columns; j++) {
                if(maze.verti[i][j] == undefined) {
                    for(var k=0; k<sizeOfCell; k++) {
                        var cubeMesh = new THREE.Mesh(cube, material);
                        cubeMesh.position.x = j*sizeOfCellPlusOne+k+1;
                        cubeMesh.position.z = i*sizeOfCellPlusOne+sizeOfCellPlusOne;
                        this.mesh.add(cubeMesh);
                    }
                }
            }
        }

        //vertical; variable horiz
        for(var i=0; i<rows; i++) {
            for(var j=0; j<columns-1; j++) {
                if(maze.horiz[i][j] == undefined) {
                    for(var k=0; k<sizeOfCell; k++) {
                        var cubeMesh = new THREE.Mesh(cube, material);
                        cubeMesh.position.x = j*sizeOfCellPlusOne+sizeOfCellPlusOne;
                        cubeMesh.position.z = i*sizeOfCellPlusOne+k+1;
                        this.mesh.add(cubeMesh);
                    }
                }
            }
        }



        for(var i=0; i<maze.horiz.length; i++){
            for(var j=0; j<maze.horiz[i].length; j++) {
                    console.log(i + " " + j + " " + maze.horiz[i][j]);
            }
        }
    }
};