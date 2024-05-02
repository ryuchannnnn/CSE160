class Cube {
    constructor() {
        this.type = "cube";
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        // this.buffer = null;
    }
    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3DUV([0,0,0,1,1,0], [1,0,0,1,1,1]);
        // drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
        drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

        // Back of Cube
        drawTriangle3D([1,0,1, 0,1,1, 1,1,1]);
        drawTriangle3D([0,0,1, 1,0,1, 0,1,1]);

        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);

        // Top of Cube
        drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
        drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);

        // Bottom of Cube
        drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
        drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);


        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);

        // Right of Cube
        drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);
        drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);

        // Left of Cube
        drawTriangle3D([0,0,0, 0,0,1, 0,1,0]);
        drawTriangle3D([0,0,1, 0,1,0, 0,1,1]);
    }
}