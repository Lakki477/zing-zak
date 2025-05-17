
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Wallet, ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth";
import { walletService } from "@/services/walletService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const WalletPage = () => {
  const [withdrawAmount, setWithdrawAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "paytm">("bank");
  const [paymentDetails, setPaymentDetails] = useState<{[key: string]: string}>({
    accountNumber: "",
    accountName: "",
    bankName: "",
    ifsc: "",
    phoneNumber: "",
  });
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch user's coins
  const { data: coins = 0, isLoading: isLoadingCoins } = useQuery({
    queryKey: ['userCoins', user?.id],
    queryFn: () => walletService.getCoins(user!.id),
    enabled: !!user?.id,
  });
  
  // Fetch transaction history
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => walletService.getTransactions(user!.id),
    enabled: !!user?.id,
  });
  
  const withdrawalMutation = useMutation({
    mutationFn: (data: { 
      userId: string; 
      amount: number; 
      paymentMethod: 'bank' | 'paytm'; 
      paymentDetails: any;
    }) => walletService.createWithdrawal(
      data.userId,
      data.amount,
      data.paymentMethod,
      data.paymentDetails
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCoins'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted.",
      });
      setIsWithdrawDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: error.message || "Unable to process withdrawal",
      });
    }
  });
  
  const handlePaymentDetailChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };
  
  const resetForm = () => {
    setWithdrawAmount("");
    setPaymentMethod("bank");
    setPaymentDetails({
      accountNumber: "",
      accountName: "",
      bankName: "",
      ifsc: "",
      phoneNumber: "",
    });
  };
  
  const handleWithdraw = () => {
    if (!user?.id || !withdrawAmount) return;
    
    const detailsToSubmit = paymentMethod === 'bank' 
      ? {
          accountName: paymentDetails.accountName,
          accountNumber: paymentDetails.accountNumber,
          bankName: paymentDetails.bankName,
          ifsc: paymentDetails.ifsc,
        }
      : {
          phoneNumber: paymentDetails.phoneNumber,
        };
    
    withdrawalMutation.mutate({
      userId: user.id,
      amount: Number(withdrawAmount),
      paymentMethod,
      paymentDetails: detailsToSubmit,
    });
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-app-background text-app-foreground pb-16">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-app-foreground"
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">Wallet</h1>
          <div className="w-10"></div>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Available Balance</p>
              <h2 className="text-3xl font-bold flex items-center">
                <Wallet className="mr-2 text-app-accent" size={24} />
                {isLoadingCoins ? (
                  <Spinner size="sm" />
                ) : (
                  <>{coins} coins</>
                )}
              </h2>
            </div>
            
            <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-app-accent hover:bg-app-accent/90">
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Coins</DialogTitle>
                  <DialogDescription>
                    Convert your coins to real money. Minimum withdrawal is 1000 coins.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 my-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (in coins)</label>
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value ? Number(e.target.value) : "")}
                      placeholder="Enter amount to withdraw"
                      min={1000}
                      max={coins}
                      className="bg-app-muted"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Available: {coins} coins
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as 'bank' | 'paytm')}
                    >
                      <SelectTrigger className="bg-app-muted">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="paytm">Paytm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {paymentMethod === 'bank' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                        <Input
                          value={paymentDetails.accountName}
                          onChange={(e) => handlePaymentDetailChange('accountName', e.target.value)}
                          placeholder="Enter account holder name"
                          className="bg-app-muted"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Bank Name</label>
                        <Input
                          value={paymentDetails.bankName}
                          onChange={(e) => handlePaymentDetailChange('bankName', e.target.value)}
                          placeholder="Enter bank name"
                          className="bg-app-muted"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Account Number</label>
                        <Input
                          value={paymentDetails.accountNumber}
                          onChange={(e) => handlePaymentDetailChange('accountNumber', e.target.value)}
                          placeholder="Enter account number"
                          className="bg-app-muted"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">IFSC Code</label>
                        <Input
                          value={paymentDetails.ifsc}
                          onChange={(e) => handlePaymentDetailChange('ifsc', e.target.value)}
                          placeholder="Enter IFSC code"
                          className="bg-app-muted"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-1">Paytm Number</label>
                      <Input
                        value={paymentDetails.phoneNumber}
                        onChange={(e) => handlePaymentDetailChange('phoneNumber', e.target.value)}
                        placeholder="Enter Paytm linked phone number"
                        className="bg-app-muted"
                      />
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsWithdrawDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleWithdraw}
                    className="bg-app-accent"
                    disabled={
                      !withdrawAmount || 
                      withdrawAmount < 1000 || 
                      withdrawAmount > coins ||
                      withdrawalMutation.isPending ||
                      (paymentMethod === 'bank' && (!paymentDetails.accountName || !paymentDetails.bankName || !paymentDetails.accountNumber || !paymentDetails.ifsc)) ||
                      (paymentMethod === 'paytm' && !paymentDetails.phoneNumber)
                    }
                  >
                    {withdrawalMutation.isPending ? "Processing..." : "Withdraw"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="w-full bg-app-muted rounded-lg">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="deposit" className="flex-1">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawal" className="flex-1">Withdrawals</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            {isLoadingTransactions ? (
              <div className="flex justify-center my-12">
                <Spinner size="lg" />
              </div>
            ) : transactions.length > 0 ? (
              <TabsContent value="all" className="space-y-4">
                {transactions.map(transaction => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-app-card rounded-lg"
                  >
                    <div className="flex items-center">
                      {transaction.transaction_type === 'deposit' ? (
                        <ArrowDownCircle className="text-green-500 mr-3" size={24} />
                      ) : (
                        <ArrowUpCircle className="text-app-accent mr-3" size={24} />
                      )}
                      <div>
                        <p className="font-medium">
                          {transaction.transaction_type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(transaction.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {transaction.transaction_type === 'deposit' ? '+' : '-'} {transaction.amount} coins
                      </p>
                      <p className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Clock size={40} className="mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            )}
            
            <TabsContent value="deposit" className="space-y-4">
              {transactions
                .filter(tx => tx.transaction_type === 'deposit')
                .map(transaction => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-app-card rounded-lg"
                  >
                    <div className="flex items-center">
                      <ArrowDownCircle className="text-green-500 mr-3" size={24} />
                      <div>
                        <p className="font-medium">Deposit</p>
                        <p className="text-xs text-gray-400">{formatDate(transaction.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">+ {transaction.amount} coins</p>
                      <p className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              {transactions.filter(tx => tx.transaction_type === 'deposit').length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Clock size={40} className="mx-auto mb-4 opacity-50" />
                  <p>No deposits yet</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="withdrawal" className="space-y-4">
              {transactions
                .filter(tx => tx.transaction_type === 'withdrawal')
                .map(transaction => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-app-card rounded-lg"
                  >
                    <div className="flex items-center">
                      <ArrowUpCircle className="text-app-accent mr-3" size={24} />
                      <div>
                        <p className="font-medium">Withdrawal</p>
                        <p className="text-xs text-gray-400">{formatDate(transaction.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">- {transaction.amount} coins</p>
                      <p className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              {transactions.filter(tx => tx.transaction_type === 'withdrawal').length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Clock size={40} className="mx-auto mb-4 opacity-50" />
                  <p>No withdrawals yet</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletPage;
