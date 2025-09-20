import { Calculus } from '../calculus.js';
import { Probability } from '../probability.js';
import { RaphUnit } from './RaphUnit.js';

const tests = new RaphUnit();

tests.DisplayResults();

//console.log(Matrix.DiagDet(Matrix.Identity(4)));

//console.log(Matrix.TriangularDet(Matrix.ConvertAAToA([[3, 1, 0, 0], [5, 9, 8, 0], [4, 3, 3, 0], [21, 6, 8, 12]])));
//console.log(Matrix.TriangularDet([4,3, 1, 0, 0, 5, 9, 8, 0, 4, 3, 3, 0, 21, 6, 8, 12]));

 //   const A = [3,2, 3, 4, 5, 6, 7, 8, 9, 10];
 //   const B = [5 ,1, 2, 8, 1, 3, 9, 5, 1, 5, 8, 9, 5, 1, 2, 0];
 //   const expected = [[65, 39, 23, 25, 30], [122, 75, 53, 49, 63], [179, 111, 83, 73, 96]];
 //   console.log(Matrix.ConvertAToAA(Matrix.Product(A, B)), expected);

//     console.log(Matrix.CompareInRange([3,-1.80952,0.952381,-0.142857,1.61904,-0.904762,0.285714,-0.142857,0.285714,-0.142857],
//         Matrix.InverseRREFMethod([3,1,2,3,4,5,6,7,8,2]),1e-5));

//console.log(Calculus.Derivative((x) => x*x,2,1e-4));

//console.log(Calculus.PartialDerivative((x,y,z) => {
//    return x*3*-z*z+y*y*y+8
//},
//[null,5,9],4,1e-4));

//console.log(Calculus.Gradient((x,y) =>{ return 5*x*x*y/(4 + y*y*y-x*y)},[4,7],1e-4));

//console.log(Stats.Mode([1,1,2,2,2,2,2,3,1,2,2,5,6,1,1,2],1e-5));

//console.log(Stats.StandardDeviation([1,1,4,6,5,2,1,1,2,3,4]));

//console.log(Stats.Skewness([11,2,44,22,34,5,3,22,45,32,3,22,34,2]));

//console.log(Stats.Kurtosis([11,2,44,22,34,5,3,22,45,32,3,22,34,2]));

//console.log(Calculus.LineIntegral(5,10,(x)=> {return [Math.cos(x), x*x*x, -Math.sin(x)*Math.cos(x)];},1000))

//console.log(Calculus.LhopitalsLimit(0,(x)=> {return Math.sin(x)},(x)=> { return x} ,1e-4,10000000000));

//console.log(Calculus.NDerivative((x)=> {return x*x*56},422303,2,1e-2));

//console.log(Calculus.LhopitalsLimit(0, (x) => 1-Math.cos(x), (x)=> x*x,1e-4,9999999));

for(let i =0; i<10; i++) {
tests.AssertInRage("Probability.Factorial(i) == Calculus.Integral 0 to inf (x^n)(e^-x) dx", ()=>{
    return Calculus.Integral(0,150,(x) => {return Math.pow(x,i)/(Math.pow(Math.E,x))},8000);
},Probability.Factorial(i),1e-2);
}

tests.DisplayResults();

//console.log(Calculus.NonLinearSystemSolver([(x,y) => x+9*y,(x,y)=> 2+x*y],1e-6));

//console.log(Matrix.ConvertAToAA(Matrix.RowReducedEchelonForm([2,0,1,1,0])));

//console.log(Calculus.SurfaceIntegral([0,0],[1,1],(x,y) => [x , y, x*x+y*5],100));

//console.log(Calculus.LineIntegral(0,5,(x) => [x, Math.cos(x)],50000));

//console.log(Calculus.Integral(0,5,(x) => Math.sqrt(1+Math.pow(Math.sin(x),2)),1000000));

//console.log((Calculus.Integral(0,5+(1e-6)/2,(x)=>x*x*x,100000)-Calculus.Integral(0,5-(1e-6)/2,(x)=>x*x*x,100000))/1e-6); //derivative of the primitive is f(x)

//console.log(Calculus.CriticalPoint((x) => x*x*x+2*x*x-5*x+80,-5,1e-4));

//console.log(Calculus.Max((x) => x*x+8*x+x*x*x/50,[-40,5],10,1e-6));

//console.log(Calculus.Min((x) => x*x+8*x+x*x*x/50,[-40,5],10,1e-6));

//console.log(Calculus.Roots((x) => x*x+8*x+x*x*x/50,[-40,5],10,1e-2));

//console.log(Calculus.LeibinzPI(2000));

//console.log(Calculus.TaylorCos(4,100), Math.cos(4));

//console.log(Calculus.TaylorSin(4,100), Math.sin(4));

//console.log(Calculus.BetterEuler(1000));

//console.log(Calculus.IntegralTrapezoid(0,2,(x) => {return x*x+1},5))

//console.log(Calculus.Integral(0,2,(x) => {return x*x+1},5))

//console.log(Calculus.MonteCarloIntegration(0,2,(x) => {return x*x+1},50))

//console.log(Calculus.NPartialDerivative((x,y) => x*x*x+y*y*y*x*x+x*x*y,[5,2],[0,0,1,1],1e-3));

//console.log(Calculus.NonLinearSystemSolver([
//    (x,y,z,l) => y*z+l,
//    (x,y,z,l) => x*z+l*2,
//    (x,y,z,l) => x*y+l*3,
//    (x,y,z,l) => x+2*y+3*z-100
//],1e-6));


console.log(Calculus.NonLinearSystemSolver([
    (a,b,c,d) => a+b+c*d-5,
    (a,b,c,d) => b+c*a-3,
    (a,b,c,d) => a*b-c+d,
    (a,b,c,d) => a*c-10
],1e-6));

console.log(Calculus.Quartic(-5,2,-3,7,8));

console.log(Calculus.NewtonRaphson((x) =>-5*x*x*x*x+2*x*x*x-3*x*x+7*x+8,0,1e-6));
console.log(Calculus.NewtonRaphsonDerivative((x) =>-5*x*x*x*x+2*x*x*x-3*x*x+7*x+8,(x) => -5*x*x*x*4 + 2*x*x*3 -3*x*2 +7,0));

