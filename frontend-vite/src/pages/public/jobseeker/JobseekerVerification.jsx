import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
import Logo from '../../../components/ui/Logo.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';

const steps = [
  { key: 'registration', label: 'Registration' },
  { key: 'verification', label: 'Verification' },
  { key: 'activation', label: 'Activation' },
];

const JobseekerVerification = () => {
  const navigate = useNavigate();
  
  // File upload and camera refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // State management for files and camera
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleStepClick = (key) => {
    // Allow navigation to any step (including going back)
    if (key === 'registration') {
      navigate('/signup/jobseeker');
    } else if (key === 'verification') {
      navigate('/signup/jobseeker/verification');
    } else if (key === 'activation') {
      // Only allow going to activation if documents are submitted or user chooses to skip
      const hasDocuments = uploadedFiles.length > 0 || capturedPhotos.length > 0;
      if (hasDocuments) {
        navigate('/signup/jobseeker/activation');
      } else {
        // Ask user if they want to skip verification
        const shouldSkip = window.confirm(
          'You haven\'t uploaded any documents yet. Do you want to skip verification for now?'
        );
        if (shouldSkip) {
          navigate('/signup/jobseeker/activation');
        }
      }
    }
  };

  // File validation
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, JPG, and PNG files are allowed';
    }
    return null;
  };

  // Handle file selection
  const handleFileSelect = (files) => {
    const newFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        // Create file object with preview URL for images
        const fileObj = {
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        };
        newFiles.push(fileObj);
      }
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setUploadErrors(errors);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  // File input handler
  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  // Remove uploaded file
  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up object URLs to prevent memory leaks
      const removedFile = prev.find(f => f.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated;
    });
  };

  // Camera functionality
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const photo = {
          id: Date.now() + Math.random(),
          blob,
          name: `photo_${Date.now()}.jpg`,
          size: blob.size,
          type: 'image/jpeg',
          preview: URL.createObjectURL(blob)
        };
        setCapturedPhotos(prev => [...prev, photo]);
      }, 'image/jpeg', 0.8);
    }
  };

  // Remove captured photo
  const removePhoto = (photoId) => {
    setCapturedPhotos(prev => {
      const updated = prev.filter(p => p.id !== photoId);
      const removedPhoto = prev.find(p => p.id === photoId);
      if (removedPhoto?.preview) {
        URL.revokeObjectURL(removedPhoto.preview);
      }
      return updated;
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Submit all documents (ready for backend integration)
  const submitDocuments = async () => {
    const allDocuments = [...uploadedFiles, ...capturedPhotos];

    setIsLoading(true);

    if (allDocuments.length === 0) {
      alert('Please upload at least one document or take a photo before submitting.');
      setIsLoading(false);
      return;
    }

    // Prepare FormData for backend submission
    const formData = new FormData();

    const userEmail = localStorage.getItem('userEmail');
    formData.append('email', userEmail);

    allDocuments.forEach((doc) => {
      if (doc.file) {
        formData.append('documents', doc.file);
      } else if (doc.blob) {
        formData.append('documents', doc.blob, doc.name);
      }
    });

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      console.log('Documents ready for submission:', allDocuments);
      console.log('FormData prepared for backend:', formData);

      // Add minimum loading time to see spinner (remove this in production)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example of how to connect to your backend:
      const response = await fetch('http://localhost:4000/accounts/users/register/pwd/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text}`);
      }

      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);
      
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: 'success',
          html: '<b>Verification documents submitted successfully!</b> \n<p>Please check your email for the verification code.</p>',
          timer: 5000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        navigate('/signup/jobseeker/activation');
      } else {
        alert(`Submission failed: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error('Error submitting documents:', error);
      alert('Error submitting documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Clean up object URLs
      uploadedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      capturedPhotos.forEach(photo => {
        if (photo.preview) URL.revokeObjectURL(photo.preview);
      });
      // Stop camera if active
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className=" mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center py-4">
            <Logo size="default" showText={true} />
            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Help"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Settings"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">PWD Verification</h1>
            <p className="text-center text-gray-600 mt-2">Please upload your PWD ID or certification documents to verify your account</p>

            <Stepper steps={steps} currentKey="verification" onStepClick={handleStepClick} />

            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9h2v5H9V9zm0-4h2v2H9V5z"/></svg>
                <div>
                  <div className="font-medium">Your Privacy is Protected</div>
                  <div>Your documents are encrypted and securely stored. Only authorized personnel can access them for verification purposes.</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* File Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">☁️</div>
                  <p className="text-gray-700">Drag and drop your files here, or</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Browse Files
                  </button>
                  <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                </div>

                {/* Display upload errors */}
                {uploadErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="font-medium text-red-800 mb-2">Upload Errors:</div>
                    {uploadErrors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">{error}</div>
                    ))}
                  </div>
                )}

                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="font-medium mb-3">Uploaded Files:</div>
                    <div className="space-y-2">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            {file.preview ? (
                              <img src={file.preview} alt="" className="w-10 h-10 object-cover rounded" />
                            ) : (
                              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">
                                PDF
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
                </div>

                {/* Camera Section */}
                {!cameraActive ? (
                  <button 
                    onClick={startCamera}
                    className="w-full border border-gray-300 rounded-lg py-3 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="text-blue-600">📷</span>
                    Take Photo with Camera
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-medium">Camera Active</div>
                      <button 
                        onClick={stopCamera}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Stop Camera
                      </button>
                    </div>
                    <div className="relative">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        className="w-full max-w-md mx-auto rounded-lg"
                      />
                      <button 
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center"
                      >
                        📸
                      </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}

                {/* Display captured photos */}
                {capturedPhotos.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="font-medium mb-3">Captured Photos:</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {capturedPhotos.map(photo => (
                        <div key={photo.id} className="relative">
                          <img 
                            src={photo.preview} 
                            alt="Captured" 
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button 
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          >
                            ✕
                          </button>
                          <div className="text-xs text-gray-500 mt-1">{formatFileSize(photo.size)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="font-medium mb-3">Accepted Document Types:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                    <div>✅ PWD ID Card</div>
                    <div>✅ Medical Certificate</div>
                    <div>✅ Disability Assessment</div>
                    <div>✅ Government-issued Certificate</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button onClick={() => navigate('/onboarding/jobseeker/skills')} className="flex-1 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors">Skip for Now</button>
                <button 
                  onClick={submitDocuments} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 transition-colors"
                  disabled={uploadedFiles.length === 0 && capturedPhotos.length === 0}
                >
                  Submit Documents ({uploadedFiles.length + capturedPhotos.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="mx-full px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 PWDe. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobseekerVerification;