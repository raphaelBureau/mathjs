//this class does matrix operations but does not (almost) allocate memory for its function calls
//it also recycles the matrix that is transformed (the one to the right)
//everything is made to be as fast as possible
//this class works for 4d matrices
export class MatrixRecycler {
    constructor() {
        //using this prevents allocating 16 floats for each matrix operation
        this.intermediateValues = new Float32Array(16); //this is intended to be ran synchronously
    }
    VecProd(mat, vec) {
        const intermediateValues = this.intermediateValues;
        intermediateValues[0] = mat[0] * vec[0] + mat[1] * vec[1] + mat[2] * vec[2] + mat[3] * vec[3];
        intermediateValues[1] = mat[4] * vec[0] + mat[5] * vec[1] + mat[6] * vec[2] + mat[7] * vec[3];
        intermediateValues[2] = mat[8] * vec[0] + mat[9] * vec[1] + mat[10] * vec[2] + mat[11] * vec[3];
        intermediateValues[3] = mat[12] * vec[0] + mat[13] * vec[1] + mat[14] * vec[2] + mat[15] * vec[3];

        vec[0] = intermediateValues[0];
        vec[1] = intermediateValues[1];
        vec[2] = intermediateValues[2];
        vec[3] = intermediateValues[3];
    }
    Vec3Prod(mat, vecmat) { //vecmat is a matrix of 3 vectors
        const intermediateValues = this.intermediateValues;
        intermediateValues[0] = mat[0] * vecmat[0] + mat[1] * vecmat[3] + mat[2] * vecmat[6] + mat[3] * vecmat[9];
        intermediateValues[1] = mat[4] * vecmat[0] + mat[5] * vecmat[3] + mat[6] * vecmat[6] + mat[7] * vecmat[9];
        intermediateValues[2] = mat[8] * vecmat[0] + mat[9] * vecmat[3] + mat[10] * vecmat[6] + mat[11] * vecmat[9];
        intermediateValues[3] = mat[12] * vecmat[0] + mat[13] * vecmat[3] + mat[14] * vecmat[6] + mat[15] * vecmat[9];

        intermediateValues[4] = mat[0] * vecmat[1] + mat[1] * vecmat[4] + mat[2] * vecmat[7] + mat[3] * vecmat[10];
        intermediateValues[5] = mat[4] * vecmat[1] + mat[5] * vecmat[4] + mat[6] * vecmat[7] + mat[7] * vecmat[10];
        intermediateValues[6] = mat[8] * vecmat[1] + mat[9] * vecmat[4] + mat[10] * vecmat[7] + mat[11] * vecmat[10];
        intermediateValues[7] = mat[12] * vecmat[1] + mat[13] * vecmat[4] + mat[14] * vecmat[7] + mat[15] * vecmat[10];

        intermediateValues[8] = mat[0] * vecmat[2] + mat[1] * vecmat[5] + mat[2] * vecmat[8] + mat[3] * vecmat[11];
        intermediateValues[9] = mat[4] * vecmat[2] + mat[5] * vecmat[5] + mat[6] * vecmat[8] + mat[7] * vecmat[11];
        intermediateValues[10] = mat[8] * vecmat[2] + mat[9] * vecmat[5] + mat[10] * vecmat[8] + mat[11] * vecmat[11];
        intermediateValues[11] = mat[12] * vecmat[2] + mat[13] * vecmat[5] + mat[14] * vecmat[8] + mat[15] * vecmat[11];

        vecmat[0] = intermediateValues[0];
        vecmat[3] = intermediateValues[1];
        vecmat[6] = intermediateValues[2];
        vecmat[9] = intermediateValues[3];
        vecmat[1] = intermediateValues[4];
        vecmat[4] = intermediateValues[5];
        vecmat[7] = intermediateValues[6];
        vecmat[10] = intermediateValues[7];
        vecmat[2] = intermediateValues[8];
        vecmat[5] = intermediateValues[9];
        vecmat[8] = intermediateValues[10];
        vecmat[11] = intermediateValues[11];
    }
    TransformVertexArray(transform, vertexArray) {//transform is row-major 4x4 and vertexArray is a column-major 4xN
        const intermediateValues = this.intermediateValues;
        for(let i=0;i<vertexArray.length;i+=4) {
            intermediateValues[0] = transform[0] * vertexArray[i] + transform[1] * vertexArray[i+1] + transform[2] * vertexArray[i+2] + transform[3] * vertexArray[i+3];
            intermediateValues[1] = transform[4] * vertexArray[i] + transform[5] * vertexArray[i+1] + transform[6] * vertexArray[i+2] + transform[7] * vertexArray[i+3];
            intermediateValues[2] = transform[8] * vertexArray[i] + transform[9] * vertexArray[i+1] + transform[10] * vertexArray[i+2] + transform[11] * vertexArray[i+3];
            vertexArray[i+3] = transform[12] * vertexArray[i] + transform[13] * vertexArray[i+1] + transform[14] * vertexArray[i+2] + transform[15] * vertexArray[i+3];
            vertexArray[i] = intermediateValues[0];
            vertexArray[i+1] = intermediateValues[1];
            vertexArray[i+2] = intermediateValues[2];
        }
    }
    MatProd(mat1, mat2) {
        const intermediateValues = this.intermediateValues;
        intermediateValues[0] = mat1[0] * mat2[0] + mat1[1] * mat2[4] + mat1[2] * mat2[8] + mat1[3] * mat2[12];
        intermediateValues[1] = mat1[0] * mat2[1] + mat1[1] * mat2[5] + mat1[2] * mat2[9] + mat1[3] * mat2[13];
        intermediateValues[2] = mat1[0] * mat2[2] + mat1[1] * mat2[6] + mat1[2] * mat2[10] + mat1[3] * mat2[14];
        intermediateValues[3] = mat1[0] * mat2[3] + mat1[1] * mat2[7] + mat1[2] * mat2[11] + mat1[3] * mat2[15];

        intermediateValues[4] = mat1[4] * mat2[0] + mat1[5] * mat2[4] + mat1[6] * mat2[8] + mat1[7] * mat2[12];
        intermediateValues[5] = mat1[4] * mat2[1] + mat1[5] * mat2[5] + mat1[6] * mat2[9] + mat1[7] * mat2[13];
        intermediateValues[6] = mat1[4] * mat2[2] + mat1[5] * mat2[6] + mat1[6] * mat2[10] + mat1[7] * mat2[14];
        intermediateValues[7] = mat1[4] * mat2[3] + mat1[5] * mat2[7] + mat1[6] * mat2[11] + mat1[7] * mat2[15];

        intermediateValues[8] = mat1[8] * mat2[0] + mat1[9] * mat2[4] + mat1[10] * mat2[8] + mat1[11] * mat2[12];
        intermediateValues[9] = mat1[8] * mat2[1] + mat1[9] * mat2[5] + mat1[10] * mat2[9] + mat1[11] * mat2[13];
        intermediateValues[10] = mat1[8] * mat2[2] + mat1[9] * mat2[6] + mat1[10] * mat2[10] + mat1[11] * mat2[14];
        intermediateValues[11] = mat1[8] * mat2[3] + mat1[9] * mat2[7] + mat1[10] * mat2[11] + mat1[11] * mat2[15];

        intermediateValues[12] = mat1[12] * mat2[0] + mat1[13] * mat2[4] + mat1[14] * mat2[8] + mat1[15] * mat2[12];
        intermediateValues[13] = mat1[12] * mat2[1] + mat1[13] * mat2[5] + mat1[14] * mat2[9] + mat1[15] * mat2[13];
        intermediateValues[14] = mat1[12] * mat2[2] + mat1[13] * mat2[6] + mat1[14] * mat2[10] + mat1[15] * mat2[14];
        intermediateValues[15] = mat1[12] * mat2[3] + mat1[13] * mat2[7] + mat1[14] * mat2[11] + mat1[15] * mat2[15];

        mat2.set(intermediateValues);
    }
    MatProdInto(mat1,mat2,result) {
        result[0] = mat1[0] * mat2[0] + mat1[1] * mat2[4] + mat1[2] * mat2[8] + mat1[3] * mat2[12];
        result[1] = mat1[0] * mat2[1] + mat1[1] * mat2[5] + mat1[2] * mat2[9] + mat1[3] * mat2[13];
        result[2] = mat1[0] * mat2[2] + mat1[1] * mat2[6] + mat1[2] * mat2[10] + mat1[3] * mat2[14];
        result[3] = mat1[0] * mat2[3] + mat1[1] * mat2[7] + mat1[2] * mat2[11] + mat1[3] * mat2[15];

        result[4] = mat1[4] * mat2[0] + mat1[5] * mat2[4] + mat1[6] * mat2[8] + mat1[7] * mat2[12];
        result[5] = mat1[4] * mat2[1] + mat1[5] * mat2[5] + mat1[6] * mat2[9] + mat1[7] * mat2[13];
        result[6] = mat1[4] * mat2[2] + mat1[5] * mat2[6] + mat1[6] * mat2[10] + mat1[7] * mat2[14];
        result[7] = mat1[4] * mat2[3] + mat1[5] * mat2[7] + mat1[6] * mat2[11] + mat1[7] * mat2[15];

        result[8] = mat1[8] * mat2[0] + mat1[9] * mat2[4] + mat1[10] * mat2[8] + mat1[11] * mat2[12];
        result[9] = mat1[8] * mat2[1] + mat1[9] * mat2[5] + mat1[10] * mat2[9] + mat1[11] * mat2[13];
        result[10] = mat1[8] * mat2[2] + mat1[9] * mat2[6] + mat1[10] * mat2[10] + mat1[11] * mat2[14];
        result[11] = mat1[8] * mat2[3] + mat1[9] * mat2[7] + mat1[10] * mat2[11] + mat1[11] * mat2[15];

        result[12] = mat1[12] * mat2[0] + mat1[13] * mat2[4] + mat1[14] * mat2[8] + mat1[15] * mat2[12];
        result[13] = mat1[12] * mat2[1] + mat1[13] * mat2[5] + mat1[14] * mat2[9] + mat1[15] * mat2[13];
        result[14] = mat1[12] * mat2[2] + mat1[13] * mat2[6] + mat1[14] * mat2[10] + mat1[15] * mat2[14];
        result[15] = mat1[12] * mat2[3] + mat1[13] * mat2[7] + mat1[14] * mat2[11] + mat1[15] * mat2[15];
    }
    static Identity() {
        let matrix = new Float32Array(16);
        matrix[0] = 1;
        matrix[5] = 1;
        matrix[10] = 1;
        matrix[15] = 1;
        return matrix;
    }
    Transpose(mat) {
        const intermediateValues = this.intermediateValues;
        intermediateValues[0] = mat[0];
        intermediateValues[1] = mat[4];
        intermediateValues[2] = mat[8];
        intermediateValues[3] = mat[12];
        intermediateValues[4] = mat[1];
        intermediateValues[5] = mat[5];
        intermediateValues[6] = mat[9];
        intermediateValues[7] = mat[13];
        intermediateValues[8] = mat[2];
        intermediateValues[9] = mat[6];
        intermediateValues[10] = mat[10];
        intermediateValues[11] = mat[14];
        intermediateValues[12] = mat[3];
        intermediateValues[13] = mat[7];
        intermediateValues[14] = mat[11];
        intermediateValues[15] = mat[15];
        mat.set(intermediateValues);
    }
}