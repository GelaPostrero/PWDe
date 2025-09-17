import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../utils/api.js'
import JobseekerHeader from '../../../components/ui/JobseekerHeader.jsx';
import Stepper from '../../../components/ui/Stepper.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';

const steps = [
  { key: 'skills', label: 'Skills' },
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'completion', label: 'Profile Completion' },
];

const routeForStep = (key) => {
  switch (key) {
    case 'skills':
      return '/onboarding/jobseeker/skills';
    case 'education':
      return '/onboarding/jobseeker/education';
    case 'experience':
      return '/onboarding/jobseeker/experience';
    case 'accessibility':
      return '/onboarding/jobseeker/accessibility';
    case 'preferences':
      return '/onboarding/jobseeker/preferences';
    case 'completion':
      return '/onboarding/jobseeker/completion';
    default:
      return '/onboarding/jobseeker/skills';
  }
};

// ---- helpers ----
const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10MB

const JobseekerOnboardingCompletion = () => {
  const navigate = useNavigate();
  const handleStepClick = (key) => navigate(routeForStep(key));
  const goBack = () => navigate(routeForStep('preferences'));

  // ---- form state ----
  const [role, setRole] = useState('');
  const [summary, setSummary] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState({
    linkedin: '',
    github: '',
    portfolio: '',
    other: ''
  });
  const [visibility, setVisibility] = useState('public');
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreeShare, setAgreeShare] = useState(false);
  const [agreeTruthful, setAgreeTruthful] = useState(false);

  // ---- upload state ----
  const [photo, setPhoto] = useState(null); // { file, previewUrl, size, type, name }
  const [resume, setResume] = useState(null); // { file, objectUrl, size, type, name }
  const [uploadErrors, setUploadErrors] = useState([]);

  // refs for hidden inputs
  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // drag state (resume)
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  

  // ---- handlers ----
  const handlePortfolioLinksChange = (field, value) => {
    setPortfolioLinks(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ---- validators ----
  const validatePhoto = (file) => {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return 'Profile photo must be JPG or PNG.';
    }
    if (file.size > MAX_PHOTO_SIZE) {
      return 'Profile photo must be less than 5MB.';
    }
    return null;
  };

  const validateResume = (file) => {
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      return 'Resume must be PDF, DOC, or DOCX.';
    }
    if (file.size > MAX_RESUME_SIZE) {
      return 'Resume must be less than 10MB.';
    }
    return null;
  };

  // ---- photo handlers ----
  const onClickPhoto = () => photoInputRef.current?.click();

  const onChangePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validatePhoto(file);
    if (error) {
      setUploadErrors((prev) => [...prev, `Profile Photo: ${error}`]);
      return;
    }

    // clean old preview
    if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);

    const previewUrl = URL.createObjectURL(file);
    setPhoto({
      file,
      previewUrl,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  };

  const removePhoto = () => {
    if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
    setPhoto(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // ---- resume handlers ----
  const onClickResume = () => resumeInputRef.current?.click();

  const onChangeResume = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateResume(file);
    if (error) {
      setUploadErrors((prev) => [...prev, `Resume: ${error}`]);
      return;
    }

    if (resume?.objectUrl) URL.revokeObjectURL(resume.objectUrl);
    const objectUrl = URL.createObjectURL(file);

    setResume({
      file,
      objectUrl,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  };

  const onResumeDragOver = (e) => {
    e.preventDefault();
    setIsDraggingResume(true);
  };

  const onResumeDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingResume(false);
  };

  const onResumeDrop = (e) => {
    e.preventDefault();
    setIsDraggingResume(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const error = validateResume(file);
    if (error) {
      setUploadErrors((prev) => [...prev, `Resume: ${error}`]);
      return;
    }

    if (resume?.objectUrl) URL.revokeObjectURL(resume.objectUrl);
    const objectUrl = URL.createObjectURL(file);

    setResume({
      file,
      objectUrl,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  };

  const removeResume = () => {
    if (resume?.objectUrl) URL.revokeObjectURL(resume.objectUrl);
    setResume(null);
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  // ---- cleanup ----
  useEffect(() => {
    return () => {
      if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      if (resume?.objectUrl) URL.revokeObjectURL(resume.objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- submit (with backend placeholder) ----
  const finish = async () => {
    console.log("Portfolio links: ", portfolioLinks);
    // basic agreements check (adjust if you want to make them required)
    if (!agreeTos || !agreeTruthful) {
      alert('Please agree to the Terms and confirm information is truthful.');
      return;
    }

    setIsLoading(true);
    console.log('Form validation passed, proceeding...');

    // Add minimum loading time to see spinner (remove this in production)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Prepare payload
      const profileCompletion = new FormData();
      profileCompletion.append('role', role);
      profileCompletion.append('summary', summary);
      profileCompletion.append('portfolioUrl', portfolioLinks.portfolio);
      profileCompletion.append('githubUrl', portfolioLinks.github);
      profileCompletion.append('linkedinUrl', portfolioLinks.linkedin);
      profileCompletion.append('otherPlatform', JSON.stringify([portfolioLinks.other])); 
      profileCompletion.append('visibility', visibility);

      // Append files if present
      if (photo?.file) {
        profileCompletion.append('profilePhoto', photo.file, photo.name || 'profile-photo.jpg');
      }

      if (resume?.file) {
        profileCompletion.append('resume', resume.file, resume.name || 'resume.pdf');
      }

      const response = await api.post('/onboard/pwd/complete-profile', profileCompletion);

      // Wait for both API call and minimum loading time
      await Promise.all([response, minLoadingTime]);

      if(response.data.success) {
        Swal.fire({
          icon: 'success',
          html: '<h5>You have finally completed your onboarding processes. \n<p><b>Welcome to your dashboard.</b></p></h6>',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });
        navigate('/jobseeker/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={true} />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 text-lg mb-3">🛠️</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome to PWDe: AI-Powered Job Matching Platform</h1>
            <p className="text-gray-600 mt-2">Help us understand your skills and preferences to find the perfect job opportunities tailored for you.</p>
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 border border-blue-100 inline-block px-4 py-2 rounded-lg">
              Our AI analyzes your profile to match you with inclusive employers and accessible positions.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <Stepper steps={steps} currentKey="completion" onStepClick={handleStepClick} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Complete Your Profile</h2>
            <p className="text-gray-600">Add final details to help us find better match for you.</p>

            {/* Upload errors */}
            {uploadErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="font-medium text-red-800 mb-2">Upload Errors:</div>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {uploadErrors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-700 mb-3">Profile Photo (Optional)</div>

                {photo ? (
                  <div className="relative mx-auto w-28 h-28">
                    <img
                      src={photo.previewUrl}
                      alt="Profile preview"
                      className="w-28 h-28 rounded-full object-cover border"
                    />
                    <button
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer"
                      title="Remove photo"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-28 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No photo
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500">Supported formats: JPG, PNG (Max 5MB)</div>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={onChangePhoto}
                />
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={onClickPhoto}
                    className="px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {photo ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {photo && (
                    <span className="text-xs text-gray-500">
                      {photo.name} • {formatFileSize(photo.size)}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs text-blue-600">A profile photo increases your chances of getting noticed by employers</div>
              </div>

              {/* Role */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="font-medium text-gray-900 mb-2">Add a title to tell the world what you do</div>
                <p className="text-sm text-gray-600 mb-3">It’s the very first thing employers see, so make it count. Stand out by describing your expertise in your own words.</p>
                <label className="block text-sm text-gray-700 mb-1">Professional Role*</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3"
                  placeholder="e.g., Full-Stack Developer | UI/UX Designer | Digital Marketing Specialist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="mt-2 text-xs text-gray-500">Tip: Use keywords that employers search for in your field</div>
              </div>

              {/* Summary */}
              <div className="border border-gray-200 rounded-xl p-6">
                <label className="block font-medium text-gray-900 mb-2">Professional Summary*</label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3"
                  placeholder="Write a brief summary highlighting your key skills, experience, and what makes you a great candidate."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              {/* Resume Upload */}
              <div className="border border-gray-200 rounded-xl p-6 text-center">
                <div className="font-medium text-gray-900 mb-2">Resume/CV Upload</div>

                <div
                  className={`border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-600 transition-colors ${
                    isDraggingResume ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={onResumeDragOver}
                  onDragLeave={onResumeDragLeave}
                  onDrop={onResumeDrop}
                >
                  <div className="text-4xl">📄</div>
                  {!resume ? (
                    <>
                      <div className="mt-2">Drag and drop your resume here, or</div>
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        onChange={onChangeResume}
                      />
                      <button
                        onClick={onClickResume}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg cursor-pointer"
                      >
                        Upload Resume
                      </button>
                      <div className="mt-2 text-xs text-gray-500">Supported formats: PDF, DOC, DOCX (Max 10MB)</div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="font-medium text-gray-800">{resume.name}</div>
                      <div className="text-xs text-gray-500">{resume.type} • {formatFileSize(resume.size)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={resume.objectUrl}
                          download={resume.name}
                          className="px-3 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Download
                        </a>
                        <button
                          onClick={onClickResume}
                          className="px-3 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          onClick={removeResume}
                          className="px-3 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Portfolio Links */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="font-medium text-gray-900 mb-4">Portfolio Links (Optional)</div>
                <div className="space-y-4">
                  {/* LinkedIn Profile and GitHub Profile - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://linkedin.com/in/yourusername"
                        value={portfolioLinks.linkedin || ''}
                        onChange={(e) => handlePortfolioLinksChange('linkedin', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://github.com/yourusername"
                        value={portfolioLinks.github || ''}
                        onChange={(e) => handlePortfolioLinksChange('github', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Portfolio Website and Other Links - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://yourportfolio.com"
                        value={portfolioLinks.portfolio || ''}
                        onChange={(e) => handlePortfolioLinksChange('portfolio', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Other Links</label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://behance.net/yourusername or https://dribbble.com/yourusername"
                        value={portfolioLinks.other || ''}
                        onChange={(e) => handlePortfolioLinksChange('other', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Add your portfolio links to showcase your work to employers. These will be included in your profile.</p>
                </div>
              </div>

              {/* Visibility */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="font-medium text-gray-900 mb-2">Profile visibility</div>
                <div className="space-y-2 text-sm text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                    />
                    Public (visible to all employers)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === 'private'}
                      onChange={() => setVisibility('private')}
                    />
                    Private (only visible to employers you apply to)
                  </label>
                </div>
              </div>

              {/* Agreements */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="font-medium text-gray-900 mb-3">Terms & Agreements</div>
                <div className="space-y-2 text-sm text-gray-700">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={agreeTos} onChange={(e) => setAgreeTos(e.target.checked)} />
                    <span>
                      I agree to the <a className="text-blue-600" href="#">Terms of Service</a> and{' '}
                      <a className="text-blue-600" href="#">Privacy Policy</a>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={agreeShare} onChange={(e) => setAgreeShare(e.target.checked)} />
                    <span>I consent to PWDe sharing my profile with potential employers</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={agreeTruthful} onChange={(e) => setAgreeTruthful(e.target.checked)} />
                    <span>I confirm that all information provided is accurate and truthful</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={goBack} 
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={finish}
                  disabled={isLoading}
                  className={`px-6 py-3 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    isLoading
                      ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  }`}
                >
                  {isLoading ? (  
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Completing Profile...</span>
                    </>
                  ) : (
                    'Complete Profile & Start Job Search'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 PWDe. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobseekerOnboardingCompletion;
