import { NextRequest, NextResponse } from "next/server";
import { createRequire } from "module";
import logger from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

const require = createRequire(import.meta.url);

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const PDF_PARSE_TIMEOUT = 15000; // 15 seconds

function textToBlocks(rawText: string, fileName: string) {
  const blocks: any[] = [];

  blocks.push({
    id: crypto.randomUUID(),
    type: "cover",
    companyName: "ROCKET",
    companySubtitle: "PROPOSTA EXTRAÍDA",
    title: fileName.replace(/\.pdf$/i, "").toUpperCase(),
    clientName: "[Nome do Cliente]",
    date: new Date().toLocaleDateString("pt-BR"),
    bgColor: "#1a1a1a",
    accentColor: "#ff0000",
    textColor: "#ffffff",
  });

  const paragraphs = rawText
    .split(/\n{2,}/)
    .map((p) => p.replace(/[ \t]+/g, " ").replace(/\n/g, " ").trim())
    .filter((p) => p.length > 3);

  for (const p of paragraphs) {
    const lp = p.toLowerCase();

    if (lp.includes("assinatura") || lp.includes("assinado") || lp.includes("contratante") || lp.includes("contratada")) {
      blocks.push({
        id: crypto.randomUUID(),
        type: "signatures",
        clientName: "[Nome do Cliente]",
        rocketResponsible: "Diretor ROCKET",
      });
      continue;
    }

    if ((lp.includes("r$") || lp.includes("investimento") || lp.includes("valor total")) && p.length < 300) {
      blocks.push({
        id: crypto.randomUUID(),
        type: "investment",
        installments: 1,
        paymentConditions: p,
      });
      continue;
    }

    const words = p.split(" ");
    const isTitle = p === p.toUpperCase() && p.length >= 3 && p.length < 100 && words.length <= 12;

    if (isTitle) {
      blocks.push({
        id: crypto.randomUUID(),
        type: "text",
        content: `### ${p}`,
      });
      continue;
    }

    blocks.push({
      id: crypto.randomUUID(),
      type: "text",
      content: p,
    });
  }

  return blocks;
}

async function parsePdfWithTimeout(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timeout no processamento do PDF"));
    }, PDF_PARSE_TIMEOUT);

    try {
      // Polyfill DOMMatrix for pdfjs-dist used by pdf-parse
      if (typeof (globalThis as any).DOMMatrix === "undefined") {
        (globalThis as any).DOMMatrix = class DOMMatrix {
          constructor() {}
          static fromFloat64Array() { return new (globalThis as any).DOMMatrix(); }
          static fromFloat32Array() { return new (globalThis as any).DOMMatrix(); }
          static fromMatrix() { return new (globalThis as any).DOMMatrix(); }
          multiply() { return this; } translate() { return this; } scale() { return this; } rotate() { return this; } inverse() { return this; }
        };
      }

      const pdfParse = require("pdf-parse");
      pdfParse(buffer)
        .then((result: any) => {
          clearTimeout(timeout);
          resolve(result.text);
        })
        .catch((err: any) => {
          clearTimeout(timeout);
          reject(err);
        });
    } catch (err) {
      clearTimeout(timeout);
      reject(err);
    }
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(ip)) {
    logger.warn({ ip }, "Rate limit exceeded");
    return NextResponse.json({ error: "Muitas requisições. Tente novamente em 1 minuto." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (file.name.toLowerCase().endsWith(".json")) {
      const text = await file.text();
      try {
        const jsonData = JSON.parse(text);
        // Se for um arquivo JSON exportado pelo sistema, ele terá a estrutura de blocos
        return NextResponse.json({
          type: "json",
          name: file.name.replace(/\.json$/i, ""),
          blocks: jsonData.blocks || jsonData, // Suporta tanto o objeto completo quanto apenas o array de blocos
          visualIdentity: jsonData.visualIdentity || null
        });
      } catch (e) {
        return NextResponse.json({ error: "Arquivo JSON inválido." }, { status: 400 });
      }
    }

    if (!file.name.toLowerCase().endsWith(".pdf") || (file.type !== "application/pdf" && file.type !== "")) {
      logger.info({ fileName: file.name, fileType: file.type }, "Invalid file type attempt");
      return NextResponse.json({ error: "Apenas arquivos PDF ou JSON são permitidos." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Arquivo muito grande (máx 20MB)." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let rawText = "";
    try {
      rawText = await parsePdfWithTimeout(buffer);
    } catch (pdfErr: any) {
      // Diagnóstico: Verificar se o arquivo começa com HTML (indicando erro de proxy ou arquivo falso)
      const fileSignature = buffer.slice(0, 50).toString("utf8");
      logger.error({ 
        error: pdfErr.message, 
        fileName: file.name,
        fileSignature: fileSignature.substring(0, 100),
        isHtml: fileSignature.toLowerCase().includes("<!doctype html") || fileSignature.toLowerCase().includes("<html")
      }, "PDF parse error");

      const status = pdfErr.message.includes("Timeout") ? 504 : 422;
      return NextResponse.json({ 
        error: fileSignature.toLowerCase().includes("<html") 
          ? "O servidor recebeu um arquivo HTML em vez de PDF. Isso geralmente indica um erro de rede ou limite de tamanho no servidor."
          : (pdfErr.message || "Erro ao processar PDF.")
      }, { status });
    }

    if (!rawText.trim()) {
      return NextResponse.json({ error: "PDF sem texto extraível." }, { status: 422 });
    }

    const blocks = textToBlocks(rawText, file.name);

    logger.info({ fileName: file.name, blocksCount: blocks.length }, "PDF processed successfully");

    return NextResponse.json({
      type: "pdf",
      name: file.name.replace(/\.pdf$/i, ""),
      blocks,
    });
  } catch (err: any) {
    logger.error({ error: err.message, stack: err.stack }, "Internal API Error in upload-template");
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
