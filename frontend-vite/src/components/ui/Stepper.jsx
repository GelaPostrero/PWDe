import React from 'react';

const Stepper = ({ steps, currentKey, onStepClick, validationStates = {} }) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      {steps.map((step, index) => {
        const isActive = step.key === currentKey;
        const isCompleted = steps.findIndex(s => s.key === currentKey) > index;
        const hasError = validationStates[step.key] === 'error';
        const isValid = validationStates[step.key] === 'valid';
        
        let baseCircle, circleContent, labelClass;
        
        if (hasError) {
          baseCircle = 'bg-red-500 text-white';
          circleContent = '!';
          labelClass = 'text-red-600';
        } else if (isActive) {
          baseCircle = 'bg-blue-600 text-white';
          circleContent = index + 1;
          labelClass = 'text-blue-600';
        } else if (isCompleted || isValid) {
          baseCircle = 'bg-emerald-500 text-white';
          circleContent = '✓';
          labelClass = 'text-emerald-600';
        } else {
          baseCircle = 'bg-gray-200 text-gray-600';
          circleContent = index + 1;
          labelClass = 'text-gray-500';
        }
        
        const clickable = true; // allow clicking any step; parent decides navigation rules

        return (
          <React.Fragment key={step.key}>
            <button
              type="button"
              onClick={() => clickable && onStepClick && onStepClick(step.key)}
              className="flex items-center gap-2 focus:outline-none hover:opacity-90 transition-opacity"
              aria-current={isActive ? 'step' : undefined}
              title={hasError ? 'This step has validation errors' : isValid ? 'This step is completed' : ''}
            >
              <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${baseCircle} transition-colors`}>
                {circleContent}
              </div>
              <span className={`text-sm font-medium -mt-px ${labelClass} transition-colors`}>
                {step.label}
              </span>
            </button>
            {index !== steps.length - 1 && (
              <div className={`h-px w-10 transition-colors ${
                isCompleted || isValid ? 'bg-emerald-300' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;


