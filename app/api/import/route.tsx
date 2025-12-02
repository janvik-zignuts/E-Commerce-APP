import { importProducts } from "@/app/routes/actions/importProducts";

export async function GET() {
  const result = await importProducts();
  return Response.json({ status: result });
}