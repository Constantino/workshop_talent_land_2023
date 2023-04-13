import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import SendIcon from '@mui/icons-material/Send';
import { Button } from '@mui/material';

export default function NFTCard({
    nft,
    title="Example1", 
    subheader="Date 1",
    description="a description...",
    image="",
    selectNft,
    modalOpener
    }) {

  let imgUrl = ( image.includes("https://") || image.includes("data:image/") ) ? image : "https://ipfs.io/ipfs/"+image.split("ipfs://")[1];

  return (
    <Card >
        <CardMedia
            component="img"
            height="170px"
            sx={{ objectFit: "contain", borderRadius: "1.5rem" }}
            image={ imgUrl }
            alt={ title + "img"}
        />
        <CardHeader
            title={ title }
            subheader={ subheader }
        />    
        <CardContent>
            <Typography variant="body2" color="text.secondary">
                { description }
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <Button variant="contained" endIcon={ <SendIcon /> } onClick={ () => { selectNft(nft); modalOpener(true); } } >
                Transfer
            </Button>
          </CardActions>
    </Card>
  );
}