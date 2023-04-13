import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import NFTCard from "./NFTCard";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { ethers } from 'ethers';
import NftContractAbi from './NFTContractTemplateERC721.ABI.json';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 405,
  bgcolor: 'background.paper',
  border: '2px solid #485CC7',
  boxShadow: 24,
  p: 4,
  color: 'red',
};

function App() {

  const [currentAccount, setCurrentAccount] = useState();
  const [nftData, setNftData] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [addressTo, setAddressTo] = useState("");
  const [selectedNft, setSelectedNft] = useState();

  const handleClose = () => setOpenModal(false);

  const handleAddressFieldChange = (event) => {
    const { value } = event.target;
    setAddressTo(value);
  }

  const transferNft = async () => {
    
    let nft = selectedNft;
    console.log("nft: ", nft);

    try {
      
      const { ethereum } = window;
  
      if(ethereum) {
  
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(nft.token_address, NftContractAbi, signer);
        let nftTxn = await connectedContract['safeTransferFrom(address,address,uint256)'](nft.owner_of, addressTo, nft.token_id);
        
        console.log("tx: ", nftTxn);

        handleClose();
        
      } else {
  
        console.error(`Ethereum object does not exist.`);
  
      }

    } catch (error) {
      console.error(error);
    }

  }

  useEffect( () => {
        
    async function fetchData() {
        try {          
            if( !currentAccount ) return;

            let urlToFetch = `https://deep-index.moralis.io/api/v2/${currentAccount}/nft`;
        
            var myHeaders = new Headers();
            myHeaders.append('accept', 'application/json');
            myHeaders.append('X-API-Key', process.env.REACT_APP_MORALIS_API_KEY);
    
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            var myParams = new URLSearchParams({chain: '0x5', format: 'decimal', normalizeMetadata: 'false'})

            const resp = await fetch(urlToFetch+"?"+ myParams, requestOptions);
            const result = await resp.json();
            console.log(result)
            setNftData(result.result.filter( (e) => e.token_address !== "0xc6e03d9d29e033dcb08f998bfc0fe3c245577bac"));

        } catch (error) {
            console.error(error);
        }
    }

    fetchData();
}, [currentAccount]);

  const connectWallet = async () => {
    try {
      const ethereum = window.ethereum;
      if(!ethereum) {
        alert("Get metamask wallet.");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Button variant="contained" onClick={ connectWallet }>connectWallet</Button>
      {
        nftData ?
        (
          <>
            <Box sx={{ flexGrow: 1, margin: "5% 3.5% 3.5% 3.5%"}} >
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    { nftData.map(
                        (_, index) => (
                        <Grid xs={2} sm={3} md={3} key={index} >
                          {
                              
                            !!nftData[index].metadata ? (
                                <NFTCard 
                                nft={ nftData[index] }
                                title={ !!JSON.parse(nftData[index].metadata).name ? JSON.parse(nftData[index].metadata).name : "" }
                                subheader={ !!nftData[index].name ? nftData[index].name : "" }
                                image={ !!JSON.parse(nftData[index].metadata).image ? JSON.parse(nftData[index].metadata).image : "" }
                                description={ !!JSON.parse(nftData[index].metadata).description ? JSON.parse(nftData[index].metadata).description : ""} 
                                selectNft={ setSelectedNft }
                                modalOpener={ setOpenModal }
                                />
                            ) : (
                                <NFTCard 
                                    title="Awaiting metadata..."
                                    subheader="Awaiting metadata..."
                                    image=""
                                    description=""
                                />
                            )
                          } 
                        </Grid>
                    ))}
                </Grid>
            </Box>
          </>
        )
        :
        (
          <></>
        )
      }

        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box sx={style}>
            <div id="closeButton">
              <IconButton aria-label="close" onClick={handleClose} >
                <CloseIcon />
              </IconButton>
            </div>
            <Typography id="modal-modal-title" variant="h6" component="h3">
              Transfer to:
            </Typography>
            <TextField
                sx={{ width: "100%" }}
                id="outlined-basic" 
                label="Address" 
                variant="outlined"
                value={ addressTo } 
                onChange={ handleAddressFieldChange }
                name="transferTo"
                />
            <div className='transferButton'>
              <Button variant='contained' onClick={ transferNft }>Transfer</Button>
            </div> 
          </Box>
          
        </Modal>
    </>
  );
}

export default App;
