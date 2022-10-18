import "./App.css";
import { db, auth } from "./firebase.js";
import { useEffect, useState } from "react";
import Header from "./Header.js";
import Post from "./Post.js";

function App() {
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(function (val) {
      if (val != null) {
        setUser(val.displayName);
      }
    });

    /* Trecho abaixo irá atualizar nossa collection posts sempre que um posto for adicionado, editado, ou removido */
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(function (snapshot) {
        setPosts(
          snapshot.docs.map(function (document) {
            return { id: document.id, info: document.data() };
          })
        );
      });
  }, []);

  return (
    <div className="App">
      <Header user={user} setUser={setUser}></Header>
      {posts.map(function (val) {
        return [<Post user={user} info={val.info} id={val.id}></Post>];
      })}
    </div>
  );
}

export default App;
