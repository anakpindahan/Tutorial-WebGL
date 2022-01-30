"use strict";

function main(){
    // Get WebGL Context
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if(!gl){
        return;
    }

    // Setup GLSL Program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    // Look up ehere the vertex data needs to go
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");

    // Lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set geometry
    setGeometry(gl);

    // Create buffer for the colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Set the coloring
    setColors(gl);

    var translation = [200, 150];
    var angleInRadians = 0;
    var scale = [1, 1];

    drawScene();

    // Setup a ui
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width});
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    function updatePosition(index){
        return function(event, ui){
            translation[index] = ui.value;
            drawScene();
        }
    }

    function updateAngle(event, ui){
        var angleInDegrees = 360 - ui.value;
        angleInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index){
        return function(event, ui){
            scale[index] = ui.value;
            drawScene();
        }
    }

    // Draw the scene
    function drawScene(){
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip spcae to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attributes
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


        // Tell the position attribute how to get data out of position buffer (ARRAY_BUFFER)
        var size = 2;       // 2 components per iteration
        var type = gl.FLOAT; // the data is 32 bit float
        var normalized = false; // dont normalize the data
        var stride = 0;     // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;     // start at the beginning f the buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalized, stride, offset);

        // Turn on the color attribute
        gl.enableVertexAttribArray(colorLocation);

        // Bind the color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        // Tell the color attribute how to get data out of color buffer
        var size = 4;               // 4 components per iteration
        var type = gl.FLOAT;        // The data is 32 bit floats
        var normalized = false;     // Don't normalize the data
        var stride = 0;             // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;             // Start at the beginning of the buffer
        gl.vertexAttribPointer(colorLocation, size, type, normalized, stride, offset);

        // Compute the matrix
        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        // Set the matrix
        gl.uniformMatrix3fv(matrixLocation, false, matrix);


        // Draw the geometry
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
}

// Fill the buffer with the values that defines a triangle
// Put the values in wherever buffer is currently bound 
// to the array ARRAY_BUFFER bind point
function setGeometry(gl){
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -150, -100,
            150, -100,
            -150, 100,
            150, -100,
            -150, 100,
            150, 100
        ]),
        gl.STATIC_DRAW
    );
}

// Fill the buffer with colors for the 2 triangles
// that make the rectangle.
// Put the values in wherever buffer is currently bound
// to the array ARRAY_BUFFER bind point
function setColors(gl){
    // Make every vertex different colors
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
            [
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1
            ]
        ),
        gl.STATIC_DRAW
    );
}

main();