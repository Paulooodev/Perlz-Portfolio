import React from 'react'
import PackForm from '../_components/PackForm'
import { createPack } from '../_actions'

export const metadata = {
  title: "Upload Pack — Admin",
  robots: { index: false, follow: false },
};

const NewPackPage = () => {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Upload a New Pack
            </h1>
            <p className="text-gray-400">
                Add a new sample pack to your catalog. Buyers will be able to
                inquire via WhatsApp.
            </p>
        </div>
          <PackForm action={createPack} submitLabel="Upload Pack" />
    </div>
  )
}

export default NewPackPage

