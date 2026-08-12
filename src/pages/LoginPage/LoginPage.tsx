import { useSearchParams } from "react-router-dom";
import { Button } from "../../shared/UI/Button/button";
import { useEffect } from "react";

const loginPageLink = 'https://accounts.spotify.com/en/authorize?responce_type=code&client_id=187a6ae3cd7c4e1aaa98fabcde1f08d4&redirect_uri=http://127.0.0.1:8888/callback'

const LoginPage = () => {
  const [searchParams] = useSearchParams();

  const handleLogin = () => {
    window.location.href = loginPageLink;
   };

   useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      fetch('https://accounts.spotify.com/api/token',{
        method:"POST",
        headers:{
          'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('187a6ae3cd7c4e1aaa98fabcde1f08d4' + ':' + 'eccb5a8d009c4d6982a4e97847a25b36')
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: 'http://127.0.0.1:8888/callback',
          grand_type: 'authorization_code'
        })
      })
      
    }
   },[])

  return (
    <main>
      <h1>Welcome to SpLight</h1>

      <Button onClick={handleLogin}>
        Continue with Spotify
      </Button>
    </main>
  );
};

export default LoginPage;