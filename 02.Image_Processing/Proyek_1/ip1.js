"use strict";

function main(){
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = "https://webglfundamentals.org/webgl/resources/leaves.jpg";
    image.onload = function(){
        render(image);
    };
}

function render(image){
    // Get A WebGL context
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if(!gl){
        return;
    }

    // Setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    // Look up where the vertex data needs to go
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2D clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Set a rectangle the same size as the image
    setRectangle(gl, 0, 0, image.width, image.height);

    // Provide a texture coordinates for the rectangle
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0, 
        1.0, 0.0, 
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0, 
        1.0, 1.0
    ]), gl.STATIC_DRAW);

    // Create a texture 
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell the WebGL how to convert from clips space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position biffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer
    var size = 2;
    var type = gl.FLOAT;
    var normalized = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionLocation, size, type, normalized, stride, offset);

    // Turn on the texCoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // Bind the texCoord buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer
    var size = 2;
    var type = gl.FLOAT;
    var normalized = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(texcoordLocation, size, type, normalized, stride, offset);

    // Sett the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Draw the rectangle
    var primitiveType = gl.TRIANGLES;
    var offset= 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);

}

function setRectangle(gl, x, y, width, height){
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
}

main();