import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { Backdrop, CircularProgress, Container } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            'margin-left': '10%',
            'margin-top': '5%',
            width: "80%",
            height: "45%",
        },
        media: {
            //   height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

export default function VerPost(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [postLst, setPostLst] = useState(false);
    const [error, setError] = useState(false);
    const spanRef = useRef(null);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        console.log('>>>VerPost<<<', postLst);
        console.log(Object.entries(props.match.params).length);
        if (Object.entries(props.match.params).length > 0) {
            console.log(props.match.params.id);
            if (!postLst && !error) {
                fetch('/api/post/lst/' + props.match.params.id)
                    .then(response => response.json())
                    .then(data => {
                        setPostLst(data);
                        // spanRef.current.innerHTML = data.conteudo;
                    })
                    .catch(error => setError(error));
            }
        }
    }, [postLst, error, props]);

    function formataData(dt) {
        console.log(dt);
        const data = new Date(dt);
        //   return "não implementado";
        return data.toLocaleString([], { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });

    }
    return (
        <Container maxWidth="xl">
            {postLst && postLst.map((post, index) => (
                <Card className={classes.root} key={index}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                Sys
                </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={post && post.titulo}
                        subheader={post && post.assunto + " - " + formataData(post.executeDate)}
                    />
                    {/* <CardMedia
              className={classes.media}
              image="/logo192.png"
              title="Paella dish"
            /> */}
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {
                                post && <span dangerouslySetInnerHTML={{
                                    __html: post.conteudo
                                  }}></span>
                            }
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>Method:</Typography>
                            <Typography paragraph>
                                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                                minutes.
                </Typography>
                            <Typography paragraph>
                                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                </Typography>
                            <Typography paragraph>
                                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                                minutes more. (Discard any mussels that don’t open.)
                </Typography>
                            <Typography>
                                Set aside off of the heat to let rest for 10 minutes, and then serve.
                </Typography>
                        </CardContent>
                    </Collapse>
                    <Backdrop className={classes.backdrop} open={!post} >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    {
                        error && <Alert severity="error">{error}</Alert>
                    }


                </Card>
            ))}

        </Container>

    );
}
