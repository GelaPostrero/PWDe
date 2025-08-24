import React from 'react';

const Stepper = ({ steps, currentKey, onStepClick }) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      {steps.map((step, index) => {
        const isActive = step.key === currentKey;
        const isCompleted = steps.findIndex(s => s.key === currentKey) > index;
        const baseCircle = isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600';
        const circleContent = isCompleted ? '✓' : index + 1;
        const labelClass = isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500';
        const clickable = true; // allow clicking any step; parent decides navigation rules

        return (
          <React.Fragment key={step.key}>
            <button
  type="button"
  onClick={() => clickable && onStepClick && onStepClick(step.key)}
  className="flex items-center gap-2 focus:outline-none hover:opacity-90"
  aria-current={isActive ? 'step' : undefined}
>
  <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${baseCircle}`}>{circleContent}</div>
  <span className={`text-sm font-medium -mt-px ${labelClass}`}>{step.label}</span>
</button>
            {index !== steps.length - 1 && <div className="h-px w-10 bg-gray-200" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;


