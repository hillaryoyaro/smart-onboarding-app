// frontend/src/components/forms/FormFieldBuilder.tsx
"use client";
import React, { useState } from "react";

export default function FormFieldBuilder({ onChange }) {
  const [fields, setFields] = useState([]);

  function addField() {
    setFields((s) => [...s, { name: `field_${s.length + 1}`, label: "Field label", type: "text", required: false }]);
  }

  function updateField(idx, key, value) {
    const copy = [...fields];
    copy[idx] = { ...copy[idx], [key]: value };
    setFields(copy);
    onChange && onChange(copy);
  }

  function removeField(idx) {
    const copy = fields.filter((_, i) => i !== idx);
    setFields(copy);
    onChange && onChange(copy);
  }

  return (
    <div>
      <div className="mb-3">
        <button type="button" onClick={addField} className="px-3 py-1 bg-green-600 text-white rounded">Add Field</button>
      </div>
      {fields.map((f, i) => (
        <div key={i} className="border p-3 mb-2">
          <div className="flex gap-2 items-center">
            <input value={f.label} onChange={(e)=>updateField(i,"label",e.target.value)} className="border p-1" placeholder="Label" />
            <input value={f.name} onChange={(e)=>updateField(i,"name",e.target.value)} className="border p-1" placeholder="Name" />
            <select value={f.type} onChange={(e)=>updateField(i,"type",e.target.value)} className="border p-1">
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="date">Date</option>
              <option value="dropdown">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="file">File</option>
            </select>
            <label>
              <input type="checkbox" checked={!!f.required} onChange={(e)=>updateField(i,"required",e.target.checked)} />
              required
            </label>
            <button type="button" onClick={()=>removeField(i)} className="text-red-600">Remove</button>
          </div>
          {f.type === "dropdown" && (
            <div className="mt-2">
              <input placeholder="Comma separated options" value={f.options||""} onChange={(e)=>updateField(i,"options",e.target.value)} className="border p-1 w-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
