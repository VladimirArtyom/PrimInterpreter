// Using mix french and spanish, because i currently learning it
'use strict'
const assert = require("assert");
const Environment = require("./Environment");

class Prim {

  constructor() {
    this.IsNumber = this.IsNumber.bind(this);
    this.IsString = this.IsString.bind(this); 
    this.Evaluate = this.Evaluate.bind(this);
    this.EvaluateBlock = this.EvaluateBlock.bind(this);
    this.IsVariableName = this.IsVariableName.bind(this);
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

  EvaluateBlock(block, env) {
    
    let result;
    const [_tag, ...expressions] = block;

    expressions.forEach(exp => {
      result = this.Evaluate(exp, env);
    });

    return result;

  }

  Evaluate(expression, env) {
  
    // Self evaluating expression
    if(this.IsNumber(expression)) {
      return expression;
    }

    if(this.IsString(expression)) {
      return expression.slice(1, -1); //'Return from '"Hello"' to "Hello"'
    }


    // Mathematical expression
    if(expression[0] === '+') {
      return this.Evaluate(expression[1], env) + this.Evaluate(expression[2], env);
    }

    if(expression[0] === '-') {
      return this.Evaluate(expression[1], env) - this.Evaluate(expression[2], env);
    }

    if(expression[0] === '*') {
      return this.Evaluate(expression[1], env) * this.Evaluate(expression[2], env);
    }

    if(expression[0] === '/') {
      return this.Evaluate(expression[1], env) / this.Evaluate(expression[2], env);
    }

    if(expression[0] === '%') {
      return this.Evaluate(expression[1], env) % this.Evaluate(expression[2], env);
    }

    // Variable declaration
    if(expression[0] === 'var') {
      let [_, name, value] = expression;
      return env.define(name, this.Evaluate(value, env)); // We need to Evaluate the value for the correct type 
    }
    
    // Variable lookoup
    if(this.IsVariableName(expression)) {
      return env.lookup(expression);
    } 

    // Block 
    if(expression[0] === 'demarrer') {
      const localEnv = new Environment({}, env);
      return this.EvaluateBlock(expression, localEnv);
    }
    throw new Error("Not implemented");
  }

}

// Testing
const primLang = new Prim();
const globalEnv = new Environment({
  null: null,
  true: true,
  false: false,
});

// Self evaluating expression
assert.strictEqual(primLang.Evaluate(4, globalEnv), 4);
assert.strictEqual(primLang.Evaluate('"Hello"', globalEnv), "Hello");


// Mathematical expression 
assert.strictEqual(primLang.Evaluate(['+', 1, 3], globalEnv), 4);
assert.strictEqual(primLang.Evaluate(['+',['+', 4, 5] ,1], globalEnv), 10);
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
assert.strictEqual(primLang.Evaluate(['var', 'prim', 50], globalEnv), 50);
assert.strictEqual(primLang.Evaluate(['var', 'jarwo', 10], globalEnv), 10);
assert.strictEqual(primLang.Evaluate(['var', 'isTrue', 'true'], globalEnv), true);
assert.strictEqual(primLang.Evaluate(['var', 'isFalse', 'false'], globalEnv), false);

// Reccherce de variable
assert.strictEqual(primLang.Evaluate('prim', globalEnv), 50);
assert.strictEqual(primLang.Evaluate('jarwo', globalEnv), 10);
assert.throws(() => {
  primLang.Evaluate("UndefinedVar", globalEnv);
}, ReferenceError, "Variable UndefinedVar is not defined");

// expresion de bloque ( Block expression )
assert.strictEqual(primLang.Evaluate(
  ['demarrer', //demarrer --> start/begin
    ['var', 'x', 10],
    ['var', 'y', 20],
    ['+', ['*', 'x', 'y'], 30]
  ]
), 230);

assert.strictEqual(primLang.Evaluate(
  ['demarrer',
    ['var', 'prim', 3],
    ['var', 'jarwo', ['*', 5, 2]],
    ['*', ['*', 'prim', 'jarwo'], 10],
  ]
), 300);
// Bloc imbrique ( nested block )
// Este bloque debe mantener el valor correcte de la x global y no debe cambiar dentro de su bloc imbrique (This block should maintain the correct value of the global x and should not change inside its nested block)
assert.strictEqual( primLang.Evaluate(
  ['demarrer',
    ['var', 'x', 10],
    ['demarrer', 
      ['var', 'x', 20],
      'x'
    ],
    'x'
  ]), 10);
console.log("Toutes les assertions les valid"); // All assertions are valid

