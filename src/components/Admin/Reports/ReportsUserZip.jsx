import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Fab } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function ReportsUserZip() {
  const dispatch = useDispatch();
  const reportsUserZip = useSelector((store) => store.reportsUserZip);

  const [circleData, setCircleData] = useState([]);

  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_REPORTS_USER_ZIP' });
  }, [dispatch]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const zipCodes = reportsUserZip.map((report) => report.zip_code);
      const coordinates = await Promise.all(
        zipCodes.map(async (zipCode) => {
          const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
          const { 'post code': postCode, places } = response.data;
          const { latitude, longitude } = places[0];
          const report = reportsUserZip.find((report) => report.zip_code === postCode);
          return {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
            zip_code: postCode,
            user_count: report.user_count,
            purchased_punch_cards: report.purchased_punch_cards,
          };
        })
      );
      setCircleData(coordinates);
    };

    if (reportsUserZip.length) {
      fetchCoordinates();
    }
  }, [reportsUserZip]);

  const getColor = (count) => {
    return count > 100 ? 'red' : count > 50 ? 'orange' : count > 20 ? 'yellow' : 'green';
  };

  const columns = [
    { field: 'zip_code', headerName: 'Zip Code', flex: 1 },
    { field: 'user_count', headerName: 'Total Donors', flex: 1 },
    {
      field: 'purchased_punch_cards',
      headerName: 'Total Cards Purchased',
      flex: 1,
    },
  ];

  const rows = reportsUserZip.map((report, index) => ({
    id: index,
    zip_code: report.zip_code,
    user_count: report.user_count,
    purchased_punch_cards: report.purchased_punch_cards,
  }));

  return (
    <Container maxWidth='md'>
      <Typography variant='h4' color='secondary' gutterBottom align='center'>
        User Zip Code Report
      </Typography>
      <Box
        sx={{
          height: isMapExpanded ? 600 : 300,
          width: '100%',
          mt: 4,
          position: 'relative',
        }}
      >
        <MapContainer
          center={[47.5515, -101.002]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {circleData.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.lat, point.lng]}
              radius={Math.sqrt(point.purchased_punch_cards) * 2}
              fillColor={getColor(point.purchased_punch_cards)}
              color={getColor(point.purchased_punch_cards)}
              weight={1}
              opacity={1}
              fillOpacity={0.6}
            >
              <Popup>
                <div>
                  <strong>Zip Code:</strong> {point.zip_code}
                  <br />
                  <strong>Total Donors:</strong> {point.user_count}
                  <br />
                  <strong>Total Cards Purchased:</strong> {point.purchased_punch_cards}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        <Fab
          color='primary'
          aria-label='expand'
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          {isMapExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Fab>
      </Box>
      <Box sx={{ height: 400, width: '100%', mt: 2, backgroundColor: 'white' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          autoHeight
          sx={{ backgroundColor: 'white' }}
        />
      </Box>
    </Container>
  );
}

export default ReportsUserZip;
