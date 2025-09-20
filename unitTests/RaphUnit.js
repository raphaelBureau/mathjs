export class RaphUnit {
    constructor() {
        this.failed = []; //testName, Error
        this.success = [];//testName
    }
    Assert(testName, funcResult) { //function should return true
        if(funcResult) {
            this.success.push(testName);
        }
        else{
            this.failed.push([testName, "Assert failed"]);
        }
    }
    AssertTrue(testName, func) { //function should return true
        try {
        if(func()) {
            this.success.push(testName);
        }
        else{
            this.failed.push([testName, "Assert failed"]);
        }
    }
    catch(e) {
        this.failed.push([testName, "AssertTrue failed, exception: " + e]);
    }
    }
    AssertFalse(testName, func) { //function should return true
        try {
        if(func()) {
            this.success.push(testName);
        }
        else{
            this.failed.push([testName, "Assert failed"]);
        }
    }
    catch(e) {
        this.failed.push([testName, "AssertFalse failed, exception: " + e]);
    }
}
    AssertEqual(testName, func, expected) {
        try {
        let result = func();
        if(result == expected) {
            this.success.push(testName);
        }
        else{
            this.failed.push([testName, "AssertEqual failed, expected: " + expected + ", result: " + result]);
        }
    }
    catch(e) {
        this.failed.push([testName, "AssertEqual failed, exception: " + e]);
    }
}
    AssertNotEqual(testName, func, expected) {
        try{
        let result = func();
        if(result != expected) {
            this.success.push(testName);
        }
        else{
            this.failed.push([testName, "AssertNotEqual failed, expected: " + expected + ", result: " + result]);
        }
    }
    catch(e) {
        this.failed.push([testName, "AssertNotEqual failed, exception: " + e]);
    }
}
    AssertInRage(testName, func, expected, range) {
        try{
            let result = func();
            if(result < expected + range && result > expected - range) {
                this.success.push(testName);
            }
            else{
                this.failed.push([testName, "AssertInRage failed, expected: " + expected + ", result: " + result, " range: " + range]);
            }
        }
        catch(e) {
            this.failed.push([testName, "AssertInRage failed, exception: " + e]);
        }
    }
    AssertEqualsArrayRange(testName, func, expected, range) {
        try{
            let result = func();
            if(result.length != expected.length) {
                this.failed.push([testName, "AssertEqualsArrayRange failed, expected: " + expected + ", result: " + result, " range: " + range]);
                return;
            }
            for(let i=0; i<result.length; i++) {
                if(Math.abs(result[i] - expected[i]) > range) {
                    this.failed.push([testName, "AssertEqualsArrayRange failed, expected: " + expected + ", result: " + result, " range: " + range]);
                    return;
                }
            }
            this.success.push(testName);
        }
        catch(e) {
            this.failed.push([testName, "AssertEqualsArrayRange failed, exception: " + e]);
        }
    }
    AssertEqualsArray2DRange(testName, func, expected, range) {
        try{
            let result = func();
            if(result.length != expected.length || result[0].length != expected[0].length) {
                this.failed.push([testName, "AssertEqualsArray2DRange failed, expected: " + expected + ", result: " + result, " range: " + range]);
                return;
            }
            for(let i=0; i<result.length; i++) {
                for(let j=0; j<result[i].length; j++) {
                if(Math.abs(result[i][j] - expected[i][j]) > range) {
                    this.failed.push([testName, "AssertEqualsArray2DRange failed, expected: " + expected + ", result: " + result, " range: " + range]);
                    return;
                }
            }
            }
            this.success.push(testName);
        }
        catch(e) {
            this.failed.push([testName, "AssertEqualsArray2DRange failed, exception: " + e]);
        }
    }
    DisplayResults() {
        let testCount = document.getElementById("testCount");
        testCount.innerHTML = this.success.length + "/" + (this.success.length + this.failed.length);
        if(this.failed.length > 0) {
            let errorElement = document.getElementById("results-container");
            let errorHtml = "";
            for(let i = 0; i < this.failed.length; i++) {
                 errorHtml += "<p style='color: red;'>" + this.failed[i][0] + ": " + this.failed[i][1] + "</p>";
            }
            errorElement.innerHTML = errorHtml;
        }
    }
}