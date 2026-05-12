import BeatsForm from "../components/BeatsForm";
import { createBeat } from "../actions";

export const metadata = {
  title: "Upload Beat — Admin",
  robots: { index: false, follow: false },
};

export default function NewBeatPage() {
    return (
      <div>
        <div className="mb-8">
           <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Upload New Beat
            </h1>
            <p className="text-gray-400">
                Add a new beat to your catalog. Buyers will be able to inquire via
                WhatsApp.
            </p> 
        </div>
        <BeatsForm action={createBeat} submitLabel="Upload Beat" />
      </div>  
    )
}