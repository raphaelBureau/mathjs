export class Matrix3D { //3d matrix with homogenous coordinates
    //optimised functions compared to matrix.js
    static Identity() {
        return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    }
    static Scale(factor) {
        return [factor,0,0,0,0,factor,0,0,0,0,factor,0,0,0,0,1];
    }
    static Transvect(vec) {
        return [1,0,0,vec[0],0,1,0,vec[1],0,0,1,vec[2],0,0,0,1];
    }
    static RotateX(rad) {
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        return [1,0,0,0,0,cos,-sin,0,0,sin,cos,0,0,0,0,1];
    }
    static RotateY(rad) {
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        return [cos,-sin,0,0,0,1,0,0,-sin,0,cos,0,0,0,0,1];
    }
    static RotateZ(rad) {
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        return [cos,-sin,0,0,sin,cos,0,0,0,0,0,0,0,0,0,1];
    }
    static ConvertToUniversal(mat) { //matrix format valid for Matrix.js
        let result = new Array(mat.length + 1);
        result[0] = 4;
        for(let i =0; i<mat.length; i++) {
            result[i+1] = mat[i];
        }
        return result;
    }
    static Det(mat) { //faster than the triangularDet from Matrix.js (more than 50x faster) saurrus method
        return mat[0] * mat[4] * mat[8] + mat[1] * mat[5] * mat[6] + mat[2] * mat[3] * mat[7]
        - mat[0] * mat[5] * mat[7] - mat[1] * mat[3] * mat[8] - mat[2] * mat[4] * mat[6];
    }
}