import { useState , useEffect} from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { BeatLoader } from 'react-spinners';
import { registerUser } from '../../Services/apiServices';

import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdAlternateEmail } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

import PrimaryBtn from '../../Components/Buttons/PrimaryBtn';
import { useSelector } from 'react-redux';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    console.log(isAuthenticated)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleGoogleLogin = () => {
        window.location.href  = 'http://localhost:3000/api/auth/google';
    };

    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            password: '',
            confirmPassword: '',
            age: '',
            phoneNumber: ''
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required('Fullname is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
            age: Yup.number().required('Age is required').min(18, 'You must be at least 18 years old').max(115, 'Enter a valid age'),
            phoneNumber: Yup.string()
                .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
                .required('Phone number is required')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await registerUser(values);
                navigate('/otp', { state: { emailForOtp: values.email } });
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="flex h-screen">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="bg-orange-200 w-[480px] flex items-center justify-center rounded-r-xl">
                <div className="text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Z</div>
            </div>

            <motion.div
                className="flex flex-col justify-center w-2/3 p-10 bg-white"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-2">Create an account</h1>
                <p className="text-gray-500 mb-6">Please create an account to continue</p>
                
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    {[
                        { name: 'fullname', type: 'text', placeholder: 'FULL NAME', icon: <FaUser /> },
                        { name: 'email', type: 'email', placeholder: 'Email ID', icon: <MdAlternateEmail /> },
                        { name: 'password', type: 'password', placeholder: 'Password', icon: <RiLockPasswordFill /> },
                        { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password', icon: <RiLockPasswordFill /> },
                        { name: 'age', type: 'number', placeholder: 'Age', icon: <FaCalendarAlt /> },
                        { name: 'phoneNumber', type: 'text', placeholder: 'Mobile Number', icon: <FaPhoneAlt /> },
                    ].map((field, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-200 p-3.5 rounded-lg">
                                    {field.icon}
                                </div>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    className="flex-1 p-2 border rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values[field.name]}
                                />
                            </div>
                            {formik.touched[field.name] && formik.errors[field.name] && (
                                <div className="text-red-500">{formik.errors[field.name]}</div>
                            )}
                        </div>
                    ))}

                    <PrimaryBtn
                        type="submit"
                        text={loading ? <BeatLoader color="#FFF" size={10} /> : "Sign Up"}
                        className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 font-bold text-2xl text-white w-full py-2 rounded-md"
                        disabled={loading}
                    />
                </form>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-200 text-gray-700 py-2 rounded-lg flex items-center justify-center mb-4">
                        <FcGoogle className="mr-2 text-2xl" />
                        Sign In Using Google Account
                    </button>
                
                <Link to={'/login'}>
                    <p className="text-center text-gray-500 mt-4">Already registered? <span className='underline text-blue-500'>Sign In</span></p>
                </Link>
            </motion.div>
        </div>
    );
};

export default Register;