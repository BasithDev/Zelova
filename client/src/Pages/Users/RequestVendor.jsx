import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { motion, AnimatePresence } from 'framer-motion';
import {submitVendorReq} from '../../Services/apiServices'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { BeatLoader } from 'react-spinners';
import { uploadImageToCloud } from '../../Helpers/uploadImageToCloud';

const RequestVendorPage = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MySwal = withReactContent(Swal);
  const cropperRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      restaurantName: '',
      address: '',
      description: '',
    },
    validationSchema: Yup.object({
      restaurantName: Yup.string().required('Restaurant name is required'),
      address: Yup.string().required('Address is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        const uploadedImage = await uploadImageToCloud(croppedImage)

        await submitVendorReq({
          restaurantName: values.restaurantName,
          address: values.address,
          description: values.description,
          license: {
            url: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
          }
        })
        MySwal.fire({
          title: <p className="text-2xl font-semibold">Request Submitted!</p>,
    text: "Your vendor request was successfully submitted.",
    icon: "success",
    iconColor: "#10B981",
    showConfirmButton: true,
    confirmButtonText: "OK",
    background: '#f3f4f6',
    color: '#111827',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-lg p-6 shadow-lg',
      confirmButton: 'bg-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition duration-200',
      cancelButton: 'bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition duration-200',
    },
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        MySwal.fire({
          title: <p className="text-2xl font-semibold">Request Failed</p>,
    text: "There was an error submitting your vendor request. Please try again.",
    icon: "error",
    iconColor: "#EF4444",
    showConfirmButton: true,
    confirmButtonText: "Retry",
    background: '#fef2f2',
    color: '#7f1d1d',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-3xl p-6 shadow-xl',
      confirmButton: 'bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition duration-200',
    },
        });
      } finally{
        setIsSubmitting(false);
      }
    },
  });
  

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  const cropImage = () => {
    const cropperInstance = cropperRef.current?.cropper;
    if (cropperInstance) {
      const croppedCanvas = cropperInstance.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          const croppedImageUrl = URL.createObjectURL(blob);
          setCroppedImage(croppedImageUrl);
          setIsCropperOpen(false);
        }, 'image/jpeg');
      }
    }
  };

  
  return (
    <motion.div
      className={`${croppedImage?'h-fit':'h-screen'} p-6 bg-amber-50`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold text-center mb-10">Become a Partner With <span className="text-orange-500">Zelova</span></h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">

        <div>
          <label className="block text-xl font-semibold mb-2">Upload License</label>
          <div className="flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer inline-block bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition duration-200 shadow-md"
            >
              Choose File
            </label>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {croppedImage && (
          <div className="bg-white space-y-3 p-3 flex-col justify-center items-center flex shadow-2xl rounded-2xl w-fit transition-all duration-200">
            <h3 className="text-xl font-semibold">Cropped Image Preview</h3>
            <img src={croppedImage} alt="Cropped" className="h-56 object-cover rounded-md border border-gray-300" />
            <button
              type="button"
              onClick={() => setIsCropperOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Crop Again
            </button>
          </div>
        )}
        <div>
          <label className="block text-xl font-semibold mb-2">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.restaurantName}
            className="w-full border rounded-md px-3 py-2"
          />
          {formik.touched.restaurantName && formik.errors.restaurantName && (
            <p className="text-red-500 text-sm">{formik.errors.restaurantName}</p>
          )}
        </div>

        <div>
          <label className="block text-xl font-semibold mb-2">Address</label>
          <textarea
            name="address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className="w-full border rounded-md px-3 py-2"
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm">{formik.errors.address}</p>
          )}
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Description</label>
          <textarea
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="w-full border rounded-md px-3 py-2"
            rows="4"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        <PrimaryBtn 
        text={isSubmitting ? <BeatLoader color="#FFF" size={10} /> : "Submit Request"}
        className="py-2 font-bold text-2xl w-full" />
      </form>
      <AnimatePresence>
        {isCropperOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-center mb-4">Crop Your Image</h3>
              <Cropper
                src={image}
                ref={cropperRef}
                style={{ height: 400, width: '100%' }}
                aspectRatio={1}
                guides={false}
              />
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={cropImage}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                  Save Crop
                </button>
                <button
                  onClick={() => setIsCropperOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequestVendorPage;