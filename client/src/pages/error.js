import { useRouter } from "next/router";

function ErrorPage() {
  const routes = useRouter();
  console.log(routes);
  return <h1>Error Page</h1>;
}

export default ErrorPage;
