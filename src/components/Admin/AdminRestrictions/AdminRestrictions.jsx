import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const AdminRestriction = () => {
  const dispatch = useDispatch();
  const restrictions = useSelector((store) => store.restrictionsReducer || []);
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRestriction, setSelectedRestriction] = useState(null);
  const [newRestriction, setNewRestriction] = useState("");

  useEffect(() => {
    dispatch({ type: "FETCH_RESTRICTIONS" });
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setNewRestriction("");
    setOpen(true);
  };

  const handleOpenEditModal = (restriction) => {
    setSelectedRestriction(restriction);
    setIsEdit(true);
    setOpen(true);
  };

  const handleOpenConfirmationModal = (restriction) => {
    setSelectedRestriction(restriction);
    setConfirmationOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRestriction(null);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setSelectedRestriction(null);
  };

  const handleAddRestriction = () => {
    if (newRestriction) {
      dispatch({
        type: "ADD_RESTRICTIONS",
        payload: { name: newRestriction },
      });
      handleClose();
    }
  };

  const handleEditRestriction = () => {
    if (selectedRestriction) {
      dispatch({
        type: "UPDATE_RESTRICTIONS",
        payload: selectedRestriction,
      });
      handleClose();
    }
  };

  const handleDeleteRestriction = () => {
    if (selectedRestriction) {
      dispatch({
        type: "DELETE_RESTRICTIONS",
        payload: selectedRestriction.id,
      });
      handleCloseConfirmation();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedRestriction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpenEditModal(row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleOpenConfirmationModal(row)}
        />,
      ],
    },
    { field: "name", headerName: "Name", width: 600 },
  ];

  const rows = restrictions.map((restriction) => ({
    id: restriction.id,
    name: restriction.name,
  }));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Restrictions
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenAddModal}
        sx={{ mb: 2 }}
      >
        Add Restriction
      </Button>
      <Box sx={{ height: 600, width: "100%", bgcolor: "white" }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            {isEdit ? "Edit Restriction" : "Add Restriction"}
          </Typography>
          <Box component="form" sx={modalContentStyle}>
            <TextField
              label="Restriction Name"
              name="name"
              value={isEdit ? selectedRestriction?.name || "" : newRestriction}
              onChange={
                isEdit ? handleChange : (e) => setNewRestriction(e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={isEdit ? handleEditRestriction : handleAddRestriction}
                sx={{ mr: 1 }}
              >
                {isEdit ? "Save Changes" : "Add Restriction"}
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
      <Modal open={confirmationOpen} onClose={handleCloseConfirmation}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this restriction?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteRestriction}
              sx={{ mr: 1 }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseConfirmation}
            >
              Cancel
            </Button>
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

export default AdminRestriction;
