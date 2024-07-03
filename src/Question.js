import Options from "./Components/Options"

function Question({question, dispatch, answer}) {
    return (
        <div className=""> 
            <h4>{question.question}</h4>
            <Options question={question} dispatch={dispatch} answer={answer}/>
        </div>
    )
}

export default Question
