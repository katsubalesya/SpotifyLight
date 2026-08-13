
import { Router} from "./app/Router/Router";

// import { useEffect } from "react";
// import { Button } from "./shared/UI/Button";

function App() {
  // const [count, setCount] = useState(0)

  // const getAccessToken = async () => {
  //   const response = await fetch('https://accounts.spotify.com/api/token', {
  //     method: 'POST',
  //     headers: {"Content-Type": "application/x-www-form-urlencoded"},
  //     body: new URLSearchParams({
        // 'grant_type': 'client_credentials',
        // 'client_id': CLIENT_ID,
        // 'client_secret': CLIENT_SECRET
  //     })
  //   })
  //   const data = await response.json();
  //   localStorage.setItem('access_token', data.access_token);
  //   // console.log(data, 'DATA')
  // }

  // const getArtist = async () => {
  //   const response = await fetch ('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  //     }
  // })
  //   const artistData = await response.json();
  //   console.log(artistData, 'ARTIST')
  // }

  // useEffect(() => {
  //   getAccessToken();
  // },[])

  return (
    <>
    {/* <div> DIPLOMA LESSON 50</div>
     <Button onClick={getArtist}> getArtist L50 </Button> */}

    <Router/>
    </>
  );
}

export default App;
