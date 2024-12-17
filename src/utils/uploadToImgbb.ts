import axios from "axios";

const uploadToImgbb = async (image: File) => {
  const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; // API key dari imgbb

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Mendapatkan URL gambar dari response
    let imageUrl = response.data.data.url;

    // Jika URL mengandung 'co.com', ganti dengan domain yang benar 'i.ibb.co.com'
    if (imageUrl.includes("i.ibbco.co")) {
      imageUrl = imageUrl.replace("i.ibbco.co", "i.ibb.co.com");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadToImgbb;
