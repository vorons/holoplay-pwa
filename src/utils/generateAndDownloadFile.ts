export const generateAndDownloadFile = (data: unknown) => {
  const content = JSON.stringify(data);
  const $link = document.createElement("a");

  $link.setAttribute(
    "href",
    `data:text/plain;charset=utf-8, ${encodeURIComponent(content)}`
  );
  $link.setAttribute(
    "download",
    `holoplay-export-${new Date().toISOString()}.json`
  );
  $link.style.display = "none";
  document.body.appendChild($link);
  $link.click();
  document.body.removeChild($link);
};
