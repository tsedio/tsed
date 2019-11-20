export async function loadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  await fetch(`/rest/upload`, {
    method: "POST",
    headers: {
      // don't set Content-Type: multipart/form-data. It's set automatically by fetch (same things with axios)
    },
    body: formData
  });
}
