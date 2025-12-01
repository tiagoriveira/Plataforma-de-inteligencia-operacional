import { drizzle } from "drizzle-orm/mysql2";
import { assets, events } from "../drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const initialAssets = [
  {
    id: "TOR-001",
    name: "TORNO CNC-01",
    type: "MÁQUINA",
    location: "SETOR A",
    status: "OPERACIONAL",
    manufacturer: "Romi S.A.",
    model: "Centur 30D",
    serialNumber: "RM-99887766",
    year: 2022,
    warranty: "ATÉ DEZ/2025",
  },
  {
    id: "PRE-020",
    name: "PRENSA HIDRÁULICA H-20",
    type: "MÁQUINA",
    location: "SETOR B",
    status: "MANUTENÇÃO",
    manufacturer: "Schuler",
    model: "HPM-200",
    serialNumber: "SCH-445566",
    year: 2020,
  },
  {
    id: "COR-005",
    name: "CORTADORA LASER L-05",
    type: "MÁQUINA",
    location: "SETOR A",
    status: "CRÍTICO",
    manufacturer: "Trumpf",
    model: "TruLaser 3030",
    serialNumber: "TRU-778899",
    year: 2021,
  },
  {
    id: "EMP-003",
    name: "EMPILHADEIRA E-03",
    type: "VEÍCULO",
    location: "LOGÍSTICA",
    status: "OPERACIONAL",
    manufacturer: "Yale",
    model: "ERP040VT",
    serialNumber: "YLE-112233",
    year: 2023,
  },
  {
    id: "FUR-012",
    name: "FURADEIRA DE BANCADA",
    type: "FERRAMENTA",
    location: "OFICINA",
    status: "OPERACIONAL",
    manufacturer: "Bosch",
    model: "GBM 23-2 E",
    serialNumber: "BSH-334455",
    year: 2019,
  },
  {
    id: "SOL-008",
    name: "MÁQUINA DE SOLDA MIG",
    type: "MÁQUINA",
    location: "OFICINA",
    status: "OPERACIONAL",
    manufacturer: "ESAB",
    model: "Rebel EMP 215ic",
    serialNumber: "ESB-556677",
    year: 2022,
  },
];

const initialEvents = [
  {
    assetId: "TOR-001",
    type: "CHECKIN",
    operator: "Op. Silva",
    observation: "Início de turno. Verificação visual OK. Nível de óleo OK.",
    timestamp: new Date("2025-12-01T10:42:00"),
  },
  {
    assetId: "TOR-001",
    type: "CHECKOUT",
    operator: "Op. Silva",
    observation: "Fim de turno. Limpeza realizada.",
    timestamp: new Date("2025-11-30T16:30:00"),
  },
  {
    assetId: "TOR-001",
    type: "MAINTENANCE",
    operator: "Téc. Santos",
    observation: "Troca de filtros de óleo e ajuste de correias. Próxima revisão em 30 dias.",
    timestamp: new Date("2025-11-26T09:15:00"),
  },
  {
    assetId: "PRE-020",
    type: "MAINTENANCE",
    operator: "Téc. Santos",
    observation: "Troca de óleo hidráulico iniciada",
    timestamp: new Date("2025-11-28T09:15:30"),
  },
  {
    assetId: "COR-005",
    type: "ISSUE",
    operator: "Op. Costa",
    observation: "Falha de sensor detectada automaticamente",
    timestamp: new Date("2025-11-28T08:30:00"),
  },
  {
    assetId: "EMP-003",
    type: "CHECKOUT",
    operator: "Op. Costa",
    observation: "Fim de turno",
    timestamp: new Date("2025-11-27T14:00:00"),
  },
];

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Inserir ativos
    console.log("📦 Inserindo ativos...");
    for (const asset of initialAssets) {
      await db.insert(assets).values(asset).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
      console.log(`  ✓ ${asset.id} - ${asset.name}`);
    }

    // Inserir eventos
    console.log("📝 Inserindo eventos...");
    for (const event of initialEvents) {
      await db.insert(events).values(event);
      console.log(`  ✓ ${event.type} - ${event.assetId} (${event.operator})`);
    }

    console.log("✅ Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
