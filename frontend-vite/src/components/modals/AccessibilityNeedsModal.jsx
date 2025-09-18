import React from 'react';

const CheckboxItem = ({ value, checked, onChange, children }) => (
  <label className="flex items-start gap-3 text-gray-700">
    <input 
      type="checkbox" 
      value={value}
      checked={checked}
      onChange={onChange}
      className="mt-1" 
    /> 
    <span>{children}</span>
  </label>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
    <div className="text-gray-900 font-medium mb-3">{title}</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">{children}</div>
  </div>
);

const AccessibilityNeedsModal = ({ formData, onFormChange }) => {
  const handleCheckboxChange = (category, option) => {
    const current = formData[category] || [];
    if (current.includes(option)) {
      onFormChange(category, current.filter(v => v !== option)); // remove
    } else {
      onFormChange(category, [...current, option]); // add
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility & Accommodation Needs</h3>
      <p className="text-gray-600 mb-6">Help us understand your accessibility needs to ensure the best job matches. <button className="text-blue-600">Select all that apply</button>.</p>

      <Section title="Visual Support Needs">
        {[
          "Screen reader compatibility required",
          "High contrast display support",
          "Large text/font size options",
          "Color-blind friendly interfaces",
          "Magnification software support",
          "Braille display compatibility",
          "Audio descriptions for visual content",
          "None of the above"
        ].map(option => (
          <CheckboxItem
            key={option}
            value={option}
            checked={(formData.visual_support || []).includes(option)}
            onChange={() => handleCheckboxChange('visual_support', option)}
          >
            {option}
          </CheckboxItem>
        ))}
      </Section>

      <Section title="Hearing Support Needs">
        {[
          "Sign language interpretation",
          "Real-time captioning/subtitles",
          "Written communication preference",
          "Video relay services",
          "Hearing loop systems",
          "Visual alerts instead of audio",
          "TTY/TDD communication support",
          "None of the above"
        ].map(option => (
          <CheckboxItem
            key={option}
            value={option}
            checked={(formData.hearing_support || []).includes(option)}
            onChange={() => handleCheckboxChange('hearing_support', option)}
          >
            {option}
          </CheckboxItem>
        ))}
      </Section>

      <Section title="Mobility Support Needs">
        {[
          "Wheelchair accessible workspace",
          "Adjustable desk/workstation",
          "Voice recognition software",
          "Alternative keyboard/mouse options",
          "Flexible work positioning",
          "Ergonomic equipment",
          "Reduced physical demands",
          "None of the above"
        ].map(option => (
          <CheckboxItem
            key={option}
            value={option}
            checked={(formData.mobility_support || []).includes(option)}
            onChange={() => handleCheckboxChange('mobility_support', option)}
          >
            {option}
          </CheckboxItem>
        ))}
      </Section>

      <Section title="Cognitive Support Needs">
        {[
          "Extended time for tasks",
          "Quiet work environment",
          "Structured work routines",
          "Written instructions preference",
          "Flexible scheduling",
          "Memory aids/reminders",
          "Reduced multitasking",
          "None of the above"
        ].map(option => (
          <CheckboxItem
            key={option}
            value={option}
            checked={(formData.cognitive_support || []).includes(option)}
            onChange={() => handleCheckboxChange('cognitive_support', option)}
          >
            {option}
          </CheckboxItem>
        ))}
      </Section>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="text-gray-900 font-medium mb-2">Additional Information</div>
        <textarea 
          value={formData.additionalInfo || ''} 
          onChange={(e) => onFormChange('additionalInfo', e.target.value)} 
          rows="4" 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Please share any other specific accommodation needs..." 
        />
        <div className="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg p-3">
          This information is used only for job matching and accommodation purposes. Employers will only see relevant accommodation needs if you choose to share them.
        </div>
      </div>
    </div>
  );
};

export default AccessibilityNeedsModal;
