"use client"

import { useRef } from "react"
import { MARKER_CATEGORIES, isCapacityElement } from "./utils" // Adjust the import path as necessary
import { ImageIcon, X, Copy, Trash2, FileText } from "lucide-react" // Adjust the import path as necessary

const EditMapPage = () => {
  const containerRef = useRef(null)
  const selectedMarker = {
    id: 1,
    name: "Marker 1",
    type: "booth",
    color: "#ff0000",
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    media: { images: [], videos: [], documents: [] },
    capacity: 100,
    description: "Description of Marker 1",
  } // Example marker data, replace with actual state management
  const handleMarkerUpdate = (id, update) => {
    // Example update handler, replace with actual logic
    console.log(`Updating marker ${id} with`, update)
  }
  const handleMarkerDuplicate = () => {
    // Example duplicate handler, replace with actual logic
    console.log("Duplicating marker")
  }
  const handleMarkerDelete = () => {
    // Example delete handler, replace with actual logic
    console.log("Deleting marker")
  }

  return (
    <div ref={containerRef} className="flex-1 relative">
      {selectedMarker && (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-4 rounded-md shadow-lg z-10 w-72 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-3">Propiedades del Marcador</h2>
          <div className="mb-2">
            <label className="block text-sm font-medium">Nombre:</label>
            <input
              type="text"
              value={selectedMarker.name}
              onChange={(e) => handleMarkerUpdate(selectedMarker.id, { name: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Tipo:</label>
            <select
              value={selectedMarker.type}
              onChange={(e) => handleMarkerUpdate(selectedMarker.id, { type: e.target.value as any })}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(MARKER_CATEGORIES)
                .flatMap(([_, items]) => items)
                .map((item) => (
                  <option key={item.type} value={item.type}>
                    {item.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Color:</label>
            <input
              type="color"
              value={selectedMarker.color}
              onChange={(e) => handleMarkerUpdate(selectedMarker.id, { color: e.target.value })}
              className="w-full h-10 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <label className="block text-sm font-medium">Pos X:</label>
              <input
                type="number"
                step="0.1"
                value={selectedMarker.position.x}
                onChange={(e) =>
                  handleMarkerUpdate(selectedMarker.id, {
                    position: { ...selectedMarker.position, x: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Pos Y:</label>
              <input
                type="number"
                step="0.1"
                value={selectedMarker.position.y}
                onChange={(e) =>
                  handleMarkerUpdate(selectedMarker.id, {
                    position: { ...selectedMarker.position, y: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Pos Z:</label>
              <input
                type="number"
                step="0.1"
                value={selectedMarker.position.z}
                onChange={(e) =>
                  handleMarkerUpdate(selectedMarker.id, {
                    position: { ...selectedMarker.position, z: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <label className="block text-sm font-medium">Rot X:</label>
              <input
                type="number"
                step="0.01"
                value={selectedMarker.rotation.x}
                onChange={(e) =>
                  handleMarkerUpdate(selectedMarker.id, {
                    rotation: { ...selectedMarker.rotation, x: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Rot Y:</label>
              <input
                type="number"
                step="0.01"
                value={selectedMarker.rotation.y}
                onChange={(e) =>
                  handleMarkerUpdate(selectedMarker.id, {
                    rotation: { ...selectedMarker.rotation, y: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Rot Z:</label>
              <input
                type="number"
                step="0.01"
                value={selectedMarker.rotation.z}
                onChange={(e) =>
                  handleMarkerUpdate(selectedMarker.id, {
                    rotation: { ...selectedMarker.rotation, z: Number.parseFloat(e.target.value) },
                  })
                }
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {isCapacityElement(selectedMarker.type) && (
            <div className="mb-2">
              <label className="block text-sm font-medium">Capacidad:</label>
              <input
                type="number"
                value={selectedMarker.capacity}
                onChange={(e) => handleMarkerUpdate(selectedMarker.id, { capacity: Number.parseInt(e.target.value) })}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium">Descripción:</label>
            <textarea
              rows={3}
              value={selectedMarker.description}
              onChange={(e) => handleMarkerUpdate(selectedMarker.id, { description: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Multimedia */}
          {(selectedMarker.type === "booth" ||
            selectedMarker.type === "sponsor_booth" ||
            selectedMarker.type === "info_booth" ||
            selectedMarker.type === "merchandise") && (
            <div className="mb-4 border-t border-gray-600 pt-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Multimedia
              </h3>

              {/* Images */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Imágenes:</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    const urls = files.map((file) => URL.createObjectURL(file))
                    handleMarkerUpdate(selectedMarker.id, {
                      media: {
                        ...selectedMarker.media,
                        images: [...(selectedMarker.media?.images || []), ...urls],
                      },
                    })
                  }}
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {selectedMarker.media?.images && selectedMarker.media.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selectedMarker.media.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Media ${idx}`}
                          className="w-full h-16 object-cover rounded"
                        />
                        <button
                          onClick={() => {
                            const newImages = selectedMarker.media?.images?.filter((_, i) => i !== idx)
                            handleMarkerUpdate(selectedMarker.id, {
                              media: { ...selectedMarker.media, images: newImages },
                            })
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Videos (URL):</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        handleMarkerUpdate(selectedMarker.id, {
                          media: {
                            ...selectedMarker.media,
                            videos: [...(selectedMarker.media?.videos || []), e.currentTarget.value],
                          },
                        })
                        e.currentTarget.value = ""
                      }
                    }}
                    className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                {selectedMarker.media?.videos && selectedMarker.media.videos.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedMarker.media.videos.map((video, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs bg-gray-800 p-2 rounded">
                        <span className="flex-1 truncate">{video}</span>
                        <button
                          onClick={() => {
                            const newVideos = selectedMarker.media?.videos?.filter((_, i) => i !== idx)
                            handleMarkerUpdate(selectedMarker.id, {
                              media: { ...selectedMarker.media, videos: newVideos },
                            })
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Documentos:</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    const fileData = files.map((file) => ({
                      name: file.name,
                      url: URL.createObjectURL(file),
                    }))
                    handleMarkerUpdate(selectedMarker.id, {
                      media: {
                        ...selectedMarker.media,
                        documents: [...(selectedMarker.media?.documents || []), ...fileData.map((f) => f.url)],
                      },
                    })
                  }}
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {selectedMarker.media?.documents && selectedMarker.media.documents.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedMarker.media.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs bg-gray-800 p-2 rounded">
                        <FileText size={14} />
                        <span className="flex-1 truncate">Documento {idx + 1}</span>
                        <button
                          onClick={() => {
                            const newDocs = selectedMarker.media?.documents?.filter((_, i) => i !== idx)
                            handleMarkerUpdate(selectedMarker.id, {
                              media: { ...selectedMarker.media, documents: newDocs },
                            })
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleMarkerDuplicate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center"
            >
              <Copy size={16} className="mr-1" /> Duplicar
            </button>
            <button
              onClick={handleMarkerDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md flex items-center justify-center"
            >
              <Trash2 size={16} className="mr-1" /> Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditMapPage
