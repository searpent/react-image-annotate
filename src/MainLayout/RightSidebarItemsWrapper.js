import React, { useEffect, useRef } from 'react';

function RightSidebarItemsWrapper({ children }) {
  const elementRef = useRef();

  useEffect(() => {
    if (elementRef) {
      const divElement = elementRef.current;
      const parentEl = divElement.parentElement;
      parentEl.style.overflowY = "scroll";
    }
  }, [])

  return (
    <div ref={elementRef} id="right-sidebar">
      {children}
    </div>
  );
}

export default RightSidebarItemsWrapper;