import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import axios from "axios";
import moment from "moment";

const AdminGolfCourses = () => {
  const dispatch = useDispatch();
  const adminCourses = useSelector(
    (state) => state.adminGolfCoursesReducer || []
  );
  const discounts = useSelector((state) => state.discountsReducer || []);
  const restrictions = useSelector((state) => state.restrictionsReducer || []);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: "",
    phone_number: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    latitude: "",
    longitude: "",
    image_url: "",
    is_active: true,
    discount_ids: [],
    restriction_ids: [],
  });

  useEffect(() => {
    dispatch({ type: "FETCH_ADMIN_GOLF_COURSES" });
    dispatch({ type: "FETCH_DISCOUNTS" });
    dispatch({ type: "FETCH_RESTRICTIONS" });
  }, [dispatch]);

  const handleRowClick = (id) => {
    const course = adminCourses.find((course) => course.golf_course_id === id);
    if (course) {
      const selectedCourseData = {
        ...course,
        name: course.golf_course_name,
        phone_number: course.golf_course_phone_number,
        street: course.golf_course_street,
        city: course.golf_course_city,
        state: course.golf_course_state,
        zip_code: course.golf_course_zip_code,
        latitude: course.golf_course_latitude,
        longitude: course.golf_course_longitude,
        image_url: course.golf_course_image_url,
        is_active: course.golf_course_is_active,
        discount_ids: discounts
          .filter((discount) => course.discounts.includes(discount.name))
          .map((discount) => discount.id),
        restriction_ids: restrictions
          .filter((restriction) =>
            course.restrictions.includes(restriction.name)
          )
          .map((restriction) => restriction.id),
      };
      setSelectedCourse(selectedCourseData);
      setIsEdit(true);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
    setIsEdit(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEdit) {
      setSelectedCourse({
        ...selectedCourse,
        [name]: value,
      });
    } else {
      setNewCourse({
        ...newCourse,
        [name]: value,
      });
    }
  };

  const handleToggleChange = (e) => {
    const { checked } = e.target;
    if (isEdit) {
      setSelectedCourse({
        ...selectedCourse,
        is_active: checked,
      });
    } else {
      setNewCourse({
        ...newCourse,
        is_active: checked,
      });
    }
  };

  const handleSave = () => {
    const courseToSave = isEdit ? selectedCourse : newCourse;
  
    if (
      !courseToSave.name ||
      !courseToSave.city ||
      !courseToSave.state ||
      !courseToSave.zip_code
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    courseToSave.latitude = courseToSave.latitude || 0;
    courseToSave.longitude = courseToSave.longitude || 0;
  
    if (isEdit) {
      axios
        .put(`/api/courses/admin/${selectedCourse.golf_course_id}`, {
          ...courseToSave,
          is_active: selectedCourse.is_active, // Ensure is_active is included
        })
        .then(() => {
          dispatch({ type: "FETCH_ADMIN_GOLF_COURSES" });
        })
        .catch((error) => {
          console.error(`Error updating golf course`, error);
        });
    } else {
      axios
        .post("/api/courses/admin", {
          ...newCourse,
          is_active: newCourse.is_active, // Ensure is_active is included
        })
        .then(() => {
          dispatch({ type: "FETCH_ADMIN_GOLF_COURSES" });
        })
        .catch((error) => {
          console.error(`Error adding new golf course`, error);
        });
    }
    handleClose();
  };
  

  const handleDelete = (id) => {
    axios
      .delete(`/api/courses/admin/${id}`)
      .then(() => {
        dispatch({ type: "FETCH_ADMIN_GOLF_COURSES" });
      })
      .catch((error) => {
        console.error(`Error deleting golf course`, error);
      });
  };

  const handleDiscountSelect = (e) => {
    const { value } = e.target;
    if (isEdit) {
      setSelectedCourse((prev) => ({
        ...prev,
        discount_ids: value,
      }));
    } else {
      setNewCourse((prev) => ({
        ...prev,
        discount_ids: value,
      }));
    }
  };

  const handleRestrictionSelect = (e) => {
    const { value } = e.target;
    if (isEdit) {
      setSelectedCourse((prev) => ({
        ...prev,
        restriction_ids: value,
      }));
    } else {
      setNewCourse((prev) => ({
        ...prev,
        restriction_ids: value,
      }));
    }
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 75,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleRowClick(id)}
        />,
        // <GridActionsCellItem
        //   icon={<DeleteIcon />}
        //   label="Delete"
        //   onClick={() => handleDelete(id)}
        // />,
      ],
    },
    // { field: 'golf_course_id', headerName: 'ID', width: 70 },
    { field: "golf_course_name", headerName: "Name", width: 200 },
    { field: "golf_course_phone_number", headerName: "Phone", width: 150 },
    { field: "golf_course_is_active", headerName: "Active", width: 100 },
    {
      field: "golf_course_created_at",
      headerName: "Date Created",
      width: 180,
      valueFormatter: (params) => {
        const createdAt = params;
        return createdAt ? moment(createdAt).format("MM/DD/YYYY") : "";
      },
    },
    { field: "golf_course_street", headerName: "Street", width: 200 },
    { field: "golf_course_city", headerName: "City", width: 130 },
    { field: "golf_course_state", headerName: "State", width: 100 },
    { field: "golf_course_zip_code", headerName: "ZIP Code", width: 100 },
    { field: "golf_course_latitude", headerName: "Latitude", width: 130 },
    { field: "golf_course_longitude", headerName: "Longitude", width: 130 },
    { field: "golf_course_image_url", headerName: "Image URL", width: 200 },
    {
      field: "discounts",
      headerName: "Discounts",
      width: 200,
      renderCell: (params) => (
        <div>{(params.row.discounts || []).join(", ")}</div>
      ),
    },
    {
      field: "restrictions",
      headerName: "Restrictions",
      width: 200,
      renderCell: (params) => (
        <div>{(params.row.restrictions || []).join(", ")}</div>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Golf Courses
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          setIsEdit(false);
          setNewCourse({
            name: "",
            phone_number: "",
            street: "",
            city: "",
            state: "",
            zip_code: "",
            latitude: "",
            longitude: "",
            image_url: "",
            is_active: true,
            discount_ids: [],
            restriction_ids: [],
          });
          setOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Add Golf Course
      </Button>
      <Box sx={{ height: 600, width: "100%", bgcolor: "white" }}>
        <DataGrid
          rows={adminCourses}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          autoHeight
          getRowId={(row) => row.golf_course_id}
          sx={{ backgroundColor: "white" }}
        />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            {isEdit ? "Edit Golf Course" : "Add Golf Course"}
          </Typography>
          <Box component="form" sx={modalContentStyle}>
            <TextField
              label="Name"
              name="name"
              value={isEdit ? selectedCourse?.name || "" : newCourse.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={
                isEdit
                  ? selectedCourse?.phone_number || ""
                  : newCourse.phone_number
              }
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Street"
              name="street"
              value={isEdit ? selectedCourse?.street || "" : newCourse.street}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={isEdit ? selectedCourse?.city || "" : newCourse.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="State"
              name="state"
              value={isEdit ? selectedCourse?.state || "" : newCourse.state}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="ZIP Code"
              name="zip_code"
              value={
                isEdit ? selectedCourse?.zip_code || "" : newCourse.zip_code
              }
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Latitude"
              name="latitude"
              value={
                isEdit ? selectedCourse?.latitude || "" : newCourse.latitude
              }
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Longitude"
              name="longitude"
              value={
                isEdit ? selectedCourse?.longitude || "" : newCourse.longitude
              }
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image URL"
              name="image_url"
              value={
                isEdit ? selectedCourse?.image_url || "" : newCourse.image_url
              }
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Discounts</InputLabel>
              <Select
                // multiple
                name="discount_ids"
                value={
                  isEdit
                    ? selectedCourse?.discount_ids || []
                    : newCourse.discount_ids
                }
                onChange={handleDiscountSelect}
              >
                {discounts.map((discount) => (
                  <MenuItem key={discount.id} value={discount.id}>
                    {discount.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Restrictions</InputLabel>
              <Select
                multiple
                name="restriction_ids"
                value={
                  isEdit
                    ? selectedCourse?.restriction_ids || []
                    : newCourse.restriction_ids
                }
                onChange={handleRestrictionSelect}
              >
                {restrictions.map((restriction) => (
                  <MenuItem key={restriction.id} value={restriction.id}>
                    {restriction.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={isEdit ? selectedCourse?.is_active : newCourse.is_active}
                  onChange={handleToggleChange}
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const modalContentStyle = {
  maxHeight: "80vh",
  overflowY: "auto",
};

export default AdminGolfCourses;
