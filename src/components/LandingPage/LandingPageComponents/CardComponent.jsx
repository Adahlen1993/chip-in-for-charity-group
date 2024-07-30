import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Pagination,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SortTabs from './SortTabs';
import PunchCardSelect from './PunchCardSelect';
import SearchField from './SearchField';
import CourseCard from './CourseCard';
import MapComponent from './MapComponent';
import ScrollToTopButton from './ScrollToTopButton';

export default function CardComponent() {
  const dispatch = useDispatch();
  const courses = useSelector((store) => store.golfCourseReducer);
  const punchCards = useSelector((store) => store.punchCards);
  const userLocation = useSelector((store) => store.location);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [punchCardId, setPunchCardId] = useState('');
  const [sortMethod, setSortMethod] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Set initial page size to 25
  const theme = useTheme();
  const [enableNavigation, setEnableNavigation] = useState(true);
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
  const [isRedeemed, setIsRedeemed] = useState(false);

  useEffect(() => {
    if (punchCards && punchCards.length > 0) {
      setPunchCardId(punchCards[0].id);
    }
  }, [punchCards]);

  useEffect(() => {
    if (punchCardId) {
      dispatch({ type: 'FETCH_GOLF_COURSES', payload: { punchCardId, isRedeemed } });
    }
  }, [dispatch, punchCardId, isRedeemed]);

  const filterCourses = useCallback(() => {
    const filteredCourses = courses.filter(
      (course) =>
        course.punch_card_id === punchCardId &&
        course.golf_course_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setLoading(true);
    if (sortMethod === 'location' && userLocation) {
      sortLocationsByDistance(userLocation.latitude, userLocation.longitude, filteredCourses);
    } else {
      sortLocationsByName(filteredCourses);
    }
  }, [courses, punchCardId, searchQuery, sortMethod, userLocation]);

  useEffect(() => {
    if (courses.length > 0 && punchCardId) {
      filterCourses();
    } else {
      setLoading(false);
    }
  }, [courses, punchCardId, searchQuery, sortMethod, filterCourses]);

  const handleSortMethodChange = (event, newValue) => {
    setLoading(true);
    if (newValue === 'location' && !userLocation) {
      if (navigator.geolocation) {
        if (
          window.confirm(
            'We need your location to show the nearest golf courses. Allow location access?'
          )
        ) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              dispatch({ type: 'SET_LOCATION', payload: location });
              setSortMethod(newValue); // Set sort method to location after fetching location
            },
            (error) => {
              console.error('Error getting location:', error);
              setSortMethod(newValue); // Set sort method to location even if fetching location fails
            }
          );
        }
      } else {
        console.error('Geolocation is not supported by this browser.');
        setSortMethod(newValue); // Set sort method to location even if geolocation is not supported
      }
    } else {
      setSortMethod(newValue);
    }
  };

  const handlePunchCardChange = (event) => {
    const newPunchCardId = event.target.value;
    setPunchCardId(newPunchCardId);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on search query change
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset to the first page on page size change
  };

  useEffect(() => {
    // Scroll to top when currentPage changes
    window.scrollTo(0, 0);
  }, [currentPage]);

  const sortLocationsByDistance = useCallback((userLat, userLon, filteredCourses) => {
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 3958.8; // Radius of the Earth in miles
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        0.5 -
        Math.cos(dLat) / 2 +
        (Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          (1 - Math.cos(dLon))) /
          2;

      return R * 2 * Math.asin(Math.sqrt(a));
    };

    const sorted = filteredCourses
      .map((course) => ({
        ...course,
        distance: haversineDistance(
          userLat,
          userLon,
          course.golf_course_latitude,
          course.golf_course_longitude
        ).toFixed(2), // Distance in miles with 2 decimal places
      }))
      .sort((a, b) => a.distance - b.distance);

    setSortedCourses(sorted);
    setLoading(false); // Set loading to false after sorting
  }, []);

  const sortLocationsByName = useCallback((filteredCourses) => {
    const sorted = filteredCourses
      .filter((course) => course.golf_course_name)
      .sort((a, b) => a.golf_course_name.localeCompare(b.golf_course_name));
    setSortedCourses(sorted);
    setLoading(false); // Set loading to false after sorting
  }, []);

  useEffect(() => {
    if (sortMethod === 'location' && userLocation) {
      filterCourses();
    }
  }, [sortMethod, userLocation, filterCourses]);

  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRedeemedChange = (event) => {
    const checked = event.target.checked;
    setIsRedeemed(checked);
    dispatch({ type: "FETCH_GOLF_COURSES", payload: { punchCardId, isRedeemed: checked } });
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '16px',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
        }}
      >
        <SortTabs value={sortMethod} onChange={handleSortMethodChange} />

        {sortMethod !== 'map' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <PunchCardSelect
              punchCardId={punchCardId}
              onChange={handlePunchCardChange}
              punchCards={punchCards}
              punchCardName={punchCards.name}
              sx={{ flexGrow: 1, maxWidth: '50%' }} // Adjust width as needed
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isRedeemed}
                  onChange={handleRedeemedChange}
                  color="primary"
                />
              }
              label="Redeemed"
              sx={{ marginLeft: '16px' }}
            />
          
          </Box>
        )}

        {sortMethod !== 'map' && (
          <SearchField searchQuery={searchQuery} onChange={handleSearchQueryChange} />
        )}
      </Box>
      <Box sx={{ padding: '16px' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <img
              src='/Animation - driving.gif'
              alt='Loading...'
              style={{ width: '150px', height: '150px' }} // Adjust size as needed
            />
          </Box>
        ) : (
          <>
            {sortedCourses.length === 0 ? (
              <Typography variant='h6' align='center'>
                No courses found
              </Typography>
            ) : sortMethod === 'map' ? (
              <MapComponent enableNavigation={enableNavigation} courses={sortedCourses} />
            ) : (
              <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                {paginatedCourses.map((course) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={course.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <CourseCard course={course} />
                  </Grid>
                ))}
              </Grid>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '16px',
              }}
            >
            
              <Select value={pageSize} onChange={handlePageSizeChange}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </Box>

            <Pagination
              count={Math.ceil(sortedCourses.length / pageSize)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}
            />
          </>
        )}
      </Box>
      <ScrollToTopButton />
    </React.Fragment>
  );
}
