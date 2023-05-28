function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default function downloadFile({ content, name, typeContent, mime }) {
  let file;

  if (typeContent === "base64") {
    file = dataURLtoFile(`data:text/plain;base64,${content}`, name);
  } else if (typeContent === "binary") {
    file = new File(content, name, { type: mime });
  } else {
    file = new Blob(content);
  }

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(file);
  link.style.display = "none";

  // decodeURI(name)

  link.setAttribute("download", decodeURIComponent(name.replace(/\+/g, "%20")));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
