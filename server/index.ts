import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || 'https://hnybjccdqsdyehywwuhn.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@jamexglobalmarkets.com';

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

if (!resendApiKey) {
  console.error('Missing RESEND_API_KEY environment variable');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/send-otp
 * Generates a 6-digit code, stores it in the DB with 10-min expiry,
 * and sends it via Resend.
 */
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check that a user with this email actually exists (profiles mirrors auth.users)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .ilike('email', normalizedEmail)
    .single();

  if (profileError || !profile) {
    console.error('[Auth] User not found for email:', normalizedEmail, profileError);
    return res.status(404).json({ error: 'No account found with that email address.' });
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  // Upsert the reset code
  const { error: dbError } = await supabaseAdmin
    .from('password_reset_codes')
    .upsert(
      { email: normalizedEmail, code, expires_at: expiresAt },
      { onConflict: 'email' }
    );

  if (dbError) {
    console.error('[DB] Failed to store OTP:', dbError);
    return res.status(500).json({ error: 'Failed to store OTP. Please try again.' });
  }

  // Send email via Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Jamex Global <${resendFromEmail}>`,
        to: email,
        subject: 'Your Jamex Password Reset Code',
        html: `<div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111827;">Password Reset</h2>
          <p style="color: #4b5563;">Use the code below to reset your Jamex Global password:</p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827;">${code}</span>
          </div>
          <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>`,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('[Resend] Failed to send email:', errData);
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('[Resend] Network error:', err.message);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Checks whether the provided code is valid and not expired.
 */
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { data: resetRecord, error: dbError } = await supabaseAdmin
    .from('password_reset_codes')
    .select('*')
    .eq('email', normalizedEmail)
    .single();

  if (dbError || !resetRecord) {
    return res.status(400).json({ error: 'Invalid or expired code.' });
  }

  if (resetRecord.code !== code) {
    return res.status(400).json({ error: 'Invalid code. Please try again.' });
  }

  if (new Date(resetRecord.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Code expired. Please request a new one.' });
  }

  res.json({ success: true });
});

/**
 * POST /api/auth/reset-password
 * Verifies the OTP code and updates the user's password via Supabase admin.
 */
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    return res.status(400).json({ error: 'Email, code, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Verify code
  const { data: resetRecord, error: dbError } = await supabaseAdmin
    .from('password_reset_codes')
    .select('*')
    .eq('email', normalizedEmail)
    .single();

  if (dbError || !resetRecord) {
    return res.status(400).json({ error: 'Invalid or expired code.' });
  }

  if (resetRecord.code !== code) {
    return res.status(400).json({ error: 'Invalid code. Please try again.' });
  }

  if (new Date(resetRecord.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Code expired. Please request a new one.' });
  }

  // Find user by email via profiles table (id matches auth.users id)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .ilike('email', normalizedEmail)
    .single();

  if (profileError || !profile) {
    console.error('[Auth] Failed to find user for reset:', normalizedEmail, profileError);
    return res.status(404).json({ error: 'User account not found.' });
  }

  // Update password
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
    password,
  });

  if (updateError) {
    console.error('[Auth] Failed to update password:', updateError);
    return res.status(500).json({ error: updateError.message || 'Failed to update password.' });
  }

  // Delete used code
  await supabaseAdmin.from('password_reset_codes').delete().eq('email', normalizedEmail);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`OTP server running on http://localhost:${PORT}`);
});
