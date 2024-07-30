import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField, Modal, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

const AdminDiscounts = () => {
  const dispatch = useDispatch();
  const discounts = useSelector((store) => store.discountsReducer || []);
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [newDiscount, setNewDiscount] = useState({ name: '' });

  useEffect(() => {
    dispatch({ type: 'FETCH_DISCOUNTS' });
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setNewDiscount({ name: '' });
    setOpen(true);
  };

  const handleOpenEditModal = (discount) => {
    setSelectedDiscount(discount);
    setIsEdit(true);
    setOpen(true);
  };

  const handleOpenConfirmationModal = (discount) => {
    setSelectedDiscount(discount);
    setConfirmationOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDiscount(null);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setSelectedDiscount(null);
  };

  const handleAddDiscount = () => {
    if (newDiscount.name) {
      dispatch({
        type: 'ADD_DISCOUNTS',
        payload: newDiscount,
      });
      handleClose();
    }
  };

  const handleEditDiscount = () => {
    if (selectedDiscount) {
      dispatch({
        type: 'UPDATE_DISCOUNTS',
        payload: selectedDiscount,
      });
      handleClose();
    }
  };

  const handleDeleteDiscount = () => {
    if (selectedDiscount) {
      dispatch({
        type: 'DELETE_DISCOUNT',
        payload: selectedDiscount.id,
      });
      handleCloseConfirmation();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEdit) {
      setSelectedDiscount((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewDiscount((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Edit'
          onClick={() => handleOpenEditModal(row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={() => handleOpenConfirmationModal(row)}
        />,
      ],
    },
    { field: 'name', headerName: 'Name', width: 600 },
  ];

  const rows = discounts.map((discount) => ({
    id: discount.id,
    name: discount.name,
  }));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h4' gutterBottom>
        Discounts
      </Typography>
      <Button
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleOpenAddModal}
        sx={{ mb: 2 }}
      >
        Add Discount
      </Button>
      <Box sx={{ height: 600, width: '100%', bgcolor: 'white' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant='h6' gutterBottom>
            {isEdit ? 'Edit Discount' : 'Add Discount'}
          </Typography>
          <Box component='form' sx={modalContentStyle}>
            <TextField
              label='Discount Name'
              name='name'
              value={isEdit ? selectedDiscount?.name || '' : newDiscount.name}
              onChange={handleChange}
              fullWidth
              margin='normal'
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                onClick={isEdit ? handleEditDiscount : handleAddDiscount}
                sx={{ mr: 1 }}
              >
                {isEdit ? 'Save Changes' : 'Add Discount'}
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal open={confirmationOpen} onClose={handleCloseConfirmation}>
        <Box sx={modalStyle}>
          <Typography variant='h6' gutterBottom>
            Are you sure you want to delete this discount?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant='contained' color='error' onClick={handleDeleteDiscount} sx={{ mr: 1 }}>
              Delete
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleCloseConfirmation}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

const modalContentStyle = {
  maxHeight: '80vh',
  overflowY: 'auto',
};

export default AdminDiscounts;
