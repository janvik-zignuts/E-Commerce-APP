import { importProducts } from "@/app/actions/importProducts";

export async function GET() {
  const result = await importProducts();
  return Response.json({ status: result });
}