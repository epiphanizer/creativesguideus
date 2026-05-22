type GuidedIntakeProgressStep = {
  key: string;
  label: string;
  title: string;
};

type GuidedIntakeStepHeaderProps = {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  trustNote: string;
  helper: string;
};

type GuidedIntakeChoiceOption = {
  value: string;
  label: string;
  description: string;
};

type GuidedIntakeChoiceGridProps = {
  options: GuidedIntakeChoiceOption[];
  value?: string;
  values?: string[];
  onSelect: (value: string) => void;
};

export function GuidedIntakeProgress({ steps, currentStep }: { steps: GuidedIntakeProgressStep[]; currentStep: number }) {
  return (
    <ol className="cg-contact__progress" aria-label="Guided intake steps">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <li
            key={step.key}
            className={`cg-contact__progress-step${isActive ? " cg-contact__progress-step--active" : ""}${isComplete ? " cg-contact__progress-step--complete" : ""}`}
            aria-current={isActive ? "step" : undefined}
          >
            <span className="cg-contact__progress-index">{index + 1}</span>
            <span className="cg-contact__progress-copy">
              <strong>{step.label}</strong>
              <small>{step.title}</small>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function GuidedIntakeStepHeader({ currentStep, totalSteps, title, description, trustNote, helper }: GuidedIntakeStepHeaderProps) {
  return (
    <div className="cg-contact__step-copy">
      <span className="cg-contact__step-count">
        Step {currentStep + 1} of {totalSteps}
      </span>
      <h3 className="cg-contact__step-title">{title}</h3>
      <p className="cg-contact__step-description">{description}</p>
      <p className="cg-contact__trust-note">{trustNote}</p>
      <p className="cg-contact__step-helper">{helper}</p>
    </div>
  );
}

export function GuidedIntakeChoiceGrid({ options, value, values, onSelect }: GuidedIntakeChoiceGridProps) {
  const multiSelect = Array.isArray(values);

  return (
    <div className="cg-contact__choice-grid">
      {options.map((option) => {
        const isActive = multiSelect ? values.includes(option.value) : value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={`cg-contact__choice${isActive ? " cg-contact__choice--active" : ""}`}
            onClick={() => onSelect(option.value)}
            aria-pressed={isActive}
          >
            <span className="cg-contact__choice-label">{option.label}</span>
            <span className="cg-contact__choice-description">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}