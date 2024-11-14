import { uploadToCloud } from "../Services/apiServices";
export const uploadImageToCloud = async (croppedImage) => {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();

    const response = await fetch(croppedImage);
    const blob = await response.blob();
    formData.append('file',blob, 'lic.jpg');
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await uploadToCloud( formData );
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
    }
  };