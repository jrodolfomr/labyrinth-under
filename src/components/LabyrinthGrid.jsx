import { useEffect, useState } from 'react'
import { quotes } from '../data/quotes'
import placeholder from '../assets/white2.png'

const useProgressiveImage = src => {
  const [sourceLoaded, setSourceLoaded] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const img = new window.Image()
    img.src = src
    setIsLoading(true)
    img.onload = () => {
      setSourceLoaded(src)
      setIsLoading(false)
    }
  }, [src])

  return [sourceLoaded, isLoading, setSourceLoaded]
}

export function LabyrinthGrid ({ children }) {
  const [background, setBackground] = useState('click on me to receive a quote :3')
  const [size, setSize] = useState(30)

  // Dynamic Width (Build Regex)

  const filteredQuotes = quotes.filter((quotes, index) => {
    return (quotes.quote.length + quotes.author.length + 5) <= 91
  })
  // console.log('change in render')

  function doEncodeURI (value) {
    const stringURI = encodeURIComponent(value)
    const stringUIRAdd = stringURI.replace(/'/g, '%27')

    return stringUIRAdd
  }

  const handleBackground = () => {
    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length - 1)]

    const hi = `"${quote.quote}" -${quote.author}`

    const area = 400 * 25
    const zoom = 1
    const contentLength = hi.length
    if (contentLength > 95) {
      setSize(20)
      setBackground('you can do it')
      return
    }
    //  console.log(contentLength)
    setSize(Math.ceil(Math.sqrt(area / contentLength) / zoom))

    setBackground(hi)
  }

  const [loaded, isLoading, setSourceLoaded] = useProgressiveImage(`https://cataas.com/cat/says/${doEncodeURI(background)}?width=400&height=400&fontColor=white&fontSize=${size}`)

  const handleOnClick = () => {
    if (!isLoading) {
      console.log('ACTUALLY RENDER IMAGE ' + new Date().toLocaleString())
      handleBackground()
      setSourceLoaded(null)
    }
  }

  const css = {
    backgroundImage: `url(${loaded || placeholder})`

  }

  return (

    <div className={`labyrinth-grid ${isLoading ? 'isLoading' : ''}`} style={css} onClick={() => handleOnClick()}>
      {children}
    </div>

  )
}
