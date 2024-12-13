import PropTypes from 'prop-types'

const FormField = ({ label, type = "text", name, value, onChange, placeholder, options, isSelect }) => (
    <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">{label}</label>
        {isSelect ? (
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        ) : type === "textarea" ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder={placeholder}
            ></textarea>
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-xl p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={placeholder}
            />
        )}
    </div>
);
FormField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf(["text", "number", "email", "password", "textarea"]),
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string,
        })
    ), 
    isSelect: PropTypes.bool, 
};
export default FormField 