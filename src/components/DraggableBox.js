
import React, {useState, useEffect} from "react";
import Draggable from "react-draggable";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";


const DraggableBox = (props) => {
    const boxHeight = props.boxHeight
    const updateXarrow = useXarrow();
    const [position, setPosition] = useState({ x: 10, y: 0 });

    const detectVal = (a) => {
        let p = Math.abs(a)
        for(let i = 0 ;i < props.data.length ; i++){
            if(p >= (boxHeight*i)-20 && p <= boxHeight*i + 20){
                return a < 0 ? -i : i
            }
        } 
        return 999           
    }

    const stopHandler = (event, ui) => {
        updateXarrow(event, ui)
        const filteredCheck = props.data.filter(f => f.ans === props.answers[props.index + detectVal(ui.y)]?.data)
        if((ui.x > window.innerWidth/3 - 60 && detectVal(ui.y) !== 999) && filteredCheck.length === 0){
            setPosition({x: window.innerWidth/3 - 40, y: detectVal(ui.y)*boxHeight})
            props.onDragItem(props.item, props.index + detectVal(ui.y))
        } else {
            if(props.data[props.index].ans){
                props.onDragItem(props.item, 999)
            }
            setPosition({x:10,y:0})
        }
      }

      useEffect(()=>{
        if(props.reset){
            setPosition({x:10,y:0})
        }
      },[props.reset])


      useEffect(()=>{
        if(props.showAnswers){
            setPosition(props.showXY)
        }
      },[props.showAnswers])

    return <Draggable
            disabled={props.submitted}
            position={position}
            onDrag={(event, ui) => {
            updateXarrow(event, ui)
            setPosition({ x: ui.x, y: ui.y });
            }}
            onStop={stopHandler}
            bounds={props.bounds}
        >
            <div id={props.id} style={{...props.styles}}></div>
  </Draggable>
}


export default DraggableBox