import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {loginUser} from '../../Services/apiServices'
import { useDispatch } from 'react-redux';
import { setAdminAuth } from '../../Redux/slices/admin/authAdminSlice';
import { useNavigate } from 'react-router-dom';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await loginUser(values);
            if (response.status === 200) {
                const { Id,token, isAdmin } = response.data;
                const adminId = Id
                console.log(adminId)
                if (isAdmin) {
                    dispatch(setAdminAuth({ adminId,token }));
                    navigate('/admin');
                } else {
                    toast.error("You're not authorized to access this page.");
                }
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-blue-500 h-screen flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg h-fit"
            >
                <h2 className="text-2xl font-semibold text-center mb-2">Login to Account</h2>
                <p className="text-center text-gray-600 mb-6">Please enter your email and password to continue</p>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="email">Email address:</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter Mail ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-3 text-center">
                                <a href="/forgot-password" className="text-md text-gray-600 hover:underline">Forget Password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full text-white font-semibold text-2xl py-2 rounded-md hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500'}`}
                            >
                                Sign In
                            </button>
                        </Form>
                    )}
                </Formik>
            </motion.div>

            <ToastContainer />
        </div>
    );
}

export default Login;