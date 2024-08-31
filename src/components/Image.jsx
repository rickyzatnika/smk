"use client"

import { IKImage } from "imagekitio-next"

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const Image = (props) => {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      {...props}
    />
  )
}

export default Image