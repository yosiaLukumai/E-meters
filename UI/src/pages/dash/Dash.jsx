import "./../../App.scss"
import dashIcon from "./../../assets/1.png"
import buy from "./../../assets/buy.png"
import info from "./../../assets/group.png"
import logout from "./../../assets/logout.png"
import loan from "./../../assets/debt.png"
import { Link, Navigate } from "react-router-dom"
import {io} from "socket.io-client"
// import {} from "s"
import { useState } from "react"
import {  retriveData, save } from "../../utils/localStorage"
import { useEffect } from "react"
import { MainUrl } from "../../../variables"
export default function Dash() {
    const [logouts,setLogout] =useState(false)
    const [user, setUser] = useState(retriveData("userEm"))
    const logoutFun = () => {
        save("userEm", null)
        setLogout(true)
    }
    // console.log(user)
    const one =(user)=> {
        save("userEm", user)
        setUser(user)
    }
    useEffect(()=> {
        const socket = io(MainUrl)
        socket.on("connect", ()=>console.log(socket.id))
        socket.on("dataSet", (user)=> one(user))
    }, [])
    return (<>
  {logouts && (
          <Navigate to="/"replace={true} />
        )}
    <div style={{marginTop:"1rem"}}></div>
        <div className="dashIcon">
            <img src={dashIcon} alt="dashboardIcon" />
        </div>
        <div className="currentUnit">
            {user?.currentUnit} <span style={{ color: "hsla(279, 40%, 15%, 1)" }}>Kwh</span>
            {/* {parseFloat(user?.amount).toFixed(2)- parseFloat(user?.debt).toFixed(2)} <span style={{ color: "hsla(279, 40%, 15%, 1)" }}>Kwh</span> */}
        </div>
        <div className="padTop"></div>
        <div className="container  row">
            <Link to="buy">
            <div className="padAll  col s5">
                <div className="flexrow">
                    <div className="iconed">
                        <img className="iconSized" src={buy}></img>
                    </div>
                    <div className="capT">
                        <div className="centerT">Buy</div>
                    </div>
                </div>
            </div>
            </Link>
           <Link to="debt">
            <div className="padAll offset-s2 col s5">
                <div className="flexrow">
                    <div className="iconed">
                        <img className="iconSized" src={loan}></img>
                    </div>
                    <div className="capT">
                        <div className="centerT">Loan</div>
                    </div>
                </div>
            </div>
            </Link>
        </div>
        <div className="padTop"></div>
        <div className="container  row">
            <Link to="info">
            <div className="padAll  col s5">
                <div className="flexrow">
                    <div className="iconed">
                        <img className="iconSized" src={info}></img>
                    </div>
                    <div className="capT">
                        <div className="centerT">Info</div>
                    </div>
                </div>
            </div>
            </Link>
            <div className="padAll offset-s2 col s5" onClick={(e)=> logoutFun()}>
                <div className="flexrow">
                    <div className="iconed">
                        <img className="iconSized" src={logout}></img>
                    </div>
                    <div className="capT">
                        <div className="centerT">Logout</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="padTop"></div>
        <div className="wrap">
            <span>@e-meters-2023</span>
        </div>
    </>)
}