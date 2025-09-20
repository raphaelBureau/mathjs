export class Matrix2D { //2d transformation with homogenous coordinates (3x3)
    //optimised functions compared to matrix.js
    static Identity() {
        return [1,0,0,0,1,0,0,0,1];
    }
    static Det(mat) {
        return mat[0]*mat[4]-mat[1]*mat[3];
    }
    static Inverse(mat) {
        let ScaleInverse = 1/Matrix2D.Det(mat);
        return [mat[4]*ScaleInverse,-mat[1]*ScaleInverse,-mat[2],
                -mat[3]*ScaleInverse,mat[0]*ScaleInverse,-mat[2],
                0,0,1];
    }
    static Scale(factor) {
        return [factor, 0, 0,0,factor,0,0,0,1];
    }
    static Rotate(rad) {
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        return [cos,-sin,0,sin,cos,0,0,0,1];
    }
    static Transvect(vec) { //linear translation
        return [1,0,vec[0],0,1,vec[1],0,0,1];
    }
    static Product(mat1,mat2) {
        return[mat1[0]*mat2[0]+mat1[1]*mat2[3],mat1[0]*mat2[1]+mat1[1]*mat2[4],mat1[0]*mat2[2]+mat1[1]*mat2[5]+mat1[2],
               mat1[3]*mat2[0]+mat1[4]*mat2[3],mat1[3]*mat2[1]+mat1[4]*mat2[4],mat1[3]*mat2[2]+mat1[4]*mat2[5]+mat1[5],
               0,0,1];
    }
    static ConvertToUniversal(mat) {
        let result = new Array(mat.length + 1);
        result[0] = 3;
        for(let i =0; i<mat.length; i++) {
            result[i+1] = mat[i];
        }
        return result;
    }
}