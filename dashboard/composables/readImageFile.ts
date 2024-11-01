export const readImageFile = (
  file: File,
  width: number,
  height: number
): Promise<{ base64?: string; error?: string }> => {
  return new Promise((resolve, _) => {
    if (!file) return resolve({ error: "File is required" });
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff", "avif"]; // Add more image extensions if needed
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return resolve({ error: "Invalid file type. Only image files are allowed" });
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        const base64 = reader.result.toString();
        var image = new Image();
        image.src = base64;
        image.onload = () => {
          // Use the width and height as needed
          if (image.width !== width || image.height !== height) {
            resolve({ error: `Require size: ${width} x ${height}` });
            return;
          }
          resolve({ base64 });
        };
      }
    };
    reader.onerror = (error) => {
      console.error(error);
      resolve({ error: "Unable to read the file" });
    };
  });
};
