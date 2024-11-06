import { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactCrop from 'react-easy-crop';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';  // Import the custom PrimaryBtn component
import { getCroppedImg } from '../../Utils/imageExtracter'; // Helper function for cropping


const RequestVendorPage = () => {
  const [image, setImage] = useState(null);  // Original image
  const [croppedImage, setCroppedImage] = useState(null);  // Cropped image
  const [croppedArea, setCroppedArea] = useState(null);  // Crop area
  const [loading, setLoading] = useState(false);  // Loading state
  const [imagePreview, setImagePreview] = useState(null);  // Image preview state

  // Formik validation schema
  const validationSchema = Yup.object({
    restaurantName: Yup.string().required('Restaurant name is required'),
    address: Yup.string().required('Address is required'),
    description: Yup.string().required('Description is required'),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      restaurantName: '',
      address: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (!croppedImage) {
        toast.error('Please crop the image.');
        return;
      }

      setLoading(true);
      // Handle the submission here, like sending it to an API
      setTimeout(() => {
        toast.success('Vendor request submitted successfully!');
        setLoading(false);
      }, 2000);
    },
  });

  // Handle file input and image preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) { // Image size should be less than 2MB
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  // Set the image for cropping
        setImagePreview(URL.createObjectURL(file)); // Set preview image
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('File size should be less than 2MB and must be an image.');
    }
  };

  // Crop change handler
  const onCropChange = useCallback((newCrop) => {
    setCroppedArea(newCrop);
  }, []);

  // When cropping is done, get the image
  const onCropComplete = useCallback(async (_, croppedAreaPixels) => {
    const croppedImg = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(croppedImg);
  }, [image]);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Become a Vendor</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Restaurant Name */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            onChange={formik.handleChange}
            value={formik.values.restaurantName}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg"
          />
          {formik.errors.restaurantName && formik.touched.restaurantName && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.restaurantName}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            onChange={formik.handleChange}
            value={formik.values.address}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg"
          />
          {formik.errors.address && formik.touched.address && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg"
            rows="4"
          />
          {formik.errors.description && formik.touched.description && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
          )}
        </div>

        {/* License Image Upload */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Upload License</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-700 file:bg-gray-200 file:py-2 file:px-4 file:rounded-md"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Image Preview</h3>
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-md" />
          </div>
        )}

        {/* Image Cropper */}
        {image && !imagePreview && (
          <div className="mt-4">
            <ReactCrop
              image={image}
              crop={croppedArea}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              className="w-full h-64 bg-gray-200 rounded-md"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <PrimaryBtn
            text={loading ? 'Submitting...' : 'Submit Vendor Request'}
            onClick={formik.handleSubmit}
            className="w-full py-3 text-xl"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default RequestVendorPage;