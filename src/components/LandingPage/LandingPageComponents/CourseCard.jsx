import * as React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import chipLogo from "/chipinforcharitylogonew.png"; // Ensure the path is correct
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function CourseCard({ course, context }) {
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleButtonClick = () => {
    if (context === "purchase-punchcard") {
      history.push("/cart");
    } else {
      history.push(`/coursepage/${course.punch_card_golf_courses_id}`);
    }
  };

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "100%",
            height: isMobile ? "180px" : "240px",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <CardMedia
            component="img"
            image={
              course.golf_course_image_url &&
              course.golf_course_image_url !== "default_image_url"
                ? course.golf_course_image_url
                : chipLogo
            }
            alt={
              course.golf_course_image_url &&
              course.golf_course_image_url !== "default_image_url"
                ? "golf course image"
                : "chip in for charity logo"
            }
            // alt={!course.golf_course_image_url ? 'golf course image' : 'chip in for charity logo'}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
        <CardContent
          sx={{
            flex: 1,
            paddingLeft: isMobile ? "0px" : "16px",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "8px" }}
          >
            {course.golf_course_name}
          </Typography>
          {course.distance && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "8px" }}
            >
              Distance: {course.distance} miles
            </Typography>
          )}
          <Typography variant="body2" sx={{ marginBottom: "4px" }}>
            <strong>Restrictions:</strong> {course.restrictions}
          </Typography>
          <Typography variant="body2">
            <strong>Discounts:</strong> {course.discount_name}
          </Typography>
        </CardContent>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleButtonClick}
          size="small"
          color="primary"
          variant="contained"
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          {context === "purchase-punchcard"
            ? "Purchase Your Punchcard"
            : "More Information"}
        </Button>
      </Box>
    </Card>
  );
}

export default CourseCard;
