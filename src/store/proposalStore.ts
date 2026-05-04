import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProposalFormData, ComputedValues } from "@/types/proposal";

const genId = () => Math.random().toString(36).substring(2, 10);

const defaultFormData: ProposalFormData = {
  client: {
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    segment: "",
  },
  problem: "",
  solution: "",
  objectives: [{ id: genId(), text: "" }],
  deliverables: [
    { id: genId(), title: "", description: "", value: 0 },
  ],
  schedulePhases: [
    { id: genId(), phase: "", duration: "", startDate: "" },
  ],
  installments: 2,
  discount: 0,
  paymentMethod: "Transferência bancária (PIX/TED)",
  paymentObservations: "",
  proposalNumber: "",
  proposalDate: "",
  validityDays: 7,
  rocketResponsible: "",
};

interface ProposalStore {
  formData: ProposalFormData;
  computed: ComputedValues;
  activeSection: string;
  setFormData: (data: Partial<ProposalFormData>) => void;
  updateField: <K extends keyof ProposalFormData>(
    field: K,
    value: ProposalFormData[K]
  ) => void;
  setActiveSection: (section: string) => void;
  resetForm: () => void;
}

function computeValues(data: ProposalFormData): ComputedValues {
  const subtotal = data.deliverables.reduce(
    (sum, d) => sum + (Number(d.value) || 0),
    0
  );
  const discountValue = (subtotal * (data.discount || 0)) / 100;
  const total = subtotal - discountValue;
  const installmentValue =
    data.installments > 0 ? total / data.installments : total;

  return { subtotal, discountValue, total, installmentValue };
}

export const useProposalStore = create<ProposalStore>()(
  persist(
    (set, get) => ({
      formData: defaultFormData,
      computed: computeValues(defaultFormData),
      activeSection: "client",

      setFormData: (data) => {
        const newData = { ...get().formData, ...data };
        set({ formData: newData, computed: computeValues(newData) });
      },

      updateField: (field, value) => {
        const newData = { ...get().formData, [field]: value };
        set({ formData: newData, computed: computeValues(newData) });
      },

      setActiveSection: (section) => set({ activeSection: section }),

      resetForm: () =>
        set({
          formData: defaultFormData,
          computed: computeValues(defaultFormData),
        }),
    }),
    {
      name: "rocket-proposal-storage",
      storage: createJSONStorage(() => localStorage),
      // Prevent computing values before hydration if needed, but Zustand handles it well
    }
  )
);
