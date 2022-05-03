import ModelError from "/ModelError.js";

export default class Funcionario {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #codigoFuncionario;
  #cpf;
  #nome;
  #email;
  #telefone;
  #cargo
  #salario

  //-----------------------------------------------------------------------------------------//

  constructor(cod, cpf, nome, email, telefone,cargo,salario) {
    this.setCodigoFuncionario(cod);
    this.setCpf(cpf);
    this.setNome(nome);
    this.setEmail(email);
    this.setTelefone(telefone);
    this.setCargo(cargo);
    this.setSalario(salario);		
  }
  
  //-----------------------------------------------------------------------------------------//

  getCodigoFuncionario() {
    return this.#codigoFuncionario;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCodigoFuncionario(cod) {
    if(!Funcionario.validarCodigo(cod))
      throw new ModelError("Codigo de funcionario Inválido: " + cod);
    this.#codigoFuncionario = cod;
  }
  
  //-----------------------------------------------------------------------------------------//

  getCpf() {
    return this.#cpf;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCpf(cpf) {
    if(!Funcionario.validarCpf(cpf))
      throw new ModelError("CPF Inválido: " + cpf);
    this.#cpf = cpf;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.#nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Funcionario.validarNome(nome))
      throw new ModelError("Nome Inválido: " + nome);
    this.#nome = nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getEmail() {
    return this.#email;
  }
  
  //-----------------------------------------------------------------------------------------//

  setEmail(email) {
    if(!Funcionario.validarEmail(email))
      throw new ModelError("Email inválido: " + email);
    this.#email = email;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTelefone() {
    return this.#telefone;
  }
  
  //-----------------------------------------------------------------------------------------//

  setTelefone(telefone) {
    if(!Funcionario.validarTelefone(telefone))
      throw new ModelError("Telefone inválido: " + telefone);
    this.#telefone = telefone;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  getCargo() {
    return this.#cargo;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCargo(cargo) {
    if(!Funcionario.validarCargo(cargo))
      throw new ModelError("Cargo inválido: " + cargo);
    this.#cargo = cargo;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  getSalario() {
    return this.#salario;
  }
  
  //-----------------------------------------------------------------------------------------//

  setSalario(salario) {
    if(!Salario.validarSalario(salario))
      throw new ModelError("Salario inválido: " + salario);
    this.#salario = salario;
  }
  
  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"codigoFuncionario" : "'+ this.#codigoFuncionario + '",' +
               '"cpf" :  "'     + this.#cpf       + '",' +
               '"nome" : "'     + this.#nome      + '",' +
               '"email" : "'    + this.#email     + '",' +
               '"telefone" : "' + this.#telefone  + '" ' + 
			   '"cargo" : "'    + this.#cargo     + '" ' + 
			   '"salario" : "'  + this.#salario     + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Funcionario(obj.codigoFuncionario, obj.cpf, obj.nome, obj.email, obj.telefone, obj.cargo, obj.salario);
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  static validarMatricula(cod) {
    if(cod == null || cod == "" || cod == undefined)
      return false;
    const padraoMatricula = /[0-9]/;
    if (!padraoMatricula.test(cod))
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarCpf(strCpf) {
    let soma;
    let resto;
    let i;

    soma = 0;
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace("-", "");

    if (strCpf == "00000000000") return false;

    for (i = 1; i <= 9; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(9, 10))) return false;

    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(10, 11))) return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      return false;
    if (nome.length > 40) 
      return false;
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarEmail(email) {
    if(email == null || email == "" || email == undefined)
      return false;

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarTelefone(telefone) {
    if(telefone == null || telefone == "" || telefone == undefined)
      return false;

    const padraoTelefone = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
    if (!padraoTelefone.test(telefone)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
  
   static validarCargo(cargo) {
    if(cargo == null || cargo == "" || cargo == undefined)
      return false;
    if (cargo.length > 40) 
      return false;
    const padraoCargo = /[A-Z][a-z] */;
    if (!padraoCargo.test(cargo)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

    static validarSalario(salario) {
        if(salario == null || salario == "" || salario == undefined)
          return false;
        if (salario.length > 2) 
          return false;
        const padraoSalario = /[1-9] */;
        if (!padraoSalario.test(salario)) 
          return false;
        return true;
      }


  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Código Funcionário: " + this.codigoFuncionario + "\n";
    texto += "Nome: " + this.nome + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}