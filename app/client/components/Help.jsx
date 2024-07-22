import React, { useState } from 'react'
import { MdCancelPresentation } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoChevronBackSharp } from "react-icons/io5";
function HelpBox({ showMenu }) {
    const [count, setCount] = useState(0)
    const [type, setType] = useState('list')
    const [show, setShow] = useState(0)

    const inc = () => {
        if (tutorials.length - 1 > count)
            setCount(count + 1)
        else {
            showMenu()
            setCount(0)
        }
    }
    const dec = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    }

    const tutorials = [
        {
            id: 1,
            title: "Introduction to AR",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+410.png",
            description: "Start the Experience: To begin, simply scan the target image with your device's camera or tap on the screen. This will activate the augmented reality (AR) experience created using Immarsify."
        },
        {
            id: 2,
            title: "Building Your First AR Scene",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+411.png",
            description: "Adjust the View: If the AR content doesn't immediately appear, try moving your device's camera slightly or check your internet connection. Sometimes, a stable connection is needed for the content to load properly."
        },
        {
            id: 3,
            title: "Interactivity in AR",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+412.png",
            description: "Re-position the Scene: If you want to change the position of the AR scene on your screen, simply tap on an empty area of the screen. This will re-center the scene and adjust its position for better viewing."
        },
        {
            id: 4,
            title: "Testing and Deployment",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+413.png",
            description: "Interact with Icons/Buttons: You'll notice various icons or buttons within the AR scene. To interact with them, simply tap on the respective icons/buttons. This might open links to websites or perform other actions within the experience."
        },
        {
            id: 5,
            title: "Advanced AR Techniques",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+414.png",
            description: "Control Videos: If there are videos within the AR experience, you can tap on them to play or pause the videos as desired."
        },
        {
            id: 6,
            title: "Advanced AR Techniques",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+415.png",
            description: "Zoom In or Out: To zoom in or out on certain elements within the AR scene, use the pinch-to-zoom gesture on your device's screen."
        },
        {
            id: 7,
            title: "Advanced AR Techniques",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+416.png",
            description: "Keep the Scene Available: Even if the scanning image/target is removed from the camera feed, the AR scene will still remain available for you to interact with. This allows you to explore the content without needing to continuously scan the target image."
        },
    ]
    const tutorialsShort = [
        {
            id: 1,
            title: "Introduction to AR",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+410.png",
            description: "Start the Experience: Scan the target image or tap on the screen to view the experience created using Immarsify."
        },
        {
            id: 2,
            title: "Building Your First AR Scene",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+411.png",
            description: "Adjust the View:The AR experience will appear above the target image. If the content does not appear, move the camera or check your internet connection."
        },
        {
            id: 3,
            title: "Interactivity in AR",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+412.png",
            description: "Re-position the Scene:Tap empty area to re-position the scene to the center of the screen."
        },
        {
            id: 4,
            title: "Testing and Deployment",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+413.png",
            description: "Interact with Icons/Buttons:Tap icons/buttons to open their links."
        },
        {
            id: 5,
            title: "Advanced AR Techniques",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+414.png",
            description: "Control Videos:Tap videos to play/pause them."
        },
        {
            id: 6,
            title: "Advanced AR Techniques",
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+415.png",
            description: "Zoom In or Out:Pinch to zoom."
        },
        {
            id: 7,
            image: "https://assets.immarsify.com/website+data/Screen+shots/Group+416.png",
            title: "Advanced AR Techniques",
            description: "Keep the Scene Available: If the scanning image/target is removed from the camera feed, the scene still remains available."
        },
    ]


    const handleShow = (id) => {
        setType("multi")
        setCount(id - 1)
    }


    return (<>
        <div className=''
            id="overlay_dialog" >


            <div className="tutorial_box " >
                <div id="title_bar">
                    <h3>How To Use?</h3>
                    <MdCancelPresentation onClick={showMenu} className='close' />
                </div>
                <div id="type_bar">
                    {type === 'multi' && <p className={type === 'list' ? 'active' : ''} onClick={() => { setType('list') }} ><IoChevronBackSharp /></p>}
                    {/*   <p className={type === 'multi' ? 'active' : ''} onClick={() => { setType('multi') }}>Multi-step</p> */}
                </div>

                {type === 'list' ?
                    <div className="list">
                        {tutorialsShort.map((item) =>
                            <div key={item.id} id="content_area" onClick={() => { handleShow(item.id) }}>
                                <div id="image_section" >
                                    <img src={item.image} />
                                </div>
                                <div id="tutorial_section">
                                    <p>{item.id}. {item.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    : <>
                        <div id="">
                            <div id="image_section">
                                <img src={tutorials[count].image} />
                            </div>
                            <div id="tutorial_section">
                                <p>{tutorials[count].description}</p>
                            </div>
                            <div id="button_section">
                                {
                                    count == 0 ? <div></div> : <button id="left_button" onClick={dec}>Previous</button>
                                }

                                <button id="right_button" onClick={inc}>{tutorials.length - 1 == count ? 'Done' : 'Next'}</button>
                            </div>
                        </div>
                    </>}


            </div>
        </div>
    </>)
}
export default HelpBox