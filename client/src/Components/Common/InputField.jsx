import PropTypes from 'prop-types';
const InputField = ({ label, value, onChange, isEditable, type }) => (
    <div className="flex flex-col">
        <label className="text-lg font-medium text-gray-600 mb-2">{label}:</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={!isEditable}
            className={`py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isEditable ? "focus:ring-blue-500" : "bg-gray-100"}`}
        />
    </div>
);

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isEditable: PropTypes.bool.isRequired,
    type: PropTypes.string,
};


export default InputField