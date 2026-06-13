import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.15, // 150 KB
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(
      file,
      options
    );

    return compressedFile;
  } catch (err) {
    console.error(err);
    return file;
  }
};

export const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";

  return `${(bytes / 1024).toFixed(2)} KB`;
};