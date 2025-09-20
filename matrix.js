//the better matrix class
//this one uses an implementation of 2d flattened arrays
//row major ordering
//arr[0] is the matrix width (row width)

export class Matrix { //[row, colone]
    static Identity(dim = 2) {
        let size = dim * dim;
        let result = new Array(size + 1);
        result[0] = dim;
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                result[i * dim + j + 1] = (j == i) ? 1 : 0;
            }
        }
        return result;
    }
    static ConvertAAToA(mat) { //convert array of arrays to simple array
        //format is row-major and array[0] = width of matrix
        //to get height of matrix (array.length-1)/array[0]
        //diagonal = i*mat[0]+i+1
        //row = i*mat[0]+1 + colIndex
        //col = rowIndex*mat[0]+1 + i
        let result = new Array(mat.length * mat[0].length + 1);
        result[0] = mat[0].length;
        for (let i = 0; i < mat.length; i++) {
            for (let j = 0; j < mat[0].length; j++) {
                result[1 + i * mat[0].length + j] = mat[i][j];
            }
        }
        return result;
    }
    static ConvertAToAA(mat) { //converts simple matrix array to array of arrays
        let height = (mat.length - 1) / mat[0];
        let result = new Array(height);
        for (let i = 0; i < height; i++) {
            result[i] = new Array(mat[0]);
            for (let j = 0; j < mat[0]; j++) {
                result[i][j] = mat[1 + i * mat[0] + j];
            }
        }
        return result;
    }
    static DiagDet(mat) { //expects square matrix that is triangular
        let result = mat[1];
        for (let i = 1; i < mat[0]; i++) {
            result *= mat[i * mat[0] + 1 + i];
        }
        return result;
    }
    static CopyAA(mat) {
        let result = new Array(mat.length);
        for (let i = 0; i < mat.length; i++) {
            result[i] = new Array(mat[i].length);
            for (let j = 0; j < result[i].length; j++) {
                result[i][j] = mat[i][j];
            }
        }
        return result;
    }
    static Copy(mat) {
        let result = new Array(mat.length);
        for (let i = 0; i < mat.length; i++) {
            result[i] = mat[i];
        }
        return result;
    }
    static TriangularDet(mat) {//this function modifies the matrix, if you want to keep your matrix you should copy it: Matrix.Copy(mat)
        let det = 1;
        let size = mat[0];
        let intermediate = 0;
        let iSize = 0;
        let rowSize = 0;
        let jSize = 0;
        let factor = 0;
        //matrix is square width = height = mat[0];
        for (let i = 0; i < size; i++) {
            iSize = i * size + 1; //to save duplicated multiplications

            if (mat[iSize + i] == 0) {//diagonal has zero
                //check if row swap is possible
                for (let row = 0; row <= size; row++) {
                    if (row == size) {
                        return 0; //if no row swap is avaible, at least one dimention is removed. det = 0
                    }
                    rowSize = row * size + 1;
                    if (row != i && mat[rowSize + i] != 0) {
                        //swap row
                        //col = i because all values before are 0
                        for (let col = i; col < size; col++) {
                            intermediate = -mat[rowSize + col]; //first values are 0;
                            mat[rowSize + col] = mat[iSize + col];
                            mat[iSize + col] = intermediate;
                        }
                        break;
                    }
                }
            }
            det *= mat[iSize + i];//the row wont be modified anymore so we can start calculating the det
            //j = i because all values before are 0
            for (let j = i; j < size; j++) {//algorithm row
                jSize = j * size + 1;
                if (j != i && mat[jSize + i] != 0) {
                    factor = mat[jSize + i] / mat[iSize + i];
                    //mat[jSize+i] = 0; //not necessary here since we just want the det
                    for (let k = i + 1; k < size; k++) {
                        mat[jSize + k] -= mat[iSize + k] * factor;
                    }
                }
            }
        }
        return det;
    }
    static ScalarMult(scalar, mat) {//modifies reference
        for (let i = 1; i < mat.length; i++) {
            mat[i] *= scalar;
        }
        return mat;
    }
    static ScalarAdd(scalar, mat) {//modifies reference
        for (let i = 1; i < mat.length; i++) {
            mat[i] += scalar;
        }
        return mat;
    }
    static Add(mat1, mat2) { //adds matrix 2 to matrix 1
        //modifies reference
        for (let i = 1; i < mat1.length; i++) {
            mat1[i] += mat2[i];
        }
        return mat1;
    }
    static Sub(mat1, mat2) { //subtracts matrix 2 to matrix 1
        //modifies reference
        for (let i = 1; i < mat1.length; i++) {
            mat1[i] -= mat2[i];
        }
        return mat1;
    }
    static Transpose(mat) {//for square matrices
        //modifies reference
        let intermediate = 0;
        for (let i = 0; i < mat[0]; i++) {
            for (let j = i + 1; j < mat[0]; j++) {
                intermediate = mat[i * mat[0] + 1 + j];
                mat[i * mat[0] + 1 + j] = mat[j * mat[0] + 1 + i];
                mat[j * mat[0] + 1 + i] = intermediate;
            }
        }
        return mat;
    }
    static Compare(mat1, mat2) { //returns true if both are equal
        if (mat1.length != mat2.length) {
            return false;
        }
        for (let i = 0; i < mat1[0]; i++) {
            if (mat1[i] != mat2[i]) {
                return false;
            }
        }
        return true;
    }
    static CompareInRange(mat1, mat2, range) {
        if (mat1.length != mat2.length) {
            return false;
        }
        for (let i = 0; i < mat1[0]; i++) {
            if (Math.abs(mat1[i] - mat2[i]) > range) {
                return false;
            }
        }
        return true;
    }
    static RowEchelonForm(mat) {
        //result is approximate because of the floating point division
        //dosent modify the reference
        let result = Matrix.Copy(mat);
        let height = (mat.length - 1) / mat[0];
        for (let i = 0; i < height; i++) { //matrix row
            for (let j = i + 1; j < height; j++) {//algorithm row
                if (result[j * mat[0] + 1 + i] != 0) {
                    let factor = result[j * mat[0] + 1 + i] / result[i * mat[0] + 1 + i];
                    result[j * mat[0] + 1 + i] = 0;
                    for (let k = i + 1; k < height; k++) {
                        result[j * mat[0] + 1 + k] -= result[i * mat[0] + 1 + k] * factor;
                    }
                }
            }
            for (let k = i + 1; k < height; k++) {
                result[i * mat[0] + 1 + k] /= result[i * mat[0] + 1 + i];
            }
            result[i * mat[0] + 1 + i] = 1;
        }
        return result;
    }
    static Reduce(mat) {
        //modifies reference
        let height = (mat.length - 1) / mat[0];
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < mat[0]; j++) {
                if (j != i) {
                    mat[i * mat[0] + 1 + j] /= mat[i * mat[0] + 1 + i];
                }
            }
            mat[i * mat[0] + 1 + i] = 1;
        }
    }
    static RowReducedEchelonForm(mat) {
        //this method allows moving pivots
        //result is approximate because of the floating point division
        //dosent modify the reference
        let result = Matrix.Copy(mat);
        let width = mat[0];
        let height = (mat.length - 1) / mat[0];
        let currentPivot = 0;
        let intermediate = 0;

        for (let i = 0; i < height; i++) { //upper triangle pass
            //check for row swaps
            //i is the col and pivot is the row
            if (result[currentPivot * width + 1 + i] == 0) {
                for (let j = currentPivot + 1; j < height; j++) {

                    if (result[j * width + 1 + i] != 0) {
                        //row swap
                        for (let k = i; k < width; k++) {
                            result[currentPivot * width + 1 + k] = intermediate;
                            result[currentPivot * width + 1 + k] = result[j * width + 1 + k];
                            result[j * width + 1 + k] = intermediate;
                        }
                        break;
                    }
                }
            }
            if (result[currentPivot * width + 1 + i] != 0) { //if row swap worked we can now reduce
                let pivotValue = result[currentPivot * width + 1 + i];
                for (let j = 0; j < height; j++) { //sub upper and lower
                    if (j == currentPivot) {//reduce pivot
                        for (let k = i + 1; k < width; k++) {
                            result[currentPivot * width + 1 + k] /= pivotValue;
                        }
                        result[currentPivot * width + 1 + i] = 1;
                    }
                    else {
                        let coeff = result[j * width + 1 + i] / pivotValue;
                        result[j * width + 1 + i] = 0;
                        for (let k = i + 1; k < width; k++) {
                            result[j * width + 1 + k] -= coeff * result[currentPivot * width + 1 + k];
                        }
                    }
                }
                currentPivot++;
            }
        }

        return result;
    }
    static RowReducedEchelonForm2(mat) {
        //this method has fixed pivots
        //result is approximate because of the floating point division
        //dosent modify the reference
        let result = Matrix.Copy(mat);
        let height = (mat.length - 1) / mat[0];
        for (let i = 0; i < height; i++) { //matrix row
            if (mat[i * mat[0] + 1 + i] == 0) {
                //if row is empty switch with non null row
                //check if row swap is possible
                for (let row = i + 1; row < height; row++) {
                    if (row != i && result[row * result[0] + 1 + i] != 0) {
                        //swap row
                        for (let col = 0; col < mat[0]; col++) {
                            let intermediate = result[row * mat[0] + 1 + col]; //first values are 0;
                            result[row * mat[0] + 1 + col] = result[i * mat[0] + 1 + col];
                            result[i * mat[0] + 1 + col] = intermediate;
                        }
                        break;
                    }
                }
            }
            else {
                for (let j = 0; j < height; j++) {//algorithm row
                    if (j != i && result[j * mat[0] + 1 + i] != 0) {
                        let factor = result[j * mat[0] + 1 + i] / result[i * mat[0] + 1 + i];
                        result[j * mat[0] + 1 + i] = 0;
                        for (let k = i + 1; k < mat[0]; k++) {
                            result[j * mat[0] + 1 + k] -= result[i * mat[0] + 1 + k] * factor;
                        }
                    }
                }
                for (let k = i + 1; k < mat[0]; k++) {
                    result[i * mat[0] + 1 + k] /= result[i * mat[0] + 1 + i];
                }
                result[i * mat[0] + 1 + i] = 1;
            }
        }
        return result;
    }
    static Product(mat1, mat2) { //mat1 should have the same width as the height of mat2
        let height = (mat1.length - 1) / mat1[0];
        let result = new Array(height * mat2[0] + 1);
        result[0] = mat2[0];
        for (let mat2Col = 0; mat2Col < mat2[0]; mat2Col++) {
            for (let mat1Row = 0; mat1Row < height; mat1Row++) {
                let dot = 0;
                for (let mat1Col = 0; mat1Col < mat1[0]; mat1Col++) {
                    dot += mat1[mat1Row * mat1[0] + 1 + mat1Col] * mat2[mat1Col * mat2[0] + 1 + mat2Col];
                }
                result[mat1Row * result[0] + 1 + mat2Col] = dot;
            }
        }
        return result;
    }
    static ProductSquare(mat1, mat2) { //simpler way of calculating the product of two square matrices of same size
        let result = new Array(mat1.length);
        result[0] = mat1[0];

        for (let mat2Col = 0; mat2Col < mat1[0]; mat2Col++) {
            for (let mat1Row = 0; mat1Row < mat1[0]; mat1Row++) {
                let dot = 0;
                for (let mat1Col = 0; mat1Col < mat1[0]; mat1Col++) {
                    dot += mat1[mat1Row * mat1[0] + 1 + mat1Col] * mat2[mat1Col * mat1[0] + 1 + mat2Col];
                }
                result[mat1Row * mat1[0] + 1 + mat2Col] = dot;
            }
        }
        return result;
    }
    static Power(power, mat) { //power is greater than 1 and is an integer
        //matrix is square
        let result = Matrix.ProductSquare(mat, mat);
        for (let i = 2; i < power; i++) {
            result = Matrix.ProductSquare(result, mat);
        }
        return result;
    }
    static Augment(mat) { //adds a dimention to a square matrix
        //usefull to convert a normal matrix to homogenous coordinates
        let result = new Array((mat[0] + 1) * (mat[0] + 1) + 1);
        result[0] = mat[0] + 1;
        for (let i = 0; i < result[0] - 1; i++) {
            for (let j = 0; j < mat[0]; j++) {
                result[i * result[0] + 1 + j] = mat[i * mat[0] + 1 + j];
            }
            result[i * result[0] + 1 + mat[0]] = 0;
        }
        for (let i = 0; i < result[0]; i++) {
            result[(result[0] - 1) * result[0] + 1 + i] = 0;
        }
        result[result.length - 1] = 1;
        return result;
    }
    static InverseRREFMethod(mat) {
        //matrix should be square and det != 0
        //[A,I] rref pivot method
        let bigMatrix = new Array(mat.length * 2 - 1);
        bigMatrix[0] = mat[0] * 2;
        for (let i = 0; i < mat[0]; i++) {//rows
            for (let j = 0; j < mat[0]; j++) {//cols A
                bigMatrix[i * bigMatrix[0] + 1 + j] = mat[i * mat[0] + 1 + j];
            }
            for (let j = 0; j < mat[0]; j++) {//cols I
                bigMatrix[i * bigMatrix[0] + 1 + j + mat[0]] = j == i ? 1 : 0;
            }
        }
        bigMatrix = Matrix.RowReducedEchelonForm2(bigMatrix); //use the fixed pivot method
        let result = new Array(mat.length);
        result[0] = mat[0];
        for (let i = 0; i < mat[0]; i++) {
            for (let j = 0; j < mat[0]; j++) {
                result[i * result[0] + 1 + j] = bigMatrix[i * bigMatrix[0] + 1 + mat[0] + j];
            }
        }
        return result;
    }
    static Crop(mat, start, end) {
        let height = end[0] - start[0] + 1;
        let width = end[1] - start[1] + 1;
        let result = new Array(height * width + 1);
        result[0] = width;
        for (let i = start[0]; i <= end[0]; i++) {
            for (let j = start[1]; j <= end[1]; j++) {
                result[(i - start[0]) * result[0] + 1 + j - start[1]] = mat[i * mat[0] + 1 + j];
            }
        }
        return result;
    }
    static RemoveRow(mat, rowIndex) {
        let height = (mat.length - 1) / mat[0];
        let result = new Array(mat.length - mat[0]);
        result[0] = mat[0];
        let resRow = 0;
        for (let i = 0; i < height; i++) {
            if (i != rowIndex) {
                for (let j = 0; j < mat[0]; j++) {
                    result[resRow * mat[0] + 1 + j] = mat[i * mat[0] + 1 + j];
                }
                resRow++;
            }
        }
        return result;
    }
    static RemoveCol(mat, colIndex) {
        let height = (mat.length - 1) / mat[0];
        let result = new Array((height) * (mat[0] - 1) + 1);
        result[0] = mat[0] - 1;
        for (let i = 0; i < height; i++) {
            let resCol = 0;
            for (let j = 0; j < mat[0]; j++) {
                if (j != colIndex) {
                    result[i * result[0] + 1 + resCol] = mat[i * mat[0] + 1 + j];
                    resCol++;
                }
            }
        }
        return result;
    }
    static RemoveCross(mat, origin) {
        let height = (mat.length - 1) / mat[0];
        let result = new Array((height - 1) * (mat[0] - 1) + 1);
        result[0] = mat[0] - 1;
        let resRow = 0;
        for (let i = 0; i < height; i++) {
            let resCol = 0;
            if (i != origin[0]) {
                for (let j = 0; j < mat[0]; j++) {
                    if (j != origin[1]) {
                        result[resRow * result[0] + 1 + resCol] = mat[i * mat[0] + 1 + j];
                        resCol++;
                    }
                }
                resRow++;
            }
        }
        return result;
    }
    static AddCol(colIndex, mat) {
        if (colIndex == null) {
            colIndex = mat[0];
        }
        let height = (mat.length - 1) / mat[0];
        let result = new Array(height * (mat[0] + 1) + 1);
        result[0] = mat[0] + 1;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < result[0]; j++) {
                result[i * result[0] + 1 + j] = (j == colIndex) ? 0 : mat[i * mat[0] + 1 + j];
            }
        }
        return result;
    }
    static AddRow(rowIndex, mat) {
        if (rowIndex == null) {
            rowIndex = (mat.length - 1) / mat[0];
        }
        let height = (mat.length - 1) / mat[0] + 1;
        let result = new Array(height * mat[0] + 1);
        result[0] = mat[0];
        let newRows = 0;
        for (let i = 0; i < height; i++) {
            if (i == rowIndex) {
                for (let j = 0; j < result[0]; j++) {
                    result[i * result[0] + 1 + j] = 0;
                }
                newRows++;
            }
            else {
                for (let j = 0; j < result[0]; j++) {
                    result[i * result[0] + 1 + j] = mat[(i - newRows) * mat[0] + 1 + j];
                }
            }
        }
        return result;
    }
    static Adjugate(mat) { //matrix adjugate for cramers formulas
        //matrix is square
        //recursive and verry expensive
        let result = new Array(mat.length);
        result[0] = mat[0];
        let height = (mat.length - 1) / mat[0];
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < mat[0]; j++) {
                let sign = (i + j) % 2 * -2 + 1;
                result[i * result[0] + 1 + j] = sign * Matrix.TriangularDet(Matrix.RemoveCross(mat, [i, j]));
            }
        }
        return Matrix.Transpose(result);
    }
    static InverseCramerMethod(mat) {
        //matrix should be square and det != 0
        //you should use InverseRREFMethod instead it is faster
        return Matrix.ScalarMult(1 / Matrix.TriangularDet(Matrix.Copy(mat)), Matrix.Adjugate(mat));
    }
    static ArrayMin(arr) {
        let min = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i];
            }
        }
        return min;
    }
    static ArrayMax(arr) {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
    static GershgorinCircleBounds(mat) { //returns interval containing eigenvalues
        let result = [new Array(mat.length), new Array(mat.length)];
        let height = (mat.length - 1) / mat[0];
        for (let i = 0; i < height; i++) {
            let center = Math.abs(mat[i * mat[0] + 1 + i]);
            let sumRow = 0;
            let sumCol = 0;
            for (let j = 0; j < mat[0]; j++) {
                if (j != i) {
                    sumRow += Math.abs(mat[i * mat[0] + 1 + j]);
                    sumCol += Math.abs(mat[j * mat[0] + 1 + i]);
                }
            }
            result[0][i] = Math.min(center - sumRow, center - sumCol);
            result[1][i] = Math.max(center + sumRow, center + sumCol);
        }
        return [Matrix.ArrayMin(result[0]), Matrix.ArrayMax(result[1])];
    }
    static Eigenvalues(mat) {
        let bounds = Matrix.GershgorinCircleBounds(mat);
        let eigenvalues = [];
        let height = (mat.length - 1) / mat[0];
        let startingPoints = height; //assume all eigenvalues are equaly separated for first guess
        let maxIteration = 4;
        for (let iteration = 0; iteration < maxIteration; iteration++) {
            for (let i = 0; i < startingPoints; i++) {
                let lambda = bounds[0] * (startingPoints - i) / startingPoints + bounds[1] * i / startingPoints;//linear interpolation
                let newEigen = Matrix.EigenValueConverge(mat, lambda);
                if (newEigen != null) { //avoid division by zero error
                    let found = false;
                    for (let j = 0; j < eigenvalues.length; j++) {
                        if (Math.abs(eigenvalues[j] - newEigen) < 0.000001) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        eigenvalues.push(newEigen);
                        if (eigenvalues.length >= height) {
                            return eigenvalues.sort((a, b) => a - b);
                        }
                    }
                }
            }
            startingPoints *= 2;
        }
        console.log("not all Eigenvalues found or matrix has duplicated eigenvalues", eigenvalues, mat, bounds);
        return eigenvalues;
    }

    static EigenValueConverge(mat, startValue) {
        let h = 1e-4;
        for (let a = 0; a < 200; a++) {
            let matLambda = Matrix.Copy(mat);
            let matH = Matrix.Copy(mat);
            for (let j = 0; j < matLambda[0]; j++) {
                matLambda[j * mat[0] + 1 + j] -= startValue;
                matH[j * mat[0] + 1 + j] -= startValue + h;
            }
            let detLambda = Matrix.TriangularDet(matLambda);
            let derivative = (Matrix.TriangularDet(matH) - detLambda) / h;
            if (derivative == 0) { //avoid division by zero error
                return null;
            }
            let newLambda = startValue - detLambda / (derivative); //newton-raphson
            if (Math.abs(detLambda) < 0.00001) {
                return startValue;
            }
            startValue = newLambda;
        }
    }

    static Transpose(mat) {
        let result = new Array(mat.length);
        let height = (mat.length - 1) / mat[0];
        result[0] = height;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < mat[0]; j++) {
                result[j * result[0] + i + 1] = mat[i * mat[0] + 1 + j];
            }
        }
        return result;
    }
    static LaplaceDet(mat) { //mat must be square
        //verry inneficient (memory and compute)
        //O(n!)
        if (mat[0] == 2) {//this is necessary for 2d matrix support
            return mat[1] * mat[4] - mat[2] * mat[3];
        }
        if (mat[0] == 3) { //this will give you O(n-1!) so you save n computations
            return mat[1] * mat[5] * mat[9] + mat[2] * mat[6] * mat[7] + mat[3] * mat[4] * mat[8]
                - mat[1] * mat[6] * mat[8] - mat[2] * mat[4] * mat[9] - mat[3] * mat[5] * mat[7];
        }
        let result = 0;
        for (let i = 0; i < mat[0]; i++) {
            result += (i % 2 * 2 - 1) * mat[i + 1] * Matrix.LaplaceDet(Matrix.RemoveCross(mat, [0, i]));
        }

        return result;
    }
    static LU(mat) { //matrix is square and det != 0
        let upper = Matrix.Copy(mat);
        let lower = Matrix.Identity(mat[0]);
        let size = mat[0];
        let intermediate = 0;

        for (let i = 0; i < size; i++) {
            if (upper[i * size + 1 + i] == 0) {//pivot is 0 check if row swap is avaiable
                for (let j = i + 1; j <= size; j++) {
                    if (j == size) {
                        console.log("LU error matrix has 0 column");
                        return 0;
                    }
                    if (upper[j * size + 1 + i] != 0) {
                        //row swap
                        for (let k = i; k < size; k++) {
                            intermediate = -upper[j * size + 1 + k];
                            upper[j * size + 1 + k] = upper[i * size + 1 + k];
                            upper[i * size + 1 + k] = intermediate;
                        }
                        break;
                    }
                }
            }

            for (let j = i + 1; j < size; j++) {
                let factor = upper[j * size + 1 + i] / upper[i * size + 1 + i];
                upper[j * size + 1 + i] = 0;
                lower[j * size + 1 + i] = factor;
                for (let k = i + 1; k < size; k++) {
                    upper[j * size + 1 + k] -= factor * upper[i * size + 1 + k];
                }
            }
        }
        return [lower, upper];
    }
    static CramerSolve(mat) {
        //slower than the rref method
        //you need n determinants to solve
        //to form a determinant you need to triangulate a matrix
        //if you were just to solve with rref the only operations are a triangulation and a reduction
        let nMat;
        let height = mat[0] - 1; //because matrix is augmented square
        let innerMat = Matrix.RemoveCol(mat, height);
        let det = Matrix.TriangularDet(Matrix.Copy(innerMat));
        let result = new Array(height);
        for (let i = 0; i < height; i++) {
            nMat = Matrix.Copy(innerMat);
            for (let j = 0; j < height; j++) {
                nMat[j * nMat[0] + 1 + i] = mat[j * mat[0] + mat[0]];
                console.log(j * mat[0] + mat[0])
            }
            console.log(nMat, det);
            result[i] = Matrix.TriangularDet(nMat) / det;
        }
        return result;
    }
    static DotMat(v1, v2) { //dot product but skips the 0 index
        let sum = 0;
        for (let i = 1; i < v1.length; i++) {
            sum += v1[i] * v2[i];
        }
        return sum;
    }
    static LenMat(v1) { //vector length but skips the 0 index
        let sum = 0;
        for (let i = 1; i < v1.length; i++) {
            sum += v1[i] * v1[i];
        }
        return Math.sqrt(sum);
    }
    static OuterRemove(mat, v1, v2,scale) {
        for(let i =0; i<mat[0]; i++) {
            for(let j=0; j<mat[0]; j++) {
                mat[i * mat[0] + 1 + j] -= (v1[i+1] * v2[j+1]) * scale;
            }
        }
        return mat;
    }
    static ArrayCompare(a1,a2,epsilon) {
        for(let i =0; i<a1.length; i++) {
            if(Math.abs(a1[i] - a2[i]) > epsilon) {
                return false;
            }
        }
        return true;
    }
    static EigenPairs(mat, epsilon = 1e-6) { //returns eigenvalues and eigenvectors
        // power method
        //mat must be square and non singular
        //rate of convergence is R = ln(l1/l2)

        let eigenvectors = new Array(mat[0]);
        let eigenvalues = new Array(mat[0]);
        for (let eigenpair = 0; eigenpair < mat[0]; eigenpair++) {
            let rayleigh = 0;
            let prevRayleigh = 0;
            let xVec = new Array(mat[0] + 1);
            for (let i = 0; i < mat[0]+1; i++) {
                xVec[i] = 1;
            }
            for (let iteration = 0; iteration <= 1_000_000; iteration++) {
                if(iteration == 1_000_000) {
                    console.log("EigenPairs could not converge");
                }
                let yVec = Matrix.Product(mat, xVec);
                rayleigh = Matrix.DotMat(xVec, yVec) / Matrix.DotMat(xVec, xVec);
                xVec = Matrix.ScalarMult(1 / Matrix.LenMat(yVec), yVec); //copies reference
                if(Math.abs(rayleigh - prevRayleigh) < epsilon) {
                    console.log(iteration + " iterations");
                    break;
                }
                prevRayleigh = rayleigh;
            }
            Matrix.OuterRemove(mat,xVec,xVec,rayleigh);
            eigenvectors[eigenpair] = xVec;
            eigenvalues[eigenpair] = rayleigh;
        }
        return [eigenvectors, eigenvalues];
    }
}