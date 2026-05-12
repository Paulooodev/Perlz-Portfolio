import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import AudioPlayerProvider from "../components/audio/AudioPlayerProvider";


export default function SiteLayout({ children }) {
  return (
    <>
    <AudioPlayerProvider>
      <Navbar />
      {children}
      <Footer />
    </AudioPlayerProvider>
    </>
  );
}