import "./globals.css";


export const metadata = {
  title: "Ultra Share",
  description: "Live Sharing App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
