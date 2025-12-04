import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase.config';

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Upload de fotos para Supabase Storage
export async function uploadPhoto(file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('photos')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// Types
export interface Asset {
  id: string;
  code: string;
  name: string;
  category: string | null;
  location: string | null;
  manufacturer: string | null;
  model: string | null;
  year: number | null;
  serial_number: string | null;
  photo_url: string | null;
  instructions: string | null;
  maintenance_interval_days: number | null;
  last_maintenance_date: string | null;
  qr_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  asset_id: string;
  type: string;
  operator: string | null;
  observation: string | null;
  photo_url: string | null;
  created_at: string;
}

// Helper functions
export async function getAssets() {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

export async function getAssetByCode(code: string) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('code', code)
    .single();

  if (error) throw error;
  return data as Asset;
}

export async function createAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('assets')
    .insert({ ...asset, user_id: user?.id })
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

export async function getEvents(assetId?: string) {
  let query = supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (assetId) {
    query = query.eq('asset_id', assetId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Event[];
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('events')
    .insert({ ...event, user_id: user?.id })
    .select()
    .single();

  if (error) throw error;

  // Enviar notificação por email para não conformidades
  if (event.type === 'NONCONFORMITY') {
    try {
      await sendEmailNotification({
        to: 'tiagosantosr59@gmail.com',
        subject: '⚠️ Não Conformidade Registrada - Op.Intel',
        body: `Uma não conformidade foi registrada:\n\nOperador: ${event.operator}\nObservação: ${event.observation || 'N/A'}\nData: ${new Date().toLocaleString('pt-BR')}`,
      });
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não bloquear o registro do evento se o email falhar
    }
  }

  return data as Event;
}

async function sendEmailNotification(params: { to: string; subject: string; body: string }) {
  const { error } = await supabase.functions.invoke('send-email-notification', {
    body: params,
  });

  if (error) {
    console.error('Erro ao enviar email:', error);
    // Não lançamos erro para não bloquear o fluxo principal
  }
}

// KPIs para Dashboard V1.2
export async function getKPIs() {
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Total de eventos do mês atual
  const { count: totalEventosAtual } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', firstDayCurrentMonth.toISOString())
    .lt('created_at', firstDayNextMonth.toISOString());

  // Total de eventos do mês anterior
  const { count: totalEventosAnterior } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', firstDayPreviousMonth.toISOString())
    .lt('created_at', firstDayCurrentMonth.toISOString());

  // Ativos saudáveis (≥3 eventos no mês)
  const { data: assetsWithEventCount } = await supabase
    .from('assets')
    .select('id, code, name')
    .then(async (result) => {
      if (result.error) throw result.error;

      const assetsWithCounts = await Promise.all(
        result.data.map(async (asset) => {
          const { count } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('asset_id', asset.id)
            .gte('created_at', firstDayCurrentMonth.toISOString());

          return { ...asset, eventCount: count || 0 };
        })
      );

      return { data: assetsWithCounts, error: null };
    });

  const ativosSaudaveis = assetsWithEventCount?.filter(a => a.eventCount >= 3).length || 0;
  const totalAtivos = assetsWithEventCount?.length || 0;

  // Ativos negligenciados (>30 dias sem evento)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const { data: allAssets } = await supabase
    .from('assets')
    .select('id, code, name');

  const ativosNegligenciados = await Promise.all(
    (allAssets || []).map(async (asset) => {
      const { data: lastEvent } = await supabase
        .from('events')
        .select('created_at')
        .eq('asset_id', asset.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!lastEvent || new Date(lastEvent.created_at) < thirtyDaysAgo) {
        const diasSemUso = lastEvent
          ? Math.floor((now.getTime() - new Date(lastEvent.created_at).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        return { ...asset, diasSemUso };
      }
      return null;
    })
  ).then(results => results.filter(Boolean));

  return {
    totalEventosAtual: totalEventosAtual || 0,
    totalEventosAnterior: totalEventosAnterior || 0,
    ativosSaudaveis,
    totalAtivos,
    ativosNegligenciados: ativosNegligenciados.length,
    ativosNegligenciadosList: ativosNegligenciados,
    distribuicaoEventos: await getEventDistribution(thirtyDaysAgo),
    top5Ativos: await getTop5Assets(firstDayCurrentMonth),
    naoConformidades: await getNonConformities(firstDayCurrentMonth),
  };
}

async function getTop5Assets(startDate: Date) {
  const { data: events } = await supabase
    .from('events')
    .select('asset_id')
    .gte('created_at', startDate.toISOString());

  const counts: Record<string, number> = {};
  (events || []).forEach(e => {
    counts[e.asset_id] = (counts[e.asset_id] || 0) + 1;
  });

  const top5Ids = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  if (top5Ids.length === 0) return [];

  const { data: assets } = await supabase
    .from('assets')
    .select('id, code, name')
    .in('id', top5Ids);

  return (assets || []).map(a => ({
    id: a.code,
    name: a.name,
    eventos: counts[a.id]
  })).sort((a, b) => b.eventos - a.eventos);
}

async function getNonConformities(startDate: Date) {
  const { data } = await supabase
    .from('events')
    .select('created_at, description, assets(code, name)')
    .eq('type', 'NONCONFORMITY')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  return (data || []).map(e => ({
    data: new Date(e.created_at).toLocaleDateString('pt-BR'),
    ativo: (e.assets as any)?.code || 'N/A',
    descricao: e.description || 'Sem descrição'
  }));
}

async function getEventDistribution(startDate: Date) {
  const { data } = await supabase
    .from('events')
    .select('type')
    .gte('created_at', startDate.toISOString());

  const counts: Record<string, number> = {};
  (data || []).forEach(e => {
    const type = e.type || 'Outros';
    counts[type] = (counts[type] || 0) + 1;
  });

  // Map types to display names and colors
  const typeMap: Record<string, { label: string; color: string }> = {
    'MAINTENANCE': { label: 'Manutenção', color: 'bg-yellow-500' },
    'INSPECTION': { label: 'Inspeção', color: 'bg-blue-500' },
    'CHECKIN': { label: 'Check-in', color: 'bg-green-500' },
    'CHECKOUT': { label: 'Check-out', color: 'bg-orange-500' },
    'NONCONFORMITY': { label: 'Problema', color: 'bg-red-500' },
    'IMPROVEMENT': { label: 'Melhoria', color: 'bg-purple-500' },
    'CLEANING': { label: 'Limpeza', color: 'bg-cyan-500' },
  };

  return Object.entries(counts)
    .map(([type, count]) => ({
      tipo: typeMap[type]?.label || type,
      count,
      cor: typeMap[type]?.color || 'bg-gray-500'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5
}

export async function logAction(action: string, entityType: string, entityId: string | null, metadata: any = {}) {
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from('audit_logs').insert({
    user_id: user?.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata
  });
}
