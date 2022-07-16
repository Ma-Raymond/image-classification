
import * as mobilenet from "@tensorflow-models/mobilenet"; 
import react from 'react'
import {useState, useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import Typerwriter from 'typewriter-effect'

import './App.scss';

function App() {

  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [results, setResults] = useState([])

  const imageRef = useRef()
  const loadModel = async () => {
    setIsModelLoading(true)
    try {
      const mode = await mobilenet.load()
      setModel(mode)
      setIsModelLoading(false)

    } catch (error) {
      console.log(error)
      setIsModelLoading(false)
    }
  }

  const uploadImage = (e) => {
    const {files} = e.target
    if (files.length > 0){
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
  }
  const indentify = async () => {
      const results = await model.classify(imageRef.current)
      setResults(results)
  }

  useEffect(() => {
    loadModel()
  }, [])
  
  if (isModelLoading){
    return <h2>Loading Learning Model...</h2>
  }

  console.log(results)

  return (
    <div className="App">
      <h1 className="Header">
        <Typerwriter
          options={{
              strings:["Image Idenification Application","I hope you like it! <3"],
              autoStart: true,
              loop: true,
          }} 
      /></h1>
      <h2 className="Header__text"><p>Please input an&nbsp;<span>image</span>&nbsp;for&nbsp;<span>classification!</span></p></h2>
      <h4 className="Header__text1">This application was created by&nbsp;<a href="https://ma-raymond.github.io/portfolio/"  target='_blank' rel='noreferrer'>Raymond Ma</a></h4>
      <motion.div className="inputHolder"
      animate={{rotate:[1,-1,1]}}
      transition={{ease:"linear",duration:2,repeat:Infinity}}
      >
        <motion.div
        whileHover={{scale:1.1}}>
        <input type='file' accept='image/*' capture='camera' className='uploadInput'
      onChange={uploadImage}
      />
      </motion.div>
      </motion.div>
      <div className="mainWrapper">
        <div className="mainContent">
          <motion.div className="imageHolder"
          whileInView={{scale:[0.9,1], rotate:[2,-2,0]}}
          
          >
              {imageURL && <img src={imageURL} alt='Upload Preview' crossOrigin="anonymous" ref={imageRef}/>}
          </motion.div>
        </div>
        {results.length > 0 && <div className='resultsHolder'>
            {results.map((result, index) => {
                return (
                    <motion.div className='result' 
                    whileInView={{x:[100,0], opacity:[0,1]}}
                    transition={{duration: 1}}
                    key={result.className}>
                        <span className='name'>{result.className}</span>
                        <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Highest Confidence</span>}</span>
                    </motion.div>
                )
            })}
        </div>}
      </div>
      <div className="buttonHolder">
        <motion.div
        whileHover={{scale: 1.1}}>
        {imageURL && <button className="button" onClick={indentify}>Indentify Image</button>}

        </motion.div>
        </div>
    </div>
  );
}

export default App;
