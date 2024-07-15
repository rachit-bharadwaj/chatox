// components
import { Login, Register } from "../components/auth";

//shadcn
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Auth() {
  return (
    <div className="p-3">
      <header className="bg-gradient-blue bg-clip-text text-6xl font-extrabold py-10 px-5 text-transparent">
        Let&apos;s get started
      </header>

      <Tabs defaultValue="login" className="w-full my-10 mx-auto max-w-xs">
        <TabsList className="w-full flex justify-evenly">
          <TabsTrigger value="login" className="w-full">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="w-full">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="register">
          <Register />
        </TabsContent>
      </Tabs>
    </div>
  );
}
