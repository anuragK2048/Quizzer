import { useEffect, useReducer, memo } from "react"

function Timer({totalTime, dispatch}) {
    const totalTime1 = {m:Number(totalTime.m),s:Number(totalTime.s)}
    function reducer1(state,action) {
        if(action === "second") return {m:state.m,s:state.s-1}
        if(action === "secondMinute") return {m:state.m-1,s:59}
        return {...state,m:"timer error"}
    }
    
    const [{m,s},dispatch1] = useReducer(reducer1,totalTime1);
    useEffect(function(){
        const timeoutID = setTimeout(function(){
            if(s===0 && m===0) {
                dispatch({type:"finished"})
                return
            };
            if(s > 0) dispatch1("second")
            if(s === 0) dispatch1("secondMinute")
        },1000)
        return ()=>clearTimeout(timeoutID);
    },[totalTime1])
    return (
        <div className="timer">
            {`${m<10?"0":""}${m}:${s<10?"0":""}${s}`}
        </div>
    )
}

export default memo(Timer);
