import React , { useState, useEffect} from 'react'
import Sample from './Game'
import "./GamePlay.scss"


const dataRen = [
 
  {
    q:[
      {
        original_ans:'https://i.etsystatic.com/11409782/r/il/c29ce5/4270203230/il_fullxfull.4270203230_ghiy.jpg', id:1,ans:null,data:'https://gmcricket.in/media/catalog/product/cache/757ea7d2b7282843694bdb6de7a23598/d/i/diamond-808-english-willow-cricket-bat_1.jpg',
      },
      {
        original_ans:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80', id:2,ans:null,data:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1CXpR6t5l4e3ELAJAEdDmWiOOQUNDav8QNQ&usqp=CAU',
      },
      {
      original_ans:'https://sportsmatik.com/uploads/matik-sports-corner/equipage/field-hockey-ball_1594279829.jpg',  id:3,ans:null,data:'https://img2.exportersindia.com/product_images/bc-full/2019/8/944415/hockey-stick-1564640815-5025693.jpeg',
      },
      {
      original_ans:'https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png', id:4,ans:null,data:'https://m.media-amazon.com/images/I/51BpDsSVd3L._SX425_.jpg',
      },
    ],
    score:0
  },
  {
    q:[
      {
        data:'Cricket bat', id:1,ans:null,original_ans:'https://gmcricket.in/media/catalog/product/cache/757ea7d2b7282843694bdb6de7a23598/d/i/diamond-808-english-willow-cricket-bat_1.jpg',
      },
      {
        data:'Foot ball', id:2,ans:null,original_ans:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1CXpR6t5l4e3ELAJAEdDmWiOOQUNDav8QNQ&usqp=CAU',
      },
      {
      data:'Hokey game',  id:3,ans:null,original_ans:'https://img2.exportersindia.com/product_images/bc-full/2019/8/944415/hockey-stick-1564640815-5025693.jpeg',
      },
      {
      data:'Wollyball', id:4,ans:null,original_ans:'https://m.media-amazon.com/images/I/51BpDsSVd3L._SX425_.jpg',
      },
    ],
    score:0
  },
  {
    q:[
      {
        data:'Bicycle ygevob ikb erb rjbi hibwhbhic jbudwcrbn iuowbibubn ouejibr kljnevjn ljnvj ofeoneon uonevober ohnwerjnboner onvjnje uohnoenjonerojnoenjonnbr ounojer ouhwnrcfb ouhne obibi', id:1,ans:null,original_ans:'Two Wheeler',
      },
      {
        data:'Car', id:2,ans:null,original_ans:'Four Wheeler',
      },
      {
      data:'Auto Riksha',  id:3,ans:null,original_ans:'Three Wheeler',
      },
      {
      data:'Container', id:4,ans:null,original_ans:'Multi Whejowneler',
      },
    ],
    score:0
  },
    {
      q:[
        {
          data:'Idea',  id:1,ans:null,original_ans:'Thought',
        },
        {
          data:'Happy', id:2,ans:null,original_ans:'Satisfied',
        },
        {
        data:'Destroy',  id:3,ans:null,original_ans:'Ruin',
        },
        {
        data:'Beautiful', id:4,ans:null,original_ans:'Gorgeous',
        },
      ],
      score:0
    },
   
  ]
    
const GamePlay = () => {
    const [data, setData] = useState(dataRen)
    const [currentQ, setCurrentQ] = useState(0)
    const [gameType, setGameType] = useState('')
    const [finalSubmitted, setFinalSubmitted] = useState(false)
  
  
    const handleSubmit = (data, score) => {
      setData(prev=> prev.map((item, index) => {
        if(currentQ === index){
          return {
            ...item,
            q:data,
            score:score
          }
        } else{
          return item
        }
      }))
    }
  
    // useEffect(()=>{
    //   setGameType('optionsPlay')
    // },[])

    const handleNext = () => {
      setCurrentQ(prev=>prev+1)
    }
    const handleNextSpecial = (d, s) => {
      setData(prev=>prev.map((item, index) => {
        if(currentQ === index){
          return {
            ...item,
            q:d,
            score:s
          }
        } else{
          return item
        }
      }))
      if(data.length === currentQ+1){
        setFinalSubmitted(true)
      } else{
        setCurrentQ(prev=>prev+1)
      }
    }

    const handleTimeOut = (d, s) => {
      if(d.length){
       handleNextSpecial(d,s)
      } else{
        if(data.length === currentQ+1){
          setFinalSubmitted(true)
        } else{
          setCurrentQ(prev=>prev+1)
        }
      }
    }

    const getScore = (objs) => {
      return objs.map((item)=> item.score).reduce((acc, crr,) => acc+crr)
    }

    const handleFinish = () => {
      setFinalSubmitted(true)
    }

  return (
    <div>
        <div style={{display:'flex', justifyContent:'space-around'}}>
          <div>
            <select  value={gameType} onChange={(e)=>{
                    setGameType(e.target.value)
                  }} style={{height:'30px', width:'100px'}}>
                <option value={''}>chooseType</option>
                <option value={'optionsPlay'}>Options Play</option>
                <option value={'generalPlay'}>General Play</option>
            </select>
          </div>
          <div>Final Score : {getScore(data)}</div>
        </div>
        {
          finalSubmitted ? <>
            <h2>Thank you!!</h2>
          </> : <>
             <>
              {
                gameType === '' ? <>
                  <h3>please Select type to play</h3>
                </> : <>
                {
                  gameType === 'optionsPlay' ? <> 
                    <Sample data={data[currentQ].q} handleTimeOut={handleTimeOut}
                     currentQ={currentQ} isSpecial={true} handleSubmit={handleSubmit} handleNext={handleNext} isLastQ={data.length-1 === currentQ}  handleNextSpecial={handleNextSpecial} handleFinish={handleFinish} />
                  </> : <>
                    <Sample data={data[currentQ].q} handleTimeOut={handleTimeOut} currentQ={currentQ} isSpecial={false} handleSubmit={handleSubmit} handleNext={handleNext} isLastQ={data.length-1 === currentQ} handleFinish={handleFinish} />
                  </>
                }
                </>
              }
            </> 
          </>
        }
            
     </div>
  )
}

export default GamePlay