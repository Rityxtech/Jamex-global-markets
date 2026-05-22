import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface KycSubmission {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  front_id_url: string | null;
  back_id_url: string | null;
  selfie_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface KycFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
}

interface KycState {
  kyc: KycSubmission | null;
  loading: boolean;
  uploading: boolean;
  uploadProgress: { front: number; back: number; selfie: number };
  error: string | null;
  fetchKyc: (userId: string) => Promise<void>;
  submitKyc: (userId: string, formData: KycFormData, files: { front: File | null; back: File | null; selfie: Blob | null }) => Promise<boolean>;
  subscribeToKyc: (userId: string) => () => void;
  clearKyc: () => void;
}

const uploadFile = async (
  userId: string,
  file: File | Blob,
  folder: 'front' | 'back' | 'selfie',
  onProgress?: (pct: number) => void
): Promise<string | null> => {
  const ext = file instanceof File ? file.name.split('.').pop() : 'jpg';
  const path = `${userId}/${folder}/${Date.now()}.${ext}`;
  onProgress?.(30);

  const { data, error } = await supabase.storage
    .from('kyc-documents')
    .upload(path, file, { upsert: true });

  if (error) {
    console.error(`Error uploading ${folder}:`, error.message);
    return null;
  }
  onProgress?.(100);
  const { data: urlData } = supabase.storage.from('kyc-documents').getPublicUrl(data.path);
  return urlData.publicUrl;
};

export const useKycStore = create<KycState>((set, get) => ({
  kyc: null,
  loading: false,
  uploading: false,
  uploadProgress: { front: 0, back: 0, selfie: 0 },
  error: null,

  fetchKyc: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      set({ kyc: data as KycSubmission | null, loading: false });
    } catch (err: any) {
      // Gracefully fail if table doesn't exist yet
      console.warn('KYC fetch failed (table may not exist yet):', err.message);
      set({ loading: false });
    }
  },

  submitKyc: async (userId, formData, files) => {
    set({ uploading: true, error: null, uploadProgress: { front: 0, back: 0, selfie: 0 } });
    try {
      let frontUrl: string | null = null;
      let backUrl: string | null = null;
      let selfieUrl: string | null = null;

      if (files.front) {
        frontUrl = await uploadFile(userId, files.front, 'front', (pct) =>
          set((s) => ({ uploadProgress: { ...s.uploadProgress, front: pct } }))
        );
        if (!frontUrl) throw new Error('Front ID upload failed.');
      }

      if (files.back) {
        backUrl = await uploadFile(userId, files.back, 'back', (pct) =>
          set((s) => ({ uploadProgress: { ...s.uploadProgress, back: pct } }))
        );
        if (!backUrl) throw new Error('Back ID upload failed.');
      }

      if (files.selfie) {
        selfieUrl = await uploadFile(userId, files.selfie, 'selfie', (pct) =>
          set((s) => ({ uploadProgress: { ...s.uploadProgress, selfie: pct } }))
        );
        if (!selfieUrl) throw new Error('Selfie upload failed.');
      }

      const payload = {
        user_id: userId,
        ...formData,
        front_id_url: frontUrl,
        back_id_url: backUrl,
        selfie_url: selfieUrl,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const existing = get().kyc;
      let result;

      if (existing?.id) {
        const { data, error } = await supabase
          .from('kyc_submissions')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('kyc_submissions')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      set({ kyc: result as KycSubmission, uploading: false });
      return true;
    } catch (err: any) {
      console.error('KYC submission error:', err.message);
      set({ error: err.message, uploading: false });
      return false;
    }
  },

  subscribeToKyc: (userId: string) => {
    const channel = supabase
      .channel(`kyc-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kyc_submissions', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.new) {
            set({ kyc: payload.new as KycSubmission });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  },

  clearKyc: () => set({ kyc: null, error: null, loading: false, uploading: false, uploadProgress: { front: 0, back: 0, selfie: 0 } }),
}));
