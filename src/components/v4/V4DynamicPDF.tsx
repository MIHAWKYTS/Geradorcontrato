import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { V4ProposalBlock } from '@/types/v4-blocks';
import { VisualIdentity } from '@/types/blocks';

// Estilos estáticos base
const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica', 
    backgroundColor: '#ffffff', 
    color: '#1a1a1a' 
  },
  cover: { 
    backgroundColor: '#1a1a1a', 
    padding: 60, 
    marginBottom: 40, 
    borderLeftWidth: 10, 
    borderLeftColor: '#ff0000',
    minHeight: 350,
    justifyContent: 'space-between'
  },
  coverCompanyInfo: {
    marginBottom: 80
  },
  coverCompany: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'black',
    letterSpacing: 2
  },
  coverSubtitle: {
    color: '#999999',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginTop: 4
  },
  coverRedBar: {
    width: 40,
    height: 3,
    backgroundColor: '#ff0000',
    marginTop: 15
  },
  coverTitle: { 
    color: '#ffffff', 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  coverClient: { 
    color: '#cccccc', 
    fontSize: 18 
  },
  text: { 
    fontSize: 12, 
    lineHeight: 1.6, 
    marginBottom: 15,
    color: '#333333'
  },
  delivHeader: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1a1a1a', 
    borderBottomWidth: 2, 
    borderBottomColor: '#ff0000', 
    marginBottom: 10, 
    paddingBottom: 5 
  },
  delivRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eeeeee' 
  },
  invBox: { 
    backgroundColor: '#f9f9f9', 
    padding: 20, 
    borderLeftWidth: 4, 
    borderLeftColor: '#ff0000', 
    marginVertical: 20 
  },
  invLabel: { 
    fontSize: 10, 
    color: '#666666', 
    textTransform: 'uppercase' 
  },
  invValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#ff0000', 
    marginVertical: 10 
  },
  sigSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 60 
  },
  sigBox: { 
    width: '40%', 
    borderTopWidth: 1, 
    borderTopColor: '#1a1a1a', 
    paddingTop: 8, 
    textAlign: 'center' 
  },
  sigName: { 
    fontSize: 10, 
    fontWeight: 'bold',
    color: '#1a1a1a'
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  galleryImage: {
    width: '48%',
    height: 150,
    objectFit: 'cover'
  }
});

export const V4DynamicPDF = ({ blocks, total, visualIdentity }: { blocks: V4ProposalBlock[], total: number, visualIdentity?: VisualIdentity | null }) => {
  const primaryColor = visualIdentity?.primaryColor || '#ff0000';
  const secondaryColor = visualIdentity?.secondaryColor || '#1a1a1a';
  
  return (
    <Document>
      <Page size="A4" style={[styles.page, { color: secondaryColor }]}>
        {blocks.map((b) => {
          switch(b.type) {
            case 'cover':
              const textColor = b.textColor || '#ffffff';
              const bgColor = b.bgColor || secondaryColor;
              const accentColor = b.accentColor || primaryColor;
              return (
                <View key={b.id} style={[styles.cover, { backgroundColor: bgColor, borderLeftColor: accentColor }]} wrap={false}>
                  <View style={styles.coverCompanyInfo}>
                    <Text style={[styles.coverCompany, { color: textColor }]}>{b.companyName || 'ROCKET'}</Text>
                    <Text style={[styles.coverSubtitle, { color: textColor, opacity: 0.6 }]}>{b.companySubtitle || 'EMPRESA JÚNIOR'}</Text>
                    <View style={[styles.coverRedBar, { backgroundColor: accentColor }]} />
                  </View>
                  <View>
                    <Text style={[styles.coverTitle, { color: textColor }]}>{b.title}</Text>
                    <Text style={[styles.coverClient, { color: textColor, opacity: 0.8 }]}>{b.clientName}</Text>
                    {b.date && <Text style={{ color: textColor, opacity: 0.5, fontSize: 12, marginTop: 40 }}>{b.date}</Text>}
                  </View>
                </View>
              );
            case 'text':
              return <Text key={b.id} style={styles.text}>{b.content}</Text>;
            case 'deliverables':
              return (
                <View key={b.id} style={{ marginBottom: 20 }} wrap={false}>
                  <Text style={[styles.delivHeader, { color: secondaryColor, borderBottomColor: primaryColor }]}>Entregáveis</Text>
                  {b.items.map(item => (
                    <View key={item.id} style={styles.delivRow}>
                      <Text style={{ fontSize: 12, width: '70%' }}>{item.name}</Text>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', width: '30%', textAlign: 'right' }}>
                        R$ {Number(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            case 'investment':
              return (
                <View key={b.id} style={[styles.invBox, { borderLeftColor: primaryColor }]} wrap={false}>
                  <Text style={styles.invLabel}>Investimento Total</Text>
                  <Text style={[styles.invValue, { color: primaryColor }]}>
                    R$ {Number(total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={{ fontSize: 10 }}>Condições: {b.paymentConditions}</Text>
                </View>
              );
            case 'gallery':
              return (
                <View key={b.id} style={styles.galleryContainer}>
                  {b.images.map((img, i) => img ? <Image key={i} src={img} style={styles.galleryImage} /> : null)}
                </View>
              );
            case 'signatures':
              return (
                <View key={b.id} style={styles.sigSection} wrap={false}>
                  <View style={[styles.sigBox, { borderTopColor: secondaryColor }]}>
                    <Text style={[styles.sigName, { color: secondaryColor }]}>{b.clientName}</Text>
                    <Text style={{ fontSize: 8, color: '#666', marginTop: 2 }}>Cliente</Text>
                  </View>
                  <View style={[styles.sigBox, { borderTopColor: secondaryColor }]}>
                    <Text style={[styles.sigName, { color: secondaryColor }]}>{b.rocketResponsible}</Text>
                    <Text style={{ fontSize: 8, color: '#666', marginTop: 2 }}>Responsável ROCKET</Text>
                  </View>
                </View>
              );
            case 'page-break': 
              return <View key={b.id} break />;
            default: 
              return null;
          }
        })}
      </Page>
    </Document>
  );
};
