import React, { useState, useContext, createContext, FunctionComponent } from "react";
import { FormEntry, FormData, Ownership, FormTemplate } from "../../../types";
import { useConfigContext } from "../config";

interface FormsContext {
  activeFormIndex?: number;
  forms: FormEntry[];
  currentForm?: FormEntry;
  currentFormData?: FormData;
  currentFormOwnership?: Ownership;
  currentFormTemplate?: FormTemplate;
  setActiveFormIndex: (index?: number) => void;
  setForms: (forms: FormEntry[]) => void;
  newForm: (templateIndex: number) => void;
  setCurrentFormData: (formData: FormData) => void;
  setCurrentFormOwnership: (ownership: Ownership) => void;
}

export const FormsContext = createContext<FormsContext>({
  forms: [],
  setActiveFormIndex: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setForms: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  newForm: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setCurrentFormData: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setCurrentFormOwnership: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useFormsContext = (): FormsContext => useContext<FormsContext>(FormsContext);

export const FormsContextProvider: FunctionComponent = ({ children }) => {
  const [activeFormIndex, setActiveFormIndex] = useState<number | undefined>(undefined);
  const [forms, setForms] = useState<FormEntry[]>([]);
  const { config } = useConfigContext();

  const currentForm = typeof activeFormIndex === "number" ? forms[activeFormIndex] : undefined;
  const currentFormData = currentForm?.data;
  const currentFormOwnership = currentForm?.ownership;
  const currentFormTemplate = currentForm ? config?.forms[currentForm?.templateIndex] : undefined;

  const newForm = (templateIndex: number): void => {
    const newIndex = forms.length;
    const newFormTemplate = config?.forms[templateIndex];

    setForms([
      ...forms,
      {
        templateIndex,
        data: {
          formData: newFormTemplate?.defaults || {},
          schema: newFormTemplate?.schema,
        },
        fileName: `Document-${forms.length + 1}.tt`,
        ownership: { beneficiaryAddress: "", holderAddress: "" },
      },
    ]);
    setActiveFormIndex(newIndex);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setCurrentFormData = (data: any): void => {
    if (activeFormIndex === undefined)
      throw new Error("Trying to set form when there is no activeFormIndex");
    const nextForms = [...forms];
    const currentForm = forms[activeFormIndex];
    nextForms.splice(activeFormIndex, 1, { ...currentForm, data });
    setForms(nextForms);
  };

  const setCurrentFormOwnership = ({ beneficiaryAddress, holderAddress }: Ownership): void => {
    if (activeFormIndex === undefined)
      throw new Error("Trying to set form when there is no activeFormIndex");
    const nextForms = [...forms];
    const currentForm = forms[activeFormIndex];
    nextForms.splice(activeFormIndex, 1, {
      ...currentForm,
      ownership: { beneficiaryAddress, holderAddress },
    });
    setForms(nextForms);
  };

  return (
    <FormsContext.Provider
      value={{
        activeFormIndex,
        forms,
        currentForm,
        currentFormData,
        currentFormOwnership,
        currentFormTemplate,
        setCurrentFormData,
        setCurrentFormOwnership,
        newForm,
        setActiveFormIndex,
        setForms,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};
