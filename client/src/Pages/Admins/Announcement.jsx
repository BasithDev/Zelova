import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AdminSearchBar from '../../Components/SearchBar/AdminSearchBar';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { sendAnnouncement, getAnnouncementStatus } from '../../Services/apiServices';
import AnnouncementTemplates from '../../Components/Announcement/AnnouncementTemplates';

const Announcement = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    isVisible: false,
    total: 0,
    sent: 0,
    failed: 0,
    subject: '',
    jobId: null,
    status: '' 
  });

  // Reference to store interval ID
  const progressInterval = useRef(null);
  const currentJobId = useRef(null);

  // Clear interval on component unmount
  React.useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const startProgressPolling = (jobId) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(async () => {
      try {
        const statusResponse = await getAnnouncementStatus(jobId);
        
        if (statusResponse.data?.status === 'Success') {
          const { state, progress: jobProgress } = statusResponse.data.data;
          
          setProgress(prev => ({
            ...prev,
            sent: jobProgress?.processed || 0,
            failed: jobProgress?.failed || 0,
            total: jobProgress?.total || prev.total,
            status: state
          }));

          if (state === 'completed' || state === 'failed') {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
            
            if (state === 'completed') {
              toast.success('Announcement sent successfully');
            } else {
              toast.error('Failed to send some announcements');
            }
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
          toast.error('Job not found');
        } else {
          console.error('Error checking progress:', error);
        }
      }
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    setLoading(true);
    setProgress({
      isVisible: true,
      total: 0,
      sent: 0,
      failed: 0,
      subject: formData.subject,
      jobId: null,
      status: 'queuing'
    });

    try {
      const response = await sendAnnouncement({
        subject: formData.subject,
        message: formData.message
      });

      if (response.data.status === 'Success') {
        // Clear form fields after successful queue
        setFormData({
          subject: '',
          message: ''
        });

        const jobId = response.data.jobId;
        currentJobId.current = jobId;

        setProgress(prev => ({
          ...prev,
          total: response.data.totalEmails,
          jobId: jobId,
          status: 'sending'
        }));

        // Start polling for progress
        startProgressPolling(jobId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send announcement');
      console.error('Error:', error);
      setProgress(prev => ({ ...prev, status: 'failed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClear = () => {
    setFormData({
      subject: '',
      message: ''
    });
  };

  const handleClearProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setProgress({
      isVisible: false,
      total: 0,
      sent: 0,
      failed: 0,
      subject: '',
      jobId: null,
      status: ''
    });
  };

  const handleTemplateSelect = (template) => {
    setFormData({
      subject: template.subject,
      message: template.message
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSearchBar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <AnnouncementTemplates onTemplateSelect={handleTemplateSelect} />
            </div>
          </div>

          {/* Announcement Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Announcement</h2>

              {/* Simple Progress Section */}
              {progress.isVisible && (
                <div className="mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">Sending Progress</h4>
                        {progress.subject && (
                          <p className="text-sm text-gray-600 mt-1">
                            Subject: {progress.subject}
                          </p>
                        )}
                        {progress.status && (
                          <p className={`text-sm mt-1 ${
                            progress.status === 'completed' ? 'text-green-600' :
                            progress.status === 'failed' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>
                            Status: {
                              progress.status === 'queuing' ? 'Setting up announcement...' :
                              progress.status === 'sending' ? 'Sending announcement...' :
                              progress.status === 'completed' ? 'Announcement completed successfully!' :
                              progress.status === 'failed' ? 'Failed to send announcement' : ''
                            }
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleClearProgress}
                        className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        Clear Progress
                      </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress.status === 'failed' ? 'bg-red-500' :
                          progress.status === 'completed' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}
                        style={{
                          width: `${progress.total ? (progress.sent / progress.total * 100) : 0}%`
                        }}
                      />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">{progress.total}</p>
                      </div>
                      <div>
                        <p className="text-green-600 flex items-center gap-1">
                          <MdCheckCircle />
                          Sent
                        </p>
                        <p className="font-medium">{progress.sent}</p>
                      </div>
                      <div>
                        <p className="text-red-600 flex items-center gap-1">
                          <MdError />
                          Failed
                        </p>
                        <p className="font-medium">{progress.failed}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  This announcement will be sent to all registered users via email.
                  Please ensure your message is clear and relevant to all users.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Announcement Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter announcement subject"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Announcement Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="8"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Enter your announcement message"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="loader"></div>
                    ) : (
                      <>
                        Send Announcement
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Announcement;