import { useRef } from "react";

function Progress({index, questions, score, answer}) {
    const totalScore = questions.reduce((acc,cur)=>acc+cur.points,0);
    return (
        <header className="progress">
            <progress max={questions.length} value={answer!==null?index+1:index}></progress>
            <p>Question <strong>{index+1}</strong>/{questions.length}</p>
            <p><strong>{score}</strong>/{totalScore}</p>
        </header>
    )
}

export default Progress
