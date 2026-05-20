import BreakdownForm from "../components/BreakdownForm";
import { createBreakdown } from "../actions";

export const metadata = {
  title: "Add Breakdown — Admin",
  robots: { index: false, follow: false },
};

export default function NewBreakdownPage() {
    return (
        <div>
           <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Add New Breakdown
              </h1>
              <p className="text-gray-400">
                Paste a YouTube URL and add a title. The thumbnail is pulled
                automatically from YouTube.
              </p>  
            </div> 

            <BreakdownForm action={createBreakdown} submitLabel="Add Breakdown" />
        </div>
    )
}