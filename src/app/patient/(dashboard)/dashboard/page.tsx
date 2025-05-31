import { isUserAuth } from "@/src/lib/isUserAuth";
import Dashboard from "./Dashboard";

export default async function Page() {
  const session = await isUserAuth();

  return <Dashboard session={session} />;
}