import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omrodclevaidlijnnqeq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcm9kY2xldmFpZGxpam5ucWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjUwNjUsImV4cCI6MjA4MDIwMTA2NX0.J_Xwh_0aju6-bxGGAk7PxkfIs_5Vr4_01EVFECcpOpE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const assets = [
  { code: "TOR-001", name: "Torno CNC-01", category: "Usinagem", location: "Setor A - Linha 1", manufacturer: "ROMI", model: "Centur 30D", year: 2019, serial_number: "SN-TOR-2019-001", instructions: "1. Verificar nível de óleo hidráulico\n2. Inspecionar proteções de segurança\n3. Testar botão de emergência\n4. Limpar cavacos acumulados\n5. Registrar leituras de temperatura", maintenance_interval_days: 30 },
  { code: "PRE-001", name: "Prensa Hidráulica H-20", category: "Conformação", location: "Setor B - Linha 2", manufacturer: "SCHULER", model: "HPM-200", year: 2020, serial_number: "SN-PRE-2020-001", instructions: "1. Verificar pressão hidráulica (180-200 bar)\n2. Inspecionar mangueiras e conexões\n3. Testar válvulas de segurança\n4. Verificar alinhamento da matriz\n5. Lubrificar guias lineares", maintenance_interval_days: 15 },
  { code: "COR-001", name: "Cortadora a Laser L-01", category: "Corte", location: "Setor C - Linha 3", manufacturer: "TRUMPF", model: "TruLaser 3030", year: 2021, serial_number: "SN-COR-2021-001", instructions: "1. Verificar alinhamento do feixe laser\n2. Inspecionar lentes e espelhos\n3. Verificar sistema de refrigeração\n4. Limpar mesa de corte\n5. Calibrar sensores de altura", maintenance_interval_days: 7 },
  { code: "SOL-001", name: "Soldadora Robotizada S-01", category: "Soldagem", location: "Setor D - Linha 4", manufacturer: "ABB", model: "IRB 1600", year: 2022, serial_number: "SN-SOL-2022-001", instructions: "1. Verificar bico de contato\n2. Inspecionar cabo de soldagem\n3. Testar sistema de alimentação de arame\n4. Verificar fluxo de gás de proteção\n5. Calibrar tocha de soldagem", maintenance_interval_days: 10 },
  { code: "EMP-001", name: "Empilhadeira Elétrica E-01", category: "Movimentação", location: "Almoxarifado", manufacturer: "YALE", model: "ERP030VT", year: 2018, serial_number: "SN-EMP-2018-001", instructions: "1. Verificar carga da bateria\n2. Inspecionar garfos e correntes\n3. Testar freios e direção\n4. Verificar pneus e rodas\n5. Testar buzina e sinalizadores", maintenance_interval_days: 30 },
  { code: "FRE-001", name: "Fresadora CNC F-01", category: "Usinagem", location: "Setor A - Linha 1", manufacturer: "HAAS", model: "VF-2SS", year: 2020, serial_number: "SN-FRE-2020-001", instructions: "1. Verificar nível de fluido de corte\n2. Inspecionar ferramentas e porta-ferramentas\n3. Verificar sistema de refrigeração\n4. Limpar mesa e guias\n5. Calibrar eixos X, Y, Z", maintenance_interval_days: 20 },
  { code: "RET-001", name: "Retificadora Cilíndrica R-01", category: "Acabamento", location: "Setor A - Linha 2", manufacturer: "STUDER", model: "S31", year: 2019, serial_number: "SN-RET-2019-001", maintenance_interval_days: 25 },
  { code: "FUR-001", name: "Forno Industrial F-01", category: "Tratamento Térmico", location: "Setor E", manufacturer: "BRASIMET", model: "FI-500", year: 2017, serial_number: "SN-FUR-2017-001", maintenance_interval_days: 60 },
  { code: "COM-001", name: "Compressor de Ar C-01", category: "Utilidades", location: "Casa de Máquinas", manufacturer: "ATLAS COPCO", model: "GA 55", year: 2016, serial_number: "SN-COM-2016-001", maintenance_interval_days: 90 },
  { code: "PON-001", name: "Ponte Rolante 10T", category: "Movimentação", location: "Setor B", manufacturer: "MUNCK", model: "PR-10000", year: 2015, serial_number: "SN-PON-2015-001", maintenance_interval_days: 180 },
  { code: "TOR-002", name: "Torno CNC-02", category: "Usinagem", location: "Setor A - Linha 1", manufacturer: "ROMI", model: "Centur 30D", year: 2020, serial_number: "SN-TOR-2020-002", maintenance_interval_days: 30 },
  { code: "PRE-002", name: "Prensa Excêntrica E-15", category: "Conformação", location: "Setor B - Linha 1", manufacturer: "SCHULER", model: "EPM-150", year: 2018, serial_number: "SN-PRE-2018-002", maintenance_interval_days: 15 },
  { code: "COR-002", name: "Cortadora Plasma P-01", category: "Corte", location: "Setor C - Linha 1", manufacturer: "HYPERTHERM", model: "HPR400XD", year: 2019, serial_number: "SN-COR-2019-002", maintenance_interval_days: 14 },
  { code: "SOL-002", name: "Soldadora MIG M-01", category: "Soldagem", location: "Setor D - Linha 2", manufacturer: "ESAB", model: "Warrior 500i", year: 2021, serial_number: "SN-SOL-2021-002", maintenance_interval_days: 10 },
  { code: "EMP-002", name: "Empilhadeira a Gás E-02", category: "Movimentação", location: "Expedição", manufacturer: "TOYOTA", model: "8FG25", year: 2019, serial_number: "SN-EMP-2019-002", maintenance_interval_days: 30 },
  { code: "FRE-002", name: "Fresadora Universal F-02", category: "Usinagem", location: "Setor A - Linha 2", manufacturer: "BRIDGEPORT", model: "Series I", year: 2010, serial_number: "SN-FRE-2010-002", maintenance_interval_days: 20 },
  { code: "RET-002", name: "Retificadora Plana R-02", category: "Acabamento", location: "Setor A - Linha 3", manufacturer: "JUNG", model: "JF 520", year: 2018, serial_number: "SN-RET-2018-002", maintenance_interval_days: 25 },
  { code: "FUR-002", name: "Forno Elétrico F-02", category: "Tratamento Térmico", location: "Setor E", manufacturer: "BRASIMET", model: "FE-300", year: 2019, serial_number: "SN-FUR-2019-002", maintenance_interval_days: 60 },
  { code: "COM-002", name: "Compressor de Ar C-02", category: "Utilidades", location: "Casa de Máquinas", manufacturer: "ATLAS COPCO", model: "GA 37", year: 2018, serial_number: "SN-COM-2018-002", maintenance_interval_days: 90 },
  { code: "PON-002", name: "Ponte Rolante 5T", category: "Movimentação", location: "Setor C", manufacturer: "MUNCK", model: "PR-5000", year: 2017, serial_number: "SN-PON-2017-002", maintenance_interval_days: 180 },
  { code: "INJ-001", name: "Injetora Plástica I-01", category: "Injeção", location: "Setor F", manufacturer: "ROMI", model: "Primax 150R", year: 2020, serial_number: "SN-INJ-2020-001", maintenance_interval_days: 30 },
  { code: "EXT-001", name: "Extrusora E-01", category: "Extrusão", location: "Setor F", manufacturer: "CARNEVALI", model: "EX-90", year: 2019, serial_number: "SN-EXT-2019-001", maintenance_interval_days: 45 },
  { code: "CAL-001", name: "Calandra C-01", category: "Conformação", location: "Setor B", manufacturer: "HAEUSLER", model: "VRM-HY", year: 2016, serial_number: "SN-CAL-2016-001", maintenance_interval_days: 60 },
  { code: "GER-001", name: "Gerador Diesel G-01", category: "Utilidades", location: "Casa de Máquinas", manufacturer: "CUMMINS", model: "C550D5", year: 2015, serial_number: "SN-GER-2015-001", maintenance_interval_days: 120 },
  { code: "TRA-001", name: "Transformador 500kVA", category: "Utilidades", location: "Subestação", manufacturer: "WEG", model: "TRI-500", year: 2014, serial_number: "SN-TRA-2014-001", maintenance_interval_days: 365 },
];

const eventTypes = ["CHECKIN", "CHECKOUT", "INSPECTION", "ISSUE", "MAINTENANCE", "IMPROVEMENT"];
const operators = ["Op. Silva", "Op. Santos", "Téc. Costa", "Eng. Oliveira", "Op. Ferreira", "Téc. Almeida"];

async function seed() {
  console.log("🌱 Iniciando seed do banco Supabase...");

  // Limpar dados existentes
  console.log("🗑️  Limpando dados existentes...");
  await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('assets').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Inserir ativos
  console.log("📦 Inserindo 25 ativos...");
  const { data: insertedAssets, error: assetsError } = await supabase
    .from('assets')
    .insert(assets)
    .select();

  if (assetsError) {
    console.error("❌ Erro ao inserir ativos:", assetsError);
    return;
  }

  console.log(`✅ ${insertedAssets.length} ativos inseridos com sucesso!`);

  // Gerar eventos (342 eventos distribuídos nos últimos 60 dias)
  console.log("📝 Gerando 342 eventos...");
  const events = [];
  const now = new Date();

  for (let i = 0; i < 342; i++) {
    const asset = insertedAssets[Math.floor(Math.random() * insertedAssets.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const created_at = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    events.push({
      asset_id: asset.id,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      operator: operators[Math.floor(Math.random() * operators.length)],
      observation: Math.random() > 0.5 ? "Operação concluída conforme procedimento padrão." : null,
      photo_url: Math.random() > 0.7 ? "https://placehold.co/800x600/png" : null,
      created_at: created_at.toISOString(),
    });
  }

  const { error: eventsError } = await supabase
    .from('events')
    .insert(events);

  if (eventsError) {
    console.error("❌ Erro ao inserir eventos:", eventsError);
    return;
  }

  console.log("✅ 342 eventos inseridos com sucesso!");
  console.log("🎉 Seed concluído!");
}

seed();
