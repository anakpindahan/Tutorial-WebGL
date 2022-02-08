"use strict";

function main(){
    // Get canvas context
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if(!gl){
        return;
    }
    
    // Process vertex shader
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, document.querySelector("#vertex-shader-2d").text)
    gl.compileShader(vertShader);

    // Process fragment shader
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, document.querySelector("#fragment-shader-2d").text);
    gl.compileShader(fragShader);

    // setup GLSL program
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    // Look up where vertex data needs to go
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // Look up uniform
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var rotationLocation = gl.getUniformLocation(program, "u_rotation");
    var translationLocation = gl.getUniformLocation(program, "u_translation");

    // Create a buffer to put position into
    var positionBuffer = gl.createBuffer();

    // Bind to array
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setF(gl);

    var translation = [30, 150];
    var rotation = [0, 1];
    var color = [Math.random(), Math.random(), Math.random(), 1];
    
    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});


    function updateAngle(event, ui) {
      var angleInDegrees = ui.value;
      var angleInRadians = angleInDegrees * Math.PI / 180;
      rotation[0] = Math.sin(angleInRadians);
      rotation[1] = Math.cos(angleInRadians);
      drawScene();
    }

    function updatePosition(index) {
      return function(event, ui) {
        translation[index] = ui.value;
        drawScene();
      };
    }

    function drawScene(){
        // Resize canvas size
        gl.canvas.width = gl.canvas.clientWidth;
        gl.canvas.height = gl.canvas.clientHeight;

        // Convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // CLear canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        // Tell to use program
        gl.useProgram(program);
    
        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);
    
        // Bind the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
        // Tell the attribute how to read buffer
        var size = 2;
        var type = gl.FLOAT;
        var normalized = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(positionLocation, size, type, normalized, stride, offset);
    
        // Set the resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
        // Set the color
        gl.uniform4fv(colorLocation, color);
        
        // Set the translation.
        gl.uniform2fv(translationLocation, translation);

        // Set the rotation
        gl.uniform2fv(rotationLocation, rotation);
    
        // Draw the geometry
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;
        gl.drawArrays(primitiveType, offset, count);
    }
}

function setF(gl){
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Left part
            0, 0, 
            30, 0,
            0, 120,
            0, 120,
            30, 0,
            30, 120,

            // Top part
            30, 0,
            80, 0,
            80, 20,
            80, 20,
            30, 0,
            30, 20,
            
            // Middle part
            30, 40,
            80, 40,
            80, 60,
            80, 60,
            30, 40,
            30, 60
        ]),
        gl.STATIC_DRAW
    );
}

main();