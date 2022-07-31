const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const gl1 = canvas1.getContext('webgl');
const gl2 = canvas2.getContext('webgl');

if (!gl1 || !gl2) {
    throw new Error('WebGL not supported');
}

const drawShape1 = () => {
    const vertexData = [
    
        // Front
        0.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        -.5, 0.5, 0.5,
        -.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        -.5, -.5, 0.5,
    
        // Left
        -.5, 0.5, 0.5,
        -.5, -.5, 0.5,
        -.5, 0.5, -.5,
        -.5, 0.5, -.5,
        -.5, -.5, 0.5,
        -.5, -.5, -.5,
    
        // Back
        -.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, 0.5, -.5,
        0.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, -.5, -.5,
    
        // Right
        0.5, 0.5, -.5,
        0.5, -.5, -.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        0.5, -.5, -.5,
    
        // Top
        0.5, 0.5, 0.5,
        0.5, 0.5, -.5,
        -.5, 0.5, 0.5,
        -.5, 0.5, 0.5,
        0.5, 0.5, -.5,
        -.5, 0.5, -.5,
    
        // Bottom
        0.5, -.5, 0.5,
        0.5, -.5, -.5,
        -.5, -.5, 0.5,
        -.5, -.5, 0.5,
        0.5, -.5, -.5,
        -.5, -.5, -.5,
    ];
    
    function randomColor() {
        return [Math.random(), Math.random(), Math.random()];
    }
    
    let colorData = [];
    for (let face = 0; face < 6; face++) {
        let faceColor = randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }
    
    const positionBuffer = gl1.createBuffer();
    gl1.bindBuffer(gl1.ARRAY_BUFFER, positionBuffer);
    gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(vertexData), gl1.STATIC_DRAW);
    
    const colorBuffer = gl1.createBuffer();
    gl1.bindBuffer(gl1.ARRAY_BUFFER, colorBuffer);
    gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(colorData), gl1.STATIC_DRAW);
    
    const vertexShader = gl1.createShader(gl1.VERTEX_SHADER);
    gl1.shaderSource(vertexShader, `
    precision mediump float;
    
    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;
    
    uniform mat4 matrix;
    
    void main() {
        vColor = color;
        gl_Position = matrix * vec4(position, 1);
    }
    `);
    gl1.compileShader(vertexShader);
    
    const fragmentShader = gl1.createShader(gl1.FRAGMENT_SHADER);
    gl1.shaderSource(fragmentShader, `
    precision mediump float;
    
    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1);
    }
    `);
    gl1.compileShader(fragmentShader);
    console.log(gl1.getShaderInfoLog(fragmentShader));
    
    const program = gl1.createProgram();
    gl1.attachShader(program, vertexShader);
    gl1.attachShader(program, fragmentShader);
    
    gl1.linkProgram(program);
    
    const positionLocation = gl1.getAttribLocation(program, `position`);
    gl1.enableVertexAttribArray(positionLocation);
    gl1.bindBuffer(gl1.ARRAY_BUFFER, positionBuffer);
    gl1.vertexAttribPointer(positionLocation, 3, gl1.FLOAT, false, 0, 0);
    
    const colorLocation = gl1.getAttribLocation(program, `color`);
    gl1.enableVertexAttribArray(colorLocation);
    gl1.bindBuffer(gl1.ARRAY_BUFFER, colorBuffer);
    gl1.vertexAttribPointer(colorLocation, 3, gl1.FLOAT, false, 0, 0);
    
    gl1.useProgram(program);
    gl1.enable(gl1.DEPTH_TEST);
    
    const uniformLocations = {
        matrix: gl1.getUniformLocation(program, `matrix`),
    };
    
    const matrix = mat4.create();
    
    mat4.translate(matrix, matrix, [.2, -.2, 0]);
        
    function animate() {
        requestAnimationFrame(animate);
        mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
        mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
        mat4.rotateY(matrix, matrix, Math.PI/2 / 70);
        gl1.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
        gl1.drawArrays(gl1.TRIANGLES, 0, vertexData.length / 3);
    }
    
    animate();
}

const drawShape2 = () => {
    const vertexData = [
    
        // Alas / Base
        -.5, 0, .5,
        .5, 0, .5,
        0, 0, -.87/2,

        // Muka 1 / Face 1
        -.5, 0, .5,
        .5, 0, .5,
        0, .87, 0,

        // Muka 2 / Face 2
        -.5, 0, .5,
        0, 0, -.87/2,
        0, .87, 0,

        // Muka 3 / Face 3
        .5, 0, .5,
        0, 0, -.87/2,
        0, .87, 0,
    ];
    
    function randomColor() {
        return [Math.random(), Math.random(), Math.random()];
    }
    
    let colorData = [];
    for (let face = 0; face < 4; face++) {
        let faceColor = randomColor();
        for (let vertex = 0; vertex < 3; vertex++) {
            colorData.push(...faceColor);
        }
    }
    
    const positionBuffer = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, positionBuffer);
    gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(vertexData), gl2.STATIC_DRAW);
    
    const colorBuffer = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, colorBuffer);
    gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(colorData), gl2.STATIC_DRAW);
    
    const vertexShader = gl2.createShader(gl2.VERTEX_SHADER);
    gl2.shaderSource(vertexShader, `
    precision mediump float;
    
    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;
    
    uniform mat4 matrix;
    
    void main() {
        vColor = color;
        gl_Position = matrix * vec4(position, 1);
    }
    `);
    gl2.compileShader(vertexShader);
    
    const fragmentShader = gl2.createShader(gl2.FRAGMENT_SHADER);
    gl2.shaderSource(fragmentShader, `
    precision mediump float;
    
    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1);
    }
    `);
    gl2.compileShader(fragmentShader);
    console.log(gl2.getShaderInfoLog(fragmentShader));
    
    const program = gl2.createProgram();
    gl2.attachShader(program, vertexShader);
    gl2.attachShader(program, fragmentShader);
    
    gl2.linkProgram(program);
    
    const positionLocation = gl2.getAttribLocation(program, `position`);
    gl2.enableVertexAttribArray(positionLocation);
    gl2.bindBuffer(gl2.ARRAY_BUFFER, positionBuffer);
    gl2.vertexAttribPointer(positionLocation, 3, gl2.FLOAT, false, 0, 0);
    
    const colorLocation = gl2.getAttribLocation(program, `color`);
    gl2.enableVertexAttribArray(colorLocation);
    gl2.bindBuffer(gl2.ARRAY_BUFFER, colorBuffer);
    gl2.vertexAttribPointer(colorLocation, 3, gl2.FLOAT, false, 0, 0);
    
    gl2.useProgram(program);
    gl2.enable(gl2.DEPTH_TEST);
    
    const uniformLocations = {
        matrix: gl2.getUniformLocation(program, `matrix`),
    };
    
    const matrix = mat4.create();
    
    mat4.translate(matrix, matrix, [.2, -.25, 0]);
    
    // mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);
    
    function animate() {
        requestAnimationFrame(animate);
        mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
        mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
        mat4.rotateY(matrix, matrix, Math.PI/2 / 70);
        gl2.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
        gl2.drawArrays(gl2.TRIANGLES, 0, vertexData.length / 3);
    }
    
    animate();
}

const main = () => {
    drawShape1();
    drawShape2();
}

window.onload = main;