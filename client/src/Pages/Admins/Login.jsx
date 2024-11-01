const Login = () => {
    return (
        <div className="bg-blue-500 h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg h-fit">
            <h2 className="text-2xl font-semibold text-center mb-2">Login to Account</h2>
            <p className="text-center text-gray-600 mb-6">Please enter your email and password to continue</p>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email address:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter Mail ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <div className="flex items-center justify-between">
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                        />
                    </div>
                </div>
                <div className="mb-3 text-center">
                <a href="#" className="text-md text-gray-600 hover:underline">Forget Password?</a>
                </div>
        
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold text-2xl py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Sign In
                </button>
            </form>
        </div>
        </div>
    )
}

export default Login