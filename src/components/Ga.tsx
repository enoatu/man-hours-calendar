import React from 'react'

export const Ga = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const gaURL = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  const dangerouslyHTML = {
    __html: `
    window.dataLayer = window.dataLayer || []
    function gtag(){dataLayer.push(arguments)}
    gtag('js', new Date())
    gtag('config', '${gaId}', {
      page_path: window.location.pathname,
    })`,
  }
  return (
    <>
      {gaId && (
        <>
          <script async src={gaURL} />
          <script dangerouslySetInnerHTML={dangerouslyHTML} />
        </>
      )}
    </>
  )
}
