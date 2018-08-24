import { answers, authRef, provider } from "../config/firebase";
import actionTypes from "../action-types";

export const answerQuestion = question => async dispatch => {
  answers.push({ answer: question.answer });
};

export const fetchAnswers = () => async dispatch => {
  answers.on("value", snapshot => {
    dispatch({
      type: actionTypes.GOT_ANSWERS,
      payload: snapshot.val() || []
    });
  });
};

export const deleteAnswers = () => async dispatch => {
  answers.on("value", snapshot => {
    const vals = snapshot.val();
    for (var i = 0; i < vals.length; i++) {
      const answer = answers.child(id);
      const key = answer.key;
      answer.remove(key);
    }

    dispatch({
      type: actionTypes.GOT_ANSWERS,
      payload: snapshot.val() || []
    });
  });
};

export const askQuestion = question => async dispatch => {
  questions.push({ question: question.questions });
};

export const fetchQuestions = () => async dispatch => {
  questions.on("value", snapshot => {
    dispatch({
      type: actionTypes.GOT_QUESTIONS,
      payload: snapshot.val() || []
    });
  });
};

// export const deleteQuestions = () => async dispatch => {
//   answers.on("value", snapshot => {
//     const vals = snapshot.val();
//     for (var i = 0; i < vals.length; i++) {
//       const answer = answers.child(id);
//       const key = answer.key;
//       answer.remove(key);
//     }

//     dispatch({
//       type: actionTypes.GOT_ANSWERS,
//       payload: snapshot.val()
//     });
//   });
// };
// export const completeToDo = (completeToDoId, uid) => async dispatch => {
//   todosRef
//     .child(uid)
//     .child(completeToDoId)
//     .remove();
// };

// export const fetchToDos = uid => async dispatch => {
//   todosRef.child(uid).on("value", snapshot => {
//     dispatch({
//       type: FETCH_TODOS,
//       payload: snapshot.val()
//     });
//   });
// };

// export const fetchUser = () => dispatch => {
//   authRef.onAuthStateChanged(user => {
//     if (user) {
//       dispatch({
//         type: FETCH_USER,
//         payload: user
//       });
//     } else {
//       dispatch({
//         type: FETCH_USER,
//         payload: null
//       });
//     }
//   });
// };

export const signIn = () => dispatch => {
  authRef
    .signInWithPopup(provider)
    .then(result => {})
    .catch(error => {
      console.log(error);
    });
};

export const signOut = () => dispatch => {
  authRef
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch(error => {
      console.log(error);
    });
};
