import { useEffect, useRef, useState } from 'react';

function useGlobalFileDragDetection() {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounter = useRef(0);
  const dragTimeout = useRef(null);

  useEffect(() => {
    const isFileDrag = (e) => e.dataTransfer?.types?.includes?.('Files');

    const onDragEnter = (e) => {
      if (!isFileDrag(e)) return;
      dragCounter.current++;
      setIsDraggingFile(true);
    };

    const onDragLeave = (e) => {
      if (!isFileDrag(e)) return;
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        setIsDraggingFile(false);
      }
    };

    const onDrop = () => {
      dragCounter.current = 0;
      setIsDraggingFile(false);
    };

    const onDragOver = (e) => {
      if (!isFileDrag(e)) return;
      // Prevent flicker when browser shows "not allowed" cursor
      e.preventDefault();

      clearTimeout(dragTimeout.current);
      dragTimeout.current = setTimeout(() => {
        dragCounter.current = 0;
        setIsDraggingFile(false);
      }, 150); // fallback in case dragleave doesn't fire
    };

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
    window.addEventListener('dragover', onDragOver);

    return () => {
      clearTimeout(dragTimeout.current);
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('dragover', onDragOver);
    };
  }, []);

  return isDraggingFile;
}

export default useGlobalFileDragDetection;

// import { useEffect, useState } from 'react';

// function useGlobalDragDetection() {
//   const [isDraggingFile, setIsDraggingFile] = useState(false);

//   useEffect(() => {
//     const onDragEnter = (e) => {
//       if (e.dataTransfer.types.includes('Files')) {
//         setIsDraggingFile(true);
//       }
//     };
//     const onDragLeave = (e) => {
//       // Use a timeout to avoid flickering
//       setTimeout(() => setIsDraggingFile(false), 1000);
//     };
//     const onDrop = () => {
//       setIsDraggingFile(false);
//     };

//     window.addEventListener('dragenter', onDragEnter);
//     window.addEventListener('dragleave', onDragLeave);
//     window.addEventListener('drop', onDrop);

//     return () => {
//       window.removeEventListener('dragenter', onDragEnter);
//       window.removeEventListener('dragleave', onDragLeave);
//       window.removeEventListener('drop', onDrop);
//     };
//   }, []);

//   return isDraggingFile;
// }

// export default useGlobalDragDetection;
