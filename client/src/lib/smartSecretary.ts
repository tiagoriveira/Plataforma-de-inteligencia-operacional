/**
 * Smart Secretary - AI Layer 1 (Client-Side)
 * 
 * Responsável pela padronização de texto e validação de contexto
 * usando lógica KISS (Regex e Dicionários), sem chamadas de API externa.
 */

// Dicionário de padronização de termos técnicos
const TERM_DICTIONARY: Record<string, string> = {
    "troca oleo": "Troca de Óleo",
    "troca de oleo": "Troca de Óleo",
    "vazamento": "Vazamento Identificado",
    "quebrado": "Danificado/Quebrado",
    "nao liga": "Falha na Partida",
    "n liga": "Falha na Partida",
    "barulho": "Ruído Anormal",
    "esquentando": "Superaquecimento",
    "travado": "Eixo/Componente Travado",
    "sujo": "Necessita Limpeza",
    "limpeza": "Limpeza Técnica",
    "preventiva": "Manutenção Preventiva",
    "corretiva": "Manutenção Corretiva",
    "rolamento": "Rolamento",
    "correia": "Correia de Transmissão",
    "filtro": "Filtro de Ar/Óleo",
    "sensor": "Sensor de Proximidade/Temperatura",
    "motor": "Motor Elétrico",
    "painel": "Painel Elétrico",
    "disjuntor": "Disjuntor de Proteção",
    "cabo": "Cabeamento Elétrico",
    "mangueira": "Mangueira Hidráulica",
    "valvula": "Válvula de Controle",
    "pistao": "Pistão Hidráulico/Pneumático",
    "cilindro": "Cilindro Atuador",
    "bomba": "Bomba Hidráulica",
    "compressor": "Compressor de Ar",
    "ventilador": "Ventilador de Refrigeração",
    "exaustor": "Exaustor Industrial",
    "lampada": "Iluminação Local",
    "fusivel": "Fusível de Proteção",
    "rele": "Relé de Comando",
    "contator": "Contator de Potência",
    "plc": "Controlador Lógico Programável (PLC)",
    "clp": "Controlador Lógico Programável (PLC)",
    "ihm": "Interface Homem-Máquina (IHM)",
    "inversor": "Inversor de Frequência",
    "servo": "Servomotor",
    "encoder": "Encoder Rotativo",
    "termopar": "Termopar/Sensor de Temperatura",
    "pressostato": "Pressostato",
    "manometro": "Manômetro",
    "termometro": "Termômetro",
    "multimetro": "Multímetro",
    "alicate": "Alicate Amperímetro",
    "chave": "Chave de Fenda/Philips/Allen",
    "parafusadeira": "Parafusadeira Elétrica",
    "furadeira": "Furadeira de Bancada/Manual",
    "lixadeira": "Lixadeira Angular",
    "esmerilhadeira": "Esmerilhadeira",
    "solda": "Máquina de Solda",
    "eletrodo": "Eletrodo de Solda",
    "arame": "Arame de Solda MIG/MAG",
    "gas": "Gás de Proteção (Argônio/CO2)",
    "oleo": "Óleo Lubrificante/Hidráulico",
    "graxa": "Graxa Lubrificante",
    "desengraxante": "Desengraxante Industrial",
    "estopa": "Estopa para Limpeza",
    "pano": "Pano Industrial",
    "luva": "Luva de Proteção",
    "oculos": "Óculos de Segurança",
    "capacete": "Capacete de Segurança",
    "bota": "Bota de Segurança",
    "protetor": "Protetor Auricular",
    "mascara": "Máscara de Proteção Respiratória",
    "avental": "Avental de Raspa/PVC",
    "cinto": "Cinto de Segurança Tipo Paraquedista",
    "extintor": "Extintor de Incêndio",
    "hidrante": "Hidrante",
    "mangueira_incendio": "Mangueira de Incêndio",
    "alarme": "Alarme de Incêndio/Emergência",
    "sirene": "Sirene Audiovisual",
    "camera": "Câmera de Monitoramento (CFTV)",
    "dvr": "Gravador Digital de Vídeo (DVR)",
    "nvr": "Gravador de Vídeo em Rede (NVR)",
    "switch": "Switch de Rede",
    "roteador": "Roteador Wi-Fi",
    "cabo_rede": "Cabo de Rede UTP (Cat5e/Cat6)",
    "conector": "Conector RJ45/RJ11",
    "rack": "Rack de Servidor/Cabeamento",
    "servidor": "Servidor de Dados",
    "computador": "Computador Desktop/Notebook",
    "monitor": "Monitor de Vídeo",
    "teclado": "Teclado USB/Sem Fio",
    "mouse": "Mouse USB/Sem Fio",
    "impressora": "Impressora Laser/Jato de Tinta",
    "etiqueta": "Etiqueta Adesiva",
    "ribbon": "Ribbon para Impressora Térmica",
    "leitor": "Leitor de Código de Barras/QR Code",
    "coletor": "Coletor de Dados",
    "tablet": "Tablet Industrial",
    "smartphone": "Smartphone Corporativo",
    "radio": "Rádio Comunicador (HT)",
    "bateria": "Bateria Recarregável",
    "pilha": "Pilha Alcalina/Recarregável",
    "carregador": "Carregador de Bateria",
    "fonte": "Fonte de Alimentação",
    "nobreak": "Nobreak (UPS)",
    "estabilizador": "Estabilizador de Tensão",
    "filtro_linha": "Filtro de Linha",
    "extensao": "Extensão Elétrica",
    "tomada": "Tomada Elétrica",
    "interruptor": "Interruptor de Luz",
    "lampada_led": "Lâmpada LED",
    "lampada_fluorescente": "Lâmpada Fluorescente",
    "reator": "Reator Eletrônico",
    "starter": "Starter para Lâmpada Fluorescente",
    "calha": "Calha para Lâmpada Fluorescente",
    "refletor": "Refletor LED/Halógeno",
    "poste": "Poste de Iluminação",
    "fiacao": "Fiação Elétrica",
    "quadro": "Quadro de Distribuição",
    "barramento": "Barramento de Cobre",
    "isolador": "Isolador Elétrico",
    "transformador": "Transformador de Tensão",
    "gerador": "Gerador de Energia",
    "tanque": "Tanque de Combustível",
    "combustivel": "Combustível (Diesel/Gasolina/Etanol)",
    "agua": "Água Potável/Industrial",
    "esgoto": "Rede de Esgoto",
    "ar_comprimido": "Rede de Ar Comprimido",
    "vapor": "Rede de Vapor",
    "gas_natural": "Rede de Gás Natural",
    "glp": "Gás Liquefeito de Petróleo (GLP)",
    "oxigenio": "Oxigênio Industrial/Medicinal",
    "nitrogenio": "Nitrogênio Líquido/Gasoso",
    "acetileno": "Acetileno",
    "hidrogenio": "Hidrogênio",
    "amonia": "Amônia Anidra",
    "cloro": "Cloro Gás/Líquido",
    "soda": "Soda Cáustica",
    "acido": "Ácido Sulfúrico/Clorídrico/Nítrico",
    "base": "Base Química",
    "solvente": "Solvente Orgânico",
    "tinta": "Tinta Industrial/Imobiliária",
    "verniz": "Verniz Protetor",
    "primer": "Primer Anticorrosivo",
    "diluente": "Diluente para Tinta",
    "catalisador": "Catalisador para Tinta",
    "endurecedor": "Endurecedor para Tinta",
    "massa": "Massa Plástica/Poliéster",
    "lixa": "Lixa d'Água/Ferro/Madeira",
    "fita": "Fita Adesiva/Crepe/Isolante",
    "cola": "Cola de Contato/Instantânea/Madeira",
    "adesivo": "Adesivo Estrutural/Vedante",
    "silicone": "Silicone Acético/Neutro",
    "pu": "Selante de Poliuretano (PU)",
    "espuma": "Espuma Expansiva",
    "manta": "Manta Asfáltica/Térmica/Acústica",
    "telha": "Telha de Fibrocimento/Metálica/Cerâmica",
    "tijolo": "Tijolo Cerâmico/Concreto",
    "bloco": "Bloco de Concreto/Cerâmico",
    "cimento": "Cimento Portland",
    "areia": "Areia Lavada/Média/Fina",
    "pedra": "Pedra Britada",
    "concreto": "Concreto Usinado",
    "argamassa": "Argamassa Colante/Reboco",
    "gesso": "Gesso em Pó/Placa",
    "drywall": "Placa de Gesso Acartonado (Drywall)",
    "perfil": "Perfil Metálico (Montante/Guia)",
    "piso": "Piso Cerâmico/Porcelanato/Vinílico",
    "azulejo": "Azulejo Cerâmico",
    "revestimento": "Revestimento de Parede",
    "rodape": "Rodapé de Madeira/PVC/Cerâmica",
    "porta": "Porta de Madeira/Metal/Vidro",
    "janela": "Janela de Alumínio/Ferro/Madeira",
    "vidro": "Vidro Temperado/Laminado/Comum",
    "fechadura": "Fechadura de Porta",
    "dobradica": "Dobradiça de Porta/Janela",
    "maçaneta": "Maçaneta de Porta",
    "puxador": "Puxador de Porta/Gaveta",
    "trinco": "Trinco de Porta/Janela",
    "cadeado": "Cadeado de Segurança",
    "corrente": "Corrente de Aço",
    "cabo_aco": "Cabo de Aço",
    "corda": "Corda de Nylon/Sisal",
    "amarracao": "Cinta de Amarração de Carga",
    "catraca": "Catraca de Amarração",
    "lonas": "Lona Plástica/Encerado",
    "pallet": "Pallet de Madeira/Plástico",
    "caixa": "Caixa de Papelão/Plástico/Madeira",
    "embalagem": "Embalagem Plástica/Papel",
    "filme": "Filme Stretch/Shrink",
    "fitilho": "Fitilho de Amarração",
    "selo": "Selo Metálico para Fita de Arquear",
    "fita_arquear": "Fita de Arquear (Polipropileno/Poliéster/Aço)",
    "aparelho_arquear": "Aparelho de Arquear Manual/Pneumático",
    "carrinho": "Carrinho de Mão/Plataforma/Hidráulico",
    "empilhadeira": "Empilhadeira Elétrica/Combustão",
    "transpaleteira": "Transpaleteira Manual/Elétrica",
    "guindaste": "Guindaste Veicular/Fixo",
    "ponte_rolante": "Ponte Rolante",
    "talha": "Talha Manual/Elétrica",
    "guincho": "Guincho Elétrico/Manual",
    "macaco": "Macaco Hidráulico/Mecânico",
    "elevador": "Elevador de Carga/Passageiros",
    "escada": "Escada de Alumínio/Fibra/Madeira",
    "andaime": "Andaime Tubular/Fachadeiro",
    "plataforma": "Plataforma Elevatória (Tesoura/Articulada)",
    "cinto_seguranca": "Cinto de Segurança para Trabalho em Altura",
    "linha_vida": "Linha de Vida (Cabo de Aço/Corda)",
    "trava_quedas": "Trava-Quedas Retrátil/Deslizante",
    "mosquetao": "Mosquetão de Aço/Alumínio",
    "polia": "Polia/Roldana",
    "roldana": "Roldana",
    "gancho": "Gancho de Carga",
    "manilha": "Manilha de Carga",
    "sapatilha": "Sapatilha para Cabo de Aço",
    "clips": "Clips para Cabo de Aço",
    "esticador": "Esticador para Cabo de Aço",
    "olhal": "Olhal de Suspensão",
    "parafuso": "Parafuso Sextavado/Allen/Fenda/Philips",
    "porca": "Porca Sextavada/Auto-Travante/Borboleta",
    "arruela": "Arruela Lisa/Pressão/Dentada",
    "barra_roscada": "Barra Roscada",
    "chumbador": "Chumbador Mecânico/Químico",
    "bucha": "Bucha de Fixação (Nylon/Plástica)",
    "prego": "Prego com Cabeça/sem Cabeça",
    "rebite": "Rebite de Repuxo (Pop)",
    "abraçadeira": "Abraçadeira de Nylon/Aço Inox/Metal",
    "fita_dupla_face": "Fita Dupla Face (Acrílica/Espuma)",
    "velcro": "Fecho de Contato (Velcro)",
    "ziper": "Zíper",
    "botao": "Botão de Comando/Vestuário",
    "tecido": "Tecido de Algodão/Poliéster/Sintético",
    "linha": "Linha de Costura",
    "agulha": "Agulha de Costura/Mão/Máquina",
    "tesoura": "Tesoura de Corte/Costura/Papel",
    "estilete": "Estilete Profissional",
    "lamina": "Lâmina de Estilete/Serra",
    "serra": "Serra Manual/Circular/Tico-Tico",
    "disco": "Disco de Corte/Desbaste/Lixa",
    "broca": "Broca de Aço Rápido/Widea/Madeira",
    "macho": "Macho de Roscar",
    "cossinete": "Cossinete de Roscar",
    "limas": "Lima Chata/Redonda/Triangular",
    "rasquete": "Rasquete Manual",
    "espátula": "Espátula de Aço/Plástico",
    "pincel": "Pincel de Pintura/Limpeza",
    "rolo": "Rolo de Pintura (Lã/Espuma)",
    "bandeja": "Bandeja de Pintura",
    "balde": "Balde Plástico/Metal",
    "bacia": "Bacia Plástica",
    "tanque_lavar": "Tanque de Lavar Peças",
    "mangueira_jardim": "Mangueira de Jardim",
    "esguicho": "Esguicho de Água",
    "regador": "Regador",
    "pa": "Pá de Bico/Quadrada",
    "enxada": "Enxada",
    "picareta": "Picareta",
    "foice": "Foice",
    "facao": "Facão",
    "machado": "Machado",
    "martelo": "Martelo de Unha/Bola/Borracha",
    "marreta": "Marreta de Aço/Borracha",
    "ponteiro": "Ponteiro de Aço",
    "talhadeira": "Talhadeira de Aço",
    "pe_de_cabra": "Pé de Cabra",
    "alavanca": "Alavanca de Aço",
    "chave_grifo": "Chave Grifo (Stillson)",
    "chave_inglesa": "Chave Inglesa (Ajustável)",
    "chave_biela": "Chave Biela (L)",
    "chave_canhao": "Chave Canhão",
    "chave_soquete": "Chave Soquete (Catraca)",
    "torquimetro": "Torquímetro de Estalo/Relógio",
    "paquimetro": "Paquímetro Universal/Digital",
    "micrometro": "Micrômetro Externo/Interno",
    "relogio_comparador": "Relógio Comparador",
    "goniometro": "Goniômetro",
    "esquadro": "Esquadro de Precisão/Carpinteiro",
    "nivel": "Nível de Bolha/Laser",
    "trena": "Trena Manual/Laser",
    "regua": "Régua de Aço/Alumínio",
    "compasso": "Compasso de Aço/Plástico",
    "riscador": "Riscador de Metal",
    "puncao": "Punção de Centro/Bico",
    "saca_polia": "Saca Polia",
    "saca_rolamento": "Saca Rolamento",
    "prensa": "Prensa Hidráulica/Manual",
    "morsa": "Morsa de Bancada (Torno)",
    "grampo": "Grampo C (Sargento)",
    "alicate_pressao": "Alicate de Pressão",
    "alicate_corte": "Alicate de Corte Diagonal/Frontal",
    "alicate_bico": "Alicate de Bico Meia-Cana/Reto/Curvo",
    "alicate_universal": "Alicate Universal",
    "alicate_rebitador": "Alicate Rebitador",
    "alicate_crimpar": "Alicate de Crimpar Terminais",
    "alicate_decapador": "Alicate Decapador de Fios",
    "ferro_solda": "Ferro de Solda Elétrico",
    "sugador_solda": "Sugador de Solda",
    "suporte_placa": "Suporte para Placa de Circuito Impresso",
    "lupa": "Lupa de Bancada/Mão",
    "microscopio": "Microscópio Óptico/Digital",
    "balanca": "Balança Digital/Mecânica",
    "termovisor": "Câmera Termográfica (Termovisor)",
    "analisador_energia": "Analisador de Energia/Qualidade",
    "megometro": "Megômetro (Medidor de Isolação)",
    "terrometro": "Terrômetro (Medidor de Aterramento)",
    "fase_metro": "Fasímetro (Identificador de Fases)",
    "luximetro": "Luxímetro (Medidor de Luminosidade)",
    "decibelimetro": "Decibelímetro (Medidor de Nível Sonoro)",
    "anemometro": "Anemômetro (Medidor de Velocidade do Vento)",
    "tacometro": "Tacômetro (Medidor de Rotação)",
    "vibrometro": "Vibrômetro (Medidor de Vibração)",
    "alinhador": "Alinhador de Eixos a Laser",
    "balanceador": "Balanceador de Rotores",
    "detector_gas": "Detector de Gás Portátil/Fixo",
    "dosimetro": "Dosímetro de Ruído",
    "bafometro": "Etilômetro (Bafômetro)",
};

// Regras de validação de contexto
// Define quais tipos de manutenção são válidos para quais tipos de ativos (baseado em palavras-chave)
const CONTEXT_RULES: Record<string, string[]> = {
    "TORNO": ["PREVENTIVA", "CORRETIVA", "PREDITIVA", "INSPEÇÃO DE ROTINA"],
    "CNC": ["PREVENTIVA", "CORRETIVA", "PREDITIVA", "INSPEÇÃO DE ROTINA"],
    "PRENSA": ["PREVENTIVA", "CORRETIVA", "INSPEÇÃO DE SEGURANÇA"],
    "EMPILHADEIRA": ["PREVENTIVA", "CORRETIVA", "CHECKLIST DIÁRIO"],
    "COMPRESSOR": ["PREVENTIVA", "CORRETIVA", "TROCA DE ÓLEO"],
    "MOTOR": ["PREVENTIVA", "CORRETIVA", "PREDITIVA", "REBOBINAMENTO"],
    "BOMBA": ["PREVENTIVA", "CORRETIVA", "VEDAÇÃO"],
    "PAINEL": ["INSPEÇÃO TERMOGRÁFICA", "LIMPEZA", "REAPERTO"],
    "EXTINTOR": ["INSPEÇÃO MENSAL", "RECARGA ANUAL"],
    "AR CONDICIONADO": ["LIMPEZA DE FILTROS", "HIGIENIZAÇÃO", "CORRETIVA"],
    "VEÍCULO": ["REVISÃO", "TROCA DE ÓLEO", "ALINHAMENTO/BALANCEAMENTO"],
    "CAMINHÃO": ["REVISÃO", "TROCA DE ÓLEO", "TACÓGRAFO"],
    "GUINDASTE": ["INSPEÇÃO DE CABOS", "TESTE DE CARGA", "PREVENTIVA"],
    "CALDEIRA": ["INSPEÇÃO NR-13", "LIMPEZA DE TUBOS", "CALIBRAÇÃO"],
    "VASO DE PRESSÃO": ["INSPEÇÃO NR-13", "TESTE HIDROSTÁTICO"],
    "TUBULAÇÃO": ["INSPEÇÃO DE ESPESSURA", "PINTURA", "ISOLAMENTO"],
    "TANQUE": ["LIMPEZA", "INSPEÇÃO VISUAL", "ESTANQUEIDADE"],
    "SILO": ["LIMPEZA", "INSPEÇÃO ESTRUTURAL"],
    "ESTEIRA": ["ALINHAMENTO", "LUBRIFICAÇÃO", "TROCA DE CORREIA"],
    "ROBÔ": ["CALIBRAÇÃO", "BACKUP", "PREVENTIVA"],
    "INJETORA": ["TROCA DE MOLDE", "AQUECIMENTO", "PREVENTIVA"],
    "EXTRUSORA": ["LIMPEZA DE ROSCA", "AQUECIMENTO", "PREVENTIVA"],
    "SOPRADORA": ["TROCA DE MOLDE", "AQUECIMENTO", "PREVENTIVA"],
    "MOINHO": ["AFIAÇÃO DE FACAS", "LIMPEZA", "PREVENTIVA"],
    "MISTURADOR": ["LIMPEZA", "LUBRIFICAÇÃO", "PREVENTIVA"],
    "ENVASADORA": ["SETUP", "LIMPEZA", "PREVENTIVA"],
    "ROTULADORA": ["AJUSTE", "LIMPEZA", "PREVENTIVA"],
    "EMPACOTADORA": ["AJUSTE", "LIMPEZA", "PREVENTIVA"],
    "PALETIZADORA": ["AJUSTE", "LIMPEZA", "PREVENTIVA"],
    "ELEVADOR": ["INSPEÇÃO MENSAL", "MANUTENÇÃO MENSAL"],
    "PORTA": ["LUBRIFICAÇÃO", "AJUSTE"],
    "PORTÃO": ["LUBRIFICAÇÃO", "AJUSTE", "AUTOMATIZAÇÃO"],
    "CÂMERA": ["LIMPEZA DE LENTE", "AJUSTE DE FOCO", "CONECTIVIDADE"],
    "ALARME": ["TESTE DE FUNCIONAMENTO", "TROCA DE BATERIA"],
    "CONTROLE DE ACESSO": ["ATUALIZAÇÃO DE FIRMWARE", "CADASTRO DE USUÁRIOS"],
    "REDE": ["ORGANIZAÇÃO DE RACK", "TESTE DE CABEAMENTO"],
    "SERVIDOR": ["BACKUP", "ATUALIZAÇÃO", "LIMPEZA FÍSICA"],
    "COMPUTADOR": ["FORMATAÇÃO", "LIMPEZA FÍSICA", "UPGRADE"],
    "IMPRESSORA": ["TROCA DE TONER", "LIMPEZA DE CABEÇOTE"],
    "NOBREAK": ["TESTE DE BATERIA", "CALIBRAÇÃO"],
    "GERADOR": ["TESTE DE CARGA", "ABASTECIMENTO", "PREVENTIVA"],
    "TRANSFORMADOR": ["ANÁLISE DE ÓLEO", "TERMOGRAFIA"],
    "DISJUNTOR": ["TESTE DE ATUAÇÃO", "TERMOGRAFIA"],
    "ILUMINAÇÃO": ["TROCA DE LÂMPADA", "LIMPEZA DE LUMINÁRIA"],
    "PREDIAL": ["PINTURA", "REPARO HIDRÁULICO", "REPARO ELÉTRICO"],
    "JARDINAGEM": ["CORTE DE GRAMA", "PODA", "ADUBAÇÃO"],
    "LIMPEZA": ["VARRIÇÃO", "LAVAGEM", "COLETA DE RESÍDUOS"],
};

/**
 * Padroniza um texto de entrada usando dicionário e regras de formatação
 * @param input Texto original (ex: "troca oleo motor")
 * @returns Texto padronizado (ex: "Troca de Óleo Motor")
 */
export function standardizeText(input: string): string {
    if (!input) return "";

    let text = input.toLowerCase();

    // 1. Substituição por dicionário (termos exatos ou parciais)
    Object.keys(TERM_DICTIONARY).forEach(key => {
        // Regex para substituir palavra inteira ou parte dela, ignorando case
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        if (regex.test(text)) {
            text = text.replace(regex, TERM_DICTIONARY[key]);
        }
    });

    // 2. Capitalização (Title Case) para palavras que não foram substituídas pelo dicionário
    // Se a palavra já estiver no formato do dicionário (que tem maiúsculas), não mexe
    text = text.split(' ').map(word => {
        // Verifica se a palavra já tem alguma letra maiúscula (veio do dicionário)
        if (/[A-Z]/.test(word)) return word;
        // Capitaliza primeira letra
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    return text;
}

/**
 * Valida se o tipo de manutenção é compatível com o ativo
 * @param assetName Nome do ativo (ex: "TORNO CNC-01")
 * @param maintenanceType Tipo de manutenção (ex: "PREVENTIVA")
 * @returns Objeto com status de validade e mensagem
 */
export function validateContext(assetName: string, maintenanceType: string): { valid: boolean; message?: string } {
    const assetUpper = assetName.toUpperCase();
    const typeUpper = maintenanceType.toUpperCase();

    // Encontrar a chave de regra que mais se aproxima do nome do ativo
    const matchedRuleKey = Object.keys(CONTEXT_RULES).find(key => assetUpper.includes(key));

    if (matchedRuleKey) {
        const allowedTypes = CONTEXT_RULES[matchedRuleKey];
        // Verifica se o tipo de manutenção contém alguma das palavras permitidas
        // Ex: "MANUTENÇÃO PREVENTIVA" contém "PREVENTIVA"
        const isValid = allowedTypes.some(allowed => typeUpper.includes(allowed));

        if (!isValid) {
            return {
                valid: false,
                message: `O tipo "${maintenanceType}" não é comum para ativos do tipo "${matchedRuleKey}". Sugestões: ${allowedTypes.join(", ")}.`
            };
        }
    }

    return { valid: true };
}

/**
 * Sugere uma categoria baseada na descrição do problema
 * @param description Descrição do problema
 * @returns Categoria sugerida ou null
 */
export function suggestCategory(description: string): string | null {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes("oleo") || lowerDesc.includes("vazamento") || lowerDesc.includes("hidraulico")) return "HIDRÁULICA";
    if (lowerDesc.includes("motor") || lowerDesc.includes("eletrico") || lowerDesc.includes("fio") || lowerDesc.includes("cabo")) return "ELÉTRICA";
    if (lowerDesc.includes("quebrado") || lowerDesc.includes("peca") || lowerDesc.includes("engrenagem")) return "MECÂNICA";
    if (lowerDesc.includes("sensor") || lowerDesc.includes("tela") || lowerDesc.includes("erro")) return "AUTOMAÇÃO";
    
    return null;
}
