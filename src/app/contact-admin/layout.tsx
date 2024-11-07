import Layout from "@/app/components/app/layout";

export default function ContactAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
