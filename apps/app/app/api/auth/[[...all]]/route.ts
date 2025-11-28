import { auth } from "@repo/auth/server";
import type { NextRequest } from "next/server";

const handler = async (request: NextRequest) => auth.handler(request);

export { handler as GET, handler as POST };
