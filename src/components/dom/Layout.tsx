import { useRef, forwardRef, useImperativeHandle, PropsWithChildren } from 'react'

const Layout = forwardRef<unknown, PropsWithChildren<{}>>(({ children, ...props }, ref) => {
  const localRef = useRef()

  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div
        {...props}
        ref={localRef}
        className='absolute top-0 left-0 z-10 w-screen h-screen overflow-hidden dom'>
        {children}
      </div>
    </>
  )
})
Layout.displayName = 'Layout'

export default Layout
