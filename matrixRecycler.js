//this class does matrix operations but does not allocate memory for its function calls
//it also recycles the matrix that is transformed (the one to the right)
//this class works for 4d matrices
export default class MatrixRecycler {
    constructor() {
        //using this prevents allocating 16 floats for each matrix operation
        this.intermediateValues = new Float32Array(16); //this is intended to be ran synchronously
    }
    VecProd(mat, vec) {
        this.intermediateValues[0] = mat[0] * vec[0] + mat[1] * vec[1] + mat[2] * vec[2] + mat[3] * vec[3];
        this.intermediateValues[1] = mat[4] * vec[0] + mat[5] * vec[1] + mat[6] * vec[2] + mat[7] * vec[3];
        this.intermediateValues[2] = mat[8] * vec[0] + mat[9] * vec[1] + mat[10] * vec[2] + mat[11] * vec[3];
        this.intermediateValues[3] = mat[12] * vec[0] + mat[13] * vec[1] + mat[14] * vec[2] + mat[15] * vec[3];

        vec[0] = this.intermediateValues[0];
        vec[1] = this.intermediateValues[1];
        vec[2] = this.intermediateValues[2];
        vec[3] = this.intermediateValues[3];
    }
    MatProd(mat1, mat2) {
        this.intermediateValues[0] = mat1[0] * mat2[0] + mat1[1] * mat2[4] + mat1[2] * mat2[8] + mat1[3] * mat2[12];
        this.intermediateValues[1] = mat1[0] * mat2[1] + mat1[1] * mat2[5] + mat1[2] * mat2[9] + mat1[3] * mat2[13];
        this.intermediateValues[2] = mat1[0] * mat2[2] + mat1[1] * mat2[6] + mat1[2] * mat2[10] + mat1[3] * mat2[14];
        this.intermediateValues[3] = mat1[0] * mat2[3] + mat1[1] * mat2[7] + mat1[2] * mat2[11] + mat1[3] * mat2[15];

        this.intermediateValues[4] = mat1[4] * mat2[0] + mat1[5] * mat2[4] + mat1[6] * mat2[8] + mat1[7] * mat2[12];
        this.intermediateValues[5] = mat1[4] * mat2[1] + mat1[5] * mat2[5] + mat1[6] * mat2[9] + mat1[7] * mat2[13];
        this.intermediateValues[6] = mat1[4] * mat2[2] + mat1[5] * mat2[6] + mat1[6] * mat2[10] + mat1[7] * mat2[14];
        this.intermediateValues[7] = mat1[4] * mat2[3] + mat1[5] * mat2[7] + mat1[6] * mat2[11] + mat1[7] * mat2[15];

        this.intermediateValues[8] = mat1[8] * mat2[0] + mat1[9] * mat2[4] + mat1[10] * mat2[8] + mat1[11] * mat2[12];
        this.intermediateValues[9] = mat1[8] * mat2[1] + mat1[9] * mat2[5] + mat1[10] * mat2[9] + mat1[11] * mat2[13];
        this.intermediateValues[10] = mat1[8] * mat2[2] + mat1[9] * mat2[6] + mat1[10] * mat2[10] + mat1[11] * mat2[14];
        this.intermediateValues[11] = mat1[8] * mat2[3] + mat1[9] * mat2[7] + mat1[10] * mat2[11] + mat1[11] * mat2[15];

        this.intermediateValues[12] = mat1[12] * mat2[0] + mat1[13] * mat2[4] + mat1[14] * mat2[8] + mat1[15] * mat2[12];
        this.intermediateValues[13] = mat1[12] * mat2[1] + mat1[13] * mat2[5] + mat1[14] * mat2[9] + mat1[15] * mat2[13];
        this.intermediateValues[14] = mat1[12] * mat2[2] + mat1[13] * mat2[6] + mat1[14] * mat2[10] + mat1[15] * mat2[14];
        this.intermediateValues[15] = mat1[12] * mat2[3] + mat1[13] * mat2[7] + mat1[14] * mat2[11] + mat1[15] * mat2[15];

        mat2[0] = this.intermediateValues[0];
        mat2[1] = this.intermediateValues[1];
        mat2[2] = this.intermediateValues[2];
        mat2[3] = this.intermediateValues[3];
        mat2[4] = this.intermediateValues[4];
        mat2[5] = this.intermediateValues[5];
        mat2[6] = this.intermediateValues[6];
        mat2[7] = this.intermediateValues[7];
        mat2[8] = this.intermediateValues[8];
        mat2[9] = this.intermediateValues[9];
        mat2[10] = this.intermediateValues[10];
        mat2[11] = this.intermediateValues[11];
        mat2[12] = this.intermediateValues[12];
        mat2[13] = this.intermediateValues[13];
        mat2[14] = this.intermediateValues[14];
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
        //this.intermediateValues[0] = mat[0];
        this.intermediateValues[1] = mat[4];
        this.intermediateValues[2] = mat[8];
        this.intermediateValues[3] = mat[12];
        this.intermediateValues[4] = mat[1];
        this.intermediateValues[5] = mat[5];
        this.intermediateValues[6] = mat[9];
        this.intermediateValues[7] = mat[13];
        this.intermediateValues[8] = mat[2];
        this.intermediateValues[9] = mat[6];
        this.intermediateValues[10] = mat[10];
        this.intermediateValues[11] = mat[14];
        this.intermediateValues[12] = mat[3];
        this.intermediateValues[13] = mat[7];
        this.intermediateValues[14] = mat[11];
        this.intermediateValues[15] = mat[15];
        //mat[0] = this.intermediateValues[0];
        mat[1] = this.intermediateValues[1];
        mat[2] = this.intermediateValues[2];
        mat[3] = this.intermediateValues[3];
        mat[4] = this.intermediateValues[4];
        mat[5] = this.intermediateValues[5];
        mat[6] = this.intermediateValues[6];
        mat[7] = this.intermediateValues[7];
        mat[8] = this.intermediateValues[8];
        mat[9] = this.intermediateValues[9];
        mat[10] = this.intermediateValues[10];
        mat[11] = this.intermediateValues[11];
        mat[12] = this.intermediateValues[12];
        mat[13] = this.intermediateValues[13];
        mat[14] = this.intermediateValues[14];
        mat[15] = this.intermediateValues[15];
    }
}