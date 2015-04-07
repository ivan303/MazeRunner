/**
 * Created by Ivan303 on 2015-01-03.
 */
var Collisions = function (objectInOrigin) {
    this.objectInOrigin = objectInOrigin;
    this.rays = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 0, 1)
    ];
    this.caster = new THREE.Raycaster();

    this.detectCollision = function (rays) {
        var collisions;
        var distance = 1.2;
        var obstacles = sceneObj.worldObj.getObstacles();
        var prohibitMovement = {forward: false, backward: false, right: false, left: false};

        for(var i=0; i<rays.length; i++) {
            this.caster.set(this.objectInOrigin.position, rays[i]);
            collisions = this.caster.intersectObjects(obstacles);

            if(collisions.length > 0 && collisions[0].distance <= distance) {
                //collision in current direction
                if(i==1)
                    prohibitMovement.backward = true;
                if(i==0)
                    prohibitMovement.forward = true;
                if(i==2)
                    prohibitMovement.right = true;
                if(i==3)
                    prohibitMovement.left = true;
            }
        }
        return prohibitMovement;
    }
};
