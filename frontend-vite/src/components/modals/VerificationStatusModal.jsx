import React, { useState, useEffect } from 'react';

const VerificationStatusModal = ({ formData, onFormChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState(formData.uploadedFiles || []);
  const [isUploading, setIsUploading] = useState(false);

  // Sync uploadedFiles state with formData
  useEffect(() => {
    if (formData.uploadedFiles) {
      setUploadedFiles(formData.uploadedFiles);
    }
  }, [formData.uploadedFiles]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = [...uploadedFiles, ...files];
    console.log('File upload - new files:', files);
    console.log('File upload - existing files:', uploadedFiles);
    console.log('File upload - combined files:', newFiles);
    setUploadedFiles(newFiles);
    // Pass files to parent component
    const updatedFormData = { ...formData, uploadedFiles: newFiles };
    console.log('File upload - updated formData:', updatedFormData);
    onFormChange(updatedFormData);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    console.log('Remove file - index:', index);
    console.log('Remove file - new files:', newFiles);
    setUploadedFiles(newFiles);
    // Pass updated files to parent component
    const updatedFormData = { ...formData, uploadedFiles: newFiles };
    console.log('Remove file - updated formData:', updatedFormData);
    onFormChange(updatedFormData);
  };

  const handleSubmitDocuments = async () => {
    setIsUploading(true);
    try {
      // TODO: Implement actual file upload to backend
      console.log('Uploading documents:', uploadedFiles);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Documents uploaded successfully! They will be reviewed within 1-3 business days.');
      // Don't clear files - keep them for user to see
      // setUploadedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
      <p className="text-gray-600 mb-6">Your account verification status and document review progress.</p>
      
      <div className="space-y-4">
        {/* Email Verification Status */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Email Address</h4>
                <p className="text-sm text-gray-600">Your email has been verified</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Document Verification Status */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                formData.documentStatus === 'verified' ? 'bg-green-100' : 
                formData.documentStatus === 'pending' ? 'bg-yellow-100' : 
                formData.documentStatus === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {formData.documentStatus === 'verified' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : formData.documentStatus === 'pending' ? (
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : formData.documentStatus === 'rejected' ? (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Identity Documents</h4>
                <p className="text-sm text-gray-600">
                  {formData.documentStatus === 'verified' ? 'Your documents have been verified' :
                   formData.documentStatus === 'pending' ? 'Your documents are under review' :
                   formData.documentStatus === 'rejected' ? 'Your documents were rejected. Please resubmit.' :
                   'No documents submitted yet'}
                </p>
                {formData.documentStatus === 'rejected' && formData.rejectionReason && (
                  <p className="text-sm text-red-600 mt-1">
                    Reason: {formData.rejectionReason}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                formData.documentStatus === 'verified' ? 'bg-green-100 text-green-800' :
                formData.documentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                formData.documentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {formData.documentStatus === 'verified' ? 'Verified' :
                 formData.documentStatus === 'pending' ? 'Under Review' :
                 formData.documentStatus === 'rejected' ? 'Rejected' :
                 'Not Submitted'}
              </span>
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        {(formData.documentStatus !== 'verified' || (formData.uploadedFiles && formData.uploadedFiles.length > 0)) && (
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Upload Documents</h4>
              <p className="text-sm text-gray-600 mb-4">
                {formData.documentStatus === 'not_submitted' ? 
                  'Upload your identity documents to complete verification. Accepted formats: PDF, JPG, PNG (Max 10MB each)' :
                  'You can upload new documents or resubmit if needed'
                }
              </p>
            </div>

            {/* Uploaded Documents Display */}
            {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents:</h5>
                <div className="space-y-2">
                  {formData.uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {typeof file === 'string' ? file : file.name}
                          </p>
                          {typeof file === 'object' && file.size && (
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {formData.documentStatus === 'pending' ? 'Under Review' : 
                           formData.documentStatus === 'verified' ? 'Verified' : 'Uploaded'}
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add more documents section */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">Want to add more documents or replace existing ones?</p>
                  <button
                    onClick={() => document.getElementById('document-upload').click()}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add More Documents
                  </button>
                </div>
              </div>
            )}

            {/* File Upload Area - Only show if no existing documents or if adding new ones */}
            {(!formData.uploadedFiles || formData.uploadedFiles.length === 0) && (
              <div className="space-y-4">
              {/* Drag and Drop Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB each</div>
                </label>
              </div>

                {/* Uploaded Files List - Only show for new uploads */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Selected Files:</h5>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Files will be saved using the Save Changes button in ProfileModal */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-blue-700">
                        {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} ready to upload. Click "Save Changes" to submit.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Verification Progress */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Verification Progress</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email Verification</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M6.564.75L3.5 3.814 1.436 1.75.75 2.436 3.5 5.186 7.25 1.436z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600">Complete</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Document Verification</span>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  formData.documentStatus === 'verified' ? 'bg-green-500' :
                  formData.documentStatus === 'pending' ? 'bg-yellow-500' :
                  formData.documentStatus === 'rejected' ? 'bg-red-500' :
                  'bg-gray-300'
                }`}>
                  {formData.documentStatus === 'verified' ? (
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M6.564.75L3.5 3.814 1.436 1.75.75 2.436 3.5 5.186 7.25 1.436z"/>
                    </svg>
                  ) : formData.documentStatus === 'pending' ? (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  ) : formData.documentStatus === 'rejected' ? (
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M6.564.75L3.5 3.814 1.436 1.75.75 2.436 3.5 5.186 7.25 1.436z"/>
                    </svg>
                  ) : null}
                </div>
                <span className={`text-sm font-medium ${
                  formData.documentStatus === 'verified' ? 'text-green-600' :
                  formData.documentStatus === 'pending' ? 'text-yellow-600' :
                  formData.documentStatus === 'rejected' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {formData.documentStatus === 'verified' ? 'Complete' :
                   formData.documentStatus === 'pending' ? 'In Progress' :
                   formData.documentStatus === 'rejected' ? 'Rejected' :
                   'Not Started'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900">Verification Process</h4>
              <p className="text-sm text-blue-700 mt-1">
                Document verification typically takes 1-3 business days. You'll receive an email notification once your documents are reviewed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatusModal;
