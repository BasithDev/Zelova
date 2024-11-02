import { useState } from 'react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdAlternateEmail } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

import PrimaryBtn from '../../Components/Buttons/PrimaryBtn'

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
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
            try {
                setLoading(true)
                await axios.post('http://localhost:3000/api/user/auth/register', values, { withCredentials: true, })
                const emailForOtp = formik.values.email
                navigate('/otp', { state: { emailForOtp } })
            } catch (error) {
                toast.error(error.response?.data?.message || 'Server error')
            } finally {
                setLoading(false)
            }
        }
    });
    return (
        <div className="flex h-screen">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="bg-orange-200 w-[480px] flex items-center justify-center rounded-r-xl">
                <div className="text-9xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Z</div>
            </div>
            {
                loading ? (
                    <div className="flex flex-col justify-center items-center w-2/3">
                        <p className='font-bold text-2xl font-sans'>Sending OTP To your Mail...</p>
                        <BeatLoader color="#FF5733" loading={loading} size={30} />
                    </div>
                ) :
                    <motion.div
                        className="flex flex-col justify-center w-2/3 p-10 bg-white"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold mb-2">Create an account</h1>
                        <p className="text-gray-500 mb-6">Please Create a account to continue</p>
                        <form
                            className="space-y-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-200 p-3.5 rounded-lg">
                                    <FaUser className="text-orange-500" />
                                </div>
                                <input
                                    type="text"
                                    name='fullname'
                                    placeholder="FULL NAME"
                                    className="flex-1 p-2 border rounded-md transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.fullname}
                                />
                                {formik.touched.fullname && formik.errors.fullname ? (
                                    <div className='text-red-500'>{formik.errors.fullname}</div>
                                ) : null}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-200 p-3.5 rounded-lg">
                                    <MdAlternateEmail className="text-orange-500" />
                                </div>
                                <input
                                    type="email"
                                    name='email'
                                    placeholder="Email ID"
                                    className="flex-1 p-2 border rounded-md transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className='text-red-500'>{formik.errors.email}</div>
                                ) : null}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-200 p-3.5 rounded-lg">
                                    <RiLockPasswordFill className="text-orange-500" />
                                </div>
                                <input
                                    type="password"
                                    name='password'
                                    placeholder="Password"
                                    className="flex-1 p-2 border rounded-md transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className='text-red-500'>{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-200 p-3.5 rounded-lg">
                                    <RiLockPasswordFill className="text-orange-500" />
                                </div>
                                <input
                                    type="password"
                                    name='confirmPassword'
                                    placeholder="Confirm Password"
                                    className="flex-1 p-2 border rounded-md transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmPassword}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                    <div className='text-red-500'>{formik.errors.confirmPassword}</div>
                                ) : null}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-200 p-3.5 rounded-lg">
                                    <FaCalendarAlt className="text-orange-500" />
                                </div>
                                <input
                                    type="number"
                                    name='age'
                                    placeholder="Age"
                                    className="flex-1 p-2 border rounded-md transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.age}
                                />
                                {formik.touched.age && formik.errors.age ? (
                                    <div className='text-red-500'>{formik.errors.age}</div>
                                ) : null}
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-200 p-3.5 rounded-lg">
                                    <FaPhoneAlt className="text-orange-500" />
                                </div>
                                <input
                                    type="text"
                                    name='phoneNumber'
                                    placeholder="Mobile Number"
                                    className="flex-1 p-2 border rounded-md transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phoneNumber}
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                    <div className='text-red-500'>{formik.errors.phoneNumber}</div>
                                ) : null}
                            </div>
                            <PrimaryBtn type="Submit" text="Sign Up" className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 font-bold text-2xl text-white w-full py-2 rounded-md" />
                        </form>
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <button className="bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-200 text-gray-700 w-full py-2 rounded-md flex items-center justify-center">
                            <FcGoogle className="mr-2 text-2xl" />
                            Sign In Using Google Account
                        </button>
                        <Link to={'/login'}><p className="text-center text-gray-500 mt-4">Already registered ? <span className='underline text-blue-500'>Sign In</span></p></Link>
                    </motion.div>
            }


        </div>
    )
}

export default Register