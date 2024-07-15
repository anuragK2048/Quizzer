import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import { useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./Components/NextButton";
import Timer from "./Components/Timer";
import Footer from "./Components/Footer";
import Progress from "./Components/Progress";
import FinishScreen from "./Components/FinishScreen";

const totalTime = { m: "10", s: "00" };
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
  highscore: 0,
};
const jsonServer = "https://everlasting-beaded-rotate.glitch.me";
export default function App() {
  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return {
          ...state,
          status: "ready",
          questions: action.payload,
        };
      case "error":
        return {
          ...state,
          status: "error",
        };
      case "start":
        return {
          ...state,
          status: "active",
        };
      case "newAnswer":
        const question = state.questions.at(state.index);
        return {
          ...state,
          answer: action.payload,
          score:
            action.payload === question.correctOption
              ? state.score + question.points
              : state.score,
        };
      case "nextQuestion":
        return { ...state, index: state.index + 1, answer: null };
      case "finished":
        return {
          ...state,
          status: "finished",
          highscore:
            state.score > state.highscore ? state.score : state.highscore,
        };
      case "restart":
        return {
          ...initialState,
          questions: state.questions,
          status: "ready",
          highscore: state.highscore,
        };

      default:
        throw new Error("Action unkonwn");
    }
  }
  const [{ questions, status, index, answer, score, highscore }, dispatch] =
    useReducer(reducer, initialState);
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(function () {
    fetch(`${jsonServer}/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "error", payload: `${err}` }));
  }, []);
  return (
    <div className="app">
      <Header></Header>
      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen questions={questions} dispatch={dispatch} />
        )}
        {status === "error" && <Error />}
        {status === "active" && (
          <>
            <Progress
              questions={questions}
              index={index}
              score={score}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                questions={questions}
              />
              <Timer totalTime={totalTime} dispatch={dispatch} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={score}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
