import { Poppins } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import Wrapper from "@/components/Wrapper";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeProviders from "@/provider/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "SMK ICB Bandung",
  description: "SMK ICB CINTA NIAGA Bandung",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider>
          <ThemeProviders>
            <ToastContainer theme="dark" />
            <AuthProvider session={session}>
              <Navbar />
              <Wrapper>{children}</Wrapper>
              <Footer />
            </AuthProvider>
          </ThemeProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
