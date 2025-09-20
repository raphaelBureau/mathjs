import { Probability } from "./probability.js";
import { Matrix } from "./matrix.js";
import { MatrixAA } from "./matrixAA.js";

export class Calculus {
    static Derivative(func, x, h) { //numerical derivative
        return (func(x + h/2) - func(x-h/2)) / h;
    }
    static NDerivative(func, x, n, h) {//numerical n-th order derivative
        if (n > 1) {
            return (Calculus.NDerivative(func, x + h / 2, n - 1, h) - Calculus.NDerivative(func, x - h / 2, n - 1, h)) / h;
        }
        return (func(x + h / 2) - func(x - h / 2)) / h;
    }
    static NewtonRaphsonDerivative(func, derivative, startX) {
        //func and derivative are functions that return a floating point value
        //ex: (x) => {return 2*x*x + x*5} in mathematical notation: 2x^2+5x
        let previousX = startX;
        for (let i = 0; i < 1_000_000; i++) {
            startX = startX - func(startX) / derivative(startX);
            if ((Math.abs(previousX - startX)) < 0.0001) {
                return startX; //convergence
            }
            previousX = startX;
        }
        console.log("NewtonRaphsonDerivative no convergence");
        return startX;
    }
    static NewtonRaphson(func, startX, epsilon=1e-6) {
        //func is a mathematical function
        //ex: (x) => {return 2*x*x + x*5} in mathematical notation: 2x^2+5x
        let previousX = startX;
        for (let i = 0; i < 1_000_000; i++) {
            startX = startX - func(startX) / Calculus.Derivative(func, startX, epsilon);
            if ((Math.abs(previousX - startX)) < epsilon) {
                return startX; //convergence
            }
            previousX = startX;
        }
        console.log("NewtonRaphson no convergence");
        return startX;
    }
    static Integral(a, b, func, segments) {
        let sum = 0;
        let x = 0;
        let width = (b - a);
        let dx = width/segments;
        for (let i = 1; i < segments+1; i++) {
            x = a + dx*i //linear interpolation
            x-= dx; //midpoint rule
            sum += func(x) * dx;
        }
        return sum;
    }
    static PartialDerivative(func, params, diffIndex, epsilon) { //expects function f(x,y) = z, or f(x,y,z) = w, only works for functions that return a single value
        //finite difference method
        //goofy javascript array decomposition
        params[diffIndex] -= epsilon / 2
        let f1 = func(...params);
        params[diffIndex] += epsilon;
        let f2 = func(...params);
        return (f2 - f1) / epsilon
    }
    static ArrayCopy(arr) {
        let result = new Array(arr.length);
        for(let i =0; i<result.length; i++) {
            result[i] = arr[i];
        }
        return result;
    }
    static NPartialDerivative(func, params, diffOrder, epsilon, currentDiff = 0) {
        //gives the nth order partial derivative
        //diffOrder is an array containing the index of the variables to be differenciated
        //ex: for fxxy(x,y) diffOrder is [0,0,1]
        if(currentDiff == 0) {
            diffOrder.sort((a,b) => b-a); //reverse diff order
        }
        if(currentDiff == diffOrder.length - 1) {
            return Calculus.PartialDerivative(func, params, diffOrder[currentDiff], epsilon);
        }
        let p1 = Calculus.ArrayCopy(params);
        p1[currentDiff] += epsilon /2;
        let p2 = Calculus.ArrayCopy(p1);
        p2[currentDiff] -= epsilon;
        return (Calculus.NPartialDerivative(func, p1, diffOrder, epsilon, currentDiff+1) - Calculus.NPartialDerivative(func, p2, diffOrder, epsilon, currentDiff+1)) / epsilon;
    }
    static Gradient(func, point, h) {//expects function f(x,y) = z, or f(x,y,z) = w, only works for functions that return a single value
        let result = new Array(point.length);
        for (let i = 0; i < point.length; i++) {
            result[i] = Calculus.PartialDerivative(func, point,i, h);
        }
        return result;
    }
    static UniversalLength(vec) { //sqrt(x^2+y^2+z^2+w^2,...) works for any vector of R^n
        let sum = 0;
        for (let i = 0; i < vec.length; i++) {
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    }
    static UniversalSub(vec1, vec2) { //works for any vector of R^n
        let result = new Array(vec1.length);
        for (let i = 0; i < vec1.length; i++) {
            result[i] = vec1[i] - vec2[i];
        }
        return result;
    }
    static UniversalScale(scalar, vec1) { //works for any vector of R^n
        let result = new Array(vec1.length);
        for (let i = 0; i < vec1.length; i++) {
            result[i] = vec1[i] * scalar;
        }
        return result;
    }
    static LineIntegral(a, b, func, segments) { //works for R^n, where f(t) -> (x,y,z,w,...);
        let dist = 0;
        let span = b - a;
        let delta = span / segments;
        for (let i = 0; i < segments; i++) {
            let pos = i * delta + a;
            dist += Calculus.UniversalLength(Calculus.UniversalSub(func(pos + delta), func(pos)));
        }
        return dist;
    }
    static LhopitalsLimit(x, func1, func2, epsilon, maxValue, TTL = 10) { //for f1/f2 limits
        //undefined -> 0/0, inf/inf, inf/0
        //0 is any number <= epsilon
        //inf is any number >= maxValue
        //a little broken for big numbers
        //good for limits approaching 0
        let v1 = func1(x);
        let v2 = func2(x);
        let f1 = Math.abs(v1);
        let f2 = Math.abs(v2);
        for (let i = 0; i < TTL; i++) {
            if (i > 0) {
                v1 = Calculus.NDerivative(func1,x,i,epsilon);
                v2 = Calculus.NDerivative(func2,x,i,epsilon);
                f1 = Math.abs(v1);
                f2 = Math.abs(v2);
            }
            if (!((f1 <= epsilon && f2 <= epsilon) || // 0/0
                (f1 >= maxValue && f2 >= maxValue))) // inf/inf 
             {
                if (f1 <= epsilon) {
                    return 0;
                }
                if (f2 >= maxValue) {
                    return 0;
                }
                if (f1 >= maxValue) {
                    return Infinity * Math.sign(v1);
                }
                if (f2 <= epsilon) {
                    return Infinity * Math.sign(v1);
                }
                return v1 / v2;
            }
        }
        console.log(f1,f2);
        console.log("lhopitals TTL < 0");
        return undefined;
    }
    static Jacobian(functions, xVec, epsilon) {
        //everything is linear if you zoom enough
        let size = functions.length;
        let mat = new Array(size*size+1);
        mat[0] = size;
        for(let i =0; i<size; i++) {
            for(let j =0; j<size; j++) {
                mat[i*size+j+1] = Calculus.PartialDerivative(functions[i],xVec,j,epsilon);
            }
        }
        return mat;
    }
    static NonLinearSystemSolver(equations, epsilon, startValue = 0) { //startValue is a vector [x,y,z,...]
        //system must be in format equation = 0
        let size = equations.length;
        let mat;
        let xVec = new Array(size);
        //find a good starting point
        const xVecAttemps = 1000;
        if(startValue == 0) {
        for(let i =0; i<=xVecAttemps; i++) {
            if(i == xVecAttemps) {
                console.log("no xVec candidate found");
            }
            let valid = true;
            for(let j =0; j<size; j++) {
                xVec[j] = (i % 2 * 2 -1) * (i+j*i+1);
            }
            let eigenvalues = Matrix.Eigenvalues(Calculus.Jacobian(equations,xVec,epsilon));
            if(eigenvalues.length != size) { //get non identical Real eigenvalues
                valid = false;
            }
            else{
                for(let eigen = 0; eigen < eigenvalues.length; eigen++) {
                    if(Math.abs(eigenvalues[eigen]) < epsilon) { //check for eigenvalues approaching 0
                        valid = false;
                        break;
                    }
                }
            }
            if(valid) {break;}
        }
        }
        else{
            xVec = startValue;
        }
        //from starting point try to converge to a point
        //where all equations = 0
        for(let iteration = 0; iteration< 100_000; iteration++) {
            mat = Calculus.Jacobian(equations, xVec, epsilon);
            mat = Matrix.AddCol(size, mat);
        for(let i =0; i<size; i++) {
            mat[i*mat[0]+1+size] = -equations[i](...xVec);
        }
        let res = Matrix.RowReducedEchelonForm(mat);
        //console.log(Matrix.ConvertAToAA(res),Matrix.ConvertAToAA(mat),xVec);
        for(let i =0; i<=xVec.length; i++) {
            if(i == xVec.length) {
                console.log(iteration + " iterations");
                return xVec;
            }
            if(Math.abs(mat[i*mat[0]+size+1]) > epsilon * 1000) {
                break;
            }
        }
        for(let i =0; i<xVec.length; i++) {
            xVec[i] += res[i*mat[0]+size+1];
        }
        }
        console.log("ttl");
        return xVec;
    }
    static SurfaceIntegral(startVector, endVector, func, segments) { //func is a function (x,y) => z
        let x = startVector[0];
        let sum = 0;
        let deltaX = (endVector[0] - x)/segments;
        for(let i =0; i < segments; i++) {
            sum += Calculus.LineIntegral(startVector[1],endVector[1],(y) => {return func(x,y)},segments)*deltaX;
            x += deltaX;
        }
        return sum;
    }
    static CriticalPoint(func, startX, epsilon) {
        let maxIterations = 1000;
        let prevX = startX;
        for(let i =0; i<maxIterations; i++) {
            startX = startX - Calculus.Derivative(func, startX, epsilon)/Calculus.NDerivative(func, startX, 2, epsilon); //newton-raphson
            if(Math.abs(prevX - startX) <= epsilon) {
                return startX;
            }
            prevX = startX;
        }
        return null;
    }
    static Max(func, bounds, segments, epsilon) {
        let absoluteMax = func(bounds[0]);
        let absoluteMaxX = bounds[0];
        for(let i =0; i<segments; i++) {
            let x = bounds[0] * (segments-i) + bounds[1] * i //linear interpolation
            let nextCrit = Calculus.CriticalPoint(func,x,epsilon);
            let value = func(nextCrit);
            if(value > absoluteMax) {
                absoluteMax = value;
                absoluteMaxX = nextCrit;
            }
        }
        if(absoluteMax > Math.max(func(bounds[0]),func(bounds[1]))) {
            return(absoluteMaxX);
        }
        if(func(bounds[0]) > func(bounds[1])) {
            return bounds[0];
        }
        return bounds[1];
    }
        static Min(func, bounds, segments, epsilon) {
        let absoluteMin = func(bounds[0]);
        let absoluteMinX = bounds[0];
        for(let i =0; i<segments; i++) {
            let x = bounds[0] * (segments-i) + bounds[1] * i //linear interpolation
            let nextCrit = Calculus.CriticalPoint(func,x,epsilon);
            let value = func(nextCrit);
            if(value < absoluteMin) {
                absoluteMin = value;
                absoluteMinX = nextCrit;
            }
        }
        if(absoluteMin < Math.max(func(bounds[0]),func(bounds[1]))) {
            return(absoluteMinX);
        }
        if(func(bounds[0]) < func(bounds[1])) {
            return bounds[0];
        }
        return bounds[1];
    }
    static InArray(array,value,epsilon) {
        for(let i =0; i <array.length; i++) {
            if(Math.abs(array[i]-value) < epsilon) {
                return true;
            }
        }
        return false;
    }
    static Roots(func, bounds, segments, epsilon) {
        let roots = [];
        let delta = (bounds[1] - bounds[0])/segments;
        for(let i=0; i<segments; i++) {
            let newRoot = Calculus.NewtonRaphson(func, bounds[0] + delta*i);
            if(!Calculus.InArray(roots,newRoot,epsilon)) {
                roots.push(newRoot);
            }
        }
        return roots.sort((a,b) => a-b);
    }
    static LeibinzPI(iterations) {
        let result = 0;
        for(let i =0; i<iterations; i++) {
            result += (i % 2 * 2 -1) / (2*i+1);
        }
        return result *4;
    }
    static TaylorCos(x, iterations) {
        let result = 0;
        for(let i =0; i<iterations; i++) {
            result += (i % 2 * 2 -1) * (Math.pow(x,2*i)/Probability.Factorial(2*i));
        }
        return result;
    }
        static TaylorSin(x, iterations) {
        let result = 0;
        for(let i =0; i<iterations; i++) {
            result += (i % 2 * 2 -1) * (Math.pow(x,2*i+1)/Probability.Factorial(2*i+1));
        }
        return result;
    }
    static EulerNumber(iterations) {
        let result = 0;
        for(let i =0; i<iterations; i++) {
            result += 1 / Probability.Factorial(i);
        }
        return result;
    }
    static EulerPower(power, iterations) {
        let result = 0;
        for(let i=0; i<iterations; i++) {
            result += Math.pow(power,i) / Probability.Factorial(i);
        }
        return result;
    }
    static BetterEuler(iterations) {
        let result = 0;
        for(let i=0; i<iterations; i++) {
            result += (1-2*i) / (Probability.Factorial(2*i));
        }
        return 1/result;
    }
    static IntegralTrapezoid(a,b,func,segments) {
        if(a > b) {
            return -Calculus.IntegralTrapezoid(b,a,func,segments);
        }
        //basicaly the finite difference method with a small optimisation
        let span = b-a;
        let dx = span/segments;
        let sum = (func(a) + func(b))/2;
        for(let i =1; i<segments; i++) {
            sum += func(a + i*dx);
        }
        return sum *= dx;
    }
    static MonteCarloIntegration(a,b,func,segments) {
        //dont use lol
        let sum = 0;
        let x = 0;
        let span = (b - a);
        let dx = span/segments;
        for (let i = 1; i < segments+1; i++) {
            x =  a + span * Math.random()//random interpolation
            sum += func(x) * dx;
        }
        return sum;
    }
    static IntegrateFromXtoB(targetValue,b,func,epsilon,maxIterations = 100000, isRecursive = false) {
        //a verry small epsilon could make the function verry long to compute
        //we cant really use the trapezoid integration here since we dont know the whole span of integration
        //integrate from unknown to a
        let sum=0;
        let sign = Math.sign(targetValue);
        for(let i =0; i<maxIterations; i++) {
            sum+= func(b - epsilon*i) * epsilon;
            if(sign) {
                if(sum > targetValue) {
                    console.log(i);
                    return b - epsilon*i;
                }
            }
            else{
                if(sum < targetValue) {
                    return b - epsilon*i;
                }
            }
        }
        if(isRecursive) {
        console.log("IntegrateFromXtoB bound not found", sum, targetValue);
        return null;
        }
        return this.IntegrateFromAtoX(-targetValue, b, func, epsilon, maxIterations, true);
    }
        static IntegrateFromAtoX(targetValue,a,func,epsilon,maxIterations = 100000, isRecursive = false) {
        //a verry small epsilon could make the function verry long to compute
        //we cant really use the trapezoid integration here since we dont know the whole span of integration
        //integrate from unknown to a
        let sum=0;
        let sign = Math.sign(targetValue) > 0;
        for(let i =0; i<maxIterations; i++) {
            sum+= func(a + epsilon*i) * epsilon;
            if(sign) {
                if(sum >= targetValue) {
                    return a + epsilon*i;
                }
            }
            else{
                if(sum <= targetValue) {
                    return a + epsilon*i;
                }
            }
        }
        if(isRecursive) {
        console.log("IntegrateFromAtoX bound not found", sum, targetValue);
        return null;
        }
        console.log("rec")
        return this.IntegrateFromXtoB(-targetValue, a, func, epsilon, maxIterations, true);
    }
    static NumericalSum(func, start, end) { //i would need to implement a parser to calculate discrete sums
        //the same is true for series
        let result = 0;
        for(let i =start; i<=end; i++) {
            result += func(i);
        }
        return result;
    }
}