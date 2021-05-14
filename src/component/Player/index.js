import React, { useRef, useEffect } from 'react'
import { initPlayer } from '../../util/videoPlayer'
import { manifestUri } from '../../constants'
import s from './index.css'

function Player() {
  const video = useRef(null)

  useEffect(() => { initPlayer(manifestUri, video) }, [])

  return (
    <div className={s.container}>
        <video
          ref={video}
          className={s.myVideo}
          preload="metadata"
          autoPlay
          controls
          loop
        />
    </div>
  )
}

export default Player

