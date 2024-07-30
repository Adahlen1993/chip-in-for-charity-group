import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  Button,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Box,
} from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import chipLogo from '/chipinforcharitylogonew.png';

function CoursePage(props) {
  const course = useSelector((store) => store.golfCoursePageReducer);
  const { id: courseId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [discountName, setDiscountName] = useState('');

  useEffect(() => {
    if (courseId) {
      dispatch({ type: 'FETCH_GOLF_COURSES_PAGE', payload: courseId });
      window.scrollTo(0, 0);
    }
  }, [dispatch, courseId]);

  const handleRedeem = async (course) => {
    try {
      const response = await axios.post('/api/punchcards/redeem', {
        punch_card_golf_courses_id: course.punch_card_golf_courses_id,
      });
      const { redeemedAt } = response.data;
      dispatch({
        type: 'FETCH_GOLF_COURSES_PAGE',
        payload: courseId,
      });
      handleClose();
    } catch (error) {
      console.error('Error redeeming course:', error);
      dispatch({ type: 'REDEEM_GOLF_COURSE_FAILURE', error });
      handleClose();
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleDirections = () => {
    const address = `${course.golf_course_street} ${course.golf_course_city} ${course.golf_course_state}, ${course.golf_course_zip}`;
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleClickOpen = (course) => {
    setSelectedCourse(course);
    setDiscountName(course.discount_name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  const handleCall = () => {
    window.open(`tel:${course.golf_course_phone}`);
  };

  console.log('Golf Course', course);

  return (
    <Container>
      <Grid container alignItems='center' spacing={2} style={{ margin: '0px 0' }}>
        <Grid item xs={2} sm={1}>
          <IconButton onClick={handleBack} color='primary'>
            <ArrowBackIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Grid>
        <Grid item xs={8} sm={10} sx={{ display: 'flex', justifyContent: 'center', px: 2 }}>
          <Typography variant='h4'>
            <strong>{course.golf_course_name}</strong>
          </Typography>
        </Grid>
        <Grid item xs={2} sm={1} />
      </Grid>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight='100vh'
      >
        <Card style={{ maxWidth: 800 }}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              {course.is_redeemed ? (
                <Typography variant='h5' color='textSecondary' align='center'>
                  Redeemed at: {moment(course.redeemed_date).format('MMMM Do YYYY, h:mm:ss a')}
                </Typography>
              ) : (
                <Button
                  onClick={() => handleClickOpen(course)}
                  variant='contained'
                  color='primary'
                  fullWidth
                  sx={{
                    margin: '10px 0',
                    fontSize: {
                      xs: '1rem',
                      sm: '1.25rem',
                    },
                    padding: {
                      xs: '8px 16px',
                      sm: '12px 24px',
                    },
                  }}
                >
                  Redeem?<br></br>
                  {course.discount_name}
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <CardMedia
                component='img'
                height='400'
                image={course.golf_course_image_url ? course.golf_course_image_url : chipLogo}
                alt={course.golf_course_name}
                style={{ width: '100%', objectFit: 'cover' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant='h4' component='div'>
                  {/* {course.golf_course_name} */}
                </Typography>
                <Typography variant='h6' color='textSecondary' gutterBottom>
                  Restrictions:
                </Typography>
                <Typography variant='body2' color='textSecondary' paragraph>
                  {course.restrictions}
                </Typography>
                <Typography variant='h6' color='textSecondary' gutterBottom>
                  Address:
                </Typography>
                <Typography variant='body2' color='textSecondary' paragraph>
                  {course.golf_course_street} {course.golf_course_city} {course.golf_course_state},{' '}
                  {course.golf_course_zip}
                </Typography>
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  style={{ margin: '10px 0' }}
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    style={{ marginRight: '16px' }}
                  >
                    <IconButton
                      onClick={handleDirections}
                      color='primary'
                      aria-label='get directions'
                    >
                      <DirectionsIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <Typography variant='body2' color='textSecondary'>
                      Directions
                    </Typography>
                  </Box>
                  <Box display='flex' flexDirection='column' alignItems='center'>
                    <IconButton onClick={handleCall} color='primary' aria-label='call'>
                      <PhoneIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <Typography variant='body2' color='textSecondary'>
                      {course.golf_course_phone}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Redeem Discount</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to redeem this discount?
              <br />
              <strong>{discountName}</strong>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => handleRedeem(selectedCourse)} color='primary'>
              Redeem
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default CoursePage;
