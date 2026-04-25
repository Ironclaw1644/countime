'use client';

import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import Map, { NavigationControl, ScaleControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { FacilityMarker } from './FacilityMarker';
import { RadiusCircle } from './RadiusCircle';
import { FacilityTooltip } from './FacilityTooltip';
import { MapFilters } from './MapFilters';
import { MapLegend } from './MapLegend';
import { applyFilters, getAllFacilities, ALL_STATES, initialFilters } from '@/lib/facilities';
import { distanceMiles, DEFAULT_VIEW } from '@/lib/geo';
import type { Facility, FacilityFilters } from '@/types/facility';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

interface State {
  filters: FacilityFilters;
  selectedId: string | null;
  hoverId: string | null;
  showAllRings: boolean;
}

type Action =
  | { type: 'SET_FILTERS'; partial: Partial<FacilityFilters> }
  | { type: 'SELECT'; id: string | null }
  | { type: 'HOVER'; id: string | null }
  | { type: 'TOGGLE_ALL_RINGS'; value: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.partial } };
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'HOVER':
      return { ...state, hoverId: action.id };
    case 'TOGGLE_ALL_RINGS':
      return { ...state, showAllRings: action.value };
  }
}

const ALL_FACILITIES = getAllFacilities();

export default function FacilityMap() {
  const [state, dispatch] = useReducer(reducer, {
    filters: initialFilters,
    selectedId: null,
    hoverId: null,
    showAllRings: false,
  });

  const [viewState, setViewState] = useState(DEFAULT_VIEW);

  const visibleFacilities = useMemo(
    () => applyFilters(ALL_FACILITIES, state.filters),
    [state.filters],
  );

  const visibleIds = useMemo(
    () => new Set(visibleFacilities.map((f) => f.id)),
    [visibleFacilities],
  );

  const selectedFacility = useMemo(
    () => ALL_FACILITIES.find((f) => f.id === state.selectedId) ?? null,
    [state.selectedId],
  );

  const hoveredFacility = useMemo(
    () => ALL_FACILITIES.find((f) => f.id === state.hoverId) ?? null,
    [state.hoverId],
  );

  const facilitiesToRing: Facility[] = useMemo(() => {
    if (state.showAllRings) return visibleFacilities;
    const set: Facility[] = [];
    if (selectedFacility) set.push(selectedFacility);
    if (hoveredFacility && hoveredFacility.id !== selectedFacility?.id) {
      set.push(hoveredFacility);
    }
    return set;
  }, [state.showAllRings, visibleFacilities, selectedFacility, hoveredFacility]);

  const userOrigin = state.filters.userCoords;

  // Fly to user's ZIP when they enter one. The view state is owned by us
  // (not derivable from props), so syncing through an effect is correct here.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (userOrigin) {
      setViewState((v) => ({
        ...v,
        longitude: userOrigin.lng,
        latitude: userOrigin.lat,
        zoom: 5.2,
      }));
    }
  }, [userOrigin]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSetFilters = useCallback((partial: Partial<FacilityFilters>) => {
    dispatch({ type: 'SET_FILTERS', partial });
  }, []);

  const handleSelect = useCallback((id: string) => {
    dispatch({ type: 'SELECT', id });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: 'SELECT', id: null });
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={() => dispatch({ type: 'SELECT', id: null })}
        mapLib={maplibregl}
        mapStyle={MAP_STYLE}
        attributionControl={true}
        style={{ position: 'absolute', inset: 0 }}
        cursor="grab"
        minZoom={2.5}
        maxZoom={10}
      >
        <NavigationControl position="bottom-left" showCompass={false} />
        <ScaleControl position="bottom-left" unit="imperial" />

        <RadiusCircle
          facilities={facilitiesToRing}
          userOrigin={userOrigin}
          dimFacilityRings={state.showAllRings}
        />

        {ALL_FACILITIES.map((f) => {
          const visible = visibleIds.has(f.id);
          return (
            <FacilityMarker
              key={f.id}
              facility={f}
              isSelected={state.selectedId === f.id}
              isDimmed={!visible}
              onSelect={handleSelect}
              onHoverStart={(id) => dispatch({ type: 'HOVER', id })}
              onHoverEnd={() => dispatch({ type: 'HOVER', id: null })}
            />
          );
        })}

        {selectedFacility && (
          <FacilityTooltip
            facility={selectedFacility}
            distanceMiles={
              userOrigin
                ? distanceMiles(userOrigin, {
                    lat: selectedFacility.lat,
                    lng: selectedFacility.lng,
                  })
                : null
            }
            onClose={handleClose}
          />
        )}
      </Map>

      <MapFilters
        filters={state.filters}
        onChange={handleSetFilters}
        allStates={ALL_STATES}
      />

      <MapLegend
        showAllRings={state.showAllRings}
        onToggleRings={(v) => dispatch({ type: 'TOGGLE_ALL_RINGS', value: v })}
        facilityCount={visibleFacilities.length}
        totalCount={ALL_FACILITIES.length}
      />
    </div>
  );
}
