/**
 * Created by Ivan303 on 2015-01-02.
 */
$(document).ready( function () {
    sceneObj = new Scene();
    sceneObj.init();

    function animate () {
        requestAnimationFrame(animate);
        sceneObj.frame();
    }
    animate();

    // start animation
    //...
});