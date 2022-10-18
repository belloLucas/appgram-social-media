import { db } from "./firebase.js";
import { useEffect, useState } from "react";
import firebase from "firebase/app";

function Post(props) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .doc(props.id)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .onSnapshot(function (snapshot) {
        setComments(
          snapshot.docs.map(function (document) {
            return { id: document.id, info: document.data() };
          })
        );
      });
  }, []);

  function comment(id, e) {
    e.preventDefault();

    let actualComment = document.getElementById("comment-" + id).value;

    db.collection("posts").doc(id).collection("comments").add({
      name: props.user,
      comment: actualComment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("Comentário enviado com sucesso! Id: " + id);

    document.getElementById("comment-" + id).value = "";
  }

  return [
    <div className="postSingle">
      <img src={props.info.image} />
      <p>
        <strong>{props.info.userName}:</strong>
        {props.info.title}
      </p>

      <div className="comments">
        <h3>Comentários</h3>
        {comments.map(function (val) {
          return (
            <div className="comment-single">
              <p>
                <b>{val.info.name}</b>: {val.info.comment}
              </p>
            </div>
          );
        })}
      </div>

      {props.user ? (
        <form onSubmit={(e) => comment(props.id, e)}>
          <textarea id={"comment-" + props.id} placeholder="Comente"></textarea>
          <input type="submit" value="Enviar comentário" />
        </form>
      ) : (
        <div></div>
      )}
    </div>,
  ];
}

export default Post;
