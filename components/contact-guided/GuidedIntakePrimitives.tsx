import type { ReactNode } from "react";

type GuidedIntakeProgressStep = {
  key: string;
  label: string;
  title: string;
};

type GuidedIntakeStepHeaderProps = {
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

type GuidedIntakeFieldRowProps = {
  children: ReactNode;
};

type GuidedIntakeFieldProps = {
  label: string;
  htmlFor: string;
  fullWidth?: boolean;
  children: ReactNode;
};

type GuidedIntakeStatusMessageProps = {
  tone: "success" | "error";
  message: string;
  role: "status" | "alert";
};

type GuidedIntakeFooterProps = {
  secondaryAction?: ReactNode;
  primaryAction: ReactNode;
  privacyText: string;
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

export function GuidedIntakeStepHeader({ title, description, trustNote, helper }: GuidedIntakeStepHeaderProps) {
  return (
    <div className="cg-contact__step-copy">
      <h3 className="cg-contact__step-title">{title}</h3>
      {description ? <p className="cg-contact__step-description">{description}</p> : null}
      {trustNote ? <p className="cg-contact__trust-note">{trustNote}</p> : null}
      {helper ? <p className="cg-contact__step-helper">{helper}</p> : null}
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

export function GuidedIntakeFieldRow({ children }: GuidedIntakeFieldRowProps) {
  return <div className="cg-contact__field-row">{children}</div>;
}

export function GuidedIntakeField({ label, htmlFor, fullWidth = false, children }: GuidedIntakeFieldProps) {
  return (
    <div className={`cg-contact__field${fullWidth ? " cg-contact__field--full" : ""}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

export function GuidedIntakeStatusMessage({ tone, message, role }: GuidedIntakeStatusMessageProps) {
  return (
    <p className={`cg-contact__form-status cg-contact__form-status--${tone}`} role={role}>
      {message}
    </p>
  );
}

export function GuidedIntakeFooter({ secondaryAction, primaryAction, privacyText }: GuidedIntakeFooterProps) {
  return (
    <div className="cg-contact__footer">
      <div className="cg-contact__footer-actions">
        {secondaryAction}
        {primaryAction}
      </div>
      <span className="cg-contact__privacy">{privacyText}</span>
    </div>
  );
}