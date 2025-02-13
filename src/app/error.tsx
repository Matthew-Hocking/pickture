'use client'

import React from 'react'

const Error = ({ error }: { error: Error & { digest?: string}}) => {
  return (
    <div>Error</div>
  )
}

export default Error