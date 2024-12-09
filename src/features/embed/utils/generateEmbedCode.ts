export function generateEmbedCode(params: {
  baseUrl: string;
  mode: 'display' | 'edit';
  height: string;
}) {
  const { baseUrl, mode, height } = params;
  
  return `<iframe
  src="${baseUrl}?mode=${mode}"
  width="100%"
  height="${height}px"
  frameborder="0"
  allow="camera"
></iframe>`;
}