"use strict";

import ModelError from "/ModelError.js";
import Funcionario from "/Funcionario.js";

export default class DaoFuncionario {
  
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.arrayFuncionarios = [];
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD
   */ 
  async obterConexao() {
    if(DaoFuncionario.conexao == null) {
      DaoFuncionario.conexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("FuncionarioDB", 1); 

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("FuncionarioST", {
            autoIncrement: true
          });
          store.createIndex("idxCodigo", "codigo", { unique: true });
        };

        requestDB.onerror = event => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = event => {
          if (event.target.result) {
            // event.target.result apontará para IDBDatabase aberto
            resolve(event.target.result);
          }
          else 
            reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoFuncionario.conexao;
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterFuncionarios() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["FuncionarioST"], "readonly");
        store = transacao.objectStore("FuncionarioST");
        indice = store.index('idxCodigo');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Funcionario.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayFuncionarios = await promessa;
    return this.arrayFuncionarios;
  }

  //-----------------------------------------------------------------------------------------//

  async obterFuncionarioPeloCodigo(cod) {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["FuncionarioST"], "readonly");
        store = transacao.objectStore("FuncionarioST");
        indice = store.index('idxCodigo');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(cod);
      consulta.onsuccess = function(event) { 
        if(consulta.result != null)
          resolve(Funcionario.assign(consulta.result)); 
        else
          resolve(null);
      };
      consulta.onerror = function(event) { reject(null); };
    });
    let funcionario = await promessa;
    return funcionario;
  }

  //-----------------------------------------------------------------------------------------//

  async obterFuncionariosPeloAutoIncrement() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["FuncionarioST"], "readonly");
        store = transacao.objectStore("FuncionarioST");
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Funcionario.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayFuncionarios = await promessa;
    return this.arrayFuncionarios;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(funcionario) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["FuncionarioST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o funcionario", event.target.error));
      };
      let store = transacao.objectStore("FuncionarioST");
      let requisicao = store.add(Funcionario.deassign(funcionario));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(funcionario) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["FuncionarioST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o funcionario", event.target.error));
      };
      let store = transacao.objectStore("FuncionarioST");     
      let indice = store.index('idxCodigo');
      var keyValue = IDBKeyRange.only(funcionario.getCodigoFuncionario());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.codigo == funcionario.getCodigoFuncionario()) {
            const request = cursor.update(Funcionario.deassign(funcionario));
            request.onsuccess = () => {
              console.log("[DaoFuncionario.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Funcionario com o código " + funcionario.getCodigoFuncionario() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(funcionario) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["FuncionarioST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o funcionario", event.target.error));
      };
      let store = transacao.objectStore("FuncionarioST");
      let indice = store.index('idxCodigo');
      var keyValue = IDBKeyRange.only(funcionario.getCodigoFuncionario());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.codigo == funcionario.getCodigoFuncionario()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Funcionario com o código " + funcionario.getCodigoFuncionario() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
