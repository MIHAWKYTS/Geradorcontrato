export type BlockType = 'text' | 'image' | 'table' | 'page-break' | 'investment';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
  style?: {
    fontSize?: number;
    color?: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string; // Base64 ou URL pública
  width?: number; // percentual ou px
  height?: number;
  alignment?: 'left' | 'center' | 'right';
}

export interface TableRow {
  id: string;
  description: string;
  value: number; // Numérico para permitir o somatório no bloco de Investimento
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  title: string;
  rows: TableRow[];
}

export interface PageBreakBlock extends BaseBlock {
  type: 'page-break';
}

export interface InvestmentBlock extends BaseBlock {
  type: 'investment';
  installments: number;
  discount: number;
  paymentMethod: string;
  paymentConditions: string;
  // Os valores totais serão derivados dos blocos de tabela
}

// União discriminada de todos os blocos possíveis
export type ProposalBlock = 
  | TextBlock 
  | ImageBlock 
  | TableBlock 
  | PageBreakBlock 
  | InvestmentBlock;

// Configuração visual da proposta (flexível para múltiplos projetos da ROCKET)
export interface VisualIdentity {
  primaryColor: string; // Ex: #ff0000
  secondaryColor: string; // Ex: #333333
  fontFamily: string; // Ex: Helvetica
}

export type TemplateCategory = 'Vendas' | 'RH' | 'Projetos' | 'Geral';

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnailUrl?: string; // URL para a miniatura
  visualIdentity: VisualIdentity;
  defaultBlocks: ProposalBlock[];
  createdAt: string;
}
