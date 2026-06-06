import axios from 'axios'
import { useGeolocated } from 'react-geolocated'

const App = ()=>{

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        })

    const trial = async ()=>{
        const trial = await axios.post("http://localhost:5000/posts/provide",{loc:[coords.latitude,coords.longitude,coords.accuracy],p:"f"})
        console.log(trial)
    }   
    trial()
    
    
    const submitWant=async (e)=>{
        e.preventDefault()
        const d = new FormData(e.target)
        const data = Object.fromEntries(d.entries())
        const selector = document.getElementById("select")

        const final={...data,need:selector.value,location:[coords.latitude,coords.longitude,coords.accuracy]}

        const returned = await axios.post("http://localhost:5000/posts/request",final) 

        console.log(returned)
    }

    /* <iframe src=`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d${152.87405777*width*cos(longitude)}!2d69.997419713793!3d69.99999998132672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNzDCsDAwJzAwLjAiTiA3MMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1780721032641!5m2!1sen!2sin` width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"/>  */

    return <div className="w-full h-screen grid items-center grid-cols-1 grid-rows-1"><div className="h-[80%] w-auto aspect-square bg-amber-50 justify-self-center rounded-2xl grid grid-cols-1 grid-rows-[30%_70%] content-center">
        <div className="justify-self-center grid content-center h-full w-full text-center text-6xl">Need Help?</div>
        <form className="w-full h-full" onSubmit={submitWant} method="POST">
            <div className="w-full h-full grid pb-4">
                <div className="w-[80%] h-full justify-self-center grid content-center"><label className="p-2">Your Name:</label><input name="want" className="bg-pink-100 h-fit text-center w-full rounded-xl hover:placeholder:text-black placeholder:text-gray-400 focus:outline-0 focus:placeholder:text-pink-100 text-black p-2" type="text" placeholder="John Doe" required/></div>
                <div className="w-[80%] h-full justify-self-center grid content-center"><label for="select" className="p-2">What do you need help with:</label><select id="select" className="bg-pink-100 outline-none focus:outline-none p-2 rounded-xl focus:rounded-b-none">
                    <option value="f">Food</option>
                    <option value="w">Water</option>
                    <option value="m">Medical Care / Medicine</option>
                    <option value="p">Power</option>
                </select></div>
                <div className="w-[80%] h-full justify-self-center grid content-center grid-cols-1 justify-items-center">
                    {!isGeolocationAvailable?<div>Geolocation Unavailable</div>:!isGeolocationEnabled?<div>Please Allow geolocation data</div>:<div><input id="agree" name="agree" required className="m-2" type="checkbox"/><label for="agree">Agree to share location info with HelpCentral</label></div>}

                </div>
                <div className="w-[80%] h-full justify-self-center grid content-center grid-cols-1 justify-items-center"><div><input id="agreeToTerms" name="agreeToTerms" required className="m-2" type="checkbox"/><label for="agreeToTerms">Agree to terms and conditions</label></div></div>
                <div className="w-full h-full justify-self-center grid content-center"><button className="bg-pink-100 justify-self-center p-2 w-1/2 text-gray-400 rounded-full hover:rounded-xl hover:text-black" type="submit">Submit request</button></div>

            </div>
        </form>
    </div></div>
}

export default App