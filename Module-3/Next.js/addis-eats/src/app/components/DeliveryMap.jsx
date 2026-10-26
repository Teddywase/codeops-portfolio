"use client";

import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./delivery-map.module.css";

const deliveryCenters = {
  Bole: [8.995, 38.7896],
  Kazanchis: [9.0102, 38.7664],
  Megenagna: [9.032, 38.8],
};

const courierIcon = L.divIcon({
  className: styles.marker,
  html: '<span class="courier" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
const deliveryIcon = L.divIcon({
  className: styles.marker,
  html: '<span class="delivery" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function DeliveryMap({ address, neighborhood }) {
  const deliveryPosition = deliveryCenters[neighborhood] ?? deliveryCenters.Bole;
  const courierPosition = [
    deliveryPosition[0] + 0.004,
    deliveryPosition[1] - 0.003,
  ];

  return (
    <MapContainer
      bounds={[courierPosition, deliveryPosition]}
      boundsOptions={{ padding: [40, 40] }}
      className={styles.map}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={deliveryPosition}
        pathOptions={{ color: "#9b3f2f", fillOpacity: 0.12 }}
        radius={700}
      />
      <Marker position={courierPosition} icon={courierIcon}>
        <Popup>Courier location (demonstration)</Popup>
      </Marker>
      <Marker position={deliveryPosition} icon={deliveryIcon}>
        <Popup>
          {address} · {neighborhood}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
