import type React from "react";
import { Navbar } from "./Navbar";
import { ThemeProvider } from "next-themes";


export default function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navbar />
            {children}  
        </ThemeProvider> 
  );
}
