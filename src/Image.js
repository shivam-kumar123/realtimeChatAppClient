import React, { useState, useEffect } from 'react'

const Image = (props) => {

    const [ImageSrc, setImageSrc] = useState("")
    console.log("Image props:",props);
    // useEffect(() =>{
    //     const reader = new FileReader()
    //     reader.readAsDataURL(props.blob)
    //     reader.onloadend = () =>{
    //         setImageSrc(reader.result)
    //     }
    // }, [props.blob])
    useEffect(() => {
      const imageUrl = URL.createObjectURL(props.blob)
      setImageSrc(imageUrl)
      return () => URL.revokeObjectURL(imageUrl)
    }, [props.blob])

  return (
    <div>
        <img style={{width: 150, height: "auto"}} src={ImageSrc} alt={props.fileName}></img>
    </div>
  )
}

export default Image