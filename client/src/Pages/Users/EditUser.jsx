import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BeatLoader } from 'react-spinners';
import { uploadImageToCloud } from '../../Helpers/uploadImageToCloud';
import { IoIosCloseCircle } from "react-icons/io";
import { deleteUserImage, updateUser } from '../../Services/apiServices';
import { fetchUserData } from '../../Redux/slices/userDataSlice';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUser = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.userData.data);
  const userId = userData._id
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoveImg, setIsRemoveImg] = useState(false)
  const [showCropper, setShowCropper] = useState(false);
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState('');
  const [cropper, setCropper] = useState(null);

  const handleEditClick = () => setShowCropper(true);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDone = () => {
    if (cropper) {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      setShowCropper(false);
    }
  };

  const extractPublicId = (url) => {
    const regex = /\/v(\d+)\/(.*)\./;
    const match = url.match(regex);
    if (match) {
      return match[2];
    }
    return null;
  };

  const handleRemoveProfilePicture = async (imageUrl) => {
    setIsRemoveImg(true)
    try {
      setImage(null);
      setCropData('');
      const public_id = extractPublicId(imageUrl);
      if (public_id) {
        await deleteUserImage({ public_id, userId });
      } else {
        console.error('Invalid image URL or unable to extract public ID');
      }
      dispatch(fetchUserData(userId))
    } catch (error) {
      console.log(error)
    } finally {
      setIsRemoveImg(false)
    }
  };

  const validationSchema = Yup.object({
    fullname: Yup.string().required('Full name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    age: Yup.number().required('Age is required').min(1, 'Enter a valid age'),
  });


  const initialValues = {
    fullname: userData.fullname || '',
    phoneNumber: userData.phoneNumber || '',
    age: userData.age || '',
  };

  const fields = [
    { name: 'fullname', label: 'Username', type: 'text' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
    { name: 'age', label: 'Age', type: 'number' },
  ];

  const hasChanges = (values) => {
    return (
      values.fullname !== userData.fullname ||
      values.phoneNumber !== userData.phoneNumber ||
      values.age !== userData.age ||
      cropData
    );
  };

  return (
    <div className="mx-5 my-2 p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer position="top-right" />
      <h2 className="text-4xl font-bold text-center mb-4">Edit Profile</h2>
      <div className="flex flex-col items-center mb-6 space-y-4">
        <img
          src={cropData || userData.profilePicture || "https://placehold.co/100x100"}
          alt="Profile"
          className="w-48 h-48 rounded-full border border-gray-300 object-cover"
        />
        <div className="flex space-x-4">
          <button
            onClick={handleEditClick}
            className="bg-orange-500 flex items-center gap-1 px-4 py-2 text-white font-semibold rounded hover:bg-orange-600"
          >
            <FiEdit />
            Edit
          </button>
          <button
            onClick={() => handleRemoveProfilePicture(userData.profilePicture)}
            className="bg-red-500 flex items-center gap-1 px-4 py-2 text-white font-semibold rounded hover:bg-red-700"
          >{
              isRemoveImg ? <BeatLoader /> : (<> <FiTrash2 />Remove</>)
            }
          </button>
        </div>
      </div>
      {showCropper && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white relative p-4 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Profile Picture</h3>
            <IoIosCloseCircle
              onClick={() => setShowCropper(false)}
              className="absolute top-2 right-2 bg-red-500 text-white text-xl cursor-pointer rounded-full hover:bg-red-600"
            />
            {image ? (
              <Cropper
                src={image}
                style={{ height: 300, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                viewMode={1}
                onInitialized={(instance) => setCropper(instance)}
              />
            ) : (
              <p className="text-center text-gray-500">Please select an image to crop.</p>
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => document.getElementById('imageInput').click()}
                className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
              >Select</button>
              <button
                onClick={handleDone}
                className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600"
              >Done</button>
            </div>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (!hasChanges(values)) {
            console.log("Data is the same");
            return;
          }
          setIsUpdating(true)
          try {
            let updatedProfileData = { ...values };
            updatedProfileData.userId = userId;
            if (cropData) {
              const uploadedImage = await uploadImageToCloud(cropData)
              updatedProfileData.profilePicture = uploadedImage.secure_url
            }
            await updateUser(updatedProfileData)
            dispatch(fetchUserData(userId))
            toast.success('User Details Updated Successfully')
          } catch (error) {
            console.log(error)
          } finally {
            setIsUpdating(false)
          }

        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {fields.map(({ name, label, type }) => (
              <div key={name} className="mb-4">
                <label className="block text-xl font-semibold text-orange-600 mb-2">{label}</label>
                <Field
                  type={type}
                  name={name}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                />
                <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
              </div>
            ))}
            <div className="my-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-orange-500 text-white font-bold text-2xl rounded-lg hover:bg-orange-600 transition-all duration-300"
                disabled={isSubmitting}
              >{isUpdating ? <BeatLoader color="#FFF" size={10} /> : 'Update'}</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default EditUser;