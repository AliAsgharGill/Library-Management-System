import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "LogIn",
  description: "Next Gen Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
