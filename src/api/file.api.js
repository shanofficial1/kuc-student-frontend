import axios from "axios";

export const compressPdfApi = async (
  file,
  token
) => {
  try {
    

    const formData =
      new FormData();

    formData.append(
      "pdf",
      file
    );

    const response =
      await axios.post(
        `${import.meta.env.VITE_SERVER}/api/file/compress`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

    return response.data;

  } catch (error) {

    console.error(
      "Compression Error:",
      error
    );

    throw error;
  }
};