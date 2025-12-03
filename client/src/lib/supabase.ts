import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omrodclevaidlijnnqeq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcm9kY2xldmFpZGxpam5ucWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjUwNjUsImV4cCI6MjA4MDIwMTA2NX0.J_Xwh_0aju6-bxGGAk7PxkfIs_5Vr4_01EVFECcpOpE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  return data as Event;
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
  };
}
