

import React from "react"
import RenderData from "./RenderData"

const Box = (props) => {
    return (
        <div style={{width:'30%', height:'90%',margin:'auto'}}>
            <div style={{ backgroundColor:'lightblue', height:'100%', width:'80%',margin:'auto', display:'flex', alignItems:'center',borderRadius:'10px', justifyContent:'center', overflowY:'auto',}}>
                <RenderData data={props.item.data} />
            </div>
        </div>
    )
}

export default Box
