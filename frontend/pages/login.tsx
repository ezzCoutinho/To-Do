import { LoginForm } from "@/components/auth/LoginForm";
import { ProviderButtons } from "@/components/auth/ProviderButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="my-6"></div>
          <ProviderButtons />
        </CardContent>
      </Card>
    </div>
  );
}
