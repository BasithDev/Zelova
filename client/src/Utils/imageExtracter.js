// Helper function to extract cropped image as base64
export const getCroppedImg = (imageSrc, pixelCrop) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageSrc;
  
    return new Promise((resolve) => {
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
  
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        ctx.drawImage(
          img,
          pixelCrop.x * scaleX,
          pixelCrop.y * scaleY,
          pixelCrop.width * scaleX,
          pixelCrop.height * scaleY,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };
  