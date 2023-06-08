
import React from "react"

const RenderData = ({data}) => {
    if(typeof data === 'string'){
        if(data.startsWith('http')){
            return  <img height={'90%'} width={window.innerWidth < 768 ? '90%' : '50%'} style={{borderRadius:'10px'}} src={data} />
        } else {
            return <p style={{marginTop: data.length > 150 ? '50px' : '0px'}} className='text'>{data}</p>
        }
    } else {
        return <p className='text'>{data}</p>
    }
}

export default RenderData