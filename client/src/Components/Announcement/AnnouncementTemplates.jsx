import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAnnouncementTemp, addAnnouncementTemp, deleteAnnouncementTemp } from '../../Services/apiServices';
import { MdDelete } from 'react-icons/md';
import PropTypes from 'prop-types';

const AnnouncementTemplates = ({ onTemplateSelect }) => {
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    message: ''
  });
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await getAnnouncementTemp();
      setTemplates(response.data.map(temp => ({
        id: temp._id,
        name: temp.templateName,
        subject: temp.title,
        message: temp.message
      })));
    } catch (error) {
      toast.error('Failed to load templates');
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.message) {
      toast.error('Please fill in all template fields');
      return;
    }

    try {
      await addAnnouncementTemp({
        templateName: templateForm.name,
        title: templateForm.subject,
        message: templateForm.message
      });
      toast.success('Template saved successfully');
      setShowTemplateModal(false);
      setTemplateForm({ name: '', subject: '', message: '' });
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to save template');
      console.error('Error saving template:', error);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await deleteAnnouncementTemp(id);
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to delete template');
      console.error('Error deleting template:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    onTemplateSelect(template);
    toast.info('Template loaded');
  };

  const renderTemplateContent = () => {
    if (loadingTemplates) {
      return (
        <div className="text-center py-4">
          <p>Loading templates...</p>
        </div>
      );
    }

    if (templates.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500">No templates saved</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-800">{template.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(template.id);
                }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <MdDelete size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">Subject: {template.subject}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{template.message}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Saved Templates</h2>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save as Template
        </button>
      </div>

      {renderTemplateContent()}

      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Save as Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={templateForm.message}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="Enter email message"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AnnouncementTemplates.propTypes = {
  onTemplateSelect: PropTypes.func.isRequired,
};

export default AnnouncementTemplates;
