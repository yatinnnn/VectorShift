import { Handle, Position } from "reactflow";
import { useState, useEffect } from "react";
import FieldRenderer from "./FieldRenderer";
import { Trash2 } from "lucide-react";


export const BaseNode = ({
  id,
  label,
  data = {},
  customFields = [],
  inputHandles = [],
  outputHandles = [],
  nodeStyle = {},
  handleStyle = {},
  children,
  className = null,
}) => {
  const [nodeData, setNodeData] = useState(data);

  const defaultHandleStyle = {
    background: "#fff",
    width: "15px",
    height: "15px",
    border: "1px solid #000",
  };

  // Ensure default values are set when the component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const defaultData = {};
    customFields.forEach((field) => {
      if (!nodeData[field.name]) {
        if (field.name.includes("Name")) {
          // Default naming logic for fields like 'inputName' or 'outputName'
          defaultData[field.name] = id.replace(
            `custom${label}-`,
            `${label.toLowerCase()}_`
          );
        } else {
          defaultData[field.name] = field.default || "";
        }
      }
    });
    setNodeData((prevData) => ({ ...prevData, ...defaultData }));
  }, [id, customFields, label, nodeData]);

  const handleInputChange = (fieldName, value) => {
    setNodeData({
      ...nodeData,
      [fieldName]: value,
    });
  };

  return (
    <div
  style={{ ...nodeStyle }}
  className={`relative group px-5 py-4 w-80 border-2 bg-white flex flex-col gap-2 border-blue-600 shadow-lg rounded-lg ${className}`}
>

    <button
  onClick={() => {
    const event = new CustomEvent("deleteNode", { detail: { id } });
    window.dispatchEvent(event);
  }}
  className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-md p-1 z-10"
  aria-label={`Delete node ${id}`}
  title="Delete node"
  >
   <Trash2 size={16} strokeWidth={2} />
</button>

      <div>
        <span className="text-blue-500 text-lg">{label}</span>
      </div>
      {children && <div>{children}</div>}
      <div className="flex flex-col gap-4">
        {customFields?.map((field, index) => (
          <FieldRenderer
            key={index}
            field={field}
            value={nodeData[field.name]}
            onChange={handleInputChange}
            label={field.label}
          />
        ))}
      </div>
      {inputHandles?.map((handle, index) => (
        <Handle
          key={`${id}-input-${index}`}
          type="target"
          position={Position.Left}
          id={handle.id}
          style={{ ...handleStyle, ...handle.style, ...defaultHandleStyle }}
          className="bg-white w-3 h-3 rounded-full border-1 border-purple-500"
        />
      ))}
      {outputHandles?.map((handle, index) => (
        <Handle
          key={`${id}-output-${index}`}
          type="source"
          position={Position.Right}
          id={handle.id}
          className="bg-white w-3 h-3 rounded-full border-1 border-purple-500"
          style={{ ...handleStyle, ...handle.style, ...defaultHandleStyle }}
        />
      ))}
    </div>
  );
};
