import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {
  LinearProgress,
  Button,
  TextField,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Toolbar,
  Typography,
  styles,
  Link,
  Container,
  makeStyles,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '100%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  hidden: {
    display:'none',
  }
}));

export default function Album() {
  
  const classes = useStyles();
  const [searchKey, setValue] = useState('');
  const [isLoaded, updateLoad] = useState(false);
  const [items, loadItems] = useState([]);
  const [sortItem, setSortItem] = useState("");
  const [error, loadError] = useState("");
  const [errorClass, setErrClass] = useState("");
  const [errorMsg, setErrMsg] = useState("");
  const [viewStatus, setViewStatus] = useState(false);

  async function searchBooks(searchKey) {

    if(searchKey != "") {

      setViewStatus(true);

      let baseUrl = "http://openlibrary.org/search.json?q="
      let key = searchKey.trim().replace("  ", " ").replace(/ /g, "+")

      await fetch(baseUrl+key)
        .then(res => res.json())
        .then(
          (result) => {
            loadItems(result.docs);
            setViewStatus(false);
          },
          (error) => {
            loadError(error);
          }
        )
      } else {
        setErrClass("error");
        setErrMsg("Required Field");
      }
  }

  function handleChange(event) {
    setSortItem(event.target.value);
    let index = event.target.value;
    const sorted = items.sort((a, b) => (a[index] > b[index]) ? 1 : -1);
    loadItems(sorted);
  }

  return (

    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <LocalLibrary className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Library
          </Typography>
        </Toolbar>
      </AppBar>
      <main>

        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="searchKey"
                name="searchKey"
                label="Search Here"
                fullWidth
                autoComplete="given-name"
                onChange={e => setValue(e.target.value)}
                helperText={ errorMsg }
              />
            </Grid>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={() => searchBooks(searchKey)}>
                    Search
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        <LinearProgress className={ viewStatus ? "" : classes.hidden } />

        <Container>
          <Grid container direction="row" justify="flex-end" alignItems="baseline">
            <FormControl className={classes.formControl}>
              <InputLabel id="sortItem">Sort By</InputLabel>
              <Select
                labelId="sortItem"
                id="sortItem"
                value={sortItem}
                onChange={handleChange}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="publish_year">Published Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Container>        

        { items.length > 0 ?
        <Container className={classes.cardGrid, !viewStatus ? "" : classes.hidden } maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {items.map((card) => (
              <Grid item key={card.key} xs={12} sm={6} md={3}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={card.cover_i != undefined ? "http://covers.openlibrary.org/b/id/"+ card.cover_i +"-M.jpg" : 
                    "https://ngmintlsubs.nationalgeographic.com/Solo/Content/Images/noCover.gif"}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h6" component="h2">
                      { card.title }
                    </Typography>
                    <Typography>
                      Author: { card.author_name }
                    </Typography>
                    <Typography>
                      Published Date: { card.publish_date != undefined && card.publish_date[0] }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      : 
      <Container className={classes.cardGrid, !viewStatus ? "" : classes.hidden } maxWidth="md">
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
          No Details Found
          </Grid>
      </Container>
      }

      </main>
    </React.Fragment>
  );
}