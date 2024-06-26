// Using mix french and spanish, because i currently learning it
'use strict'
const assert = require("assert");
const Environment = require("./Environment");

class Prim {

  constructor(environment = new Environment()) {
    this.IsNumber = this.IsNumber.bind(this);
    this.IsString = this.IsString.bind(this); 
    this.Evaluate = this.Evaluate.bind(this);
    this.IsVariableName = this.IsVariableName.bind(this);
    this.environment = environment; 
  }


  IsNumber(expression) {
    return typeof(expression) === "number";
  }

  IsString(expression) {
    return typeof(expression) === "string" && expression[0] === '"' && expression.slice(-1) === '"';
  }

  IsVariableName(expression) {
    return typeof(expression) === "string" && /^[a-zA-Z][a-zA-Z0-9]*$/.test(expression);
  }


  Evaluate(expression) {
  
    // Self evaluating expression
    if(this.IsNumber(expression) ) {
      return expression;
    }

    if(this.IsString(expression)) {
      return expression.slice(1, -1); //'Return from '"Hello"' to "Hello"'
    }


    // Mathematical expression
    if(expression[0] === '+') {
      return this.Evaluate(expression[1]) + this.Evaluate(expression[2]);
    }

    if(expression[0] === '-') {
      return this.Evaluate(expression[1]) - this.Evaluate(expression[2]);
    }

    if(expression[0] === '*') {
      return this.Evaluate(expression[1]) * this.Evaluate(expression[2]);
    }

    if(expression[0] === '/') {
      return this.Evaluate(expression[1]) / this.Evaluate(expression[2]);
    }

    if(expression[0] === '%') {
      return this.Evaluate(expression[1]) % this.Evaluate(expression[2]);
    }

    // Variable declaration
    if(expression[0] === 'var') {
      let [_, name, value] = expression;
      return this.environment.define(name, this.Evaluate(value)); // We need to Evaluate the value for the correct type 
    }
    
    // Variable lookoup
    if(this.IsVariableName(expression)) {
      return this.environment.lookup(expression);
    } 

    //throw new Error("Not implemented");
  }

}

// Testing

const primLang = new Prim(new Environment({
  null: null,
  true: true,
  false: false,
}));

// Self evaluating expression
assert.strictEqual(primLang.Evaluate(4), 4);
assert.strictEqual(primLang.Evaluate('"Hello"'), "Hello");


// Mathematical expression 
assert.strictEqual(primLang.Evaluate(['+', 1, 3]), 4);
assert.strictEqual(primLang.Evaluate(['+',['+', 4, 5] ,1]), 10);
assert.strictEqual(primLang.Evaluate(['+',['+',['+', 10, 20], 30], 60]), 120);

assert.strictEqual(primLang.Evaluate(['-', 1, 3]), -2);
assert.strictEqual(primLang.Evaluate(['-',['+', 4, 5] ,1]), 8);

assert.strictEqual(primLang.Evaluate(['*', 1, 3]),3);
assert.strictEqual(primLang.Evaluate(['*',['+', 4, 5] ,2]), 18);

assert.strictEqual(primLang.Evaluate(['/', 10, 5]), 2);
assert.strictEqual(primLang.Evaluate(['/',['-', 4, 5] ,1]), -1);

assert.strictEqual(primLang.Evaluate(['%', 10, 5]), 0);
assert.strictEqual(primLang.Evaluate(['%',['*', 3, 3] ,2]), 1);

// Declaration de variable
assert.strictEqual(primLang.Evaluate(['var', 'prim', 50]), 50);
assert.strictEqual(primLang.Evaluate(['var', 'jarwo', 10]), 10);
assert.strictEqual(primLang.Evaluate(['var', 'isTrue', 'true']), true);
assert.strictEqual(primLang.Evaluate(['var', 'isFalse', 'false']), false);

// Reccherce de variable
assert.strictEqual(primLang.Evaluate('prim'), 50);
assert.strictEqual(primLang.Evaluate('jarwo'), 10);
assert.throws(() => {
  primLang.Evaluate("UndefinedVar");
}, ReferenceError, "Variable UndefinedVar is not defined");

console.log("Toutes les assertions les valid"); // All assertions is valid

