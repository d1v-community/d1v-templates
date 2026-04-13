export async function loader() {
  // Return a 204 No Content response for favicon requests
  // This prevents the "No route matches" error
  return new Response(null, { status: 204 });
}
