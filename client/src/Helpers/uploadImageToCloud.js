import { uploadToCloud } from "../Services/apiServices";

export const uploadImageToCloud = async (croppedImage) => {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();

    // Check if the croppedImage is already a Blob or File
    if (croppedImage instanceof Blob || croppedImage instanceof File) {
        formData.append('file', croppedImage, 'image.jpg');
    } else {
        // Fetch the image and convert it to a Blob
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        formData.append('file', blob, 'image.jpg');
    }

    // Append the Cloudinary upload preset to the form data
    formData.append('upload_preset', uploadPreset);

    try {
        // Upload the image using the `uploadToCloud` service
        const response = await uploadToCloud(formData);
        return response.data; // Return the response data after a successful upload
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
    }
};