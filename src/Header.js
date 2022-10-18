import { useEffect, useState } from "react";
import firebase from "firebase/app";
import { auth, storage, db } from "./firebase.js";

function Header(props) {
  const [progress, setProgress] = useState(0); //Estados para atualizar barra de progresso no upload

  const [file, setFile] = useState(null); //Estados atualizados quando escolhemos um arquivo para upload

  useEffect(() => {}, []);

  function openModalAccountCreate(e) {
    e.preventDefault();
    document.querySelector(".modalAccountCreate").style.display = "block";
  }

  function closeModalCreate() {
    document.querySelector(".modalAccountCreate").style.display = "none";
  }

  function createAccount(e) {
    e.preventDefault();
    let email = document.getElementById("signUpEmail").value;
    let username = document.getElementById("signUpUserName").value;
    let password = document.getElementById("signUpPassword").value;

    //Creating account in firebase
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
        alert("Conta criada com sucesso!");
        document.querySelector(".modalAccountCreate").style.display = "none";
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function openModalLogin(e) {
    e.preventDefault();
    document.querySelector(".modalLogin").style.display = "block";
    console.log("clicado");
  }

  function closeModalLogin() {
    document.querySelector(".modalLogin").style.display = "none";
  }

  function logIn(e) {
    e.preventDefault();
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        props.setUser(auth.user.displayName);
        alert("Usuário conectado!");
        window.location.href = "/";
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function logout(e) {
    e.preventDefault();
    auth.signOut().then(function (val) {
      props.setUser(null);
      window.location.href = "/";
    });
  }

  function openModalUpload(e) {
    e.preventDefault();
    document.querySelector(".modalUpload").style.display = "block";
  }

  function closeModalUpload() {
    document.querySelector(".modalUpload").style.display = "none";
  }

  function uploadPost(e) {
    e.preventDefault(); //Prevenção para que o formulário não atualize a página quando for enviado
    let postTitle = document.getElementById("upload-title").value; //Pegando o titulo da postagem

    const uploadTask = storage.ref(`images/${file.name}`).put(file); //Aqui criamos uma referencia para a pasta images e dizendo que dentro da pasta images estará o nome do arquivo, que no parâmetro do put passamos que o nome será o nome do próprio arquivo selecionado

    uploadTask.on(
      //Nessa função estamos verificando em que ponto o upload está, para assim atualizarmos a barra de progresso conforme o upload é feito
      "state_changed",
      function (snapshot) {
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100; //Aqui fazemos uma conta matemática para saber quando foi transferido até o momento (snapshot.bytesTransferred) e quando é o total a ser transferido (snapshot.totalBytes) e multiplicamos essa divisão por 100, sendo uma regra de três básica
        setProgress(progress); //Atualizando em tempo real a barra de progresso
      },
      function (error) {
        alert(error); //Essa função vai nos retornar um alert com um erro caso ocorra um durante o upload
      },
      function () {
        //Essa função rodará após o upload ser concluído
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL() //Pegamos esses dados desde a referencia a pasta images, nome do arquivo e url de downlod dele para inserirmos ele no banco de dados.
          .then(function (url) {
            //Aqui será retornada uma promise com a url de download
            db.collection("posts").add({
              //Nesse trecho chamamos o db da firestore que nos permite pegar, inserior ou atualizar posts, e nesse caso estamos inserindo uma coleção. Nesse caso, se existir a coleção posts esses dados serão adicionados nela, caso não exista, essa coleção será criada e os dados serão armazenados nessa coleção criada.
              title: postTitle,
              image: url,
              userName: props.user,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            alert("Upload realizado com sucesso.");

            /* No trecho abaixo resetamos a barra de progresso, a barra de arquivo e o formulário. */
            setProgress(0);
            setFile(null);
            document.getElementById("form-upload").reset();
            closeModalUpload();
          });
      }
    );
  }

  return (
    <div className="header">
      <div className="modalAccountCreate">
        <div className="formAccountCreate">
          <div onClick={() => closeModalCreate()} className="close_modalCreate">
            <strong>X</strong>
          </div>
          <h2>Cadastre-se para ver fotos e vídeos dos seus amigos.</h2>
          <form onSubmit={(e) => createAccount(e)}>
            <input id="signUpEmail" type="email" placeholder="Seu e-mail" />
            <input id="signUpUserName" type="text" placeholder="Seu usuário" />
            <input
              id="signUpPassword"
              type="password"
              placeholder="Sua senha"
            />
            <input type="submit" value="Cadastre-se" />
          </form>
        </div>
      </div>
      <div className="modalLogin">
        <div className="formLogin">
          <div onClick={() => closeModalLogin()} className="close_modalLogin">
            <strong>X</strong>
          </div>
          <h2>Faça Login para realizar postagens e comentários!</h2>
          <form onSubmit={(e) => logIn(e)}>
            <input id="login-email" type="text" placeholder="Login" />
            <input id="login-password" type="password" placeholder="Senha" />
            <input type="submit" name="acao" value="Entrar" />
          </form>
        </div>
      </div>
      <div className="modalUpload">
        <div className="formUpload">
          <div onClick={() => closeModalUpload()} className="close_modalUpload">
            <strong>X</strong>
          </div>
          <h2>Criar nova publicação</h2>
          <form id="form-upload" onSubmit={(e) => uploadPost(e)}>
            <progress id="progress-upload" value={progress}></progress>
            <input
              id="upload-title"
              type="text"
              placeholder="Escreva uma legenda..."
            />
            <input
              id="signUpPassword"
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              name="file"
            />
            <input type="submit" value="Enviar postagem" />
          </form>
        </div>
      </div>
      <div className="center">
        <div className="header_logo">
          <a href="#">
            <p>Appgram</p>
          </a>
        </div>
        {props.user ? (
          <div className="header_loggedInfo">
            <span>
              Olá, <strong>{props.user}</strong>!
            </span>
            <a onClick={(e) => openModalUpload(e)} href="#">
              +
            </a>
            <a onClick={(e) => logout(e)}>Sair</a>
          </div>
        ) : (
          <div className="header_loginForm">
            <div className="btn_login">
              <a onClick={(e) => openModalLogin(e)} href="#">
                Faça Login
              </a>
            </div>
            <div className="btn_accountCreate">
              <a onClick={(e) => openModalAccountCreate(e)} href="#">
                Cadastre-se
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
