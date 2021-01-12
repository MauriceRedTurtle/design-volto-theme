import React, { useEffect, useRef } from 'react';

function DangerouslySetHtmlContent(props) {
  const { html, ...rest } = props;
  const divRef = useRef(null);

  //il problema è questo: Failed to execute 'write' on 'Document': It isn't possible to write into a document from an asynchronously-loaded external script unless it is explicitly opened.

  useEffect(() => {
    if (!html) return;

    const slotHtml = document.createRange().createContextualFragment(html); // Create a 'tiny' document and parse the html string
    divRef.current.innerHTML = ''; // Clear the container
    divRef.current.appendChild(slotHtml); // Append the new content
  }, [html]);

  return <div {...rest} ref={divRef}></div>;
}

export default DangerouslySetHtmlContent;
