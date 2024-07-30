import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import chipLogo from "/chipinforcharitylogonew.png"; // Ensure the path is correct
import "../LandingPage.css"; // Import the CSS file for custom styles

// Fixing default marker icon issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapComponent({ courses, enableNavigation }) {
  const history = useHistory();
  const mapRef = React.useRef();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    const map = mapRef.current;
    if (map) {
      map.invalidateSize();
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "16px",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "100%",
          width: "100%",
        }}
      >
        <MapContainer
          center={[47.5515, -101.002]} // Centering on North Dakota
          zoom={8} // Adjust zoom level as needed
          style={{ height: "100%", width: "100%", borderRadius: "8px" }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {courses.map((course) => (
            <Marker
              key={course.golf_course_id}
              position={[
                course.golf_course_latitude,
                course.golf_course_longitude,
              ]}
              icon={
                new L.Icon({
                  iconUrl: chipLogo,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })
              }
            >
              <Popup>
                <div
                  onClick={() => {
                    if (enableNavigation) {
                      history.push(`/coursepage/${course.punch_card_golf_courses_id}`);
                    }
                  }}
                  style={{ cursor: enableNavigation ? "pointer" : "default" }}
                >
                  <strong>{course.golf_course_name}</strong>
                  <br />
                  <p>
                    <strong>Restrictions:</strong>
                  </p>
                  {course.restrictions}
                  <br />
                  <p>
                    <strong>Discounts:</strong>
                  </p>
                  {course.discount_name}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapComponent;
