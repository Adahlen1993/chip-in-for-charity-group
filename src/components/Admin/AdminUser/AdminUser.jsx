import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Modal,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

const AdminUser = () => {
  const dispatch = useDispatch();
  const [editableUserId, setEditableUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [open, setOpen] = useState(false);
  const allUsers = useSelector((store) => store.allUsersReducer);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
  }, [dispatch]);

  const handleRowClick = (id) => {
    const user = allUsers.find((us) => us.id === id);
    if (user) {
      setEditableUserId(id);
      setUserData({
        ...user,
        birthdate: user.birthdate ? moment(user.birthdate).format("YYYY-MM-DD") : "",
      });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setEditableUserId(null);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAdminToggle = () => {
    setUserData((prevData) => ({
      ...prevData,
      admin: !prevData.admin,
    }));
  };

  const handleUserStatus = () => {
    setUserData((prevData) => ({
      ...prevData,
      is_active: !prevData.is_active,
    }));
  };

  const handleSave = () => {
    const updatedUserData = {
      ...userData,
      admin: Boolean(userData.admin),
      is_active: Boolean(userData.is_active),
    };
    dispatch({ type: "UPDATE_USER_ADMIN", payload: updatedUserData });
    dispatch({ type: "UPDATE_USER_STATUS", payload: updatedUserData });
    handleClose();
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
      ],
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Phone", flex: 1 },
    { field: "street", headerName: "Street", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "state", headerName: "State", flex: 1 },
    { field: "zip_code", headerName: "Zip Code", flex: 1 },
    { field: "birthdate", headerName: "Date of Birth", flex: 1 },
    { field: "created_at", headerName: "Time Created", flex: 1 },
    { field: "purchased_punch_cards", headerName: "Purchased Cards", flex: 1 },
    {
      field: "admin",
      headerName: "Admin",
      flex: 1,
      renderCell: (params) => (params.value ? "True" : "False"),
    },
  ];

  const rows = allUsers.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    phone_number: user.phone_number,
    street: user.street,
    city: user.city,
    state: user.state,
    zip_code: user.zip_code,
    birthdate: moment(user.birthdate).format("MM/DD/YYYY"),
    purchased_punch_cards: user.purchased_punch_cards,
    created_at: moment(user.created_at).format("MM/DD/YYYY"),
    admin: user.admin,
    is_active: user.is_active,
  }));

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Box sx={{ height: 600, width: "100%", bgcolor: "white" }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            {editableUserId ? "Edit User" : "Add User"}
          </Typography>
          <Box component="form" sx={modalContentStyle}>
            <TextField
              label="Name"
              name="name"
              value={userData.name || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={userData.email || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone_number"
              value={userData.phone_number || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Street"
              name="street"
              value={userData.street || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={userData.city || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="State"
              name="state"
              value={userData.state || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Zip Code"
              name="zip_code"
              value={userData.zip_code || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Birthday"
              name="birthdate"
              type="date"
              value={userData.birthdate || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={userData.admin || false}
                  onChange={handleAdminToggle}
                />
              }
              label="Admin"
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

export default AdminUser;
