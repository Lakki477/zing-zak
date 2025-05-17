
import { supabase } from "@/integrations/supabase/client";
import { WalletTransaction } from "@/types/supabase";

export const walletService = {
  getTransactions: async (userId: string): Promise<WalletTransaction[]> => {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
    
    return data as WalletTransaction[];
  },
  
  getCoins: async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('coins')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error("Error fetching coins:", error);
      return 0;
    }
    
    return data.coins;
  },
  
  createWithdrawal: async (
    userId: string,
    amount: number,
    paymentMethod: 'bank' | 'paytm',
    paymentDetails: any
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      // First check if user has enough coins
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('coins')
        .eq('id', userId)
        .single();
      
      if (profileError || !profile) {
        throw new Error(`Error fetching profile: ${profileError?.message || "Profile not found"}`);
      }
      
      if (profile.coins < amount) {
        throw new Error("Insufficient coins for withdrawal");
      }
      
      // Begin transaction
      // 1. Create withdrawal record
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          transaction_type: 'withdrawal',
          status: 'pending',
          payment_method: paymentMethod,
          payment_details: paymentDetails,
        });
      
      if (transactionError) {
        throw new Error(`Error creating transaction: ${transactionError.message}`);
      }
      
      // 2. Deduct coins from user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          coins: profile.coins - amount 
        })
        .eq('id', userId);
      
      if (updateError) {
        throw new Error(`Error updating coins: ${updateError.message}`);
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error in createWithdrawal:", error);
      return { success: false, error: error.message };
    }
  },
};
