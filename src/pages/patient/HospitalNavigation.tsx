import React, { useState, useMemo } from "react";
import {
  Compass,
  MapPin,
  Search,
  Building2,
  Navigation,
  ArrowRight,
  Sparkles,
  Layers,
  Phone,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { HospitalRoom } from "../../types";
import { SearchBar } from "../../components/common/SearchBar";

export const HospitalNavigation: React.FC = () => {
  const { rooms, departments } = useHospital();

  const [selectedFloor, setSelectedFloor] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<HospitalRoom | null>(rooms[0] || null);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchFloor = selectedFloor === "All" || r.floor === selectedFloor;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.departmentName.toLowerCase().includes(q) ||
        r.roomNumber.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q);
      return matchFloor && matchQuery;
    });
  }, [rooms, selectedFloor, searchQuery]);

  const quickSearchPrompts = [
    "Where is the Laboratory?",
    "Where is Emergency / Trauma?",
    "Where is Cardiology OP?",
    "Where is the Central Pharmacy?",
    "Radiology / MRI",
  ];

  const handleQuickSearch = (prompt: string) => {
    const clean = prompt.replace("Where is the ", "").replace("Where is ", "").replace("?", "");
    setSearchQuery(clean);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-600/15">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-teal-100 w-fit mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Campus Wayfinding & Room Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Hospital Navigation & Floor Directory
        </h1>
        <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
          Locate consultation chambers, diagnostic laboratories, nursing stations, and outpatient amenities across all hospital floors.
        </p>
      </div>

      {/* Interactive Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search room (e.g. 'Laboratory', 'Room 102', 'Pharmacy', 'Emergency')..."
            className="flex-1"
          />

          {/* Floor Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {["All", "Ground Floor", "First Floor", "Second Floor"].map((floor) => (
              <button
                key={floor}
                type="button"
                onClick={() => setSelectedFloor(floor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedFloor === floor
                    ? "bg-white text-teal-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {floor}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Queries:
          </span>
          {quickSearchPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickSearch(q)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 text-slate-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Visual Route Guide on Left, Interactive Room Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step-by-Step Wayfinding Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedRoom ? (
            <div className="bg-white rounded-3xl p-6 border border-teal-200 shadow-md space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {selectedRoom.name}
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold">{selectedRoom.roomNumber}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {selectedRoom.type}
                </span>
              </div>

              {/* Wayfinding Route Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-100 space-y-3">
                <div className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>Interactive Route & Wayfinding</span>
                </div>

                <div className="text-sm font-bold text-slate-900">
                  {selectedRoom.name} → {selectedRoom.floor} → Block {selectedRoom.block} → {selectedRoom.roomNumber}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedRoom.directions}
                </p>
              </div>

              {/* Step Directions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Step-by-Step Directions:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      1
                    </span>
                    <span className="text-slate-700">
                      Enter through the <strong>Main Atrium Entrance</strong>.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      2
                    </span>
                    <span className="text-slate-700">
                      {selectedRoom.floor === "Ground Floor"
                        ? "Proceed straight through the central corridor."
                        : `Take the central elevator or west stairs to the ${selectedRoom.floor}.`}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      3
                    </span>
                    <span className="text-slate-700">
                      Follow overhead directional signs for <strong>Block {selectedRoom.block}</strong> to locate <strong>{selectedRoom.roomNumber}</strong>.
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Capacity */}
              <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span>Room Status: <strong className="text-slate-700">{selectedRoom.status}</strong></span>
                <span>Max Capacity: <strong className="text-slate-700">{selectedRoom.capacity}</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
              Select any room or facility from the directory on the right to view instant directions.
            </div>
          )}
        </div>

        {/* Room Directory Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Hospital Rooms & Facilities ({filteredRooms.length})
            </h3>
            <span className="text-xs text-slate-400">Click a room to map path</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRooms.map((room) => {
              const isSelected = selectedRoom?.id === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-teal-50/80 border-teal-500 shadow-md ring-1 ring-teal-500"
                      : "bg-white border-slate-200 hover:border-teal-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                        {room.roomNumber}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-1">
                        {room.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{room.departmentName}</p>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      Block {room.block}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{room.floor}</span>
                    </span>
                    <span className="text-teal-600 font-semibold flex items-center gap-0.5">
                      <span>View Route</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
