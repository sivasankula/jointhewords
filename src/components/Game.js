import React, { useState } from 'react'
import { useEffect } from 'react';

import Xarrow, { Xwrapper } from "react-xarrows";
import sound from "../assets/startPlay.mp3"
import beep from "../assets/beepPlay.mp3"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import DraggableBox from './DraggableBox';
import Box from './Box';


const Game = (props) => {
    const boxHeight = 100
    const [data, setData] = useState([])
    const [answers, setAnswers] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [hintsCount, setHintsCount] = useState(0)
    const [hintList, setHintList] = useState([])
    const [showAnsClicked, setShowAnsClicked] = useState(false)
    const [reset, setReset] = useState(false)
    const [resetOriginal, setResetOriginal] = useState(false)
    const [timer, setTimer] = useState(30); 
    const [intervalId, setIntervalId] = useState(null);

    useEffect(()=>{
        if(!reset){
            const dataVal = props.data.map((i)=>{
                return {
                    id:i.id,
                    data:i.original_ans
                }
            })
            setAnswers(dataVal.sort(()=> Math.random()-0.5))
            setData([...props.data].sort(() => Math.random() - 0.5))
            setReset(true)
            setSubmitted(false)
            setHintsCount(0)
            setShowAnsClicked(false)
            setHintList(dataVal.map(k=>{
                return {
                    ...k,
                    isShown:false
                }
            }))

            setTimer(30)
            if (intervalId) {
                clearInterval(intervalId);
              }
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                  if (prevTimer === -1) {
                    return 30;
                  }
                  return prevTimer - 1;
                });
              }, 1000);
              setIntervalId(interval);
          
              return () => {
                clearInterval(intervalId);
              };
        }

      
    },[props.currentQ])


    useEffect(()=>{
        if(timer === 0){
            clearInterval(intervalId);
            setReset(false)
            setResetOriginal(true)
            props.handleTimeOut(data, getScore())        
        }
    },[timer])

    useEffect(()=>{
        setHintList(prev => data.filter(f=>f.ans === null).map(k=>{
            return {
                ...k,
                isShown: prev.find(s=> s.id === k.id)?.isShown || false
            }
        }))
    },[data])

    const onDragItem = (item, ans) => {
        setResetOriginal(false)
        setData((prev)=> prev.map(i=>{
            if(i.id === item.id){
                return {
                    ...item,
                    ans: ans === 999 ? null : answers[ans].data,
                }
            } else{
                return {...i}
            }
        }))
        const audio = new Audio(sound);
        audio.play();
    }


    const submitHandler = ()=>{
        if(submitted){
            // next
            setReset(false)
            setResetOriginal(true)
            if(props.isLastQ){
                props.handleFinish()
            } else {
                props.handleNext()
            }
        } else {
            setSubmitted(true)
            clearInterval(intervalId)
            let score = data.filter(f=>f.ans === f.original_ans).length
            props.handleSubmit(data, showAnsClicked ? 0 : score - hintsCount > 0 ? score -hintsCount : 0)
            setResetOriginal(false)
        }
    }

    const hintHandler = ()=>{
        setHintsCount(prev=> prev+1)
        const audio = new Audio(beep);
        audio.play();
        const dataObj = hintList.find(f=>f.isShown === false)
        setHintList(prev=>prev.map(i=>{
            if(i.id === dataObj.id){
                return {
                    ...i,
                    isShown:true
                }
            } return i
        }))
        const RenderToast = ({item}) => {
        if(typeof item === 'string'){
            if(item.startsWith('http')){
                return  <div><img height={'70%'} width={'70%'} style={{borderRadius:'10px'}} src={item} /></div>
            } else {
                return <p className='text'>{item}</p>
            }
        } else {
            return <p className='text'>{item}</p>
        }
    }
        toast(<div style={{display:'flex',justifyContent:'space-around' }}>
            <RenderToast item={dataObj.data} />
            <RenderToast item={dataObj.original_ans} />
        </div>,{ autoClose: 4000,
          closeButton: true,})
    }

    const showAnsHandler = ()=>{
        setResetOriginal(false)
        // setSubmitted(true)
        setShowAnsClicked(true)
        setData(prev => prev.map(i => {
            return {
                ...i,
                ans:i.original_ans
            }
        }))
        setSubmitted(true)
    }
  
    const handleNextSpecial = () => {
        clearInterval(intervalId)
        setReset(false)
        setResetOriginal(true)
        props.handleNextSpecial(data,getScore())
    }

    const getBorderColor = (item , index) => {
        return props.isSpecial ? item.ans === null ? `rgba(0, 0, 255, ${1 - index / data.length})` : item.ans === item.original_ans ? `rgba(0, 255, 0, ${1 - index / data.length})` : `rgba(255, 0, 0, ${1 - index / data.length})` : (submitted ? (item.ans === item.original_ans ? `rgba(0, 255, 0, ${1 - index / data.length})` : `rgba(255, 0, 0, ${1 - index / data.length})`) : `rgba(0, 0, 255, ${1 - index / data.length})`)
        // return   (item.ans === null ? `rgba(0, 0, 255, ${1 - index / data.length})` : item.ans === item.original_ans ? `rgba(0, 255, 0, ${1 - index / data.length})` : `rgba(255, 0, 0, ${1 - index / data.length})`)
    }

    const getScore = () => {
        let score = data.filter(f=>f.ans === f.original_ans).length
        return showAnsClicked ? 0 : props.isSpecial ? score - hintsCount < 0 ? 0 : score - hintsCount :  (submitted ? score - hintsCount < 0 ? 0 : score - hintsCount : 0)
    }
    
    const handleSubmitFinishNext = () => {
        if(props.isSpecial){
            clearInterval(intervalId)
            handleNextSpecial()
        } else {
            submitHandler()
        }
    }

    const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return (
    <div className='full__container' >
        <div className='buttons__container'>
            <div className='btn__div'>
                {
                    <button disabled={data.filter(f=>f.ans !== null).length !== 4} onClick={handleSubmitFinishNext}>{props.isSpecial ? ( props.isLastQ ? "Finish" : 'Next'): (!submitted ? 'Submit' : props.isLastQ ? 'Finish' : 'Next' )}</button>
                }
            </div>
            <div className='btn__div'><button disabled={hintsCount === 4 || data.filter(f=>f.ans !== null).length === 4 || hintList.filter(k=>k.isShown === false).length === 0 } onClick={hintHandler}>Hint</button></div>
             <div><button  disabled={ data.filter(f=>f.ans !== null).length === 4} onClick={showAnsHandler}>Show Ans</button></div>
        </div>
        <div className='score__container'>
            <div>Time :- {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
            <div>Score: {getScore()} </div>
            <div>Hints Left: {data.length - hintsCount}</div>
        </div>
        <ToastContainer />
        <div style={{ }}>
            <div className='questions__box'>
                <div style={{height:'10px'}}></div>
                {data.map((item, index)=><div key={index} className='row' style={{ height: `${boxHeight}px`}}>
                    <Box item={data[index]} />
                    <div className='arrows' style={{width: window.innerWidth/3}}>
                        <div className='arrow__item__container'>
                            <div className='arrow__item'>
                                <Xwrapper>
                                    <div id={`question${item.id}`} 
                                    className='round__ans_q' style={{backgroundColor: getBorderColor(item, index),}}></div>
                                    <DraggableBox id={`answer${item.id}`} 
                                     styles={{width:'20px', height:'20px', borderRadius:'20px',
                                        cursor:'grab', 
                                        backgroundColor: getBorderColor(item, index),
                                    }}
                                     bounds={{left:0, right:window.innerWidth/3-40,top: -index * boxHeight, bottom: (data.length - (index + 1)) * boxHeight,}}
                                     index={index}
                                     showXY={{y: ((answers.findIndex(k => k.data === item.original_ans) - index ) * 100 ), x:  window.innerWidth/3 - 40  }}
                                     reset={resetOriginal}
                                     item={item}
                                     submitted={props.isSpecial ? item.ans !== null : submitted}
                                     boxHeight={boxHeight}
                                     data={data}
                                     answers={answers}
                                     showAnswers={showAnsClicked}
                                     onDragItem = {onDragItem}
                                     />
                                    <Xarrow
                                    // color={(submitted || props.isSpecial)? item.ans === item.original_ans ? `rgba(0, 255, 0, ${1 - index / data.length})` : `rgba(255, 0, 0, ${1 - index / data.length})` : item.ans === null ? index % 2 == 0 ? "lightGray" : "lightBlue" :  `rgba(0, 0, 255, ${1 - index / data.length})` }
                                    showHead={false}
                                    color={getBorderColor(item, index)}
                                    start={`question${item.id}`}
                                    end={`answer${item.id}`}
                                    />
                                </Xwrapper>
                            </div>
                        <div className='round__ans'></div>
                        </div>
                    </div>
                    <Box item={answers[index]} />
                </div>)}
                <div style={{height:'10px'}}></div>
            </div>
        </div>
    </div>
  )
}

export default Game