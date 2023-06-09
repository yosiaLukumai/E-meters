// import "./../App.sccs"
import meterPng from "../assets/log.png"
import { Login } from "./../pages/Land/login"
import "./../App.scss"
import { Button } from "../components/Button"
import { useState } from "react"
import { useMediaQuery } from "./../Hooks/mediaQuery"
import { useEffect } from "react"
import { retriveData, save } from "../utils/localStorage"
import { Navigate } from "react-router-dom"
import { MainUrl } from "../../variables"
export const Landing = () => {
    const [password, changePassword] = useState("")
    const [email, changeEmail] = useState("")
    const [disable, setDisable] = useState(false)
    const [currentAction, setCurrentAction] = useState("")
    const [error, setError] =useState("")
    let screenSize = useMediaQuery()
    let [clicked, setClicked] = useState(0)
    const [hit, setHit] = useState(false)
    const [user, setUser] = useState(retriveData("userEm"))

      const fetcher = async (url, payload) => {
            
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                })
                const jsonResponse = await response.json();
                if (jsonResponse.success) {
                    if (currentAction == "Sign in") {
                        // alert("u can now login ")
                        setDisable(false)
                        if(jsonResponse.success) {
                            save("userEm", jsonResponse.body.user)
                            setTimeout(()=> {
                                console.log("setting user");
                                setUser(jsonResponse.body.user)
                            }, 300)
                            
                            setDisable(false)
                        }
                    } else {
                        setError("Account registered")
                        setDisable(false)
                    }
                } else {
                    setDisable(false)
                    setError("Incorrect Login")
                }
            } catch (error) {
                setError("Failed to Connect")
                setDisable(false)
            }
        }

    // console.log(user, "-----");
    useEffect(() => {
        if (currentAction == "Sign in") {
            // console.log("try to sign in");
            fetcher(`${MainUrl}/user/login`, { email, password })
        }
        if (currentAction == "Sign Up") {
            // console.log("try to sign up");
            fetcher(`${MainUrl}/user/register`, { email, password })
        }
    }, [hit])
    const getValuess = (element, value) => {
        if (element == 1) {
            changeEmail(value)
        }
        if (element == 2) {
            changePassword(value)
        }
    }
    const actionCalled = (name) => {
        setDisable(true)
        setCurrentAction(name)
        setClicked(clicked+1)
        if(clicked == 1 || (clicked % 2 == 1) || (clicked % 2 == 0)) {
            setHit(!hit)
            setError("")
        }
    }
    return (
        <>
        <div>
        {user && (
          <Navigate to={`/auth/${user._id}`} replace={true} />
        )}
        </div>

            <div className={screenSize.width > 630 ?
                "landing" : "landingMinimum "}>
                <div className="pageHolder">
                    <div className={screenSize.width > 630 ? "descPage" : "hide"} >
                        <div className="centerImage"><img className="imageResponsive" src={meterPng} alt="Meter png" /></div>
                        <div className="captionText">E_meter</div>
                    </div>
                    <div className={screenSize.width > 630 ? "actionPage" : "row container s12 now"} >
                        <div >
                            <div className={screenSize.width > 630 ? "hide" : "subTexts"} >
                                <h4 className="subTexts">E_Meter</h4>
                        <div className="textSuccFail">{error}</div>
                            </div>
                            <div>
                                <Login getValues={(e, v) => getValuess(e, v)} />
                            </div>
                            <div className="actionButtons row container">
                                <div>
                                    <Button disabled={disable ? true : false} width="7rem" height="2.2rem" name="Sign in" actionCalled={(name) => actionCalled(name)}></Button>
                                </div>
                                <div>
                                    <Button disabled={disable ? true : false} width="8rem" height="2.2rem" name="Sign Up" actionCalled={(name) => actionCalled(name)}></Button>
                                </div>
                            </div>
                        </div>
                        <div className="forgot">
                            <h6 style={{ fontSize: "1.3rem", fontWeight: "lighter" }}>forgot password ?</h6>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}