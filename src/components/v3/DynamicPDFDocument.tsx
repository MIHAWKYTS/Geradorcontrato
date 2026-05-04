import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { ProposalBlock, VisualIdentity } from '@/types/blocks';

const createStyles = (identity: VisualIdentity) => StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: identity.fontFamily || 'Helvetica',
    backgroundColor: '#ffffff',
  },
  textBlock: {
    fontSize: 12,
    color: identity.secondaryColor,
    marginBottom: 12,
    lineHeight: 1.5,
  },
  imageBlock: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  tableBlock: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
  },
  tableHeader: {
    backgroundColor: identity.primaryColor,
    padding: 10,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tableHeaderTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    padding: 10,
    alignItems: 'center',
  },
  tableCellDescription: {
    flex: 1,
    fontSize: 11,
    color: '#374151',
  },
  tableCellValue: {
    width: 100,
    textAlign: 'right',
    fontSize: 11,
    color: '#111827',
    fontWeight: 'bold',
  },
  investmentBlock: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderLeftWidth: 4,
    borderLeftColor: identity.primaryColor,
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: identity.primaryColor,
    marginBottom: 8,
  },
  investmentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  investmentConditions: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.5,
  }
});

interface DynamicPDFDocumentProps {
  blocks: ProposalBlock[];
  identity: VisualIdentity;
  totalInvestment: number;
}

export const DynamicPDFDocument: React.FC<DynamicPDFDocumentProps> = ({ blocks, identity, totalInvestment }) => {
  const styles = createStyles(identity);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {blocks.map((block) => {
          switch (block.type) {
            case 'text':
              return (
                <Text 
                  key={block.id} 
                  style={[
                    styles.textBlock, 
                    { textAlign: (block.style?.alignment as any) || 'left' }
                  ]}
                >
                  {block.content}
                </Text>
              );

            case 'image':
              if (!block.url) return null;
              return (
                <Image 
                  key={block.id} 
                  src={block.url} 
                  style={[
                    styles.imageBlock, 
                    { width: block.width ? `${block.width}%` : '100%' }
                  ]} 
                />
              );

            case 'table':
              return (
                <View key={block.id} style={styles.tableBlock} wrap={false}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderTitle}>{block.title}</Text>
                  </View>
                  {block.rows.map((row, index) => (
                    <View 
                      key={row.id} 
                      style={[
                        styles.tableRow,
                        index === block.rows.length - 1 ? { borderBottomWidth: 0 } : {}
                      ]}
                    >
                      <Text style={styles.tableCellDescription}>{row.description}</Text>
                      <Text style={styles.tableCellValue}>
                        R$ {Number(row.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  ))}
                </View>
              );

            case 'investment':
              return (
                <View key={block.id} style={styles.investmentBlock} wrap={false}>
                  <Text style={styles.investmentTitle}>Investimento Total</Text>
                  <Text style={styles.investmentValue}>
                    R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                  {block.paymentConditions && (
                    <Text style={styles.investmentConditions}>
                      Condições: {block.paymentConditions}
                    </Text>
                  )}
                </View>
              );

            case 'page-break':
              // O @react-pdf/renderer usa a prop 'break' num View para forçar quebra
              return <View key={block.id} break />;

            default:
              return null;
          }
        })}
      </Page>
    </Document>
  );
};
