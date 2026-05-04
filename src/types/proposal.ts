// ============================
// Tipos da Proposta ROCKET
// ============================

export interface ClientData {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  segment: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  value: number;
}

export interface Objective {
  id: string;
  text: string;
}

export interface SchedulePhase {
  id: string;
  phase: string;
  duration: string;
  startDate: string;
}

export interface InvestmentData {
  totalValue: number;
  installments: number;
  discount: number;
  paymentMethod: string;
  observations: string;
}

export interface ProposalFormData {
  // Dados do cliente
  client: ClientData;

  // Conteúdo da proposta
  problem: string;
  solution: string;
  objectives: Objective[];
  deliverables: Deliverable[];
  schedulePhases: SchedulePhase[];

  // Investimento
  installments: number;
  discount: number;
  paymentMethod: string;
  paymentObservations: string;

  // Metadados
  proposalNumber: string;
  proposalDate: string;
  validityDays: number;
  rocketResponsible: string;
}

export interface ComputedValues {
  subtotal: number;
  discountValue: number;
  total: number;
  installmentValue: number;
}
