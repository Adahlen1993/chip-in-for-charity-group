import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Pagination,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SortTabs from "../LandingPage/LandingPageComponents/SortTabs";
import SearchField from "../LandingPage/LandingPageComponents/SearchField";
import CourseCard from "../LandingPage/LandingPageComponents/CourseCard";
import MapComponent from "../LandingPage/LandingPageComponents/MapComponent";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import ScrollToTopButton from "../LandingPage/LandingPageComponents/ScrollToTopButton";
import "../LoadingAnimation/LoadingAnimation.css";

const PurchasePunchCard = () => {
  const dispatch = useDispatch();
  const courses = useSelector((store) => store.purchasePunchCard);
  const userLocation = useSelector((store) => store.location);
  const [enableNavigation, setEnableNavigation] = useState(false);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Set initial page size to 25
  const theme = useTheme();
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    dispatch({ type: "FETCH_GOLF_COURSES_PRE" });
  }, [dispatch]);

  const filterCourses = useCallback(() => {
    const filteredCourses = courses.filter((course) =>
      course.golf_course_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortMethod === "location" && userLocation) {
      sortLocationsByDistance(
        userLocation.latitude,
        userLocation.longitude,
        filteredCourses
      );
    } else {
      sortLocationsByName(filteredCourses);
    }
  }, [courses, searchQuery, sortMethod, userLocation]);

  useEffect(() => {
    if (courses.length > 0) {
      filterCourses();
      setLoading(false); // Set loading to false after filtering
    } else {
      setLoading(false);
    }
  }, [courses, filterCourses]);

  const handleSortMethodChange = (event, newValue) => {
    if (newValue === "location" && !userLocation) {
      if (navigator.geolocation) {
        if (
          window.confirm(
            "We need your location to show the nearest golf courses. Allow location access?"
          )
        ) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              dispatch({ type: "SET_LOCATION", payload: location });
              setSortMethod(newValue); // Set sort method to location after fetching location
            },
            (error) => {
              console.error("Error getting location:", error);
              setSortMethod(newValue); // Set sort method to location even if fetching location fails
            }
          );
        }
      } else {
        console.error("Geolocation is not supported by this browser.");
        setSortMethod(newValue); // Set sort method to location even if geolocation is not supported
      }
    } else {
      setSortMethod(newValue);
    }
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

  const sortLocationsByDistance = (userLat, userLon, filteredCourses) => {
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
  };

  const sortLocationsByName = useCallback((filteredCourses) => {
    const sorted = filteredCourses
      .filter((course) => course.golf_course_name)
      .sort((a, b) => a.golf_course_name.localeCompare(b.golf_course_name));
    setSortedCourses(sorted);
  }, []);

  useEffect(() => {
    if (sortMethod === "location" && userLocation) {
      filterCourses();
    }
  }, [sortMethod, userLocation, filterCourses]);

  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <React.Fragment>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
          padding: "16px",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <SortTabs value={sortMethod} onChange={handleSortMethodChange} />

        <SearchField
          searchQuery={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </Box>
      <Box sx={{ padding: "16px" }}>
        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            {sortedCourses.length === 0 ? (
              <Typography variant="h6" align="center">
                No courses found
              </Typography>
            ) : sortMethod === "map" ? (
              <MapComponent
                courses={sortedCourses}
                enableNavigation={enableNavigation}
              />
            ) : (
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {paginatedCourses.map((course) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={course.id}
                    sx={{
                      display: "flex",
                      "& > div": {
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      },
                    }}
                  >
                    <CourseCard course={course} context="purchase-punchcard" />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
      {sortMethod !== "map" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Select value={pageSize} onChange={handlePageSizeChange}>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
          <Pagination
            count={Math.ceil(sortedCourses.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
      <ScrollToTopButton />
    </React.Fragment>
  );
};

export default PurchasePunchCard;
