
import * as mobilenet from "@tensorflow-models/mobilenet"; 
import react from 'react'
import {useState, useEffect, useRef} from 'react';
import {motion} from 'framer-motion';


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
      <h1 className="Header">Image Idenification Application</h1>
      <h2 className="Header__text">Please input an image for classification!</h2>
      <h4 className="Header__text1">This application was created by&nbsp;<a href="https://ma-raymond.github.io/portfolio/"  target='_blank' rel='noreferrer'>Raymond Ma</a></h4>
      <div className="inputHolder"><input type='file' accept='image/*' capture='camera' className='uploadInput'
      onChange={uploadImage}
      />
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
              {imageURL && <img src={imageURL} alt='Upload Preview' crossOrigin="anonymous" ref={imageRef}/>}
          </div>
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
