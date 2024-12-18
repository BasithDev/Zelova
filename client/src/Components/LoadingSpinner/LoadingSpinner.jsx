import { RingLoader } from 'react-spinners';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <RingLoader color="#4F46E5" loading={true} size={50} />
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};

LoadingSpinner.propTypes = {
    message: PropTypes.string
};

LoadingSpinner.defaultProps = {
    message: "Loading..."
};

export default LoadingSpinner;
