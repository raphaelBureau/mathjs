import { Calculus } from '../calculus.js';
import { Matrix } from '../matrix.js';
import { Matrix2D } from '../matrix2D.js';
import { Matrix3D } from '../matrix3D.js';
import { RaphUnit } from './RaphUnit.js';
import {Probability} from '../probability.js'
import { NumTheory } from '../NumTheory.js';
import { MatrixAA } from '../matrixAA.js';
import { Polynomial } from '../polynomial.js';

const tests = new RaphUnit();

//
// ─── Identity & DiagDet ────────────────────────────────────────────────────────
//
tests.AssertEqual("DiagDet non-uniform", () => Matrix.DiagDet([3,3, 0, 0, 0, 9, 0, 0, 0, 3]), 81);
tests.AssertEqual("DiagDet singular", () => Matrix.DiagDet([3,3, 0, 0, 0, 9, 0, 0, 0, 0]), 0);
tests.DisplayResults();

for (let i = 1; i <= 30; i++) {
    tests.AssertTrue(`Dynamic Identity ${i}x${i}`, () => {
        const m = Matrix.Identity(i);
        return m[0] === i && (m.length-1)/m[0] === i;
    });
    tests.AssertEqual(`Dynamic DiagDet ${i}x${i}`, () => Matrix.DiagDet(Matrix.Identity(i)), 1);
}
tests.DisplayResults();

//
// ─── Matrix Copy ───────────────────────────────────────────────────────────────
//
tests.AssertTrue("Matrix.Copy deep copy integrity", () => {
    const original = [2,1, 2, 3, 4];
    const copy = Matrix.Copy(original);
    original[1] = 99;
    return copy[1] !== 99;
});
tests.AssertTrue("Matrix.Copy creates new reference", () => {
    const m = [1,1];
    return Matrix.Copy(m) !== m;
});
tests.AssertTrue("Matrix.Copy preserves identity", () => {
    return Matrix.Compare(Matrix.Identity(3), Matrix.Copy(Matrix.Identity(3)));
});
tests.DisplayResults();

//
// ─── Transpose ────────────────────────────────────────────────────────────────
//
tests.AssertTrue("Transpose symmetric matrix", () => {
    const mat = [[1, 2, 3], [2, 4, 5], [3, 5, 6]];
    return Matrix.Compare(Matrix.Transpose(Matrix.Copy(mat)), mat);
});
tests.AssertTrue("Transpose modifies correctly", () => {
    const mat = [[1, 2], [3, 4]];
    Matrix.Transpose(mat);
    return Matrix.Compare(mat, [[1, 3], [2, 4]]);
});
tests.DisplayResults();

//
// ─── Scalar Operations ─────────────────────────────────────────────────────────
//
tests.AssertTrue("ScalarMult works in-place", () => {
    const m = [2,1, 2, 3, 4];
    Matrix.ScalarMult(3, m);
    return Matrix.Compare(m, [2,3, 6, 9, 12]);
});

tests.AssertTrue("ScalarMult negative scalar", () => {
    const m = [2,1, -2, -3, 4];
    Matrix.ScalarMult(-2, m);
    return Matrix.Compare(m, [2,-2, 4, 6, -8]);
});

tests.AssertTrue("ScalarMult fractional scalar", () => {
    const m = [2,2, 4, 6, 8];
    Matrix.ScalarMult(0.5, m);
    return Matrix.CompareInRange(m, [2,1, 2, 3, 4], 1e-6);
});

tests.AssertTrue("ScalarAdd modifies matrix", () => {
    const m = [2,1, 1, 1, 1];
    Matrix.ScalarAdd(2, m);
    return Matrix.Compare(m, [2,3, 3, 3, 3]);
});

tests.AssertTrue("ScalarAdd negative scalar", () => {
    const m = [2,5, 6, 7, 8];
    Matrix.ScalarAdd(-3, m);
    return Matrix.Compare(m, [2,2, 3, 4, 5]);
});

tests.AssertTrue("ScalarAdd fractional scalar", () => {
    const m = [3,[0, 0.5], [1.5, 2]];
    Matrix.ScalarAdd(0.5, m);
    return Matrix.CompareInRange(m, [3,[0.5, 1], [2, 2.5]], 1e-6);
});

tests.DisplayResults();

//
// ─── Row Echelon & RREF ────────────────────────────────────────────────────────
//
tests.AssertTrue("RowEchelonForm full rank", () => {
    const A = [3, 3, 2, 1, 0, 5, 2, 0, 0, 7];
    return Matrix.CompareInRange(Matrix.RowEchelonForm(A), [3,1, 2 / 3, 1 / 3, 0, 1, 0.4, 0, 0, 1], 1e-6);
});
tests.AssertTrue("RowReducedEchelonForm reduces correctly", () => {
    const A = [4,2, 3, 7, 2, 6, 5, 3, 4, 7, 8, 4, 8];
    const expected = [4,1, 0, 0, -0.540541, 0, 1, 0, 1.594594, 0, 0, 1, -0.243243];
    return Matrix.CompareInRange(Matrix.RowReducedEchelonForm(A), expected, 1e-6);
});
tests.DisplayResults();

//
// ─── Matrix Multiplication ─────────────────────────────────────────────────────
//

// 2x2 * 2x2 basic test
tests.AssertTrue("Product 2x2 × 2x2", () => {
    const A = [2,1, 2, 3, 4];
    const B = [2,5, 6, 7, 8];
    const expected = [2,19, 22, 43, 50];
    return Matrix.Compare(Matrix.Product(A, B), expected);
});

// 2x3 * 3x2
tests.AssertTrue("Product 2x3 × 3x2", () => {
    const A = [3,1, 2, 3, 4, 5, 6];
    const B = [2,7, 8, 9, 10, 11, 12];
    const expected = [2,58, 64, 139, 154];
    return Matrix.Compare(Matrix.Product(A, B), expected);
});

// 3x3 × 3x5
tests.AssertTrue("Product 3x3 × 3x5", () => {
    const A = [3,2, 3, 4, 5, 6, 7, 8, 9, 10];
    const B = [5,1, 2, 8, 1, 3, 9, 5, 1, 5, 8, 9, 5, 1, 2, 0];
    const expected = [5,65, 39, 23, 25, 30, 122, 75, 53, 49, 63, 179, 111, 83, 73, 96];
    return Matrix.Compare(Matrix.Product(A, B), expected);
});

// Identity matrix as right factor
tests.AssertTrue("Product A × Identity = A", () => {
    const A = [2,1, 2, 3, 4];
    const I = Matrix.Identity(2);
    return Matrix.Compare(Matrix.Product(A, I), A);
});

// Identity matrix as left factor
tests.AssertTrue("Product Identity × A = A", () => {
    const A = [2,5, 6, 7, 8];
    const I = Matrix.Identity(2);
    return Matrix.Compare(Matrix.Product(I, A), A);
});

// Multiplying with zero matrix
tests.AssertTrue("Product with zero matrix", () => {
    const A = [2,1, 2, 3, 4];
    const Z = [2,0, 0, 0, 0];
    const expected = [2,0, 0, 0, 0];
    return Matrix.Compare(Matrix.Product(A, Z), expected);
});

// 1xN × Nx1 (dot product = scalar in matrix)
tests.AssertTrue("Product 1x3 × 3x1 (scalar in matrix)", () => {
    const A = [3,2, 4, 6];
    const B = [1,1, 2, 3];
    const expected = [1,28]; // 2×1 + 4×2 + 6×3 = 28
    return Matrix.Compare(Matrix.Product(A, B), expected);
});

// Nx1 × 1xN (outer product)
tests.AssertTrue("Product 3x1 × 1x3 (outer product)", () => {
    const A = [1,1, 2, 3];
    const B = [3,4, 5, 6];
    const expected = [3,4, 5, 6, 8, 10, 12, 12, 15, 18];
    return Matrix.Compare(Matrix.Product(A, B), expected);
});

tests.DisplayResults();

//
// ─── Matrix Multiplication - Square ─────────────────────────────────────────────────────
//
tests.AssertTrue("ProductSquare identity * A == A", () => {
    const A = [3,2, 4, 6, 1, 3, 5, 0, 0, 1];
    return Matrix.Compare(Matrix.ProductSquare(Matrix.Identity(3), A), A);
});
tests.AssertTrue("ProductSquare (3x3)x(3x3)", () => {
    const A = [3,2, 3, 4, 5, 6, 7, 8, 9, 10];
    const B = [3,5, 6, 8, 2, 5, 4, 4, 7, 3];
    const C = [3,32, 55, 40, 65, 109, 85, 98, 163, 130];
    return Matrix.Compare(Matrix.ProductSquare(A, B), C);
});
// A * B * C
tests.AssertTrue("ProductSquare chain A*B*C", () => {
    const A = [2,1, 2, 3, 4];
    const B = [2,2, 0, 1, 2];
    const C = [2,0, 1, 1, 0];

    const AB = Matrix.ProductSquare(A, B);
    const ABC = Matrix.ProductSquare(AB, C);

    const expected = Matrix.ProductSquare(Matrix.ProductSquare(A, B), C);
    return Matrix.Compare(ABC, expected);
});

// A^3 = A*A*A
tests.AssertTrue("ProductSquare A^3", () => {
    const A = [2,1, 2, 3, 4];
    const A2 = Matrix.ProductSquare(A, A);
    const A3 = Matrix.ProductSquare(A2, A);
    const expected = [2,37, 54, 81, 118];
    return Matrix.Compare(A3, expected);
});

// Chain (A*B)*(B*A)
tests.AssertTrue("ProductSquare chain (A*B)*(B*A)", () => {
    const A = [2,1, 2, 0, 1];
    const B = [2,3, 1, 2, 4];

    const AB = Matrix.ProductSquare(A, B);
    const BA = Matrix.ProductSquare(B, A);
    const result = Matrix.ProductSquare(AB, BA);

    const expected = [2,39, 121, 14, 46];

    return Matrix.Compare(result, expected);
});

// Large 3x3 chain A*A*A
tests.AssertTrue("ProductSquare 3x3 A^3", () => {
    const A = [3,2, 0, 1, 1, 3, 0, 4, 1, 2];
    const A2 = Matrix.ProductSquare(A, A);
    const A3 = Matrix.ProductSquare(A2, A);
    const expected = Matrix.Power(3, A); // assuming Matrix.Power exists
    return Matrix.CompareInRange(A3, expected, 1e-6);
});
tests.DisplayResults();
//
// ─── Triangulation ─────────────────────────────────────────────────────
//
tests.AssertInRage(
    "TriangularDet [[3,1,0],[5,9,8],[4,3,3]]",
    () => Matrix.TriangularDet([3,3, 1, 0, 5, 9, 8, 4, 3, 3]),
    26,
    0.000000001
);

tests.AssertInRage(
    "TriangularDet [[8,2,3],[2,7,0],[7,3,8]]",
    () => Matrix.TriangularDet([3,8, 2, 3, 2, 7, 0, 7, 3, 8]),
    287,
    0.000000001
);

tests.AssertInRage(
    "TriangularDet [[3,1,0,0],[5,9,8,0],[4,3,3,0],[21,6,8,12]]",
    () => Matrix.TriangularDet([4,3, 1, 0, 0, 5, 9, 8, 0, 4, 3, 3, 0, 21, 6, 8, 12]),
    312,
    0.000000001
);
tests.AssertEqual("TriangularDet [[0,265],[658,0]]", ()=> {
    return Matrix.TriangularDet([2,0,265,658,0]);
},-174370
);

tests.DisplayResults();
//
// ─── PowerSquare ─────────────────────────────────────────────────────
//
// Compare Power 2 with ProductSquare
tests.AssertTrue("Matrix.Power(2) matches ProductSquare", () => {
    const A = [3,4, 2, 6, 34, 43, 5, 2, 6, 8];
    const expected = Matrix.ProductSquare(A, A);
    const result = Matrix.Power(2, A);
    return Matrix.CompareInRange(result, expected, 1e-6);
});

// Compare Power 3 with repeated ProductSquare
tests.AssertTrue("Matrix.Power(3) matches A * A * A", () => {
    const A = [3,4, 2, 6, 34, 43, 5, 2, 6, 8];
    const A2 = Matrix.ProductSquare(A, A);
    const expected = Matrix.ProductSquare(A2, A);
    const result = Matrix.Power(3, A);
    return Matrix.CompareInRange(result, expected, 1e-6);
});

// Compare Power 5 with looped multiplication
tests.AssertTrue("Matrix.Power(5) matches repeated multiplication", () => {
    const A = [3, 4, 2, 6, 34, 43, 5, 2, 6, 8];
    let expected = A;
    for (let i = 1; i < 5; i++) {
        expected = Matrix.ProductSquare(expected, A);
    }
    const result = Matrix.Power(5, A);
    return Matrix.CompareInRange(result, expected, 1e-6);
});

tests.DisplayResults();
//
// ─── Raise Dimention ─────────────────────────────────────────────────────
//
tests.AssertTrue("Augment 2x2 -> 3x3", () => {
    return Matrix.Compare([3,1, 0, 0, 0, 1, 0, 0, 0, 1],
        Matrix.Augment([2,1, 0, 0, 1])
    );
});

tests.AssertTrue("Augment 2*(2x2) -> 3x3", () => {
    return Matrix.Compare([3,2, 0, 0, 0, 2, 0, 0, 0, 1],
        Matrix.Augment(Matrix.ScalarMult(2, [2,1, 0, 0, 1]))
    );
});

for(let i = 1; i<30; i++) {
tests.AssertTrue(`Dynamic Augment ${i}x${i} -> ${i+1}x${i+1}`, () => {
    return Matrix.Compare(Matrix.Identity(i+1),
        Matrix.Augment(Matrix.Identity(i))
    );
});
}
tests.DisplayResults();

//
// ─── Crop ─────────────────────────────────────────────────────
//

tests.AssertTrue("Crop Identity returns identity", ()=> {
    return Matrix.Compare(Matrix.Crop(Matrix.Identity(3),[0,0],[2,2]),Matrix.Identity(3));
});
tests.AssertTrue("Crop 2x2 on 3x3 Identity returns 2x2 identity", ()=> {
    return Matrix.Compare(Matrix.Crop(Matrix.Identity(3),[0,0],[1,1]),Matrix.Identity(2));
});
tests.AssertTrue("Crop 2x2 on 3x3 Identity returns 2x2 identity - starting from end", ()=> {
    return Matrix.Compare(Matrix.Crop(Matrix.Identity(3),[1,1],[2,2]),Matrix.Identity(2));
});
tests.AssertTrue("Crop 3x3 -> 2x2", ()=> {
    return Matrix.Compare(Matrix.Crop([3,2,5,6,7,8,2,4,6,9],[0,1],[1,2]),[2,5,6,8,2]);
});
tests.AssertTrue("Crop 3x3 -> 1x1", ()=> {
    return Matrix.Compare(Matrix.Crop([3,2,5,6,7,8,2,4,6,9],[1,1],[1,1]),[1,8]);
});

tests.DisplayResults();

//
// ─── Remove ─────────────────────────────────────────────────────
//
tests.AssertTrue("Remove Row on Identity", ()=> {
    return Matrix.Compare([3,1,0,0,0,0,1],Matrix.RemoveRow(Matrix.Identity(3),1))
});
tests.AssertTrue("Remove Col on Identity", ()=> {
    return Matrix.Compare([2,1,0,0,0,0,1],Matrix.RemoveCol(Matrix.Identity(3),1))
});
tests.AssertTrue("Remove Cross on Identity 3x3 is 2x2 Identity", ()=> {
    return Matrix.Compare(Matrix.Identity(2),Matrix.RemoveCross(Matrix.Identity(3),[1,1]))
});
tests.DisplayResults();
//
// ─── Cramer ─────────────────────────────────────────────────────
//
tests.AssertTrue("Cramer Adjugate [[2,1,3],[1,-1,1],[1,4,-2]]", ()=> {
    return Matrix.Compare([3,-2,14,4,3,-7,1,5,-7,-3],Matrix.Adjugate([3,2,1,3,1,-1,1,1,4,-2]))
});
tests.AssertTrue("Cramer Inverse on 3x3 Identity is 3x3 Identity", ()=> {
    return Matrix.Compare(Matrix.Identity(3),Matrix.InverseCramerMethod(Matrix.Identity(3)))
});
tests.AssertTrue("Cramer Inverse [[2,1,3],[1,-1,1],[1,4,-2]]", ()=> {
    return Matrix.CompareInRange([3,-1/7,1,2/7,3/14,-1/2,1/14,5/14,-1/2,-3/14],Matrix.InverseCramerMethod([3,2,1,3,1,-1,1,1,4,-2]),1e-6)
});
tests.AssertTrue("Cramer Inverse = RREF [A,I] Inverse on [[2,5,6,4],[3,8,6,2],[2,1,8,3],[7,96,9,2]]", ()=> {
    return Matrix.CompareInRange(Matrix.InverseCramerMethod([4,2,5,6,4,3,8,6,2,2,1,8,3,7,96,9,2]),Matrix.InverseRREFMethod([4,2,5,6,4,3,8,6,2,2,1,8,3,7,96,9,2]),1e-6);
});
tests.AssertTrue("Cramer Inverse [[2,5,6,4],[3,8,6,2],[2,1,8,3],[7,96,9,2]]", ()=> {
    return Matrix.CompareInRange(Matrix.InverseCramerMethod([4,2,5,6,4,3,8,6,2,2,1,8,3,7,96,9,2]),[4,2/29,25/29,-18/29,-2/29,7/1595,-72/1595,24/1595,2/145,-32/145,-23/145,56/145,3/145,863/1595,-218/1595,-459/1595,-2/145],1e-6);
});
tests.DisplayResults();
//
// ─── Inverse ─────────────────────────────────────────────────────
//
tests.AssertTrue("Inverse 2x2", ()=> {
    return Matrix.CompareInRange([2,0.2916666,-0.2083333,0.083333,0.083333],
        Matrix.InverseRREFMethod([2,2,5,-2,7]),1e-6);
});
tests.AssertTrue("Inverse 3x3", ()=> {
    return Matrix.CompareInRange([3,-1.80952,0.952381,-0.142857,1.61904,-0.904762,0.285714,-0.142857,0.285714,-0.142857],
        Matrix.InverseRREFMethod([3,1,2,3,4,5,6,7,8,2]),1e-5);
});
tests.DisplayResults();
//
// ─── Additional Tests ──────────────────────────────────────────────────────────
//
tests.AssertTrue("Transpose of 1x1", () => {
    const mat = [1,5];
    return Matrix.Compare(Matrix.Transpose(Matrix.Copy(mat)), [1,5]);
});
tests.AssertTrue("ScalarAdd zero doesn't change matrix", () => {
    const mat = [2,1, 2, 3, 4];
    Matrix.ScalarAdd(0, mat);
    return Matrix.Compare(mat, [2,1, 2, 3, 4]);
});
tests.AssertTrue("ScalarMult by 0 creates zero matrix", () => {
    const mat = [3,9, 8, 7, 6, 5, 4, 3, 2, 1];
    Matrix.ScalarMult(0, mat);
    return Matrix.Compare(mat, [3,0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

tests.DisplayResults();


//
// ─── Matrix2D Tests ──────────────────────────────────────────────────────────
//
tests.AssertTrue("Matrix2D Identity", ()=> {
    return Matrix.Compare(Matrix.Identity(3),Matrix2D.ConvertToUniversal(Matrix2D.Identity()));
});
tests.AssertTrue("Matrix2D Inverted Identity", ()=> { // (-0 == 0) -> true
    return Matrix.Compare(Matrix.Identity(3),Matrix2D.ConvertToUniversal(Matrix2D.Inverse(Matrix2D.Identity())));
});

tests.AssertTrue("Matrix2D Identity x Identity = Identity", ()=> {
    return Matrix.Compare(Matrix.Identity(3), Matrix2D.ConvertToUniversal(Matrix2D.Product(Matrix2D.Identity(),Matrix2D.Identity())));
});

tests.AssertTrue("Matrix2D Product", ()=> {
    return Matrix.Compare([3,23,56,15,22,48,12,0,0,1],Matrix2D.ConvertToUniversal(Matrix2D.Product([5,2,3,2,4,4,0,0,1],[3,8,2,4,8,1,0,0,1])));
});

tests.AssertTrue("Matrix2D 5*scale x 1/5scale = Identity", ()=> {
    return Matrix.CompareInRange(Matrix2D.ConvertToUniversal(Matrix2D.Product(Matrix2D.Scale(5),Matrix2D.Scale(1/5))),Matrix.Identity(3),1e-6);
});
tests.AssertEqualsArray2DRange("Matrix2D 5*scale x 1/5scale = Identity", ()=> {
    return Matrix2D.Product(Matrix2D.Scale(5),Matrix2D.Scale(1/5));},
    Matrix2D.Identity(),
    1e-6
);

tests.DisplayResults();


//console.log(Matrix.RowReducedEchelonForm([[3, -5,0,0,6],[1,-9,8,0,0],[0,1,-3,0,2],[5,0,0,80,5]]));

//
// ─── EigenValues ──────────────────────────────────────────────────────────
//
tests.AssertEqualsArrayRange("Eigenvalues [[23,56,15],[22,48,12],[0,0,1]]", ()=> {
    return Matrix.Eigenvalues([3,23,56,15,22,48,12,0,0,1]);},
    [-1.75923,1,72.7592],
    1e-4
);

tests.AssertEqualsArrayRange("GershgorinCircleBounds [[23,56,15],[22,48,12],[0,0,1]]", ()=> {
    return Matrix.GershgorinCircleBounds([3,23,56,15,22,48,12,0,0,1]);},
    [-48,104],
    0
);

tests.AssertEqualsArrayRange("Eigenvalues [[3,5,8,1,0],[3,6,12,52,6],[8,59,3,0,65],[1,31,15,30,48],[8,6,3,84,6]]", ()=> {
    return Matrix.Eigenvalues([5,3,5,8,1,0,3,6,12,52,6,8,59,3,0,65,1,31,15,30,48,8,6,3,84,6]);},
    [ -38.425804059213924, -32.29503500473464, 1.753685161804851, 8.7203609234924, 108.24679297865211 ],
    1e-6
);

tests.DisplayResults();

for(let i =0; i<10; i++) {
tests.AssertInRage("Probability.Factorial(i) == Calculus.Integral 0 to inf (x^n)(e^-x) dx", ()=>{
    return Calculus.Integral(0,150,(x) => {return Math.pow(x,i)/(Math.pow(Math.E,x))},8000);
},Probability.Factorial(i),1e-2);
}

tests.DisplayResults();

console.log(Calculus.NonLinearSystemSolver([(x,y) => x+9*y,(x,y)=> 2+x*y],1e-4));
//console.log("expected: " + [ -4.242587653779236, 0.4713986281976929 ]);

console.log(Calculus.NonLinearSystemSolver([(x,y) => 2+x*y-Math.cos(x),(x,y)=> x*x+9*y],1e-4));

console.log(Calculus.NonLinearSystemSolver([(x,y,z)=>5*x-y*y*y+5*z,(x,y,z)=> z*z*z-x+y-7,(x,y,z) => 5*x-9*z-Math.cos(y)],1e-4));

console.log(Calculus.NonLinearSystemSolver([(x) => 0.072-8.99*Math.pow(10,9)*40*Math.pow(10,-5)*Math.pow(10,-6)/(x*x)],1e-6));

console.log(Calculus.IntegrateFromAtoX(4,20,(x) => x*x+4*x-89,1e-6, 10000000)); //la ti est a chier

console.log(Calculus.IntegrateFromXtoB(2,5,(x) => 1,1e-6, 10000000)); //la ti est a chier

console.log(Calculus.NonLinearSystemSolver([(x,y) => Calculus.IntegralTrapezoid(x,y,(t) => t*t-5*t+40,10000)-200,(x,y) => x*x+9*y-50],1e-6));

console.log(NumTheory.Euclid(5320, 950));

//console.log(NumTheory.Bezout(96, 28));
console.log(Calculus.IntegralTrapezoid(0.3,0.8,(x) => Math.pow(10,4)/x,100000));

function benchmark() {
let time = Date.now();
for(let i =0; i<1_000_000; i++) {
    //MatrixAA.LaplaceDet([[0,5,8,1,0],[0,6,12,52,6],[0,59,3,0,65],[0,31,15,30,48],[0,6,3,84,6]]);
    MatrixAA.LaplaceDet([[1,2,3],[4,5,6],[9,8,9]]);
}
console.log("LaplaceDetAA:" + (Date.now() - time));

time = Date.now();
for(let i =0; i<1_000_000; i++) {
   //Matrix.TriangularDet([5,0,5,8,1,0,0,6,12,52,6,0,59,3,0,65,0,31,15,30,48,0,6,3,84,6]);
   Matrix.TriangularDet([3,1,2,3,4,5,6,9,8,9]);
}
console.log("TriangularDet:" + (Date.now() - time));

time = Date.now();
for(let i =0; i<1_000_000; i++) {
    //Matrix.LaplaceDet([5,0,5,8,1,0,0,6,12,52,6,0,59,3,0,65,0,31,15,30,48,0,6,3,84,6]);
    Matrix.LaplaceDet([3,1,2,3,4,5,6,9,8,9]);
}
console.log("LaplaceDet:" + (Date.now() - time));

time = Date.now();
for(let i =0; i<1_000_000; i++) {
    Matrix3D.Det([1,2,3,4,5,6,9,8,9]);
}
console.log("Matrix3DDet:" + (Date.now() - time));
}
benchmark();
console.log(Matrix3D.Det([1,2,3,4,5,6,9,8,9]));
console.log(Matrix.TriangularDet([5,1,5,8,1,0,0,6,12,52,6,0,59,3,0,65,0,31,15,30,48,0,6,3,84,6]));
console.log(Matrix.LaplaceDet([5,1,5,8,1,0,0,6,12,52,6,0,59,3,0,65,0,31,15,30,48,0,6,3,84,6]));
console.log(MatrixAA.LaplaceDet([[1,5,8,1,0],[0,6,12,52,6],[0,59,3,0,65],[0,31,15,30,48],[0,6,3,84,6]]));

console.log(Matrix.LU([3,0,2,3,4,5,6,9,8,9]));
console.log(MatrixAA.LU([[0,2,3],[4,5,6],[9,8,9]]));

function f1(x,y,z) {
    return x*y*z;
}
function g1(x,y,z) {
    return x+2*y+3*z-100;
}
console.log(Calculus.NonLinearSystemSolver([
    (x,y,z,l) => Calculus.PartialDerivative(f1,[x,y,z],0,1e-6)+l*Calculus.PartialDerivative(g1,[x,y,z],0,1e-6),
    (x,y,z,l) => Calculus.PartialDerivative(f1,[x,y,z],1,1e-6)+l*Calculus.PartialDerivative(g1,[x,y,z],1,1e-6),
    (x,y,z,l) => Calculus.PartialDerivative(f1,[x,y,z],2,1e-6)+l*Calculus.PartialDerivative(g1,[x,y,z],2,1e-6),
    (x,y,z,l) => g1(x,y,z)
],1e-6));

console.log(Matrix.ConvertAToAA(Matrix.InverseRREFMethod([4,2,5,6,4,3,8,6,2,2,1,8,3,7,96,9,2]),1e-6));
console.log(Matrix.InverseCramerMethod([4,2,5,6,4,3,8,6,2,2,1,8,3,7,96,9,2]));

console.log(Matrix.CramerSolve(Matrix.ConvertAAToA(
    [[5,2,-1,1,9],
    [0,-2,8,0,8],
    [2,0,2,-8,4],
    [8,6,-3,3,2]]
)));

console.log(Matrix.RowReducedEchelonForm2(Matrix.ConvertAAToA(
    [[5,2,-1,1,9],
    [0,-2,8,0,8],
    [2,0,2,-8,4],
    [8,6,-3,3,2]]
)));

console.log(Matrix.EigenPairs(Matrix.ConvertAAToA([[23,56,15],[22,48,12],[0,0,1]])));

console.log(Polynomial.Evaluate(8,[5,7,3,1,6,3]));
console.log(Polynomial.Evaluate(8,Polynomial.Derivative([5,7,3,1,6,3])));

console.log(Polynomial.CauchyBound([5,7,3,1,6,3]));

console.log(Polynomial.BisectionRoot([5,7,3,1,6,3]));
console.log(Polynomial.ToString([5,7,3,1,6,3]));
console.log(Polynomial.ToString(Polynomial.Primitive([5,7,3,1,6,3])));
console.log(Polynomial.ToString(Polynomial.Primitive(Polynomial.Derivative([5,7,3,1,6,3]))));
console.log(Polynomial.ToString(Polynomial.Derivative([5,7,3,1,6,3])));

console.log(Polynomial.DescartesRule([5,7,3,1,6,3]));