// Class For storing global and local variables and functions
// Furthermore it is used for lookup and set values later

class Environment {

  constructor(records = {}, parentEnv = null) {
    this.records = records;
    this.parentEnv = parentEnv;
  }

  // Creer une variable avec le nom et la valeur donnes 
  define(varName, varValue) {
    this.records[varName] = varValue;
    return this.records[varName];
  }

  // Retourne la valeur d'une variable
  lookup(varName) {
    if (this.records.hasOwnProperty(varName)) {
      return this.records[varName];
    }

    throw new ReferenceError(`Variable ${varName} is not defined`);
  }

}

module.exports = Environment;
