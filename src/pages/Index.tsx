import h1 from "@/image/h1.webp";
import h2 from "@/image/h2.webp";
import h3 from "@/image/h3.webp";
import h5 from "@/image/h5.webp";
import h7 from "@/image/h7.webp";
import { ContactForm } from "@/components/ContactForm";
import YoutubeEmbed from "@/components/YoutubeEmbed";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-md p-0">
        <main>
          <img src={h1} alt="Hình ảnh 1" className="w-full h-auto block" />
          <img src={h2} alt="Hình ảnh 2" className="w-full h-auto block" />
          <img src={h3} alt="Hình ảnh 3" className="w-full h-auto block" />
          <YoutubeEmbed embedId="dQw4w9WgXcQ" />
          <img src={h5} alt="Hình ảnh 5" className="w-full h-auto block" />
          <YoutubeEmbed embedId="L_LUpnjgPso" />
          <img src={h7} alt="Hình ảnh 7" className="w-full h-auto block" />
          <ContactForm />
        </main>
      </div>
    </div>
  );
};

export default Index;