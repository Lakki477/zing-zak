
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Logo } from "@/components/Logo";

type AuthMode = "signin" | "signup";

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: error.message,
          });
        } else {
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, username);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: error.message,
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          setMode("signin");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-app-card rounded-lg p-8 shadow-lg">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-app-accent"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          {mode === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-app-accent hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="text-app-accent hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
