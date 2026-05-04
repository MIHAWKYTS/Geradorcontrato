import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ProposalFormData, ComputedValues } from "@/types/proposal";

// Fontes removidas para usar a fonte nativa Helvetica que não causa erro no react-pdf

const ROCKET_RED = "#FF0000";
const DARK = "#1A1A1A";
const GRAY = "#71717A";
const LIGHT_GRAY = "#F4F4F5";
const BORDER = "#E4E4E7";
const WHITE = "#FFFFFF";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    backgroundColor: WHITE,
    paddingTop: 0,
    paddingBottom: 40,
  },

  // ─── Cover / Header ───
  coverBand: {
    backgroundColor: DARK,
    paddingHorizontal: 40,
    paddingVertical: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  rocketLogoText: {
    fontSize: 22,
    fontWeight: 700,
    color: WHITE,
    letterSpacing: 4,
  },
  rocketSubtag: {
    fontSize: 7,
    color: "#A1A1AA",
    letterSpacing: 2,
    marginTop: 2,
  },
  redAccentBar: {
    width: 36,
    height: 3,
    backgroundColor: ROCKET_RED,
    marginTop: 6,
  },
  proposalMeta: {
    alignItems: "flex-end",
  },
  proposalMetaNum: {
    fontSize: 9,
    fontWeight: 600,
    color: WHITE,
  },
  proposalMetaDate: {
    fontSize: 8,
    color: "#A1A1AA",
    marginTop: 2,
  },
  proposalMetaValidity: {
    fontSize: 8,
    color: "#A1A1AA",
    marginTop: 1,
  },

  // Red separator line
  redLine: {
    height: 3,
    backgroundColor: ROCKET_RED,
  },

  // ─── Title Section ───
  titleSection: {
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  proposalTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: DARK,
    letterSpacing: -0.5,
  },
  proposalTitleAccent: {
    color: ROCKET_RED,
  },
  destinatarioLabel: {
    fontSize: 7,
    fontWeight: 600,
    color: GRAY,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 12,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 700,
    color: DARK,
  },
  clientSub: {
    fontSize: 8,
    color: GRAY,
    marginTop: 2,
  },

  // ─── Body ───
  body: {
    paddingHorizontal: 40,
  },

  // Section
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ROCKET_RED,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: GRAY,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionText: {
    fontSize: 9,
    color: DARK,
    lineHeight: 1.6,
  },

  // Objectives list
  objectiveRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    gap: 6,
  },
  objectiveBullet: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: ROCKET_RED,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0.5,
  },
  objectiveBulletText: {
    color: WHITE,
    fontSize: 6,
    fontWeight: 700,
  },
  objectiveText: {
    flex: 1,
    fontSize: 9,
    color: DARK,
    lineHeight: 1.5,
  },

  // Deliverables table
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: DARK,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: WHITE,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    backgroundColor: LIGHT_GRAY,
  },
  tableCell: {
    fontSize: 8,
    color: DARK,
    lineHeight: 1.4,
  },
  tableCellDesc: {
    fontSize: 7.5,
    color: GRAY,
    marginTop: 2,
    lineHeight: 1.4,
  },
  colNum: { width: "5%" },
  colTitle: { width: "50%" },
  colValue: { width: "20%", textAlign: "right" },
  colDesc: { width: "25%" },

  // Schedule table
  scheduleTable: {
    marginTop: 8,
  },
  scheduleHeader: {
    flexDirection: "row",
    backgroundColor: ROCKET_RED,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  scheduleHeaderCell: {
    fontSize: 7,
    fontWeight: 700,
    color: WHITE,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  scheduleRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  scheduleNum: { width: "8%" },
  schedulePhase: { width: "50%" },
  scheduleDuration: { width: "22%" },
  scheduleDate: { width: "20%" },

  // Investment box
  investmentBox: {
    backgroundColor: DARK,
    borderRadius: 8,
    padding: 18,
    marginTop: 8,
  },
  investmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  investmentLabel: {
    fontSize: 8,
    color: "#A1A1AA",
  },
  investmentValue: {
    fontSize: 8,
    color: WHITE,
    fontWeight: 600,
  },
  investmentDivider: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginVertical: 8,
  },
  investmentTotalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: WHITE,
  },
  investmentTotalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: ROCKET_RED,
  },
  investmentInstallments: {
    fontSize: 8,
    color: "#A1A1AA",
    marginTop: 4,
    textAlign: "right",
  },
  paymentNote: {
    fontSize: 7.5,
    color: "#A1A1AA",
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 6,
  },

  // ─── Signature ───
  signatureSection: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
  },
  signatureBox: {
    flex: 1,
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: DARK,
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 7.5,
    color: GRAY,
    textAlign: "center",
  },
  signatureName: {
    fontSize: 8,
    fontWeight: 600,
    color: DARK,
    textAlign: "center",
    marginTop: 2,
  },

  // ─── Footer ───
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerText: {
    fontSize: 7,
    color: GRAY,
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: 700,
    color: ROCKET_RED,
    letterSpacing: 2,
  },
  pageNumber: {
    fontSize: 7,
    color: GRAY,
  },
});

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Props {
  formData: ProposalFormData;
  computed: ComputedValues;
}

export default function ProposalDocument({ formData, computed }: Props) {
  const { client } = formData;

  return (
    <Document
      title={`Proposta ${formData.proposalNumber} — ${client.company || "Cliente"}`}
      author="ROCKET Empresa Júnior"
      subject="Proposta Comercial"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Cover Band ── */}
        <View style={styles.coverBand}>
          <View>
            <Text style={styles.rocketLogoText}>ROCKET</Text>
            <Text style={styles.rocketSubtag}>EMPRESA JÚNIOR</Text>
            <View style={styles.redAccentBar} />
          </View>
          <View style={styles.proposalMeta}>
            <Text style={styles.proposalMetaNum}>{formData.proposalNumber}</Text>
            <Text style={styles.proposalMetaDate}>{formData.proposalDate}</Text>
            {formData.validityDays > 0 && (
              <Text style={styles.proposalMetaValidity}>
                Válida por {formData.validityDays} dias
              </Text>
            )}
          </View>
        </View>
        <View style={styles.redLine} />

        {/* ── Title + Client ── */}
        <View style={styles.titleSection}>
          <Text style={styles.proposalTitle}>
            Proposta Comercial
            {client.company ? (
              <Text style={styles.proposalTitleAccent}> — {client.company}</Text>
            ) : null}
          </Text>

          {(client.name || client.company) && (
            <>
              <Text style={styles.destinatarioLabel}>Destinatário</Text>
              {client.name && (
                <Text style={styles.clientName}>{client.name}</Text>
              )}
              {client.company && (
                <Text style={styles.clientSub}>{client.company}</Text>
              )}
              {client.segment && (
                <Text style={styles.clientSub}>Segmento: {client.segment}</Text>
              )}
              {client.city && (
                <Text style={styles.clientSub}>{client.city}</Text>
              )}
              {client.email && (
                <Text style={styles.clientSub}>{client.email}</Text>
              )}
              {client.phone && (
                <Text style={styles.clientSub}>{client.phone}</Text>
              )}
            </>
          )}
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {/* Problem */}
          {formData.problem.trim() && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Problema Identificado</Text>
              </View>
              <Text style={styles.sectionText}>{formData.problem}</Text>
            </View>
          )}

          {/* Solution */}
          {formData.solution.trim() && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Solução Proposta</Text>
              </View>
              <Text style={styles.sectionText}>{formData.solution}</Text>
            </View>
          )}

          {/* Objectives */}
          {formData.objectives.some((o) => o.text.trim()) && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Objetivos do Projeto</Text>
              </View>
              {formData.objectives
                .filter((o) => o.text.trim())
                .map((o, i) => (
                  <View key={o.id} style={styles.objectiveRow}>
                    <View style={styles.objectiveBullet}>
                      <Text style={styles.objectiveBulletText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.objectiveText}>{o.text}</Text>
                  </View>
                ))}
            </View>
          )}

          {/* Deliverables Table */}
          {formData.deliverables.some((d) => d.title.trim()) && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Escopo de Entregáveis</Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.colNum]}>#</Text>
                  <Text style={[styles.tableHeaderCell, styles.colTitle]}>
                    Entregável
                  </Text>
                  <Text style={[styles.tableHeaderCell, styles.colDesc]}>
                    Descrição
                  </Text>
                  <Text style={[styles.tableHeaderCell, styles.colValue]}>
                    Valor
                  </Text>
                </View>
                {formData.deliverables
                  .filter((d) => d.title.trim())
                  .map((d, i) => (
                    <View
                      key={d.id}
                      style={[
                        styles.tableRow,
                        i % 2 === 1 ? styles.tableRowAlt : {},
                      ]}
                    >
                      <Text style={[styles.tableCell, styles.colNum]}>
                        {i + 1}
                      </Text>
                      <View style={styles.colTitle}>
                        <Text style={styles.tableCell}>{d.title}</Text>
                      </View>
                      <View style={styles.colDesc}>
                        {d.description ? (
                          <Text style={styles.tableCellDesc}>
                            {d.description}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.tableCell, styles.colValue, { fontWeight: 600 }]}>
                        {d.value > 0 ? formatBRL(d.value) : "-"}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {/* Schedule Table */}
          {formData.schedulePhases.some((p) => p.phase.trim()) && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Cronograma de Execução</Text>
              </View>
              <View style={styles.scheduleTable}>
                <View style={styles.scheduleHeader}>
                  <Text style={[styles.scheduleHeaderCell, styles.scheduleNum]}>#</Text>
                  <Text style={[styles.scheduleHeaderCell, styles.schedulePhase]}>Fase</Text>
                  <Text style={[styles.scheduleHeaderCell, styles.scheduleDuration]}>Duração</Text>
                  <Text style={[styles.scheduleHeaderCell, styles.scheduleDate]}>Início</Text>
                </View>
                {formData.schedulePhases
                  .filter((p) => p.phase.trim())
                  .map((p, i) => (
                    <View
                      key={p.id}
                      style={[
                        styles.scheduleRow,
                        i % 2 === 1 ? styles.tableRowAlt : {},
                      ]}
                    >
                      <Text style={[styles.tableCell, styles.scheduleNum]}>{i + 1}</Text>
                      <Text style={[styles.tableCell, styles.schedulePhase]}>{p.phase}</Text>
                      <Text style={[styles.tableCell, styles.scheduleDuration]}>{p.duration}</Text>
                      <Text style={[styles.tableCell, styles.scheduleDate]}>
                        {p.startDate
                          ? new Date(p.startDate + "T00:00:00").toLocaleDateString("pt-BR")
                          : "-"}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {/* Investment */}
          {computed.total > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Investimento</Text>
              </View>
              <View style={styles.investmentBox}>
                <View style={styles.investmentRow}>
                  <Text style={styles.investmentLabel}>Subtotal</Text>
                  <Text style={styles.investmentValue}>{formatBRL(computed.subtotal)}</Text>
                </View>
                {computed.discountValue > 0 && (
                  <View style={styles.investmentRow}>
                    <Text style={[styles.investmentLabel, { color: "#FCA5A5" }]}>
                      Desconto ({formData.discount}%)
                    </Text>
                    <Text style={[styles.investmentValue, { color: "#FCA5A5" }]}>
                      - {formatBRL(computed.discountValue)}
                    </Text>
                  </View>
                )}
                <View style={styles.investmentDivider} />
                <View style={styles.investmentRow}>
                  <Text style={styles.investmentTotalLabel}>Total</Text>
                  <Text style={styles.investmentTotalValue}>{formatBRL(computed.total)}</Text>
                </View>
                {formData.installments > 1 && (
                  <Text style={styles.investmentInstallments}>
                    {formData.installments}x de {formatBRL(computed.installmentValue)}
                  </Text>
                )}
                {formData.paymentMethod && (
                  <Text style={styles.paymentNote}>
                    Forma de pagamento: {formData.paymentMethod}
                  </Text>
                )}
                {formData.paymentObservations && (
                  <Text style={[styles.paymentNote, { marginTop: 2, borderTopWidth: 0 }]}>
                    {formData.paymentObservations}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Signature */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Assinatura do Cliente</Text>
              {client.name && (
                <Text style={styles.signatureName}>{client.name}</Text>
              )}
            </View>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Responsável ROCKET</Text>
              {formData.rocketResponsible && (
                <Text style={styles.signatureName}>{formData.rocketResponsible}</Text>
              )}
            </View>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              Este documento é confidencial e de uso exclusivo do destinatário.
            </Text>
            <Text style={styles.footerBrand}>ROCKET</Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
