import axios from 'axios'
import { useGeolocated } from 'react-geolocated'
import { useState } from 'react'

const App = ()=>{


    const [isHelping,setHelping]=useState(false)
    const [hasPulled,setPulled]=useState(true)

    

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        })


    const provide = async ()=>{
        const trial1 = await axios.post("http://localhost:5000/posts/provide",{loc:[coords.latitude,coords.longitude,coords.accuracy],p:"f"})
        const trial2 = await axios.post("http://localhost:5000/posts/provide",{loc:[coords.latitude,coords.longitude,coords.accuracy],p:"SOS"})
        console.log(trial1.data,trial2.data)
    } 
    const sos = async ()=>{
        const post = await axios.post("http://localhost:5000/posts/sos",{loc:`${coords.latitude} ${coords.longitude}`})
    }
    
    
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

    return <div className="w-full h-[200%] grid justify-items-center items-center grid-cols-[40%_60%]"><div className='absolute top-0 p-4 text-6xl font-mono left-0 font-black text-emerald-300'>HelpCentral.</div><a href="#helping" className='absolute w-1/4 bottom-0 p-4 text-4xl font-mono left-0 bg-amber-100 rounded-tr-full cursor-pointer' onClick={()=>setHelping(true)}>Want to provide?<br/> Click here.</a><div className='h-screen w-full grid content-center justify-items-center'><div className='text-3xl h-auto aspect-square w-[min(70%,200px)] grid content-center justify-items-center cursor-pointer rounded-full text-white bg-red-500' onClick={()=>sos()}><div>SOS</div></div></div>
    <div className="h-[80%] w-auto aspect-square bg-amber-50 rounded-2xl grid grid-cols-1 grid-rows-[25%_75%] content-center">
        <div className="grid content-center h-full w-full text-center text-4xl">Need help with something specific?</div>
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
    </div>
    
    {(isHelping)?(<div id='helping' className='w-full h-screen col-span-2 bg-amber-100 overflow-hidden'><div className='w-full h-full grid content-center justify-items-center'><div className='p-8 text-6xl font-bold'>Wanna help?</div>
        {(!hasPulled)?(<div className='w-[90%] aspect-video rounded-2xl overflow-hidden bg-white grid grid-cols-4 grid-rows-1'>
                <div className='w-full h-full bg-olive-400'><div className='w-full h-full bg-olive-200 justify-items-center grid content-center text-6xl cursor-pointer hover:font-bold  transition-all hover:m-4 hover:rounded-tl-2xl'>Food</div></div>
                <div className='w-full h-full bg-blue-400'><div className='w-full h-full bg-blue-100 justify-items-center grid content-center text-6xl cursor-pointer hover:font-bold transition-all hover:m-4 hover:rounded-tl-2xl'>Water</div></div>
                <div className='w-full h-full bg-green-400'><div className='w-full h-full bg-green-100 justify-items-center grid content-center text-6xl cursor-pointer hover:font-bold transition-all hover:m-4 hover:rounded-tl-2xl'>Medicine</div></div>
                <div className='w-full h-full bg-purple-400'><div className='w-full h-full bg-purple-100 justify-items-center grid content-center text-6xl cursor-pointer hover:font-bold transition-all hover:m-4 hover:rounded-tl-2xl'>Power</div></div>
            </div>):(<div className='w-[90%] aspect-video rounded-2xl overflow-hidden bg-white grid grid-cols-[8%_92%] grid-rows-1'>
                <div className=' h-full w-full bg-blue-400 flex flex-col justify-around'>
                    <div className='font-black text-center'>Change <br/>prefrence</div>
                    <div className='w-auto h-1/9 aspect-square bg-red-300 cursor-pointer grid content-center justify-items-center border-red-400 hover:border-l-[1rem] transition-all hover:font-black'>Food</div>
                    <div className='w-auto h-1/9 aspect-square bg-red-300 cursor-pointer grid content-center justify-items-center border-red-400 hover:border-l-[1rem] transition-all hover:font-black'>Food</div>
                    <div className='w-auto h-1/9 aspect-square bg-red-300 cursor-pointer grid content-center justify-items-center border-red-400 hover:border-l-[1rem] transition-all hover:font-black'>Food</div>
                    <div className='w-auto h-1/9 aspect-square bg-red-300 cursor-pointer grid content-center justify-items-center border-red-400 hover:border-l-[1rem] transition-all hover:font-black'>Food</div>
                    <div className='w-auto h-1/9 aspect-square bg-red-300 cursor-pointer grid content-center justify-items-center border-red-400 hover:border-l-[1rem] transition-all hover:font-black'>Food</div>
                    <div ></div>
                </div>
                <div className=' h-full w-full bg-green-50 grid grid-cols-1 overflow-y-scroll'>
                    <div className='w-full h-[20%] m-[1rem_0_0_1rem] rounded-l-2xl bg-amber-300 grid content-center justify-items-end grid-cols-1 grid-rows-1'>
                        <div className='w-[99%] h-full bg-amber-100 rounded-l-2xl  grid overflow-hidden grid-cols-[20%_80%] grid-rows-1'><div className='grid grid-cols-1 grid-rows-3'><div className='p-2 font-black'>Name:</div><div className='p-2 font-black'>Requirement:</div><div className='p-2 text-red-500 font-black justify-self-center cursor-pointer'>Report Completion</div></div> <iframe src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d${152.87405777*200*Math.cos(coords.longitude)}!2d69.997419713793!3d69.99999998132672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNzDCsDAwJzAwLjAiTiA3MMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1780721032641!5m2!1sen!2sin`} className='w-full h-full rounded-l-2xl' allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"/></div>
                    </div>
                </div>
                </div>)}
        
        </div>

    </div>):("")}
    
    </div>
}

export default App