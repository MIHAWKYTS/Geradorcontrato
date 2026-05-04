export type V4BlockType = 'cover' | 'text' | 'deliverables' | 'investment' | 'gallery' | 'signatures' | 'page-break';

export interface BaseBlock {
  id: string;
  type: V4BlockType;
}

export interface CoverBlock extends BaseBlock {
  type: 'cover';
  companyName: string;
  companySubtitle: string;
  title: string;
  clientName: string;
  date: string;
  bgColor?: string;
  accentColor?: string;
  textColor?: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface DeliverablesBlock extends BaseBlock {
  type: 'deliverables';
  items: { id: string; name: string; desc: string; value: number }[];
}

export interface InvestmentBlock extends BaseBlock {
  type: 'investment';
  installments: number;
  paymentConditions: string;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: string[]; // URLs das imagens
}

export interface SignaturesBlock extends BaseBlock {
  type: 'signatures';
  clientName: string;
  rocketResponsible: string;
}

export interface PageBreakBlock extends BaseBlock {
  type: 'page-break';
}

export type V4ProposalBlock = 
  | CoverBlock 
  | TextBlock 
  | DeliverablesBlock 
  | InvestmentBlock 
  | GalleryBlock 
  | SignaturesBlock
  | PageBreakBlock;
