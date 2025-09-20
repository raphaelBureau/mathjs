//matrix class Arrays of Arrays structure
//you should use the normal matrix class

export class MatrixAA { //[row, colone]
    static Identity(dim = 2) {
        let result = new Array(dim);
        for(let i = 0; i < dim; i++) {
            result[i] = new Array(dim);
            for(let j = 0; j < dim; j++) {
                result[i][j] = i == j ? 1 : 0;
            }
        }
        return result;
    }
    static DiagDet(mat) { //expects square matrix that is triangular
        let result = 1;
        for(let i = 0; i < mat.length; i++) {
            result *= mat[i][i];
        }
        return result;
    }
    static Copy(mat) {
        let result = new Array(mat.length);
        for(let i=0; i<mat.length; i++) {
            result[i] = new Array(mat[i].length);
            for(let j =0; j<result[i].length; j++) {
                result[i][j] = mat[i][j];
            }
        }
        return result;
    }
    static TriangularDet(mat) {
        let result = MatrixAA.Copy(mat);
        for(let i=0; i<mat.length;i++) {
            if(result[i][i] == 0) {//diagonal has zero
                //check if row swap is possible
                for(let row = 0; row <= mat.length;row++) {
                    if(row == mat.length) {
                        return 0;
                    }
                    if(row != i && result[row][i] != 0) {
                        //swap row
                        for(let col =0; col<mat.length; col++) {
                            let intermediate = -result[row][col]; //first values are 0;
                            result[row][col] = result[i][col];
                            result[i][col] = intermediate;
                        }
                        break;
                    } 
                }
            }
            for(let j = 0; j<mat.length; j++) {//algorithm row
                if(j != i && result[j][i] != 0) {
                    let factor = result[j][i]/result[i][i];
                    result[j][i] = 0;
                    for(let k = i+1; k < mat.length;k++) {
                       result[j][k] -= result[i][k]*factor;
                    }
                }
            }
        }
        return MatrixAA.DiagDet(result);
    }
    static ScalarMult(scalar, mat) {//modifies reference
        for(let i =0; i<mat.length; i++) {
            for(let j =0; j< mat[i].length; j++) {
                mat[i][j] *= scalar;
            }
        }
        return mat;
    }
    static ScalarAdd(scalar, mat) {//modifies reference
        for(let i =0; i<mat.length; i++) {
            for(let j =0; j< mat[i].length; j++) {
                mat[i][j] += scalar;
            }
        }
        return mat;
    }
    static Add(mat1,mat2) { //adds matrix 2 to matrix 1
        //modifies reference
        for(let i =0; i< mat1.length; i++) {
            for(let j =0; j<mat1[0].length; j++) {
                mat1[i][j] += mat2[i][j];
            }
        }
        return mat1;
    }
    static Sub(mat1,mat2) { //subtracts matrix 2 to matrix 1
        //modifies reference
        for(let i =0; i< mat1.length; i++) {
            for(let j =0; j<mat1[0].length; j++) {
                mat1[i][j] -= mat2[i][j];
            }
        }
        return mat1;
    }
    static Transpose(mat) {//for square matrices
        //modifies reference
        let intermediate = 0;
        for(let i =0; i< mat.length;i++) {
            for(let j=i+1; j<mat.length; j++) {
                intermediate = mat[i][j];
                mat[i][j] = mat[j][i];
                mat[j][i] = intermediate;
            }
        }
        return mat;
    }
    static Compare(mat1,mat2) { //returns true if both are equal
        if(mat1.length != mat2.length || mat1[0].length != mat2[0].length) {
            return false;
        }
        for(let i =0; i<mat1.length;i++) {
            for(let j =0; j<mat1[i].length;j++) {
                if(mat1[i][j] != mat2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    static CompareInRange(mat1,mat2,range) {
        for(let i =0; i<mat1.length;i++) {
            for(let j =0; j<mat1[i].length;j++) {
                if(mat1[i][j] < mat2[i][j]-range || mat1[i][j] > mat2[i][j]+range) {
                    return false;
                }
            }
        }
        return true;
    }
    static ConvertToArray(mat) { //useful for libraries that expect matrices to be a single array like WebGL
        let result = new Array(mat.length*mat.length);
        for(let i=0; i<mat.length;i++) {
            for(let j =0; j<mat[i].length;j++) {
                result[i*mat.length+j] = mat[i][j];
            }
        }
        return result;
    }
    static RowEchelonForm(mat) {
        //result is approximate because of the floating point division
        //dosent modify the reference
        let result = Matrix.Copy(mat);
        for(let i = 0; i < mat.length; i++) { //matrix row
            for(let j = i+1; j<mat.length; j++) {//algorithm row
                if(result[j][i] != 0) {
                    let factor = result[j][i]/result[i][i];
                    result[j][i] = 0;
                    for(let k = i+1; k < mat.length;k++) {
                        result[j][k] -= result[i][k]*factor;
                    }
                }
            }
            for(let k = i+1; k < mat.length;k++) {
                result[i][k]/=result[i][i];
            }
            result[i][i] = 1;
        }
        return result;
    }
    static Reduce(mat) {
        //modifies reference
        for(let i =0; i<mat.length; i++) {
            for(let j =0; j<mat[i].length; j++) {
                if(j != i) {
                mat[i][j] /= mat[i][i];
                }
            }
            mat[i][i] = 1;
        }
    }
    static RowReducedEchelonForm(mat) {
        //result is approximate because of the floating point division
        //dosent modify the reference
        let result = MatrixAA.Copy(mat);
        for(let i = 0; i < mat.length; i++) { //matrix row
            if(mat[i][i] == 0) {

            }
            else{
            for(let j = 0; j<mat.length; j++) {//algorithm row
                if(j!=i && result[j][i] != 0) {
                    let factor = result[j][i]/result[i][i];
                    result[j][i] = 0;
                    for(let k = i+1; k < mat[j].length;k++) {
                        result[j][k] -= result[i][k]*factor;
                    }
                }
            }
            for(let k = i+1; k < mat[i].length;k++) {
                result[i][k]/=result[i][i];
            }
            result[i][i] = 1;
        }
    }
        return result;
    }
    static Product(mat1,mat2) { //mat1 should have the same width as the height of mat2
        let result = new Array(mat1.length);
        for(let i =0; i<result.length; i++) {
            result[i] = new Array(mat2[0].length);
        }

        for(let mat2Col = 0; mat2Col<mat2[0].length; mat2Col++) {
            for(let mat1Row=0;mat1Row<mat1.length; mat1Row++) {
                let dot = 0;
                for(let mat1Col = 0; mat1Col<mat1[0].length;mat1Col++) {
                    dot += mat1[mat1Row][mat1Col]*mat2[mat1Col][mat2Col];
                }
                result[mat1Row][mat2Col] = dot;
            }
        }
        return result;
    }
    static ProductSquare(mat1,mat2) { //simpler way of calculating the product of two square matrices of same size
        let size = mat1.length;
        let result = new Array(size);
        for(let i =0; i<size; i++) {
            result[i] = new Array(size);
        }

        for(let mat2Col =0; mat2Col<size; mat2Col++) {
            for(let mat1Row = 0; mat1Row<size; mat1Row++) {
                let dot = 0;
                for(let mat1Col = 0; mat1Col<size; mat1Col++) {
                    dot+= mat1[mat1Row][mat1Col]*mat2[mat1Col][mat2Col];
                }
                result[mat1Row][mat2Col] = dot;
            }
        }
        return result;
    }
    static Power(power,mat) { //power is greater than 1 and is an integer
        //matrix is square
        let result = Matrix.ProductSquare(mat,mat);
        for(let i=2; i<power; i++) {
            result = Matrix.ProductSquare(result,mat);
        }
        return result;
    }
    static NewtonRaphson(func, derivative, startX) {
        //func and derivatives are functions that return a floating point value
        //ex: (x) => {return 2*x*x + x*5} in mathematical notation: 2x^2+5x
        let previousX = startX;
        for(let i =0; i< 500; i++) {
            startX = startX - func(startX)/derivative(startX);
            if((Math.abs(previousX - startX))<0.0001){
                break; //convergence
            }
            previousX = startX;
        }
        return startX;
    }
    static NewtonRaphsonNumericalDerivation(func, startX) {
        //func is a mathematical function
        //ex: (x) => {return 2*x*x + x*5} in mathematical notation: 2x^2+5x
        let previousX = startX;
        for(let i =0; i< 500; i++) {
            startX = startX - func(startX)/Matrix.Derivative(func,startX,1e-6);
            if((Math.abs(previousX - startX))<0.0001){
                break; //convergence
            }
            previousX = startX;
        }
        return startX;
    }
    static Augment(mat) { //adds a dimention to a square matrix
        //usefull to convert a normal matrix to homogenous coordinates
        let result = new Array(mat.length+1);
        for(let i =0; i<mat.length;i++) {
            result[i] = new Array(mat.length+1);
            for(let j=0; j<mat.length;j++) {
                result[i][j] = mat[i][j];
            }
            result[i][mat.length] = 0;
        }
        result[mat.length] = new Array(mat.length);
        for(let i=0; i<mat.length; i++) {
            result[mat.length][i] = 0;
        }
        result[mat.length][mat.length] = 1;
        return result;
    }
    static InverseRREFMethod(mat) {
        //matrix should be square and det != 0
        //[A,I] rref pivot method
        let bigMatrix = new Array(mat.length);
        for(let i =0; i < mat.length;i++) {//rows
            bigMatrix[i] = new Array(mat.length*2);
            for(let j=0;j<mat.length;j++) {//cols A
                bigMatrix[i][j] = mat[i][j];
            }
            for(let j=0;j<mat.length;j++) {//cols I
                bigMatrix[i][j+mat.length] = j==i ? 1 : 0;
            }
        }
        bigMatrix = Matrix.RowReducedEchelonForm(bigMatrix);
        let result = new Array(mat.length);
        for(let i =0; i<mat.length;i++) {
            result[i] = new Array(mat.length);
            for(let j = 0; j<mat.length;j++) {
                result[i][j] = bigMatrix[i][mat.length+j];
            }
        }
        return result;
    }
    static Crop(mat,start,end) {
        let result = new Array(end[0] - start[0]+1);
        let width = end[1]-start[1]+1;
        for(let i =start[0]; i<=end[0]; i++) {
            result[i-start[0]] = new Array(width);
            for(let j=start[1]; j<=end[1]; j++) {
                result[i-start[0]][j-start[1]] = mat[i][j];
            }
        }
        return result;
    }
    static RemoveRow(mat, rowIndex) {
        let result = new Array(mat.length-1);
        let resRow = 0;
        for(let i =0; i<mat.length; i++) {
            if(i!= rowIndex) {
                result[resRow] = new Array(mat[i].length);
                for(let j =0; j<mat[i].length; j++) {
                    result[resRow][j] = mat[i][j];
                }
                resRow++;
            }
        }
        return result;
    }
    static RemoveCol(mat, colIndex) {
        let result = new Array(mat.length);
        for(let i=0; i<mat.length; i++) {
            let resCol = 0;
            result[i] = new Array(mat[i].length-1);
            for(let j =0; j<mat[i].length;j++) {
                if(j!=colIndex) {
                    result[i][resCol] = mat[i][j];
                    resCol++;
                }
            }
        }
        return result;
    }
    static RemoveCross(mat, origin) {
        let result = new Array(mat.length-1);
        let resRow = 0;
        for(let i=0; i<mat.length; i++) {
            let resCol = 0;
            if(i != origin[0]) {
            result[resRow] = new Array(mat[i].length-1);
            for(let j =0; j<mat[i].length;j++) {
                if(j!=origin[1]) {
                    result[resRow][resCol] = mat[i][j];
                    resCol++;
                }
            }
            resRow++;
        }
        }
        return result;
    }
    static AddCol(colIndex,mat) {
        if(colIndex == null) {
            colIndex = mat[0].length;
        }
        let result = new Array(mat.length);
        for(let i =0; i<result.length; i++) {
            result[i] = new Array(mat[i].length+1);
            for(let j=0; j<result[i].length; j++) {
                result[i][j] = (j == colIndex) ? 0 : mat[i][j];
            }
        }
        return result;
    }
    static AddRow(rowIndex,mat) {
        if(rowIndex == null) {
            rowIndex = mat.length;
        }
        let result = new Array(mat.length+1);
        let newRows = 0;
        for(let i =0; i<result.length; i++) {
            result[i] = new Array(mat[0].length);
            if(i == rowIndex) {
                for(let j =0; j<result[i].length; j++) {
                    result[i][j] = 0;
                }
                newRows++;
            }
            else{
                for(let j =0; j<result[i].length; j++) {
                    result[i][j] = mat[i - newRows][j];
                }
            }
        }
        return result;
    }
    static Adjugate(mat) { //matrix adjugate for cramers formulas
        //matrix is square
        //recursive and verry expensive
        let result = new Array(mat.length);
        for(let i =0; i<mat.length;i++) {
            result[i] = new Array(mat[i].length);
            for(let j=0; j<mat[i].length;j++) {
                let sign = (i+j) % 2 == 0 ? 1 : -1;
                result[i][j] = sign * Matrix.TriangularDet(Matrix.RemoveCross(mat,[i,j]));
            }
        }
        return Matrix.Transpose(result);
    }
    static InverseCramerMethod(mat) {
        //matrix should be square and det != 0
        //you should use InverseRREFMethod instead it is faster
        return Matrix.ScalarMult(1/Matrix.TriangularDet(mat),Matrix.Adjugate(mat));
    }
    static Diagonalize(mat) { //gives diagonal matrix where Det(diag) = Det(mat)
        let result = Matrix.Copy(mat);
        for(let i=0; i<mat.length;i++) {
            if(result[i][i] == 0) {//diagonal has zero
                //check if row swap is possible
                for(let row = 0; row <= mat.length;row++) {
                    if(row == mat.length) {
                        return 0;
                    }
                    if(row != i && result[row][i] != 0) {
                        //swap row
                        for(let col =0; col<mat.length; col++) {
                            let intermediate = -result[row][col]; //first values are 0;
                            result[row][col] = result[i][col];
                            result[i][col] = intermediate;
                        }
                        break;
                    } 
                }
            }
            for(let j = 0; j<mat.length; j++) {//algorithm row
                if(j != i && result[j][i] != 0) {
                    let factor = result[j][i]/result[i][i];
                    result[j][i] = 0;
                    for(let k = i+1; k < mat.length;k++) {
                       result[j][k] -= result[i][k]*factor;
                    }
                }
            }
        }
        for(let i=0; i<result.length;i++) {
            for(let j=0; j<result[i].length;j++) {
                result[i][j] = (i == j) ? result[i][j] : 0;
            }
        }
        return result;
    }
    static Derivative(func, x, h) { //numerical derivative
        return (func(x + h)-func(x))/h;
    }
    static ArrayMin(arr) {
        let min = arr[0];
        for(let i = 1; i<arr.length; i++) {
            if(arr[i] < min) {
                min = arr[i];
            }
        }
        return min;
    }
    static ArrayMax(arr) {
        let max = arr[0];
        for(let i = 1; i<arr.length; i++) {
            if(arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
    static GershgorinCircleBounds(mat) { //returns interval containing eigenvalues
        let result = [new Array(mat.length),new Array(mat.length)];
        for(let i =0; i<mat.length; i++) {
            let center = Math.abs(mat[i][i]);
            let sum = 0;
            for(let j =0; j<mat[i].length; j++) {
                if(j != i) {
                sum += Math.abs(mat[i][j]);
                }
            }
            result[0][i] = center - sum;
            result[1][i] = center + sum;
        }
        return [Matrix.ArrayMin(result[0]),Matrix.ArrayMax(result[1])];
    }
    static Eigenvalues(mat) {
        let bounds = Matrix.GershgorinCircleBounds(mat);
        let eigenvalues = [];
        let startingPoints = mat.length;
        let maxIteration = 15;
        for(let iteration = 0; iteration < maxIteration; iteration++) {
        for(let i=0; i<startingPoints;i++) {
            let lambda = bounds[0] * (startingPoints-i)/startingPoints + bounds[1] * i/startingPoints;//linear interpolation
            let newEigen = Matrix.EigenValueConverge(mat,lambda);
            if(newEigen != null) { //avoid division by zero error
            let found = false;
            for(let j =0; j<eigenvalues.length; j++) {
                if(Math.abs(eigenvalues[j] - newEigen) < 0.000001) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                eigenvalues.push(newEigen);
                if(eigenvalues.length >= mat.length) {
                    return eigenvalues.sort((a,b) => a-b);
                }
            }
        }
        }
        startingPoints*=2;
    }
    console.log("not all Eigenvalues found", eigenvalues);
    }

    static EigenValueConverge(mat,startValue) {
        let h = 1e-4; 
        for(let a = 0; a<200; a++) {
            let matLambda = Matrix.Copy(mat);
            let matH = Matrix.Copy(mat);
            for(let j =0; j<matLambda.length;j++) {
                matLambda[j][j] -= startValue;
                matH[j][j] -= startValue + h;
            }
            let detLambda = Matrix.TriangularDet(matLambda);
            let derivative = (Matrix.TriangularDet(matH)-detLambda)/h;
            if(derivative == 0) { //avoid division by zero error
                return null;
            }
            let newLambda = startValue - detLambda/(derivative); //newton-raphson
            if(Math.abs(detLambda) < 0.00001) {
                return startValue;
            }
            startValue = newLambda;
            } 
    }
    static LaplaceDet(mat) { //mat must be square
        //verry inneficient (memory and compute)
        //O(n!)
        if(mat.length == 2) {//this is necessary for 2d matrix support
            return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
        }
        if(mat.length == 3) {//this will give you O(n-1!) so you save n computations
            return mat[0][0] * mat[1][1] * mat[2][2] + mat[0][1] * mat[1][2] * mat[2][0] + mat[0][2] * mat[1][0] * mat[2][1] 
                - mat[0][0] * mat[1][2] * mat[2][1] - mat[0][1] * mat[1][0] * mat[2][2] - mat[0][2] * mat[1][1] * mat[2][0];
        }
        let result = 0;
        for(let i =0; i<mat.length; i++) {
            result += (i % 2 * 2 -1) * mat[0][i] * MatrixAA.LaplaceDet(MatrixAA.RemoveCross(mat,[0,i]));
        }
        
        return result;
    }
        static LU(mat) { //matrix is square and det != 0
        let upper = MatrixAA.Copy(mat);
        let lower = MatrixAA.Identity(mat.length);
        let size = mat.length;
        let intermediate = 0;

        for(let i= 0; i<size; i++) {
            if(upper[i][i] == 0) {//pivot is 0 check if row swap is avaiable
                for(let j = i+1; j<=size; j++) {
                    if(j == size) {
                        console.log("LU error matrix has 0 column");
                        return 0;
                    }
                    if(upper[j][i] != 0) {
                        //row swap
                        for(let k=i; k<size; k++) {
                            intermediate = -upper[j][k];
                            upper[j][k] = upper[i][k];
                            upper[i][k] = intermediate;
                        }
                        break;
                    }
                }
            }

            for(let j=i+1; j<size; j++) {
                let factor = upper[j][i]/upper[i][i];
                upper[j][i] = 0;
                lower[j][i] = factor;
                for(let k =i+1; k<size; k++) {
                    upper[j][k] -= factor * upper[i][k];
                }
            }
        }
        return [lower,upper];
    }
}