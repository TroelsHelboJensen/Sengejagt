import { useEffect, useState } from 'react'

// Beslutnings-/notespanel pr. seng. Gemmer noter lokalt i browseren
// (localStorage), så de overlever genindlæsning. Tjeklisten dækker de
// ting man typisk skal have afklaret før køb af en kontinentalseng.
//
// NB: Dette er bevidst ikke et live LLM-kald — det kræver en backend med
// API-nøgle. Strukturen er klar til senere at sende `notes` + sengedata
// til fx Claude API via en serverless-funktion på Vercel.

const CHECKLIST = [
  'Findes modellen i 180×210 cm?',
  'Er det den faste (ikke-elevérbare) variant?',
  'Hvilken fasthed/komfort er valgt?',
  'Hvad koster levering og montering?',
  'Hvor lang er garantien?',
  'Returret / prøveperiode?',
]

export default function AIAssistant({ bed }) {
  const storageKey = `sengejagt:notes:${bed.id}`
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setNotes(localStorage.getItem(storageKey) ?? '')
  }, [storageKey])

  const onChange = (value) => {
    setNotes(value)
    localStorage.setItem(storageKey, value)
  }

  return (
    <div className="assistant">
      <h4>Beslutningshjælp</h4>
      <ul className="assistant__checklist">
        {CHECKLIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <textarea
        className="assistant__notes"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Noter om ${bed.brand} ${bed.model}…`}
        rows={4}
      />
    </div>
  )
}
