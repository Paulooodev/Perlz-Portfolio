import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BreakdownForm from "../../components/BreakdownForm";
import { updateBreakdown } from "../../actions";

export const metadata = {
  title: "Edit Breakdown — Admin",
  robots: { index: false, follow: false },
};

export default async function EditBreakdownPage({ params }) {
    const { id } = await params;
    const supabase = await createClient();

    const { 
        data: breakdown,
        error
    } = await supabase
        .from("breakdowns")
        .select("*")
        .eq("id", id)
        .single();

        if (error || !breakdown) notFound();

        return (
            <div>
               <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                    Edit Breakdown
                  </h1>
                  <p className="text-gray-400">
                    Update the video details.
                  </p>
                </div> 

                <BreakdownForm
                  action={updateBreakdown}
                  breakdownId={id}
                  defaultValues={breakdown}
                  submitLabel="Save Changes"
                />
            </div>
        )
}