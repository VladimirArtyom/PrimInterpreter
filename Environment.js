// Class For storing global and local variables and functions
// Furthermore it is used for lookup and set values later

const { lookup } = require("dns");

class Environment {

  constructor(records = {}, parentEnv = null) {
    this.records = records;
    this.parentEnv = parentEnv;
  }

  // Creer une  avec le nom et la valeur donnes 
  define(varName, varValue) {
    this.records[varName] = varValue;
    return this.records[varName];
  }

  // Retourne la valeur d'une variable
  lookup(varName) {
    return this.resolve(varName).records[varName];
  }
   // Modifier la valeur d'une variable
  assign(varName, varValue) {
    this.resolve(varName).records[varName] = varValue;
  }
  //  Revenir a l'environnment specifique dans lequel une variable est definie ou lancer une
  //  exception si une variable n'est pas definie
  resolve(varName) {
    if(this.records.hasOwnProperty(varName)) {
      return this;
    }

    if (this.parentEnv === null) {
      throw new ReferenceError(`Variable ${varName} is not defined`);  
    }

    // Revenir a l'environnement parent 
    return this.parentEnv.resolve(varName);
  }
}

module.exports = Environment;
