import PropTypes from 'prop-types';

const PrimaryBtn = ({ text, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 ${className}`}
    >
      {text}
    </button>
  );
};

PrimaryBtn.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default PrimaryBtn;