//this class does matrix operations but does not allocate memory for its function calls
//it also recycles the matrix that is transformed (the one to the right)
//this class works for 4d matrices
export default class MatrixRecycler {
    constructor() {
        //using this prevents allocating 16 floats for each matrix operation
        this.intermediateValues = new Float32Array(16); //this is intended to be ran synchronously
    }
    VecProd(mat, vec) {

    }
    MatProd(mat1, mat2) {

    }
    
}