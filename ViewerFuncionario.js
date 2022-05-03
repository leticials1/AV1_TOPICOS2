import Status from "/Status.js";
import Funcionario from "/Funcionario.js";
import ViewerError from "/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerFuncionario {

  #ctrl;
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar  = this.obterElemento('divNavegar'); 
    this.divComandos = this.obterElemento('divComandos'); 
    this.divAviso    = this.obterElemento('divAviso'); 
    this.divDialogo  = this.obterElemento('divDialogo');

    this.btPrimeiro  = this.obterElemento('btPrimeiro');
    this.btAnterior  = this.obterElemento('btAnterior');
    this.btProximo   = this.obterElemento('btProximo');
    this.btUltimo    = this.obterElemento('btUltimo');

    this.btIncluir   = this.obterElemento('btIncluir');
    this.btExcluir   = this.obterElemento('btExcluir');
    this.btAlterar   = this.obterElemento('btAlterar');
    this.btSair      = this.obterElemento('btSair');

    this.btOk        = this.obterElemento('btOk');
    this.btCancelar  = this.obterElemento('btCancelar');

    this.tfCodigoFuncionario = this.obterElemento('tfCodigoFuncionario');
    this.tfCpf       = this.obterElemento('tfCpf');
    this.tfNome      = this.obterElemento('tfNome');
    this.tfEmail     = this.obterElemento('tfEmail');
    this.tfTelefone  = this.obterElemento('tfTelefone');
	this.tfCargo     = this.obterElemento('tfCargo');
	this.tfSalario   = this.obterElemento('tfSalario');
      
    this.btPrimeiro.onclick = fnBtPrimeiro; 
    this.btProximo.onclick = fnBtProximo; 
    this.btAnterior.onclick = fnBtAnterior; 
    this.btUltimo.onclick = fnBtUltimo; 

    this.btIncluir.onclick = fnBtIncluir; 
    this.btAlterar.onclick = fnBtAlterar; 
    this.btExcluir.onclick = fnBtExcluir; 

    this.btOk.onclick = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

//------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

//------------------------------------------------------------------------//
  
  getCtrl() { 
    return this.#ctrl;
  }

//------------------------------------------------------------------------//
  
  apresentar(pos, qtde, funcionario) {    
    
    this.configurarNavegacao( pos <= 1 , pos == qtde );   

    if(funcionario == null) {
      this.tfCodigoFuncionario.value = "";
      this.tfCpf.value       = "";
      this.tfNome.value      = "";
      this.tfEmail.value     = "";
      this.tfTelefone.value  = "";
	  this.tfCargo.value     = "";
	  this.tfSalario.value   = "";
      this.divAviso.innerHTML = " Número de Funcionarios: 0";
    } else {
      this.tfCodigoFuncionario.value = funcionario.getCodigoFuncionario();
      this.tfCpf.value       = funcionario.getCpf();
      this.tfNome.value      = funcionario.getNome();
      this.tfEmail.value     = funcionario.getEmail();
      this.tfTelefone.value  = funcionario.getTelefone();
	  this.tfCargo.value     = funcionario.getCargo();
	  this.tfSalario.value  = funcionario.getSalario();
      this.divAviso.innerHTML = "Posição: " + pos + " | Número de Funcionarios: " + qtde;
    }
  }

//------------------------------------------------------------------------//

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled   = flagFim;
    this.btProximo.disabled  = flagFim;
    this.btAnterior.disabled = flagInicio;
  }
  
//------------------------------------------------------------------------//
  
  statusEdicao(operacao) { 
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false; 
    
    if(operacao != Status.EXCLUINDO) {
      this.tfCpf.disabled = false;
      this.tfNome.disabled = false;
      this.tfEmail.disabled = false;
      this.tfTelefone.disabled = false;
	  this.tfCargo.disabled = false;
	  this.tfSalario.disabled = false;
      this.divAviso.innerHTML = "";      
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";      
    }
    if(operacao == Status.INCLUINDO) {
      this.tfCodigoFuncionario.disabled = false;
      this.tfCodigoFuncionario.value = "";
      this.tfCpf.value = "";
      this.tfNome.value = "";
      this.tfEmail.value = "";
      this.tfTelefone.value = "";
	  this.tfCargo.value = "";
      this.tfSalario.value = "";
    }
  }

//------------------------------------------------------------------------//
  
  statusApresentacao() { 
    this.tfCpf.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true; 
    this.tfCodigoFuncionario.disabled = true;
    this.tfCpf.disabled = true;
    this.tfNome.disabled = true;
    this.tfEmail.disabled = true;
    this.tfTelefone.disabled = true;
	this.tfCargo.disabled = true;
    this.tfSalario.disabled = true;
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarPrimeiro();
  
}

//------------------------------------------------------------------------//

function fnBtProximo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarProximo();
  
}

//------------------------------------------------------------------------//

function fnBtAnterior() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarAnterior();
  
}

//------------------------------------------------------------------------//

function fnBtUltimo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarUltimo();
  
}
//------------------------------------------------------------------------//

function fnBtIncluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarIncluir();
}

//------------------------------------------------------------------------//

function fnBtAlterar() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarAlterar();
  
}

//------------------------------------------------------------------------//

function fnBtExcluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const codigo = this.viewer.tfCodigoFuncionario.value;
  const cpf = this.viewer.tfCpf.value;
  const nome = this.viewer.tfNome.value;
  const email = this.viewer.tfEmail.value;
  const telefone = this.viewer.tfTelefone.value;
  const cargo = this.viewer.tfCargo.value;
  const salario = this.viewer.tfSalario.value;
    
  this.viewer.getCtrl().efetivar(codigo, cpf, nome, email, telefone, cargo, salario); 

}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}

//------------------------------------------------------------------------//





